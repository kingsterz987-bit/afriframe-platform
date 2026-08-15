import { motion } from "framer-motion";
import { ArrowRight, Check, Clock, Film, Sparkles } from "lucide-react";
import type { Experience } from "@/data/booking";
import GradientBlobCard from "@/components/ui/gradient-bold-card";

const fade = (i: number) => ({
  initial: { opacity: 0, y: 26 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: 0.06 * i, duration: 0.65, ease: [0.22, 1, 0.36, 1] as const },
});

const ServiceOverview = ({
  service,
  onBook,
}: {
  service: Experience;
  onBook: () => void;
}) => (
  <div className="mx-auto max-w-5xl">
    {/* Cinematic banner */}
    <motion.div
      layoutId={`service-media-${service.id}`}
      className="relative h-[240px] overflow-hidden rounded-[26px] border border-border md:h-[380px]"
    >
      {service.featured ? (
        <>
          <div className="absolute inset-0 bg-[linear-gradient(150deg,hsl(240_3%_4%),hsl(0_0%_11%)_55%,hsl(240_3%_6%))]" />
          <motion.div
            aria-hidden
            className="absolute inset-0"
            animate={{ opacity: [0.4, 0.75, 0.4] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            style={{
              background:
                "radial-gradient(55% 50% at 25% 25%, hsl(var(--gold)/0.3), transparent 70%), radial-gradient(45% 45% at 80% 75%, hsl(var(--gold)/0.2), transparent 70%)",
            }}
          />
        </>
      ) : (
        <>
          <img
            src={service.image}
            alt={`${service.name} cover frame by Afriframe Studio`}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,hsl(240_3%_4%/0.2),hsl(240_3%_4%/0.85))]" />
        </>
      )}
      <div className="absolute inset-x-0 bottom-0 p-7 md:p-10">
        <p className="eyebrow">Afriframe Studio</p>
        <h2 className="mt-3 font-display text-3xl text-white md:text-5xl">{service.name}</h2>
      </div>
    </motion.div>

    <motion.p {...fade(1)} className="mx-auto mt-8 max-w-2xl text-center text-base leading-relaxed text-muted-foreground md:text-lg">
      {service.description}
    </motion.p>

    <div className="mt-10 grid gap-5 md:grid-cols-2">
      <motion.div {...fade(2)}>
        <GradientBlobCard contentClassName="p-7">
          <p className="eyebrow flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5" /> {service.includesLabel}
          </p>
          <ul className="mt-5 space-y-3">
            {service.includes.map((x) => (
              <li key={x} className="flex items-start gap-3 text-sm text-foreground">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {x}
              </li>
            ))}
          </ul>
        </GradientBlobCard>
      </motion.div>

      <motion.div {...fade(3)}>
        <GradientBlobCard contentClassName="p-7">
          <p className="eyebrow flex items-center gap-2">
            <Film className="h-3.5 w-3.5" /> Deliverables
          </p>
          <ul className="mt-5 space-y-3">
            {service.deliverables.map((x) => (
              <li key={x} className="flex items-start gap-3 text-sm text-foreground">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {x}
              </li>
            ))}
          </ul>
          <div className="gold-rule my-6" />
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 text-primary" />
            <span className="numeric">{service.duration}</span>
          </p>
        </GradientBlobCard>
      </motion.div>
    </div>

    {/* Workflow */}
    <motion.div {...fade(4)} className="mt-5">
      <GradientBlobCard contentClassName="p-7">
        <p className="eyebrow">How It Works</p>
        <ol className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {service.workflow.map((w, i) => (
            <li key={w} className="relative">
              <span className="numeric text-3xl text-primary/40">0{i + 1}</span>
              <p className="mt-2 text-sm text-foreground">{w}</p>
            </li>
          ))}
        </ol>
      </GradientBlobCard>
    </motion.div>



    {/* Gallery */}
    {service.gallery.length > 0 && (
      <motion.div {...fade(5)} className="mt-5 grid grid-cols-3 gap-3">
        {service.gallery.map((g, i) => (
          <motion.div
            key={g + i}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="group relative aspect-[4/5] overflow-hidden rounded-[20px] border border-border"
          >
            <img
              src={g}
              alt={`${service.name} sample ${i + 1}`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
            />
          </motion.div>
        ))}
      </motion.div>
    )}

    <motion.div {...fade(6)} className="mt-10 flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={onBook}
        className="group inline-flex h-14 items-center gap-3 rounded-2xl bg-primary px-9 text-sm font-medium text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_46px_hsl(var(--gold)/0.35)]"
      >
        {service.cta}
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
      </button>
      <p className="text-xs text-muted-foreground">
        {service.price > 0
          ? `Investment from $${service.price} — final pricing confirmed after review.`
          : "Bespoke pricing, prepared after your consultation."}
      </p>
    </motion.div>
  </div>
);

export default ServiceOverview;
