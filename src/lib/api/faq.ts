import type { FaqItem } from "@/types/faq";

// Owned by this data layer, not imported from the section components —
// same reasoning as lib/api/contact.ts: the data layer stays independent
// of components/*, components declare their own separate prop types that
// happen to match structurally (TypeScript still catches any drift at
// the `{...hero}` spread call sites in page.tsx).
export type FaqHeroData = {
  eyebrow: string;
  heading: string;
};

export type FaqClosingCtaData = {
  eyebrow: string;
  heading: string;
  description: string;
  linkText: string;
  href: string;
};

export type FaqPageData = {
  hero: FaqHeroData;
  items: FaqItem[];
  closingCta: FaqClosingCtaData;
};

// Mirrors the Contact page's lib/api/contact.ts pattern — page.tsx and
// the section components only see this typed, already-shaped data. Real
// content (confirmed from the Astro source's pages/faq.astro), not
// placeholder; folded in from the old data/faq.ts, which only this page
// ever consumed. Static for now; swapping the body for
// `apiFetch<...>("/pages/faq")` later shouldn't require touching
// page.tsx or either section component.
//
// closingCta: real content confirmed from the Astro source's
// pages/faq.astro own <ContactCTA> usage (the generic, prop-driven
// component — not Home's hardcoded ClosingCTA.astro). Rendered via the
// shared ContactCtaBanner primitive directly in page.tsx, not through a
// dedicated section wrapper — there's no page-specific composition
// around it here, just a straight prop spread, so a wrapper folder would
// be pure pass-through.
export async function getFaqPage(): Promise<FaqPageData> {
  return {
    hero: {
      eyebrow: "Everything You Need to Know",
      heading: "Frequently Asked Questions",
    },
    items: [
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
    ],
    closingCta: {
      eyebrow: "Still Have Questions?",
      heading: "We're here to help.",
      description:
        "Every enquiry is handled personally by one of our founders. Reach out and we'll respond within one business day.",
      linkText: "Get in Touch",
      href: "/contact",
    },
  };
}
