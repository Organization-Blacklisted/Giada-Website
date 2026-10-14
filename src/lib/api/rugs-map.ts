// Pure mapping logic split out of lib/api/rugs.ts so it can be imported
// as a VALUE from RugsPageClient.tsx (a Client Component) without
// dragging getPayload/@payload-config/unstable_cache into the client
// bundle — same reasoning as lib/api/gallery-map.ts's split from
// lib/api/gallery.ts.
import type { SeoData } from "./seo-types";
import type { RugsPage, Media } from "@/payload-types";

function mediaUrl(image: number | Media | null | undefined): string {
  return typeof image === "object" && image !== null ? (image.url ?? "") : "";
}

export type RugsPageData = {
  hero: { eyebrow: string; heading: string; description: string };
  closingCta: { eyebrow: string; heading: string; description: string };
  seo: SeoData;
};

export function mapRugsData(page: RugsPage): RugsPageData {
  return {
    hero: { eyebrow: page.hero.eyebrow, heading: page.hero.heading, description: page.hero.description },
    closingCta: {
      eyebrow: page.closingCta.eyebrow,
      heading: page.closingCta.heading,
      description: page.closingCta.description,
    },
    seo: {
      metaTitle: page.seo?.metaTitle ?? "",
      metaDescription: page.seo?.metaDescription ?? "",
      ogImage: mediaUrl(page.seo?.ogImage),
      noIndex: page.seo?.noIndex ?? false,
    },
  };
}
