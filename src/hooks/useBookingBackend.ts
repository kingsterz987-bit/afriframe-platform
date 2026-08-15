import { useCallback, useEffect, useMemo, useState } from "react";
import { afriframe, type DbAvailability, type DbService } from "@/integrations/afriframe/client";
import { experiences, type Experience } from "@/data/booking";

export const toDateKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/** DB service + the existing Afriframe card presentation (images, copy, gallery). */
export type BookingService = Experience & { dbId: string };

const presentationFor = (name: string): Experience | undefined => {
  const key = name.trim().toLowerCase();
  return (
    experiences.find((e) => e.name.trim().toLowerCase() === key) ??
    experiences.find((e) => key.includes(e.name.trim().toLowerCase()))
  );
};

const mapService = (row: DbService): BookingService => {
  const preset = presentationFor(row.name) ?? experiences[experiences.length - 1];
  const dbPrice = Number(row.price ?? 0);
  return {
    ...preset,
    id: row.id,
    dbId: row.id,
    name: row.name || preset.name,
    description: preset.description || row.short_description || row.description || "",
    image: row.cover_image_url || preset.image,
    price: dbPrice > 0 ? dbPrice : preset.price,
    duration: preset.duration,
    featured: preset.featured,
  };
};

export type DayAvailability = {
  available: boolean;
  maxBookings: number;
  booked: number;
  remaining: number;
  slots: string[];
  notes: string | null;
};

/** Calendar status priority: blocked → booked → available. */
export type DateStatus = "available" | "booked" | "blocked";

/** System defaults used when the admin has NOT configured a date. */
const DEFAULT_CAPACITY = 3;
const DEFAULT_SLOTS = ["09:00", "12:00", "14:00", "16:00"];

/** Row shape returned by the backend's public availability RPC. */
type CalendarRow = {
  date: string;
  capacity: number | null;
  booking_count: number | null;
  is_override: boolean | null;
  status: string | null;
};

const shiftMonth = (delta: number) => {
  const n = new Date();
  return new Date(n.getFullYear(), n.getMonth() + delta, 1);
};

export const useBookingBackend = () => {
  const [services, setServices] = useState<BookingService[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [availability, setAvailability] = useState<Record<string, DayAvailability>>({});
  const [loadingAvailability, setLoadingAvailability] = useState(true);

  const loadServices = useCallback(async () => {
    const { data, error } = await afriframe
      .from("services")
      .select("*")
      .eq("active", true)
      .eq("booking_enabled", true)
      .order("display_order", { ascending: true });

    if (error) console.error("[booking] services load failed:", error);
    setServices(((data as DbService[]) ?? []).map(mapService));
    setLoadingServices(false);
  }, []);

  const loadAvailability = useCallback(async () => {
    // Source of truth = the backend's availability RPC. It already applies
    // "default open, capacity 3" for unconfigured dates, layers admin overrides
    // on top, and returns booking counts WITHOUT exposing any client data.
    const start = toDateKey(shiftMonth(-1));
    const end = toDateKey(shiftMonth(19));

    const [calendarRes, availRes] = await Promise.all([
      afriframe.rpc("get_availability_calendar", { p_start: start, p_end: end }),
      // Only used for admin time-slot / notes overrides; never for open/closed state.
      afriframe.from("availability").select("*"),
    ]);

    if (calendarRes.error) console.error("[booking] calendar load failed:", calendarRes.error);
    if (availRes.error) console.error("[booking] availability load failed:", availRes.error);

    const overrides: Record<string, DbAvailability> = {};
    for (const row of (availRes.data as DbAvailability[]) ?? []) {
      overrides[String(row.date).slice(0, 10)] = row;
    }

    const next: Record<string, DayAvailability> = {};
    for (const row of (calendarRes.data as CalendarRow[]) ?? []) {
      // Dates are DATE strings (YYYY-MM-DD) and are never parsed into a Date,
      // so no UTC conversion can shift a day.
      const key = String(row.date).slice(0, 10);
      const status = (row.status ?? "").toLowerCase();
      const override = overrides[key];
      const slots =
        override && Array.isArray(override.time_slots) && override.time_slots.length > 0
          ? override.time_slots.map(String)
          : DEFAULT_SLOTS;

      const maxBookings =
        row.capacity && row.capacity > 0 ? Number(row.capacity) : DEFAULT_CAPACITY;
      const booked = Math.max(0, Number(row.booking_count ?? 0));
      const blocked = status === "blocked" || status === "unavailable";

      next[key] = {
        available: !blocked,
        maxBookings,
        booked,
        remaining: Math.max(0, maxBookings - booked),
        slots,
        notes: override?.notes ?? null,
      };
    }

    setAvailability(next);
    setLoadingAvailability(false);
  }, []);


  useEffect(() => {
    loadServices();
    loadAvailability();
  }, [loadServices, loadAvailability]);

  // Live updates when the CMS changes availability / bookings.
  useEffect(() => {
    const channel = afriframe
      .channel("afriframe-booking")
      .on("postgres_changes", { event: "*", schema: "public", table: "availability" }, () =>
        loadAvailability()
      )
      .on("postgres_changes", { event: "*", schema: "public", table: "bookings" }, () =>
        loadAvailability()
      )
      .on("postgres_changes", { event: "*", schema: "public", table: "services" }, () =>
        loadServices()
      )
      .subscribe();

    return () => {
      afriframe.removeChannel(channel);
    };
  }, [loadAvailability, loadServices]);

  /**
   * Every upcoming date resolves to a day record. Dates the backend did not
   * return (outside the fetched window) fall back to the system default so the
   * client never shows a future date as unavailable just because no row exists.
   */
  const dayFor = useCallback(
    (d: Date): DayAvailability | undefined =>
      availability[toDateKey(d)] ?? {
        available: true,
        maxBookings: DEFAULT_CAPACITY,
        booked: 0,
        remaining: DEFAULT_CAPACITY,
        slots: DEFAULT_SLOTS,
        notes: null,
      },
    [availability]
  );

  /**
   * Single source of truth for a date's status.
   * Priority: admin block → fully booked → available.
   */
  const statusFor = useCallback(
    (d: Date): DateStatus => {
      const day = dayFor(d);
      if (!day) return "available";
      if (!day.available) return "blocked";
      if (day.remaining <= 0) return "booked";
      return "available";
    },
    [dayFor]
  );

  const isDateSelectable = useCallback((d: Date) => statusFor(d) === "available", [statusFor]);

  /** Fully booked: open date whose capacity is consumed (red dot). */
  const isDateBooked = useCallback((d: Date) => statusFor(d) === "booked", [statusFor]);

  /** Explicitly blocked by the admin (gray). */
  const isDateUnavailable = useCallback((d: Date) => statusFor(d) === "blocked", [statusFor]);


  const slotsForDate = useCallback(
    (d: Date) => {
      const day = dayFor(d);
      if (!day) return [] as { time: string; available: boolean }[];
      const open = day.available && day.remaining > 0;
      return day.slots.map((time) => ({ time, available: open }));
    },
    [dayFor]
  );


  return useMemo(
    () => ({
      services,
      loadingServices,
      availability,
      loadingAvailability,
      dayFor,
      statusFor,
      isDateSelectable,
      isDateBooked,
      isDateUnavailable,
      slotsForDate,
      refreshAvailability: loadAvailability,
    }),
    [
      services,
      loadingServices,
      availability,
      loadingAvailability,
      dayFor,
      statusFor,
      isDateSelectable,
      isDateBooked,
      isDateUnavailable,
      slotsForDate,
      loadAvailability,
    ]
  );
};


export type BookingSubmission = {
  serviceId: string;
  date: Date;
  time: string;
  fullName: string;
  email: string;
  phone: string;
  company?: string;
  instagram?: string;
  message?: string;
};

const friendlyError = (raw: string) => {
  const m = raw.toLowerCase();
  if (m.includes("fully booked"))
    return "This date has just become fully booked. Please choose another date.";
  if (m.includes("time slot is not available") || m.includes("not available"))
    return "That time is no longer available. Please choose another time.";
  if (m.includes("already booked") || m.includes("duplicate"))
    return "That time has just been taken. Please choose another time.";
  if (m.includes("row-level security") || m.includes("permission"))
    return "We couldn't submit your request right now. Please contact the studio directly.";
  return "We couldn't complete your booking. Please try again or contact the studio.";
};

/** Creates/reuses the client record, then books through the create_booking RPC. */
export const submitBooking = async (
  input: BookingSubmission
): Promise<{ ok: boolean; bookingId?: string; message?: string }> => {
  const email = input.email.trim().toLowerCase();

  try {
    let clientId: string | undefined;

    const { data: existing } = await afriframe
      .from("clients")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existing?.id) {
      clientId = existing.id as string;
    } else {
      const { data: created, error: clientError } = await afriframe
        .from("clients")
        .insert({
          full_name: input.fullName.trim(),
          email,
          phone: input.phone.trim(),
          instagram_handle: input.instagram?.trim() || null,
          company: input.company?.trim() || null,
          notes: input.message?.trim() || null,
          source: "website",
          marketing_opt_in: false,
        })
        .select("id")
        .single();

      if (clientError || !created) {
        console.error("[booking] client creation failed:", clientError);
        return { ok: false, message: friendlyError(clientError?.message ?? "") };
      }
      clientId = created.id as string;
    }

    const { data, error } = await afriframe.rpc("create_booking", {
      p_service_id: input.serviceId,
      p_client_id: clientId,
      p_booking_date: toDateKey(input.date),
      p_booking_time: input.time.length === 5 ? `${input.time}:00` : input.time,
      p_message: input.message?.trim() || null,
    });

    if (error) {
      console.error("[booking] create_booking failed:", error);
      return { ok: false, message: friendlyError(error.message) };
    }

    const bookingId =
      typeof data === "string"
        ? data
        : (data as { id?: string; booking_id?: string } | null)?.id ??
          (data as { booking_id?: string } | null)?.booking_id ??
          "";

    return { ok: true, bookingId };
  } catch (err) {
    console.error("[booking] unexpected error:", err);
    return { ok: false, message: friendlyError("") };
  }
};
