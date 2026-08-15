import { motion } from "framer-motion";
import { Check } from "lucide-react";

export const bookingSteps = [
  "Service",
  "Overview",
  "Date",
  "Time",
  "Details",
  "Review",
  "Submitted",
];

const BookingProgress = ({ current }: { current: number }) => (
  <nav aria-label="Booking progress" className="w-full">
    <ol className="hidden items-center justify-between gap-1 md:flex md:gap-2">
      {bookingSteps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={label} className="flex flex-1 items-center gap-2">
            <div className="flex items-center gap-2">
              <motion.span
                animate={{ scale: active ? 1.1 : 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className={`numeric grid h-8 w-8 shrink-0 place-items-center rounded-full border text-[11px] transition-colors duration-500 ${
                  done
                    ? "border-primary bg-primary text-primary-foreground"
                    : active
                      ? "border-primary text-primary shadow-[0_0_0_5px_hsl(var(--gold)/0.12)]"
                      : "border-border text-muted-foreground"
                }`}
                aria-current={active ? "step" : undefined}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </motion.span>
              <span
                className={`hidden text-[10px] uppercase tracking-[0.18em] transition-colors duration-500 xl:inline ${
                  active ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {label}
              </span>
            </div>
            {i < bookingSteps.length - 1 && (
              <span className="relative h-px flex-1 overflow-hidden bg-border">
                <motion.span
                  initial={false}
                  animate={{ scaleX: done ? 1 : 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 origin-left bg-primary"
                />
              </span>
            )}
          </li>
        );
      })}
    </ol>

    {/* Mobile: single line rail */}
    <div className="md:hidden">
      <div className="relative h-[3px] w-full overflow-hidden rounded-full bg-border">
        <motion.span
          initial={false}
          animate={{ scaleX: (current + 1) / bookingSteps.length }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 origin-left rounded-full bg-primary"
        />
      </div>
      <p className="mt-3 text-center text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        Step {current + 1} of {bookingSteps.length} — {bookingSteps[current]}
      </p>
    </div>
  </nav>
);

export default BookingProgress;
