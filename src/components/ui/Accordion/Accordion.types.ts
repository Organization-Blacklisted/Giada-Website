// Deliberately its own shape, not FaqItem — Accordion is a generic
// primitive (reusable for FAQ, legal sections, product specs, ...), it
// shouldn't know about the FAQ domain. Callers map their own data into
// this shape.
export type AccordionItem = {
  id?: string;
  title: string;
  content: string;
};

export interface AccordionProps {
  items: AccordionItem[];
  defaultOpenIndex?: number;
  className?: string;
}
