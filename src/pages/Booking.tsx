import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Loader2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import BookingProgress from "@/components/booking/BookingProgress";
import ServiceCard from "@/components/booking/ServiceCard";
import ServiceOverview from "@/components/booking/ServiceOverview";
import LuxuryCalendar from "@/components/booking/LuxuryCalendar";
import TimeSlotSelector from "@/components/booking/TimeSlotSelector";
import {
  FloatingInput,
  FloatingSelect,
  FloatingTextarea,
} from "@/components/booking/FloatingField";
import { budgetRanges, mediumOptions, projectTypes } from "@/data/booking";
import { submitBooking, toDateKey, useBookingBackend } from "@/hooks/useBookingBackend";


type Details = {
  name: string;
  email: string;
  phone: string;
  location: string;
  address: string;
  notes: string;
  projectName: string;
  projectType: string;
  vision: string;
  budget: string;
  medium: string;
};

const emptyDetails: Details = {
  name: "",
  email: "",
  phone: "",
  location: "",
  address: "",
  notes: "",
  projectName: "",
  projectType: "",
  vision: "",
  budget: "",
  medium: "",
};

const stepHeadings = [
  { title: "Begin Your Story", sub: "Choose the experience that matches your vision." },
  { title: "", sub: "" },
  { title: "Choose Your Date", sub: "Select the day we reserve exclusively for you." },
  { title: "Choose Your Time", sub: "Pick the window that suits your schedule." },
  { title: "Your Details", sub: "A few essentials so we can prepare properly." },
  { title: "Review Booking", sub: "Everything in one place before we begin." },
  { title: "", sub: "" },
];

const SectionHeading = ({ title, sub }: { title: string; sub: string }) => (
  <div className="mb-12 text-center">
    <h2 className="font-display text-3xl text-foreground md:text-5xl">
      {title.split(" ").slice(0, -1).join(" ")}{" "}
      <span className="italic gold-text">{title.split(" ").slice(-1)}</span>
    </h2>
    {sub && <p className="mx-auto mt-4 max-w-xl text-muted-foreground">{sub}</p>}
  </div>
);

const Particles = ({ count = 26 }: { count?: number }) => {
  const items = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: `${(i * 41) % 100}%`,
        top: `${(i * 67) % 100}%`,
        size: 2 + (i % 3),
        duration: 7 + (i % 6),
        delay: (i % 8) * 0.4,
      })),
    [count]
  );
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-primary/60"
          style={{ left: p.left, top: p.top, width: p.size, height: p.size }}
          animate={{ y: [0, -40, 0], opacity: [0.1, 0.8, 0.1] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
};

const Booking = () => {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [serviceId, setServiceId] = useState<string>();
  const [date, setDate] = useState<Date>();
  const [slot, setSlot] = useState<string>();
  const [details, setDetails] = useState<Details>(emptyDetails);
  const [errors, setErrors] = useState<Partial<Record<keyof Details, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState("");
  const topRef = useRef<HTMLDivElement>(null);

  const {
    services,
    loadingServices,
    loadingAvailability,
    dayFor,
    isDateSelectable,
    isDateBooked,
    isDateUnavailable,
    slotsForDate,
    refreshAvailability,
  } = useBookingBackend();

  const service = services.find((s) => s.id === serviceId);
  const isCustom = !!service?.featured;
  const slots = date ? slotsForDate(date) : [];
  const capacity = date ? dayFor(date) : undefined;

  // Admin changes and booking/cancellation events arrive through the existing
  // realtime subscription. Never retain a date after its source-of-truth state
  // changes from available to blocked or fully booked.
  useEffect(() => {
    if (!loadingAvailability && date && !isDateSelectable(date)) {
      setDate(undefined);
      setSlot(undefined);
      if (step > 2 && step < 6) setStep(2);
      toast.error("That date is no longer available. Please choose another date.");
    }
  }, [date, isDateSelectable, loadingAvailability, step]);


  const set = (k: keyof Details) => (v: string) => {
    setDetails((d) => ({ ...d, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validateDetails = () => {
    const next: Partial<Record<keyof Details, string>> = {};
    if (!details.name.trim()) next.name = "Please tell us your name";
    if (!/^\S+@\S+\.\S+$/.test(details.email)) next.email = "Enter a valid email address";
    if (details.phone.trim().length < 7) next.phone = "Enter a reachable phone number";
    if (isCustom) {
      if (!details.projectName.trim()) next.projectName = "Give your project a name";
      if (details.vision.trim().length < 12) next.vision = "Tell us a little about your vision";
      if (!details.medium) next.medium = "Choose photography, videography or both";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const canAdvance = () => {
    if (step === 0) return !!serviceId;
    if (step === 2) return !!date;
    if (step === 3) return !!slot;
    if (step === 4) return validateDetails();
    return true;
  };

  const scrollTop = () =>
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const goTo = (target: number, direction = 1) => {
    setDir(direction);
    setStep(target);
    scrollTop();
  };

  const go = (delta: number) => {
    if (delta > 0 && !canAdvance()) {
      const messages: Record<number, string> = {
        0: "Select an experience to continue.",
        2: "Choose a date to continue.",
        3: "Choose a time to continue.",
      };
      if (messages[step]) toast.error(messages[step]);
      return;
    }
    goTo(Math.min(6, Math.max(0, step + delta)), delta);
  };

  const confirm = async () => {
    if (submitting) return;
    if (!service || !date || !slot) {
      toast.error("Please complete your date and time selection.");
      return;
    }

    setSubmitting(true);

    const notes = isCustom
      ? [
          details.projectName && `Project: ${details.projectName}`,
          details.projectType && `Type: ${details.projectType}`,
          details.medium && `Medium: ${details.medium}`,
          details.budget && `Budget: ${details.budget}`,
          details.location && `Location: ${details.location}`,
          details.vision && `Vision: ${details.vision}`,
        ]
          .filter(Boolean)
          .join("\n")
      : [
          details.location && `Location: ${details.location}`,
          details.address && `Address: ${details.address}`,
          details.notes && `Notes: ${details.notes}`,
        ]
          .filter(Boolean)
          .join("\n");

    const result = await submitBooking({
      serviceId: service.dbId,
      date,
      time: slot,
      fullName: details.name,
      email: details.email,
      phone: details.phone,
      message: notes,
    });

    await refreshAvailability();
    setSubmitting(false);

    if (!result.ok) {
      toast.error(result.message ?? "We couldn't complete your booking. Please try again.");
      return;
    }


    setReference(
      result.bookingId
        ? `AFR-${result.bookingId.slice(0, 8).toUpperCase()}`
        : `AFR-${new Date().getFullYear()}-${toDateKey(date).replace(/-/g, "")}`
    );
    goTo(6, 1);
  };


  const reset = () => {
    setServiceId(undefined);
    setDate(undefined);
    setSlot(undefined);
    setDetails(emptyDetails);
    setErrors({});
    setReference("");
    goTo(0, -1);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (step === 6) return;
      if (e.key === "ArrowRight" && step !== 5) go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, serviceId, date, slot, details, isCustom]);


  const dateLabel = date
    ? date.toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

  const variants = {
    enter: (d: number) => ({ opacity: 0, y: 28, x: d * 24, filter: "blur(10px)" }),
    center: { opacity: 1, y: 0, x: 0, filter: "blur(0px)" },
    exit: (d: number) => ({ opacity: 0, y: -18, x: d * -24, filter: "blur(10px)" }),
  };

  const reviewRows: [string, string, number][] = isCustom
    ? [
        ["Experience", service?.name ?? "—", 0],
        ["Preferred Date", dateLabel, 2],
        ["Preferred Time", slot ?? "—", 3],
        ["Project Name", details.projectName, 4],
        ["Project Type", details.projectType || "To be discussed", 4],
        ["Photo / Video", details.medium, 4],
        ["Your Vision", details.vision, 4],
        ["Preferred Location", details.location || "To be confirmed", 4],
        ["Estimated Budget", details.budget || "To be discussed", 4],
        ["Full Name", details.name, 4],
        ["Email", details.email, 4],
        ["Phone", details.phone, 4],
      ]
    : [
        ["Experience", service?.name ?? "—", 0],
        ["Date", dateLabel, 2],
        ["Time", slot ?? "—", 3],
        ["Estimated Duration", service?.duration ?? "—", 1],
        ["Full Name", details.name, 4],
        ["Email", details.email, 4],
        ["Phone", details.phone, 4],
        ["Location", details.location || "To be confirmed", 4],
        ["Event Address", details.address || "To be confirmed", 4],
        ["Additional Notes", details.notes || "—", 4],
      ];

  const primaryLabel = step === 4 ? "Review Booking" : "Continue";

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[560px] bg-[radial-gradient(70%_60%_at_50%_0%,hsl(var(--gold)/0.12),transparent_70%)]" />

        <section ref={topRef} className="lux-container relative pb-6 pt-28 text-center md:pt-36">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="eyebrow"
          >
            Afriframe Studio — Reservations
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 font-display text-[2.25rem] leading-tight text-foreground md:text-6xl"
          >
            Start a <span className="italic gold-text">Creative Journey</span>
          </motion.h1>
        </section>

        <div className="lux-container sticky top-20 z-30 py-3 md:top-24">
          <div className="glass rounded-[20px] px-5 py-4 md:px-8">
            <BookingProgress current={step} />
          </div>
        </div>

        <section className="lux-container relative pb-44 pt-8 md:pb-36">
          <AnimatePresence mode="wait" custom={dir} initial={false}>
            <motion.div
              key={step}
              custom={dir}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: reduce ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              {stepHeadings[step].title && (
                <SectionHeading
                  title={stepHeadings[step].title}
                  sub={stepHeadings[step].sub}
                />
              )}

              {/* STEP 1 — SERVICE SELECTION */}
              {step === 0 && (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {loadingServices
                    ? Array.from({ length: 6 }).map((_, i) => (
                        <div
                          key={i}
                          className="h-[440px] animate-pulse rounded-[26px] border border-border bg-card/60"
                        />
                      ))
                    : services.map((s, i) => (
                        <ServiceCard
                          key={s.id}
                          service={s}
                          index={i}
                          onSelect={() => {
                            setServiceId(s.id);
                            setDir(1);
                            setStep(1);
                            scrollTop();
                          }}
                        />
                      ))}
                </div>
              )}

              {/* STEP 2 — SERVICE OVERVIEW */}
              {step === 1 && service && (
                <ServiceOverview service={service} onBook={() => go(1)} />
              )}

              {/* STEP 3 — DATE */}
              {step === 2 && (
                <div className="flex justify-center">
                  <LuxuryCalendar
                    value={date}
                    isBooked={isDateBooked}
                    isUnavailable={isDateUnavailable}
                    onSelect={(d) => {
                      setDate(d);
                      setSlot(undefined);
                    }}
                  />
                </div>
              )}

              {/* STEP 4 — TIME */}
              {step === 3 && (
                <div className="mx-auto max-w-2xl">
                  <div className="glass rounded-[26px] p-7 md:p-10">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                      {service?.name}
                    </p>
                    <p className="mt-2 font-display text-2xl text-foreground md:text-3xl">
                      {dateLabel}
                    </p>

                    {capacity && (
                      <div className="mt-5 flex flex-wrap gap-x-7 gap-y-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                        <span>
                          Maximum <span className="numeric text-foreground">{capacity.maxBookings}</span>
                        </span>
                        <span>
                          Booked <span className="numeric text-foreground">{capacity.booked}</span>
                        </span>
                        <span>
                          Remaining{" "}
                          <span className="numeric text-primary">{capacity.remaining}</span>
                        </span>
                      </div>
                    )}

                    <div className="gold-rule my-8" />
                    {slots.length ? (
                      <TimeSlotSelector slots={slots} value={slot} onSelect={setSlot} />
                    ) : (
                      <p className="text-sm italic text-muted-foreground">
                        No times are open for this date. Please choose another date.
                      </p>
                    )}
                  </div>
                </div>
              )}


              {/* STEP 5 — DETAILS */}
              {step === 4 && (
                <div className="mx-auto grid max-w-3xl gap-6">
                  {isCustom && (
                    <p className="mx-auto -mt-4 max-w-xl text-center text-sm italic text-muted-foreground">
                      This is the beginning of a consultation, not a form. Share as much or as
                      little as you like.
                    </p>
                  )}

                  <div className="grid gap-5 md:grid-cols-2">
                    <FloatingInput
                      label="Full Name"
                      required
                      index={0}
                      value={details.name}
                      onChange={set("name")}
                      error={errors.name}
                    />
                    <FloatingInput
                      label="Email"
                      type="email"
                      required
                      index={1}
                      value={details.email}
                      onChange={set("email")}
                      error={errors.email}
                    />
                    <FloatingInput
                      label="Phone"
                      type="tel"
                      required
                      index={2}
                      value={details.phone}
                      onChange={set("phone")}
                      error={errors.phone}
                    />
                    <FloatingInput
                      label={isCustom ? "Preferred Location" : "Location"}
                      index={3}
                      value={details.location}
                      onChange={set("location")}
                    />
                  </div>

                  {isCustom ? (
                    <>
                      <div className="grid gap-5 md:grid-cols-2">
                        <FloatingInput
                          label="Project Name"
                          required
                          index={4}
                          value={details.projectName}
                          onChange={set("projectName")}
                          error={errors.projectName}
                        />
                        <FloatingSelect
                          label="Project Type"
                          index={5}
                          options={projectTypes}
                          value={details.projectType}
                          onChange={set("projectType")}
                        />
                      </div>
                      <FloatingTextarea
                        label="Describe Your Vision"
                        index={6}
                        rows={6}
                        value={details.vision}
                        onChange={set("vision")}
                      />
                      {errors.vision && (
                        <p className="-mt-4 pl-1 text-xs text-destructive">{errors.vision}</p>
                      )}
                      <div className="grid gap-5 md:grid-cols-2">
                        <FloatingSelect
                          label="Estimated Budget (optional)"
                          index={7}
                          options={budgetRanges}
                          value={details.budget}
                          onChange={set("budget")}
                        />
                        <FloatingSelect
                          label="Photography, Videography or Both"
                          required
                          index={8}
                          options={mediumOptions}
                          value={details.medium}
                          onChange={set("medium")}
                        />
                      </div>
                      {errors.medium && (
                        <p className="-mt-4 pl-1 text-xs text-destructive">{errors.medium}</p>
                      )}
                    </>
                  ) : (
                    <>
                      <FloatingInput
                        label="Event Address (if applicable)"
                        index={4}
                        value={details.address}
                        onChange={set("address")}
                      />
                      <FloatingTextarea
                        label="Additional Notes"
                        index={5}
                        rows={5}
                        value={details.notes}
                        onChange={set("notes")}
                      />
                    </>
                  )}
                </div>
              )}

              {/* STEP 6 — REVIEW */}
              {step === 5 && (
                <div className="mx-auto max-w-3xl">
                  <div className="lux-card overflow-hidden p-0">
                    <div className="flex items-center justify-between border-b border-border px-7 py-6">
                      <div>
                        <p className="eyebrow">Afriframe Studio</p>
                        <p className="mt-1 font-display text-2xl text-foreground">
                          Booking Summary
                        </p>
                      </div>
                      <Sparkles className="h-5 w-5 text-primary" />
                    </div>

                    <dl className="divide-y divide-border">
                      {reviewRows.map(([label, value, editStep]) => (
                        <div
                          key={label}
                          className="flex items-start justify-between gap-6 px-7 py-4"
                        >
                          <dt className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                            {label}
                          </dt>
                          <dd className="flex items-start gap-4 text-right text-sm text-foreground">
                            <span className="max-w-sm">{value || "—"}</span>
                            <button
                              type="button"
                              onClick={() => goTo(editStep, -1)}
                              className="shrink-0 text-[11px] uppercase tracking-[0.16em] text-primary underline-offset-4 hover:underline"
                            >
                              Edit
                            </button>
                          </dd>
                        </div>
                      ))}
                    </dl>

                    <div className="flex items-center justify-between bg-muted/50 px-7 py-6">
                      <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                        {isCustom ? "Bespoke Proposal" : "Estimated Investment"}
                      </span>
                      <span className="numeric text-2xl font-semibold text-primary md:text-3xl">
                        {isCustom ? "On consultation" : `$${service?.price ?? 0}`}
                      </span>
                    </div>
                  </div>
                  <p className="mt-4 text-center text-xs text-muted-foreground">
                    Final pricing is confirmed after our creative team reviews your request.
                  </p>
                </div>
              )}

              {/* STEP 7 — SUBMITTED */}
              {step === 6 && (
                <div className="relative mx-auto max-w-2xl overflow-hidden rounded-[28px] px-6 py-14 text-center md:px-12">
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_20%,hsl(var(--gold)/0.16),transparent_70%)]" />
                  {!reduce && <Particles />}

                  <motion.div
                    initial={{ scale: 0, rotate: -25 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 170, damping: 14 }}
                    className="relative mx-auto grid h-24 w-24 place-items-center rounded-full bg-primary text-primary-foreground shadow-[0_20px_60px_hsl(var(--gold)/0.4)]"
                  >
                    <motion.span
                      className="absolute inset-0 rounded-full border border-primary/50"
                      animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
                    />
                    <Check className="h-10 w-10" strokeWidth={2.5} />
                  </motion.div>

                  <h2 className="relative mt-9 font-display text-3xl text-foreground md:text-5xl">
                    Booking Request
                    <span className="block italic gold-text">Received</span>
                  </h2>
                  <p className="relative mx-auto mt-5 max-w-md text-muted-foreground">
                    Our creative team is reviewing your request. We'll contact you within 24 hours
                    to confirm availability.
                  </p>

                  <div className="lux-card relative mt-10 grid gap-px overflow-hidden bg-border text-left sm:grid-cols-2">
                    {[
                      ["Booking Number", reference],
                      ["Experience", service?.name ?? "—"],
                      ["Date", dateLabel],
                      ["Time", slot ?? "—"],
                    ].map(([l, v]) => (
                      <div key={l} className="bg-card px-6 py-5">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                          {l}
                        </p>
                        <p className="numeric mt-1 text-sm text-foreground">{v}</p>
                      </div>
                    ))}
                  </div>

                  <p className="relative mt-5 text-xs text-muted-foreground">
                    A confirmation email is on its way to {details.email}.
                  </p>

                  <div className="relative mt-10 flex flex-wrap justify-center gap-3">
                    <Link
                      to="/"
                      className="inline-flex h-12 items-center rounded-2xl bg-primary px-6 text-sm font-medium text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5"
                    >
                      Return Home
                    </Link>
                    <Link
                      to="/explore"
                      className="inline-flex h-12 items-center rounded-2xl border border-border px-6 text-sm transition-colors duration-300 hover:border-primary hover:text-primary"
                    >
                      Explore Our Work
                    </Link>
                    <Link
                      to="/explore#showreel"
                      className="inline-flex h-12 items-center rounded-2xl border border-border px-6 text-sm transition-colors duration-300 hover:border-primary hover:text-primary"
                    >
                      Watch Our Showreel
                    </Link>
                    <button
                      type="button"
                      onClick={reset}
                      className="inline-flex h-12 items-center rounded-2xl border border-border px-6 text-sm transition-colors duration-300 hover:border-primary hover:text-primary"
                    >
                      Book Another Experience
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </section>

        {/* Sticky navigation */}
        {step > 0 && step < 6 && (
          <div className="fixed inset-x-0 bottom-0 z-40">
            <div className="lux-container pb-4 md:pb-5">
              <div className="glass flex items-center justify-between gap-3 rounded-[20px] px-4 py-3.5 md:px-5 md:py-4">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  className="inline-flex h-12 items-center gap-2 rounded-2xl border border-border px-5 text-sm transition-all duration-300 hover:border-primary hover:text-primary"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Back</span>
                </button>

                <p className="hidden text-xs uppercase tracking-[0.2em] text-muted-foreground lg:block">
                  {service?.name}
                  {slot ? ` · ${slot}` : ""}
                </p>

                {step === 1 ? (
                  <button
                    type="button"
                    onClick={() => go(1)}
                    className="group inline-flex h-12 flex-1 items-center justify-center gap-3 rounded-2xl bg-primary px-7 text-sm font-medium text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_40px_hsl(var(--gold)/0.35)] sm:flex-none"
                  >
                    {service?.cta ?? "Continue"}
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                ) : step < 5 ? (
                  <button
                    type="button"
                    onClick={() => go(1)}
                    className="group inline-flex h-12 flex-1 items-center justify-center gap-3 rounded-2xl bg-primary px-7 text-sm font-medium text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_40px_hsl(var(--gold)/0.35)] sm:flex-none"
                  >
                    {primaryLabel}
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={confirm}
                    disabled={submitting}
                    className="inline-flex h-12 flex-1 items-center justify-center gap-3 rounded-2xl bg-primary px-7 text-sm font-medium text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_40px_hsl(var(--gold)/0.35)] disabled:opacity-70 sm:flex-none"
                  >
                    {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                    {submitting ? "Submitting…" : "Confirm Booking"}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Booking;
