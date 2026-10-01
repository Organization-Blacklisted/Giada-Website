import type { FaqItem } from "@/types/faq";

// Real content, confirmed from the Astro source's pages/faq.astro —
// currently hardcoded there too, not CMS-driven. Static for now; swap
// for a Laravel fetch later without touching the Accordion or the page
// (this file is the only thing that changes).
export const faqs: FaqItem[] = [
  {
    id: "unusual-dimensions",
    question: "What if my space has unusual or very large dimensions?",
    answer:
      "We excel at custom sizing. We can produce rugs up to 25+ feet wide and accommodate any dimension or irregular footprint. We also advise on optimal sizing for challenging spaces.",
  },
  {
    id: "international-shipping",
    question: "Do you ship internationally?",
    answer:
      "Yes, we ship worldwide. We manage all logistics, documentation, and customs clearance. Shipping typically takes 1–3 weeks by air or 6–10 weeks by sea, depending on destination.",
  },
  {
    id: "minimum-order",
    question: "What is your minimum order quantity?",
    answer:
      "There is no minimum. We create a single custom rug with the same care and attention as an entire property commission. Every project begins with your vision.",
  },
  {
    id: "modify-after-sample",
    question: "Can I modify my design after approving the sample?",
    answer:
      "Yes, within reason. Minor adjustments — colour refinements, pile height tweaks — can often be accommodated at no additional cost. Significant redesigns are discussed on a case-by-case basis.",
  },
  {
    id: "unsatisfied-with-sample",
    question: "What if I am not satisfied with my sample?",
    answer:
      "We work closely with you through revisions until the sample is exactly right. If substantial changes are needed, we discuss all options — including redoing the sample or refining the direction.",
  },
  {
    id: "trade-programme",
    question: "Do you have a trade programme for designers?",
    answer:
      "Absolutely. We have dedicated relationships with interior designers and architects. We offer professional pricing, expedited timelines, direct consultation, and tailored project support.",
  },
  {
    id: "payment-terms",
    question: "What are your payment terms?",
    answer:
      "We require a 50% deposit upon design approval, with the balance due before shipment. We accept wire transfers and cheques.",
  },
  {
    id: "showroom-visit",
    question: "Can I visit the showroom without an appointment?",
    answer:
      "Walk-ins are welcome during business hours, but appointments are strongly recommended. Private showings allow our team to prepare samples specific to your project and provide personalised attention.",
  },
];
