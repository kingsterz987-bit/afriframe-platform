import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Star } from "lucide-react";
import { Link } from "react-router-dom";
import heroCamera from "@/assets/hero-camera.jpg";

const trust = [
  { value: "★★★★★", label: "Rated by 200+ clients", star: false },
  { value: "500+", label: "Projects" },
  { value: "10+", label: "Years" },
  { value: "100%", label: "Client Satisfaction" },
];

const Hero = () => {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (reduce) return;
    const el = sectionRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      setPointer({
        x: (e.clientX - r.left) / r.width - 0.5,
        y: (e.clientY - r.top) / r.height - 0.5,
      });
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, [reduce]);

  const particles = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
        id: i,
        left: `${(i * 37) % 100}%`,
        top: `${(i * 53) % 100}%`,
        size: 2 + ((i * 7) % 5),
        delay: (i % 10) * 1.4,
        duration: 14 + (i % 6) * 2.5,
      })),
    []
  );

  return (
    <section
      ref={sectionRef}
      className="grain relative isolate flex min-h-[100svh] items-center overflow-hidden bg-[hsl(240_3%_4%)]"
      aria-label="Afriframe Studio hero"
    >
      {/* Layer 1 — the uploaded photograph as the entire hero background */}
      <div
        aria-hidden
        className="absolute inset-0 -z-30 bg-cover bg-center-right bg-no-repeat"
        style={{
          backgroundImage: `url(${heroCamera})`,
          backgroundPosition: "center right",
          transform: reduce
            ? undefined
            : `scale(1.04) translate3d(${pointer.x * -10}px, ${pointer.y * -8}px, 0)`,
          transition: "transform 900ms cubic-bezier(0.22,1,0.36,1)",
        }}
      />

      {/* Layer 2 — cinematic readability gradient (never darkens the camera) */}
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,hsl(240_3%_3%/0.96)_0%,hsl(240_3%_3%/0.86)_28%,hsl(240_3%_4%/0.45)_52%,transparent_74%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-[linear-gradient(180deg,hsl(240_3%_3%/0.9)_0%,hsl(240_3%_3%/0.62)_45%,hsl(240_3%_3%/0.78)_100%)] md:bg-[linear-gradient(180deg,hsl(240_3%_3%/0.55)_0%,transparent_30%,transparent_70%,hsl(240_3%_3%/0.6)_100%)]"
      />

      {/* Vignette + warm bloom */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(75%_65%_at_72%_52%,hsl(39_70%_60%/0.14),transparent_62%),radial-gradient(120%_100%_at_50%_50%,transparent_55%,hsl(0_0%_0%/0.55)_100%)]"
      />

      {/* Layer 3 — drifting gold dust */}
      {!reduce &&
        particles.map((p) => (
          <span
            key={p.id}
            aria-hidden
            className="animate-drift pointer-events-none absolute -z-10 rounded-full bg-[hsl(39_70%_68%/0.6)] blur-[1px]"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              transform: `translate3d(${pointer.x * (8 + (p.id % 5) * 4)}px, ${
                pointer.y * (6 + (p.id % 4) * 3)
              }px, 0)`,
            }}
          />
        ))}

      {/* Layer 4 — content */}
      <div className="lux-container relative z-10 pb-28 pt-36 md:pb-32 md:pt-32">
        <div className="max-w-[640px] text-center md:text-left">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="eyebrow"
          >
            Afriframe Studio
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.35, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="display mt-6 font-medium text-[hsl(0_0%_98%)]"
          >
            Crafting Stories
            <span className="block italic gold-text">Beyond The Frame.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.9 }}
            className="mx-auto mt-8 max-w-[620px] text-base leading-relaxed text-[hsl(0_0%_82%)] md:mx-0 md:text-lg"
          >
            Afriframe Studio transforms weddings, portraits, brands and unforgettable moments
            into cinematic visual stories through timeless photography and modern filmmaking.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.95, duration: 0.9 }}
            className="mt-10 flex flex-col gap-4 sm:flex-row md:justify-start"
          >
            <Link
              to="/booking"
              className="group inline-flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-primary px-8 text-sm font-medium tracking-wide text-primary-foreground transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_18px_50px_hsl(var(--gold)/0.4)] sm:w-auto"
            >
              Book Your Experience
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              to="/explore"
              className="group inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl border border-primary/45 px-8 text-sm font-medium tracking-wide text-[hsl(0_0%_96%)] transition-all duration-500 hover:-translate-y-0.5 hover:border-primary hover:text-primary sm:w-auto"
            >
              Explore Portfolio
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.25, duration: 1 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-x-7 gap-y-4 md:justify-start"
          >
            {trust.map((t, i) => (
              <div key={t.label} className="flex items-center gap-7">
                {i > 0 && <span className="h-6 w-px bg-primary/30" aria-hidden />}
                <div className="flex items-baseline gap-2">
                  {i === 0 ? (
                    <span className="flex items-center gap-0.5" aria-hidden>
                      {Array.from({ length: 5 }).map((_, s) => (
                        <Star key={s} className="h-3.5 w-3.5 fill-primary text-primary" />
                      ))}
                    </span>
                  ) : (
                    <span className="numeric text-lg font-semibold text-[hsl(0_0%_96%)]">
                      {t.value}
                    </span>
                  )}
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[hsl(0_0%_70%)]">
                    {t.label}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.7, duration: 1 }}
        className="absolute bottom-8 left-6 z-10 hidden items-center gap-4 md:left-10 md:flex lg:left-16"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-[hsl(0_0%_70%)]">
          Scroll to Explore
        </span>
        <span className="relative h-px w-16 overflow-hidden bg-[hsl(0_0%_100%/0.2)]">
          <motion.span animate={{ x: ["-100%", "260%"] }} transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }} className="absolute inset-y-0 left-0 w-6 bg-primary" />
        </span>
      </motion.div>
    </section>
  );
};

export default Hero;
