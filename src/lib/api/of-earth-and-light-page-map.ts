// Pure mapping logic for Of Earth and Light's own detail-page Global —
// split out the same way every other page's `-map.ts` is. See
// lib/api/fragments-page-map.ts for the identical pattern.
import type { OfEarthAndLightPage, Media } from "@/payload-types";
import type { SeoData } from "./seo-types";

function mediaUrl(image: number | Media | null | undefined): string {
  return typeof image === "object" && image !== null ? (image.url ?? "") : "";
}

export type OfEarthAndLightPageData = {
  statement: {
    description: string;
  };
  designer: {
    bio: string;
    portrait: string;
  };
  seo: SeoData;
};

export function mapOfEarthAndLightPage(doc: OfEarthAndLightPage): OfEarthAndLightPageData {
  return {
    statement: {
      description: doc.statement.description,
    },
    designer: {
      bio: doc.designer.bio,
      portrait: mediaUrl(doc.designer.portrait),
    },
    seo: {
      metaTitle: doc.seo?.metaTitle ?? "",
      metaDescription: doc.seo?.metaDescription ?? "",
      ogImage: mediaUrl(doc.seo?.ogImage),
      noIndex: doc.seo?.noIndex ?? false,
    },
  };
}
