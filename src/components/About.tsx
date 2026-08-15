import bridal from "@/assets/bridal-portrait.jpg";
import lifestyle from "@/assets/lifestyle-portrait.jpg";
import { statistics } from "@/data/site";

const values = [
  { title: "Story first", body: "We plan every shoot around the narrative, not the shot list." },
  { title: "Light as language", body: "Warm, deliberate lighting is the signature of every Afriframe frame." },
  { title: "Quiet presence", body: "We document without directing the moment out of existence." },
];

const timeline = [
  { year: "2019", text: "Afriframe founded in Kigali with one camera and a rented lens." },
  { year: "2021", text: "First international wedding commission; the film team is formed." },
  { year: "2023", text: "Studio opens — dedicated lighting stage and colour suite." },
  { year: "2026", text: "500+ projects delivered across three continents." },
];

const About = () => (
  <section id="about" className="lux-section bg-background">
    <div className="lux-container">
      <div className="grid items-center gap-14 lg:grid-cols-2">
        <div className="relative">
          <img
            src={bridal}
            alt="Afriframe bridal portrait lit with warm studio light"
            loading="lazy"
            className="aspect-[4/5] w-full rounded-[24px] object-cover"
          />
          <img
            src={lifestyle}
            alt="Behind the scenes on an Afriframe lifestyle shoot"
            loading="lazy"
            className="absolute -bottom-10 -right-4 hidden w-48 rounded-[20px] border border-border object-cover shadow-[var(--shadow-lift)] md:block lg:w-60"
          />
        </div>

        <div>
          <p className="eyebrow">Our Story</p>
          <h2 className="mt-5 text-4xl font-medium md:text-5xl">
            A studio built on <span className="italic gold-text">patience and light</span>
          </h2>
          <p className="mt-6 leading-relaxed text-muted-foreground">
            Afriframe Studio began with a simple belief: a photograph should feel like the moment
            it came from. Seven years later we direct weddings, campaigns and films with the same
            conviction — restraint, warmth and craft above spectacle.
          </p>

          <div className="mt-10 space-y-6">
            {values.map((v) => (
              <div key={v.title} className="border-l border-primary/40 pl-5">
                <h3 className="text-lg">{v.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="gold-rule my-16 md:my-24" />

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {statistics.map((s) => (
          <div key={s.label} className="text-center">
            <p className="numeric text-4xl font-semibold text-foreground md:text-5xl">{s.value}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.22em] text-muted-foreground">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-20 grid gap-8 md:grid-cols-4">
        {timeline.map((t) => (
          <div key={t.year} className="lux-card p-6">
            <p className="numeric text-primary">{t.year}</p>
            <p className="mt-3 text-sm text-muted-foreground">{t.text}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default About;
