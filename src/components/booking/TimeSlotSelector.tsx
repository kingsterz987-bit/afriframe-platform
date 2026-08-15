import { motion } from "framer-motion";

type Slot = { time: string; available: boolean };

const TimeSlotSelector = ({
  slots,
  value,
  onSelect,
}: {
  slots: Slot[];
  value?: string;
  onSelect: (t: string) => void;
}) => (
  <div>
    <p className="eyebrow mb-4">Available Times</p>
    <div className="flex flex-wrap gap-3">
      {slots.map((s, i) => {
        const selected = value === s.time;
        return (
          <motion.button
            key={s.time}
            type="button"
            disabled={!s.available}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            whileHover={s.available ? { y: -3, scale: 1.03 } : undefined}
            whileTap={s.available ? { scale: 0.96 } : undefined}
            onClick={() => onSelect(s.time)}
            aria-pressed={selected}
            className={`numeric h-12 rounded-full border px-6 text-sm transition-colors duration-300 ${
              selected
                ? "border-primary bg-primary font-semibold text-primary-foreground shadow-[0_12px_32px_hsl(var(--gold)/0.35)]"
                : s.available
                  ? "border-border text-foreground hover:border-primary hover:text-primary hover:shadow-[0_10px_28px_hsl(var(--gold)/0.18)]"
                  : "cursor-not-allowed border-transparent bg-muted text-muted-foreground/50"
            }`}
          >
            {s.time}
          </motion.button>
        );
      })}
    </div>
  </div>
);

export default TimeSlotSelector;
