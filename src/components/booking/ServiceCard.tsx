import { motion } from "framer-motion";
import { Camera, Sparkles } from "lucide-react";
import type { Experience } from "@/data/booking";

const ServiceCard = ({
  service,
  index,
  onSelect,
}: {
  service: Experience;
  index: number;
  onSelect: () => void;
}) => {
  const featured = service.featured;

  return (
    <motion.article
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: 0.07 * index, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8 }}
      className={`group relative flex w-full flex-col overflow-hidden rounded-[26px] border bg-card text-left transition-[box-shadow,border-color] duration-500 ${
        featured
          ? "border-primary/40 shadow-[0_24px_70px_hsl(var(--gold)/0.2)] hover:border-primary"
          : "border-border hover:border-primary/50 hover:shadow-[0_26px_70px_hsl(0_0%_0%/0.2)]"
      }`}
    >
      {/* Media */}
      <div className="relative h-[240px] overflow-hidden md:h-[260px]">
        {featured ? (
          <>
            <div className="absolute inset-0 bg-[linear-gradient(150deg,hsl(240_3%_5%),hsl(0_0%_12%)_55%,hsl(240_3%_7%))]" />
            <motion.div
              aria-hidden
              className="absolute inset-0"
              animate={{ opacity: [0.35, 0.7, 0.35] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              style={{
                background:
                  "radial-gradient(60% 45% at 30% 25%, hsl(var(--gold)/0.3), transparent 70%), radial-gradient(50% 40% at 80% 80%, hsl(var(--gold)/0.18), transparent 70%)",
              }}
            />
            {Array.from({ length: 14 }).map((_, i) => (
              <motion.span
                key={i}
                aria-hidden
                className="absolute h-1 w-1 rounded-full bg-primary/70"
                style={{ left: `${(i * 37) % 100}%`, top: `${(i * 53) % 100}%` }}
                animate={{ y: [0, -24, 0], opacity: [0.15, 0.9, 0.15] }}
                transition={{
                  duration: 5 + (i % 5),
                  repeat: Infinity,
                  delay: i * 0.25,
                  ease: "easeInOut",
                }}
              />
            ))}
          </>
        ) : (
          <img
            src={service.image}
            alt={`${service.name} photography by Afriframe Studio`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.08]"
          />
        )}

        {/* Icon badge */}
        <span className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_10px_28px_hsl(var(--gold)/0.35)]">
          {featured ? <Sparkles className="h-5 w-5" /> : <Camera className="h-5 w-5" />}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-7">
        <h3 className="font-display text-[1.7rem] leading-tight text-foreground">{service.name}</h3>
        <p className="mt-3 max-w-[42ch] text-sm italic leading-relaxed text-muted-foreground">
          {service.description}
        </p>

        <div className="mt-7 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              {service.price > 0 ? "Starting from" : "Bespoke"}
            </p>
            <p className="numeric mt-1 text-2xl text-primary">
              {service.price > 0 ? `$${service.price}` : "On request"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{service.duration}</p>
          </div>

          <button
            type="button"
            onClick={onSelect}
            className="h-11 shrink-0 rounded-full border border-border bg-secondary px-7 text-sm text-foreground transition-all duration-300 hover:border-primary hover:bg-primary hover:text-primary-foreground"
          >
            Select
          </button>
        </div>
      </div>
    </motion.article>
  );
};

export default ServiceCard;
