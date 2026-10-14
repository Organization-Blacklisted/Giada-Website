// Pure mapping logic split out of lib/api/products.ts so it can be
// imported as a VALUE from ProductsPageClient.tsx (a Client Component)
// without dragging getPayload/@payload-config/unstable_cache into the
// client bundle — same reasoning as lib/api/gallery-map.ts's split from
// lib/api/gallery.ts.
//
// This is the `products-page` GLOBAL's mapper (the /products hub's hero
// + category cards + gallery CTA) — NOT the Rugs catalog. The catalog
// (a real Payload collection, ~75 items) has its own separate mapper at
// lib/api/products-catalog-map.ts, kept under a different filename
// specifically to avoid colliding with this one.
import type { SeoData } from "./seo-types";
import type { ProductsPage, Media } from "@/payload-types";

function mediaUrl(image: number | Media | null | undefined): string {
  return typeof image === "object" && image !== null ? (image.url ?? "") : "";
}

function mediaDims(image: number | Media | null | undefined): { width: number; height: number } {
  return typeof image === "object" && image !== null
    ? { width: image.width ?? 0, height: image.height ?? 0 }
    : { width: 0, height: 0 };
}

export type ProductsCategoryData = {
  title: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  href: string;
};

export type ProductsPageData = {
  hero: { eyebrow: string; heading: string };
  categories: ProductsCategoryData[];
  galleryCta: { label: string; href: string };
  seo: SeoData;
};

export function mapProductsData(page: ProductsPage): ProductsPageData {
  return {
    hero: { eyebrow: page.hero.eyebrow, heading: page.hero.heading },
    categories: (page.categories ?? []).map((category) => {
      const { width, height } = mediaDims(category.image);
      return { title: category.title, image: mediaUrl(category.image), imageWidth: width, imageHeight: height, href: category.href };
    }),
    galleryCta: { label: page.galleryCta.label, href: page.galleryCta.href },
    seo: {
      metaTitle: page.seo?.metaTitle ?? "",
      metaDescription: page.seo?.metaDescription ?? "",
      ogImage: mediaUrl(page.seo?.ogImage),
      noIndex: page.seo?.noIndex ?? false,
    },
  };
}
