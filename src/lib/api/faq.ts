import { unstable_cache } from "next/cache";
import { getPayload } from "payload";
import config from "@payload-config";
import type { FaqItem } from "@/types/faq";
import type { SeoData } from "./seo-types";
import type { Media } from "@/payload-types";

// Same helper as lib/api/home-map.ts's — not shared across files since
// faq.ts and home.ts/home-map.ts are otherwise independent, and it's
// only 3 lines.
function mediaUrl(image: number | Media | null | undefined): string {
  return typeof image === "object" && image !== null ? (image.url ?? "") : "";
}

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
  seo: SeoData;
};

// Mirrors lib/api/home.ts's pattern: a single `findGlobal` call wrapped
// in `unstable_cache` (tagged "faq"), with the Faq global's own
// `afterChange` hook (src/globals/Faq.ts) busting that tag on every
// /admin save. Real content, seeded from what previously lived here as
// a literal (see git history) into the "faq-page" global via a one-off
// script, not fabricated.
// `draft: false` is explicit, not relying on it already being the
// default — see lib/api/home.ts's identical comment. Same reasoning,
// now that versions.drafts is enabled on this global too.
const getFaqFromCMS = unstable_cache(
  async (): Promise<FaqPageData> => {
    const payload = await getPayload({ config });
    const faq = await payload.findGlobal({ slug: "faq-page", draft: false });

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
      seo: {
        metaTitle: faq.seo?.metaTitle ?? "",
        metaDescription: faq.seo?.metaDescription ?? "",
        ogImage: mediaUrl(faq.seo?.ogImage),
        noIndex: faq.seo?.noIndex ?? false,
      },
    };
  },
  ["faq-page-full"],
  { tags: ["faq"] }
);

export async function getFaqPage(): Promise<FaqPageData> {
  return getFaqFromCMS();
}
