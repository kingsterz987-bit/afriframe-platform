import { motion } from "framer-motion";

type Slot = {
  time: string;
  available: boolean;
  booked?: boolean;
};

const TimeSlotSelector = ({
  slots,
  value,
  onSelect,
}: {
  slots: Slot[];
  value?: string;
  onSelect: (t: string) => void;
}) => {
  const hasBookedSlots = slots.some(
    (slot) => slot.booked
  );

  return (
    <div>
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="eyebrow">
          Choose a Time
        </p>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-primary" />
            Available
          </span>

          {hasBookedSlots && (
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/50" />
              Already Booked
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {slots.map((s, i) => {
          const selected =
            value === s.time;

          const isBooked =
            s.booked === true;

          return (
            <motion.button
              key={s.time}
              type="button"
              disabled={!s.available}
              initial={{
                opacity: 0,
                y: 12,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay:
                  0.05 * i,
                duration: 0.45,
                ease: [
                  0.22,
                  1,
                  0.36,
                  1,
                ],
              }}
              whileHover={
                s.available
                  ? {
                      y: -3,
                      scale: 1.03,
                    }
                  : undefined
              }
              whileTap={
                s.available
                  ? {
                      scale: 0.96,
                    }
                  : undefined
              }
              onClick={() =>
                onSelect(
                  s.time
                )
              }
              aria-pressed={
                selected
              }
              aria-label={
                isBooked
                  ? `${s.time} is already booked`
                  : `${s.time} ${
                      s.available
                        ? "is available"
                        : "is unavailable"
                    }`
              }
              className={`numeric relative h-12 rounded-full border px-6 text-sm transition-all duration-300 ${
                selected
                  ? "border-primary bg-primary font-semibold text-primary-foreground shadow-[0_12px_32px_hsl(var(--gold)/0.35)]"
                  : s.available
                    ? "border-border bg-card text-foreground hover:border-primary hover:text-primary hover:shadow-[0_10px_28px_hsl(var(--gold)/0.18)]"
                    : isBooked
                      ? "cursor-not-allowed border-muted-foreground/15 bg-muted text-muted-foreground/60 line-through opacity-75"
                      : "cursor-not-allowed border-transparent bg-muted text-muted-foreground/50"
              }`}
            >
              {s.time}

              {isBooked && (
                <span className="ml-2 text-[9px] uppercase tracking-[0.12em] no-underline">
                  Taken
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {hasBookedSlots && (
        <p className="mt-5 text-xs text-muted-foreground">
          Times marked as{" "}
          <span className="font-medium text-foreground">
            Taken
          </span>{" "}
          are already reserved and cannot be selected.
        </p>
      )}
    </div>
  );
};

export default TimeSlotSelector;
