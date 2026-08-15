import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Instagram, Youtube, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const empty = { name: "", email: "", phone: "", service: "", message: "" };

const Contact = () => {
  const { toast } = useToast();
  const [form, setForm] = useState(empty);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Message received", description: "Our studio replies within 24 hours." });
    setForm(empty);
  };

  return (
    <section id="contact" className="lux-section bg-surface">
      <div className="lux-container grid gap-14 lg:grid-cols-2">
        {/* Left — studio details */}
        <div>
          <p className="eyebrow">Contact</p>
          <h2 className="mt-5 text-4xl font-medium md:text-5xl">
            Let's create <span className="italic gold-text">something timeless</span>
          </h2>
          <p className="mt-5 max-w-md text-muted-foreground">
            Tell us about the moment you want preserved. We'll respond with availability, a
            tailored approach and transparent pricing.
          </p>

          <div className="mt-10 space-y-5">
            {[
              { icon: MapPin, label: "Studio", value: "KG 7 Ave, Kimihurura — Kigali, Rwanda" },
              { icon: Phone, label: "Phone", value: "+250 788 000 000", href: "tel:+250788000000" },
              { icon: Mail, label: "Email", value: "studio@afriframe.co", href: "mailto:studio@afriframe.co" },
              { icon: Clock, label: "Hours", value: "Mon–Fri 9:00–18:00 · Sat by appointment" },
            ].map(({ icon: Icon, label, value, href }) => {
              const content = (
                <div className="flex items-start gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-border text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                      {label}
                    </p>
                    <p className="mt-1 text-foreground">{value}</p>
                  </div>
                </div>
              );
              return href ? (
                <a key={label} href={href} className="block transition-opacity hover:opacity-75">
                  {content}
                </a>
              ) : (
                <div key={label}>{content}</div>
              );
            })}
          </div>

          <div className="mt-10 flex gap-3">
            {[Instagram, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label={i === 0 ? "Instagram" : "YouTube"}
                className="grid h-11 w-11 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary"
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>

          <div className="mt-10 h-44 overflow-hidden rounded-[20px] border border-border bg-[radial-gradient(70%_70%_at_50%_50%,hsl(var(--gold)/0.15),transparent)]">
            <div className="grid h-full place-items-center text-sm text-muted-foreground">
              Kimihurura · Kigali — map preview
            </div>
          </div>
        </div>

        {/* Right — form */}
        <form onSubmit={handleSubmit} className="lux-card h-fit p-8 md:p-10">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Name</span>
              <Input name="name" value={form.name} onChange={handleChange} required placeholder="Your full name" className="mt-2 h-12 rounded-2xl" />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Email</span>
              <Input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="you@email.com" className="mt-2 h-12 rounded-2xl" />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Phone</span>
              <Input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+250 …" className="mt-2 h-12 rounded-2xl" />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Service</span>
              <select
                name="service"
                value={form.service}
                onChange={handleChange}
                required
                className="mt-2 h-12 w-full rounded-2xl border border-input bg-background px-4 text-sm text-foreground"
              >
                <option value="">Select a service</option>
                <option>Wedding Photography</option>
                <option>Wedding Film</option>
                <option>Portrait Session</option>
                <option>Graduation Session</option>
                <option>Commercial Campaign</option>
                <option>Music Video</option>
              </select>
            </label>
            <label className="block sm:col-span-2">
              <span className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Message</span>
              <Textarea name="message" value={form.message} onChange={handleChange} required rows={6} placeholder="Tell us about your story…" className="mt-2 rounded-2xl" />
            </label>
          </div>

          <button
            type="submit"
            className="mt-8 inline-flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-primary text-sm font-medium text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_50px_hsl(var(--gold)/0.35)]"
          >
            Send Message <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
