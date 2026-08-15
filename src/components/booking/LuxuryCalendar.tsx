import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

type Props = {
  value?: Date;
  onSelect: (d: Date) => void;
  isBooked?: (d: Date) => boolean;
  isUnavailable?: (d: Date) => boolean;
};

const LuxuryCalendar = ({ value, onSelect, isBooked, isUnavailable }: Props) => {
  const today = startOfDay(new Date());
  const [cursor, setCursor] = useState(
    new Date((value ?? today).getFullYear(), (value ?? today).getMonth(), 1)
  );
  const [dir, setDir] = useState(1);

  const move = (delta: number) => {
    setDir(delta);
    setCursor((c) => new Date(c.getFullYear(), c.getMonth() + delta, 1));
  };

  const firstWeekday = cursor.getDay();
  const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
  const cells: (Date | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from(
      { length: daysInMonth },
      (_, i) => new Date(cursor.getFullYear(), cursor.getMonth(), i + 1)
    ),
  ];

  const monthLabel = cursor.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div
      className="glass w-full max-w-[460px] rounded-[26px] p-5 md:p-8"
      role="group"
      aria-label="Booking calendar"
    >
      <div className="mb-7 flex items-center justify-between">
        <button
          type="button"
          onClick={() => move(-1)}
          aria-label="Previous month"
          className="grid h-11 w-11 place-items-center rounded-full border border-border transition-all duration-300 hover:border-primary hover:text-primary"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={monthLabel}
              initial={{ opacity: 0, y: dir * 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: dir * -12 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-xl text-foreground"
            >
              {monthLabel}
            </motion.p>
          </AnimatePresence>
        </div>
        <button
          type="button"
          onClick={() => move(1)}
          aria-label="Next month"
          className="grid h-11 w-11 place-items-center rounded-full border border-border transition-all duration-300 hover:border-primary hover:text-primary"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mb-3 grid grid-cols-7 gap-1.5 text-center">
        {WEEKDAYS.map((w) => (
          <span key={w} className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            {w}
          </span>
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={monthLabel}
          initial={{ opacity: 0, x: dir * 24, filter: "blur(6px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, x: dir * -24, filter: "blur(6px)" }}
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-7 gap-1.5"
        >
          {cells.map((d, i) => {
            if (!d) return <span key={`e${i}`} />;
            const past = d < today;
            // Priority: past → blocked → fully booked → available (selected is UI-only).
            const closed = !past && (isUnavailable?.(d) ?? false);
            const booked = !past && !closed && (isBooked?.(d) ?? false);
            const disabled = past || booked || closed;

            // Selection is only a visual layer on a currently bookable date. If
            // realtime data blocks/fills the selected date, its underlying state
            // must win immediately instead of leaving a misleading gold selection.
            const selected =
              !disabled && !!value && startOfDay(value).getTime() === d.getTime();
            const isToday = d.getTime() === today.getTime();

            return (
              <motion.button
                key={d.toISOString()}
                type="button"
                disabled={disabled}
                whileHover={disabled ? undefined : { scale: 1.09, y: -2 }}
                whileTap={disabled ? undefined : { scale: 0.94 }}
                onClick={() => onSelect(d)}
                aria-label={
                  d.toDateString() +
                  (booked ? " (fully booked)" : closed ? " (studio closed)" : "")
                }
                aria-pressed={selected}
                className={`numeric relative aspect-square rounded-2xl border text-sm transition-colors duration-300 ${
                  selected
                    ? "border-primary bg-primary font-semibold text-primary-foreground shadow-[0_12px_32px_hsl(var(--gold)/0.35)]"
                    : past
                      ? "border-transparent text-muted-foreground/30"
                      : booked
                        ? "border-transparent bg-muted/60 text-muted-foreground/70"
                        : closed
                          ? "border-transparent bg-muted/40 text-muted-foreground/40"
                          : "border-primary/40 text-foreground hover:border-primary hover:bg-primary/10"
                } ${isToday && !selected ? "ring-1 ring-primary/60" : ""}`}
              >
                {d.getDate()}
                {booked && !selected && (
                  <span className="absolute bottom-1.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-destructive" />
                )}
              </motion.button>
            );
          })}
        </motion.div>
      </AnimatePresence>

      <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-md border border-primary/60" /> Available
        </span>
        <span className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-destructive" /> Fully booked
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-md bg-muted" /> Unavailable / Blocked
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-md bg-primary" /> Selected
        </span>
      </div>
    </div>
  );
};

export default LuxuryCalendar;
