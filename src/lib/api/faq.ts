import { unstable_cache } from "next/cache";
import { getPayload } from "payload";
import config from "@payload-config";
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

// Mirrors lib/api/home.ts's pattern: a single `findGlobal` call wrapped
// in `unstable_cache` (tagged "faq"), with the Faq global's own
// `afterChange` hook (src/globals/Faq.ts) busting that tag on every
// /admin save. Real content, seeded from what previously lived here as
// a literal (see git history) into the "faq-page" global via a one-off
// script, not fabricated.
const getFaqFromCMS = unstable_cache(
  async (): Promise<FaqPageData> => {
    const payload = await getPayload({ config });
    const faq = await payload.findGlobal({ slug: "faq-page" });

    return {
      hero: {
        eyebrow: faq.hero.eyebrow,
        heading: faq.hero.heading,
      },
      items: (faq.items ?? []).map((item) => ({
        id: item.id ?? item.question,
        question: item.question,
        answer: item.answer,
      })),
      closingCta: {
        eyebrow: faq.closingCta.eyebrow,
        heading: faq.closingCta.heading,
        description: faq.closingCta.description,
        linkText: faq.closingCta.linkText,
        href: faq.closingCta.href,
      },
    };
  },
  ["faq-page-full"],
  { tags: ["faq"] }
);

export async function getFaqPage(): Promise<FaqPageData> {
  return getFaqFromCMS();
}
