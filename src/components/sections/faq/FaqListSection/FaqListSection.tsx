import Accordion from "@/components/ui/Accordion";
import type { FaqListSectionProps } from "./FaqListSection.types";

// Thin wrapper around the generic Accordion primitive — maps the FAQ
// domain shape into Accordion's own deliberately-generic AccordionItem
// shape (see Accordion.types.ts), same mapping the page used to do
// directly before this retrofit.
//
// TODO: real source ends with a ContactCTA strip ("Still Have
// Questions?") — components/ui/ContactCTA isn't built yet, add once it exists.
export default function FaqListSection({ items, className = "" }: FaqListSectionProps) {
  return (
    <section className={`px-5 pb-24 md:px-10 lg:px-16 ${className}`}>
      <div className="mx-auto max-w-3xl">
        <Accordion items={items.map((item) => ({ id: item.id, title: item.question, content: item.answer }))} />
      </div>
    </section>
  );
}
