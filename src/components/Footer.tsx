import { Link } from "react-router-dom";
import { ArrowUp, Instagram, Youtube, Facebook } from "lucide-react";
import logo from "@/assets/afriframe-logo.png";

const columns = [
  {
    title: "Studio",
    links: [
      { label: "Home", to: "/" },
      { label: "Portfolio", to: "/explore" },
      { label: "Services", to: "/#services" },
      { label: "About", to: "/#about" },
    ],
  },
  {
    title: "Collections",
    links: [
      { label: "Weddings", to: "/explore" },
      { label: "Portraits", to: "/explore" },
      { label: "Commercial", to: "/explore" },
      { label: "Films", to: "/explore" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "Book a session", to: "/booking" },
      { label: "Contact", to: "/#contact" },
      { label: "FAQ", to: "/#faq" },
      { label: "Testimonials", to: "/#testimonials" },
    ],
  },
];

const Footer = () => (
  <footer className="relative bg-background pt-20">
    <div className="lux-container">
      <div className="gold-rule mb-16" />

      <div className="grid gap-12 lg:grid-cols-[minmax(0,36%)_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="Afriframe Studio logo"
              className="h-9 w-9 rounded-[10px] object-cover"
            />
            <span className="font-cinzel text-sm uppercase tracking-[0.28em]">Afriframe Studio</span>
          </div>

          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Luxury photography and cinematic storytelling. Moments, preserved beautifully — from
            Kigali to wherever your story unfolds.
          </p>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-8 flex max-w-sm gap-2"
            aria-label="Newsletter signup"
          >
            <input
              type="email"
              required
              placeholder="Email address"
              aria-label="Email address"
              className="h-12 w-full rounded-2xl border border-input bg-transparent px-4 text-sm outline-none focus:border-primary/60"
            />
            <button className="h-12 shrink-0 rounded-2xl bg-primary px-5 text-sm font-medium text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5">
              Join
            </button>
          </form>

          <div className="mt-8 flex gap-3">
            {[Instagram, Youtube, Facebook].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label={["Instagram", "YouTube", "Facebook"][i]}
                className="grid h-10 w-10 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div className="grid gap-10 sm:grid-cols-3">
          {columns.map((col) => (
            <div key={col.title}>
              <p className="font-cinzel text-[11px] uppercase tracking-[0.28em] text-primary">
                {col.title}
              </p>
              <ul className="mt-5 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border py-8 sm:flex-row">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Afriframe Studio. All rights reserved.
        </p>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-primary"
        >
          Back to top <ArrowUp className="h-4 w-4" />
        </button>
      </div>
    </div>
  </footer>
);

export default Footer;
