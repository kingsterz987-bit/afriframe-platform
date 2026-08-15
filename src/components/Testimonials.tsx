import { Star } from "lucide-react";
import { testimonials } from "@/data/site";

const Testimonials = () => (
  <section id="testimonials" className="lux-section bg-surface">
    <div className="lux-container">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">Kind Words</p>
        <h2 className="mt-5 text-4xl font-medium md:text-5xl">
          Trusted with <span className="italic gold-text">once-in-a-lifetime</span> moments
        </h2>
      </div>

      <div className="mt-14 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 md:grid md:grid-cols-3 md:overflow-visible">
        {testimonials.map((t) => (
          <figure
            key={t.id}
            className="lux-card min-w-[85%] snap-center p-8 md:min-w-0"
          >
            <div className="flex gap-1" aria-label={`${t.rating} out of 5 stars`}>
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-primary text-primary" />
              ))}
            </div>
            <blockquote className="mt-6 font-display text-lg italic leading-relaxed text-foreground">
              “{t.quote}”
            </blockquote>
            <figcaption className="mt-8 flex items-center gap-4">
              <img
                src={t.image}
                alt=""
                loading="lazy"
                className="h-12 w-12 rounded-full object-cover"
              />
              <div>
                <p className="text-sm text-foreground">{t.name}</p>
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {t.service}
                </p>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
