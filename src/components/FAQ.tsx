import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs } from "@/data/site";

const FAQ = () => (
  <section id="faq" className="lux-section bg-background">
    <div className="lux-container grid gap-12 lg:grid-cols-[minmax(0,38%)_minmax(0,62%)]">
      <div>
        <p className="eyebrow">Questions</p>
        <h2 className="mt-5 text-4xl font-medium md:text-5xl">
          Everything you <span className="italic gold-text">might ask</span>
        </h2>
        <p className="mt-5 text-muted-foreground">
          Still unsure about something? Our studio team replies within 24 hours.
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {faqs.map((f, i) => (
          <AccordionItem key={f.q} value={`item-${i}`} className="border-border">
            <AccordionTrigger className="py-6 text-left font-display text-lg hover:text-primary hover:no-underline">
              {f.q}
            </AccordionTrigger>
            <AccordionContent className="pb-6 text-base leading-relaxed text-muted-foreground">
              {f.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
);

export default FAQ;
