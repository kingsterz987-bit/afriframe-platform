import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import logo from "@/assets/afriframe-logo.png";


const links = [
  { label: "Home", to: "/" },
  { label: "Portfolio", to: "/explore" },
  { label: "Services", to: "/#services" },
  { label: "About", to: "/#about" },
  { label: "Contact", to: "/#contact" },
];

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname, hash]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 pt-3 md:pt-5">
      <nav
        className={`lux-container flex h-16 items-center justify-between rounded-[20px] px-5 transition-all duration-500 md:px-8 ${
          scrolled ? "glass max-w-[1360px]" : "max-w-[1500px] border border-transparent"
        }`}
        aria-label="Main"
      >
        <Link to="/" className="flex items-center gap-3">
          <img
            src={logo}
            alt="Afriframe Studio logo"
            className="h-9 w-9 rounded-[10px] object-cover"
          />
          <span className="font-cinzel text-sm uppercase tracking-[0.28em] text-foreground">
            Afriframe
          </span>
        </Link>


        <div className="hidden items-center gap-9 lg:flex">
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              className="group relative text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
              <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            to="/booking"
            className="hidden h-10 items-center rounded-2xl bg-primary px-5 text-sm font-medium text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_hsl(var(--gold)/0.35)] sm:inline-flex"
          >
            Book a Session
          </Link>
          <button
            className="grid h-10 w-10 place-items-center rounded-full border border-border/70 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="lux-container mt-3 lg:hidden">
          <div className="glass animate-fade-in rounded-[20px] p-6">
            <div className="flex flex-col gap-5">
              {links.map((l) => (
                <Link key={l.label} to={l.to} className="text-lg text-foreground">
                  {l.label}
                </Link>
              ))}
              <Link
                to="/booking"
                className="mt-2 inline-flex h-12 items-center justify-center rounded-2xl bg-primary text-sm font-medium text-primary-foreground"
              >
                Book a Session
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navigation;
