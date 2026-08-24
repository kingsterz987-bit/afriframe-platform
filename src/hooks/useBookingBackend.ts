import { useCallback, useEffect, useMemo, useState } from "react";
import { afriframe, type DbService } from "@/integrations/afriframe/client";
import { experiences, type Experience } from "@/data/booking";

export const toDateKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;

/** DB service + the existing Afriframe card presentation. */
export type BookingService = Experience & {
  dbId: string;
};

const presentationFor = (name: string): Experience | undefined => {
  const key = name.trim().toLowerCase();

  return (
    experiences.find(
      (e) => e.name.trim().toLowerCase() === key
    ) ??
    experiences.find((e) =>
      key.includes(e.name.trim().toLowerCase())
    )
  );
};

const mapService = (row: DbService): BookingService => {
  const preset =
    presentationFor(row.name) ??
    experiences[experiences.length - 1];

  const dbPrice = Number(row.price ?? 0);

  return {
    ...preset,
    id: row.id,
    dbId: row.id,
    name: row.name || preset.name,
    description:
      preset.description ||
      row.short_description ||
      row.description ||
      "",
    image:
      row.cover_image_url ||
      preset.image,
    price:
      dbPrice > 0
        ? dbPrice
        : preset.price,
    duration: preset.duration,
    featured: preset.featured,
  };
};

export type DayAvailability = {
  available: boolean;
  maxBookings: number;
  booked: number;
  remaining: number;

  /** All configured time slots for this date. */
  slots: string[];

  /** Time slots already occupied by active bookings. */
  bookedSlots: string[];

  notes: string | null;
};

/** Calendar status priority: blocked → booked → available. */
export type DateStatus =
  | "available"
  | "booked"
  | "blocked";

/** Capacity used when the RPC does not return an explicit value. */
const DEFAULT_CAPACITY = 3;

/**
 * Normalizes:
 *
 * 09:00
 * 9:00
 * 09:00:00
 *
 * into:
 *
 * 09:00
 */
const normalizeTimeSlot = (
  value: unknown
): string | null => {
  const raw = String(value ?? "").trim();

  const match = raw.match(
    /^(\d{1,2}):(\d{2})(?::\d{2})?$/
  );

  if (!match) return null;

  const hour = Number(match[1]);
  const minute = Number(match[2]);

  if (
    hour > 23 ||
    minute > 59
  ) {
    return null;
  }

  return `${String(hour).padStart(
    2,
    "0"
  )}:${match[2]}`;
};

/**
 * Accepts either:
 *
 * ["09:00", "11:00"]
 *
 * or a JSON string containing that array.
 */
const normalizeTimeSlots = (
  values: unknown
): string[] => {
  const parsed =
    typeof values === "string"
      ? (() => {
          try {
            return JSON.parse(values);
          } catch {
            return [];
          }
        })()
      : values;

  return [
    ...new Set(
      (Array.isArray(parsed)
        ? parsed
        : []
      )
        .map(normalizeTimeSlot)
        .filter(
          (
            value
          ): value is string =>
            value !== null
        )
    ),
  ];
};

/** Row shape returned by get_availability_calendar. */
type CalendarRow = {
  date: string;
  capacity: number | null;
  booking_count: number | null;
  is_override: boolean | null;
  status: string | null;
  time_slots: unknown;

  /**
   * NEW:
   * Returned by the updated database function.
   */
  booked_slots: unknown;
};

const shiftMonth = (
  delta: number
) => {
  const now = new Date();

  return new Date(
    now.getFullYear(),
    now.getMonth() + delta,
    1
  );
};

export const useBookingBackend = () => {
  const [services, setServices] =
    useState<BookingService[]>([]);

  const [loadingServices, setLoadingServices] =
    useState(true);

  const [
    availability,
    setAvailability,
  ] = useState<
    Record<string, DayAvailability>
  >({});

  const [
    loadingAvailability,
    setLoadingAvailability,
  ] = useState(true);

  /**
   * Load bookable services.
   */
  const loadServices =
    useCallback(async () => {
      setLoadingServices(true);

      const {
        data,
        error,
      } = await afriframe
        .from("services")
        .select("*")
        .eq("active", true)
        .eq(
          "booking_enabled",
          true
        )
        .order(
          "display_order",
          {
            ascending: true,
          }
        );

      if (error) {
        console.error(
          "[booking] services load failed:",
          error
        );
      }

      setServices(
        (
          (data as DbService[]) ??
          []
        ).map(mapService)
      );

      setLoadingServices(false);
    }, []);

  /**
   * Load availability from the database.
   *
   * The database is the source of truth.
   */
  const loadAvailability =
    useCallback(async () => {
      setLoadingAvailability(true);

      const start = toDateKey(
        shiftMonth(-1)
      );

      const end = toDateKey(
        shiftMonth(19)
      );

      const calendarRes =
        await afriframe.rpc(
          "get_availability_calendar",
          {
            p_start: start,
            p_end: end,
          }
        );

      if (calendarRes.error) {
        console.error(
          "[booking] calendar load failed:",
          calendarRes.error
        );

        setLoadingAvailability(false);
        return;
      }

      const next: Record<
        string,
        DayAvailability
      > = {};

      for (const row of
        (calendarRes.data as CalendarRow[]) ??
        []) {
        /**
         * Dates remain as YYYY-MM-DD strings.
         * No UTC conversion happens here.
         */
        const key = String(
          row.date
        ).slice(0, 10);

        const status =
          row.status
            ?.toLowerCase()
            .trim() ?? "";

        /**
         * All configured slots.
         */
        const slots =
          normalizeTimeSlots(
            row.time_slots
          );

        /**
         * NEW:
         * Slots occupied by existing active bookings.
         */
        const bookedSlots =
          normalizeTimeSlots(
            row.booked_slots
          );

        const maxBookings =
          row.capacity &&
          row.capacity > 0
            ? Number(row.capacity)
            : DEFAULT_CAPACITY;

        const booked = Math.max(
          0,
          Number(
            row.booking_count ?? 0
          )
        );

        const blocked =
          status === "blocked" ||
          status === "unavailable";

        next[key] = {
          available: !blocked,

          maxBookings,

          booked,

          remaining: Math.max(
            0,
            maxBookings - booked
          ),

          slots,

          bookedSlots,

          notes: null,
        };
      }

      setAvailability(next);

      setLoadingAvailability(false);
    }, []);

  /**
   * Initial data loading.
   */
  useEffect(() => {
    void loadServices();
    void loadAvailability();
  }, [
    loadServices,
    loadAvailability,
  ]);

  /**
   * Keep booking availability synchronized.
   */
  useEffect(() => {
    const refresh = () => {
      void loadAvailability();
    };

    const channel =
      afriframe
        .channel(
          "afriframe-booking"
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "availability",
          },
          refresh
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "studio_settings",
          },
          refresh
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "bookings",
          },
          refresh
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "services",
          },
          () => {
            void loadServices();
          }
        )
        .subscribe();

    window.addEventListener(
      "focus",
      refresh
    );

    document.addEventListener(
      "visibilitychange",
      refresh
    );

    return () => {
      window.removeEventListener(
        "focus",
        refresh
      );

      document.removeEventListener(
        "visibilitychange",
        refresh
      );

      afriframe.removeChannel(
        channel
      );
    };
  }, [
    loadAvailability,
    loadServices,
  ]);

  /**
   * Returns the availability state for a date.
   */
  const dayFor =
    useCallback(
      (
        d: Date
      ): DayAvailability =>
        availability[
          toDateKey(d)
        ] ?? {
          available: true,
          maxBookings:
            DEFAULT_CAPACITY,
          booked: 0,
          remaining:
            DEFAULT_CAPACITY,

          slots: [],

          bookedSlots: [],

          notes: null,
        },
      [availability]
    );

  /**
   * Calendar date status.
   *
   * Priority:
   *
   * blocked
   * ↓
   * fully booked
   * ↓
   * available
   */
  const statusFor =
    useCallback(
      (
        d: Date
      ): DateStatus => {
        const day = dayFor(d);

        if (!day.available) {
          return "blocked";
        }

        if (
          day.remaining <= 0
        ) {
          return "booked";
        }

        return "available";
      },
      [dayFor]
    );

  const isDateSelectable =
    useCallback(
      (d: Date) =>
        statusFor(d) ===
        "available",
      [statusFor]
    );

  const isDateBooked =
    useCallback(
      (d: Date) =>
        statusFor(d) ===
        "booked",
      [statusFor]
    );

  const isDateUnavailable =
    useCallback(
      (d: Date) =>
        statusFor(d) ===
        "blocked",
      [statusFor]
    );

  /**
   * Returns every configured time slot
   * and determines individually whether
   * that specific slot is available.
   */
  const slotsForDate =
    useCallback(
      (d: Date) => {
        const day =
          dayFor(d);

        const dateOpen =
          day.available &&
          day.remaining > 0;

        /**
         * Fast lookup of booked slots.
         */
        const bookedSlotSet =
          new Set(
            day.bookedSlots
          );

        return day.slots.map(
          (time) => {
            const booked =
              bookedSlotSet.has(
                time
              );

            return {
              time,

              booked,

              /**
               * A slot is selectable only when:
               *
               * 1. The date isn't blocked
               * 2. Daily capacity remains
               * 3. This exact time isn't booked
               */
              available:
                dateOpen &&
                !booked,
            };
          }
        );
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

      refreshAvailability:
        loadAvailability,
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

const friendlyError = (
  raw: string
) => {
  const m =
    raw.toLowerCase();

  if (
    m.includes(
      "fully booked"
    )
  ) {
    return "This date has just become fully booked. Please choose another date.";
  }

  if (
    m.includes(
      "already been booked"
    ) ||
    m.includes(
      "already booked"
    ) ||
    m.includes(
      "duplicate"
    )
  ) {
    return "That time has just been taken. Please choose another time.";
  }

  if (
    m.includes(
      "time slot is not available"
    ) ||
    m.includes(
      "time slot"
    ) ||
    m.includes(
      "not available"
    )
  ) {
    return "That time is no longer available. Please choose another time.";
  }

  if (
    m.includes(
      "row-level security"
    ) ||
    m.includes(
      "permission"
    )
  ) {
    return "We couldn't submit your request right now. Please contact the studio directly.";
  }

  return "We couldn't complete your booking. Please try again or contact the studio.";
};

/**
 * Creates or reuses a client,
 * then creates the booking through
 * the database RPC.
 */
export const submitBooking = async (
  input: BookingSubmission
): Promise<{
  ok: boolean;
  bookingId?: string;
  message?: string;
}> => {
  const email =
    input.email
      .trim()
      .toLowerCase();

  const normalizedTime =
    normalizeTimeSlot(
      input.time
    );

  if (!normalizedTime) {
    return {
      ok: false,
      message:
        "Please choose a valid booking time.",
    };
  }

  try {
    let clientId:
      | string
      | undefined;

    /**
     * Reuse an existing client
     * with the same email.
     */
    const {
      data: existing,
      error: existingError,
    } = await afriframe
      .from("clients")
      .select("id")
      .eq(
        "email",
        email
      )
      .maybeSingle();

    if (existingError) {
      console.error(
        "[booking] client lookup failed:",
        existingError
      );
    }

    if (existing?.id) {
      clientId =
        existing.id as string;
    } else {
      const {
        data: created,
        error: clientError,
      } = await afriframe
        .from("clients")
        .insert({
          full_name:
            input.fullName.trim(),

          email,

          phone:
            input.phone.trim(),

          instagram_handle:
            input.instagram?.trim() ||
            null,

          company:
            input.company?.trim() ||
            null,

          notes:
            input.message?.trim() ||
            null,

          source:
            "website",

          marketing_opt_in:
            false,
        })
        .select("id")
        .single();

      if (
        clientError ||
        !created
      ) {
        console.error(
          "[booking] client creation failed:",
          clientError
        );

        return {
          ok: false,
          message:
            friendlyError(
              clientError?.message ??
                ""
            ),
        };
      }

      clientId =
        created.id as string;
    }

    /**
     * Database-level booking.
     *
     * The database now checks:
     *
     * - Date availability
     * - Valid configured slot
     * - Exact slot duplication
     * - Daily capacity
     */
    const {
      data,
      error,
    } = await afriframe.rpc(
      "create_booking",
      {
        p_service_id:
          input.serviceId,

        p_client_id:
          clientId,

        p_booking_date:
          toDateKey(
            input.date
          ),

        p_booking_time:
          `${normalizedTime}:00`,

        p_message:
          input.message?.trim() ||
          null,
      }
    );

    if (error) {
      console.error(
        "[booking] create_booking failed:",
        error
      );

      return {
        ok: false,
        message:
          friendlyError(
            error.message
          ),
      };
    }

    /**
     * create_booking returns
     * a bookings row.
     */
    const bookingId =
      typeof data ===
      "string"
        ? data
        : (
            data as
              | {
                  id?: string;
                  booking_id?: string;
                }
              | null
          )?.id ??
          (
            data as {
              booking_id?: string;
            } | null
          )?.booking_id ??
          "";

    return {
      ok: true,
      bookingId,
    };
  } catch (err) {
    console.error(
      "[booking] unexpected error:",
      err
    );

    return {
      ok: false,
      message:
        friendlyError(""),
    };
  }
};
