import { Link } from "react-router-dom";
import { Check, ArrowRight } from "lucide-react";
import { services } from "@/data/site";

const Services = () => (
  <section id="services" className="lux-section bg-surface">
    <div className="lux-container">
      <div className="max-w-2xl">
        <p className="eyebrow">The Studio</p>
        <h2 className="mt-5 text-4xl font-medium md:text-5xl">
          Services crafted <span className="italic gold-text">with intention</span>
        </h2>
        <p className="mt-5 text-muted-foreground">
          Each engagement is directed end to end — from the first conversation to the final
          colour grade.
        </p>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <article key={s.id} className="lux-card group overflow-hidden">
            <div className="relative h-52 overflow-hidden">
              <img
                src={s.image}
                alt={s.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
            <div className="p-7">
              <h3 className="text-2xl">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.description}</p>
              <ul className="mt-5 space-y-2">
                {s.includes.map((inc) => (
                  <li key={inc} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 shrink-0 text-primary" />
                    {inc}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {s.deliverables}
              </p>
              <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
                <span className="numeric text-lg text-foreground">{s.price}</span>
                <Link
                  to="/booking"
                  className="inline-flex items-center gap-2 text-sm text-primary transition-transform duration-300 hover:translate-x-1"
                >
                  Book now <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default Services;
