import SectionHeading from "@/components/ui/SectionHeading";
import Accordion from "@/components/ui/Accordion";
import type { AccordionItem } from "@/components/ui/Accordion";

export default function BlogFaqSection({ faqs, className = "" }: { faqs: AccordionItem[]; className?: string }) {
  return (
    <section className={`border-t border-stone-200 px-5 py-20 md:px-10 lg:px-16 lg:py-28 ${className}`}>
      <div className="mx-auto max-w-3xl">
        <SectionHeading eyebrow="Everything You Need to Know" title="Frequently Asked Questions" />
        <Accordion items={faqs} defaultOpenIndex={-1} />
      </div>
    </section>
  );
}
