import { useId, useState } from "react";
import { motion } from "framer-motion";

type BaseProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  required?: boolean;
  index?: number;
};

const wrapperMotion = (index = 0) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: 0.06 * index, duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
});

export const FloatingInput = ({
  label,
  value,
  onChange,
  error,
  required,
  index,
  type = "text",
}: BaseProps & { type?: string }) => {
  const id = useId();
  const [focused, setFocused] = useState(false);
  const lifted = focused || value.length > 0;

  return (
    <motion.div {...wrapperMotion(index)} className="relative">
      <input
        id={id}
        type={type}
        value={value}
        required={required}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        className={`peer h-16 w-full rounded-2xl border bg-card px-5 pt-6 text-sm text-foreground outline-none transition-all duration-300 ${
          error
            ? "border-destructive"
            : "border-border focus:border-primary focus:shadow-[0_0_0_4px_hsl(var(--gold)/0.12)]"
        }`}
      />
      <label
        htmlFor={id}
        className={`pointer-events-none absolute left-5 transition-all duration-300 ${
          lifted
            ? "top-2.5 text-[10px] uppercase tracking-[0.18em] text-primary"
            : "top-1/2 -translate-y-1/2 text-sm text-muted-foreground"
        }`}
      >
        {label}
        {required && " *"}
      </label>
      {error && (
        <motion.p
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          className="mt-2 pl-1 text-xs text-destructive"
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
};

export const FloatingTextarea = ({
  label,
  value,
  onChange,
  index,
  rows = 4,
}: BaseProps & { rows?: number }) => {
  const id = useId();
  const [focused, setFocused] = useState(false);
  const lifted = focused || value.length > 0;

  return (
    <motion.div {...wrapperMotion(index)} className="relative">
      <textarea
        id={id}
        rows={rows}
        value={value}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e) => onChange(e.target.value)}
        className="w-full resize-none rounded-2xl border border-border bg-card px-5 pb-4 pt-8 text-sm text-foreground outline-none transition-all duration-300 focus:border-primary focus:shadow-[0_0_0_4px_hsl(var(--gold)/0.12)]"
      />
      <label
        htmlFor={id}
        className={`pointer-events-none absolute left-5 transition-all duration-300 ${
          lifted
            ? "top-3 text-[10px] uppercase tracking-[0.18em] text-primary"
            : "top-7 text-sm text-muted-foreground"
        }`}
      >
        {label}
      </label>
    </motion.div>
  );
};

export const FloatingSelect = ({
  label,
  value,
  onChange,
  options,
  index,
  required,
}: BaseProps & { options: string[] }) => {
  const id = useId();
  return (
    <motion.div {...wrapperMotion(index)} className="relative">
      <select
        id={id}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="h-16 w-full appearance-none rounded-2xl border border-border bg-card px-5 pt-6 text-sm text-foreground outline-none transition-all duration-300 focus:border-primary focus:shadow-[0_0_0_4px_hsl(var(--gold)/0.12)]"
      >
        <option value="">Select…</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-5 top-2.5 text-[10px] uppercase tracking-[0.18em] text-primary"
      >
        {label}
        {required && " *"}
      </label>
      <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground">
        ▾
      </span>
    </motion.div>
  );
};
