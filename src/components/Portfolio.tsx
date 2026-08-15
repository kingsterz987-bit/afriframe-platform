import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { collections } from "@/data/site";

const filters = ["All", "Weddings", "Portraits", "Commercial", "Fashion", "Events"];

const Portfolio = () => {
  const [active, setActive] = useState("All");

  const visible = useMemo(
    () => (active === "All" ? collections : collections.filter((c) => c.category === active)),
    [active]
  );

  return (
    <section id="portfolio" className="lux-section relative bg-background">
      <div className="lux-container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Curated Collections</p>
          <h2 className="mt-5 text-4xl font-medium md:text-5xl lg:text-[3.25rem]">
            Pick a story — <span className="italic gold-text">each frame tells one</span>
          </h2>
          <p className="mt-5 text-muted-foreground">
            Ten bodies of work, shot across weddings, studios and streets. Every collection is
            edited as a single visual narrative.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`h-10 rounded-full border px-5 text-sm transition-all duration-300 ${
                active === f
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="mt-14 grid auto-rows-[260px] grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((c, i) => (
            <Link
              key={c.id}
              to="/explore"
              className={`group relative overflow-hidden rounded-[20px] border border-border ${
                i === 0 ? "sm:col-span-2 sm:row-span-2" : i === 3 ? "lg:row-span-2" : ""
              }`}
            >
              <img
                src={c.image}
                alt={`${c.title} collection`}
                loading={i > 2 ? "lazy" : "eager"}
                className="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-90" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <span className="font-cinzel text-[10px] uppercase tracking-[0.3em] text-primary">
                  {c.category} · <span className="numeric">{c.count}</span> frames
                </span>
                <h3 className="mt-2 text-2xl text-white">{c.title}</h3>
                <p className="mt-1 max-w-sm translate-y-2 text-sm text-white/70 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  {c.descriptor}
                </p>
              </div>
              <span className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full border border-white/25 bg-black/30 text-white opacity-0 backdrop-blur transition-all duration-500 group-hover:opacity-100">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link
            to="/explore"
            className="inline-flex h-13 items-center gap-3 rounded-2xl border border-border px-8 py-4 text-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/60 hover:text-primary"
          >
            View the full portfolio <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
