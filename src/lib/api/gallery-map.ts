// Pure mapping logic split out of lib/api/gallery.ts so it can be
// imported as a VALUE from GalleryPageClient.tsx (a Client Component)
// without dragging getPayload/@payload-config/unstable_cache into the
// client bundle — same reasoning, and the same real failure mode, as
// lib/api/home-map.ts's split from lib/api/home.ts.
import type { SeoData } from "./seo-types";
import type { GalleryPage, Media } from "@/payload-types";

function mediaUrl(image: number | Media | null | undefined): string {
  return typeof image === "object" && image !== null ? (image.url ?? "") : "";
}

function mediaDims(image: number | Media): { width: number; height: number } {
  return typeof image === "object" ? { width: image.width ?? 0, height: image.height ?? 0 } : { width: 0, height: 0 };
}

// Same classification rule as the real Astro source (pages/gallery.astro)
// used at build time, now computed from each image's real measured
// dimensions (via the populated Media relation) instead of being stored
// as its own CMS field — it's a pure function of width/height, so
// storing it separately would just be data that can drift out of sync.
function computeShape(width: number, height: number): "portrait" | "landscape" | "square" {
  const ratio = width > 0 ? height / width : 1;
  if (ratio > 1.25) return "portrait";
  if (ratio < 0.75) return "landscape";
  return "square";
}

export type GalleryItemData = {
  image: string;
  imageWidth: number;
  imageHeight: number;
  alt: string;
  category: string;
  shape: "portrait" | "landscape" | "square";
};

export type GalleryPageData = {
  hero: {
    eyebrow: string;
    heading: string;
    description: string;
  };
  items: GalleryItemData[];
  seo: SeoData;
};

// Reused by both the normal cached SSR path (lib/api/gallery.ts's
// getGalleryPage) and GalleryPageClient.tsx's live-preview render, where
// `gallery` is whatever raw document `useLivePreview` currently holds.
export function mapGalleryData(gallery: GalleryPage): GalleryPageData {
  return {
    hero: {
      eyebrow: gallery.hero.eyebrow,
      heading: gallery.hero.heading,
      description: gallery.hero.description,
    },
    items: (gallery.items ?? []).map((item) => {
      const { width, height } = mediaDims(item.image);
      return {
        image: mediaUrl(item.image),
        imageWidth: width,
        imageHeight: height,
        alt: item.alt,
        category: item.category,
        shape: computeShape(width, height),
      };
    }),
    seo: {
      metaTitle: gallery.seo?.metaTitle ?? "",
      metaDescription: gallery.seo?.metaDescription ?? "",
      ogImage: mediaUrl(gallery.seo?.ogImage),
      noIndex: gallery.seo?.noIndex ?? false,
    },
  };
}
