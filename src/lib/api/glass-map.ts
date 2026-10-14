// Pure mapping logic split out of lib/api/glass.ts so it can be imported
// as a VALUE from GlassPageClient.tsx (a Client Component) without
// dragging getPayload/@payload-config/unstable_cache into the client
// bundle — same reasoning as lib/api/gallery-map.ts's split from
// lib/api/gallery.ts.
import type { SeoData } from "./seo-types";
import type { GlassPage, Media } from "@/payload-types";

function mediaUrl(image: number | Media | null | undefined): string {
  return typeof image === "object" && image !== null ? (image.url ?? "") : "";
}

// The real source renders every image on this page at its native aspect
// ratio (Astro `<Image class="h-auto w-full">`, no fixed-ratio crop
// anywhere) rather than this project's more typical fixed-aspect-box +
// `fill` card pattern — so, same reasoning as gallery-map.ts's
// `mediaDims`, real width/height are carried through here for next/image
// to size against instead of defaulting to a crop.
function mediaDims(image: number | Media | null | undefined): { width: number; height: number } {
  return typeof image === "object" && image !== null
    ? { width: image.width ?? 0, height: image.height ?? 0 }
    : { width: 0, height: 0 };
}

export type GlassPageData = {
  hero: {
    eyebrow: string;
    heading: string;
    lead: string;
    ctaLabel: string;
    badgeLabel: string;
    images: { image: string; imageWidth: number; imageHeight: number; alt: string }[];
  };
  material: {
    eyebrow: string;
    heading: string;
    pullQuote: string;
    paragraph1: string;
    paragraph2: string;
  };
  feature: {
    eyebrow: string;
    heading: string;
    description: string;
    image: string;
    imageWidth: number;
    imageHeight: number;
    imageAlt: string;
  };
  applications: {
    eyebrow: string;
    heading: string;
    description: string;
    items: { label: string; body: string }[];
  };
  gallery: {
    eyebrow: string;
    heading: string;
    description: string;
    items: { image: string; imageWidth: number; imageHeight: number; alt: string; eyebrow: string; title: string }[];
  };
  process: {
    eyebrow: string;
    heading: string;
    steps: { title: string; body: string }[];
  };
  technicalSpecs: {
    eyebrow: string;
    heading: string;
    description: string;
    specs: { label: string; value: string }[];
  };
  closingCta: {
    eyebrow: string;
    heading: string;
    description: string;
    linkText: string;
    image: string;
    imageWidth: number;
    imageHeight: number;
    imageAlt: string;
  };
  seo: SeoData;
};

// Reused by both the normal cached SSR path (lib/api/glass.ts's
// getGlassPage) and GlassPageClient.tsx's live-preview render, where
// `page` is whatever raw document `useLivePreview` currently holds.
export function mapGlassData(page: GlassPage): GlassPageData {
  const featureDims = mediaDims(page.feature.image);
  const closingCtaDims = mediaDims(page.closingCta.image);

  return {
    hero: {
      eyebrow: page.hero.eyebrow,
      heading: page.hero.heading,
      lead: page.hero.lead,
      ctaLabel: page.hero.ctaLabel,
      badgeLabel: page.hero.badgeLabel,
      images: (page.hero.images ?? []).map((item) => {
        const dims = mediaDims(item.image);
        return { image: mediaUrl(item.image), imageWidth: dims.width, imageHeight: dims.height, alt: item.alt };
      }),
    },
    material: {
      eyebrow: page.material.eyebrow,
      heading: page.material.heading,
      pullQuote: page.material.pullQuote,
      paragraph1: page.material.paragraph1,
      paragraph2: page.material.paragraph2,
    },
    feature: {
      eyebrow: page.feature.eyebrow,
      heading: page.feature.heading,
      description: page.feature.description,
      image: mediaUrl(page.feature.image),
      imageWidth: featureDims.width,
      imageHeight: featureDims.height,
      imageAlt: page.feature.imageAlt,
    },
    applications: {
      eyebrow: page.applications.eyebrow,
      heading: page.applications.heading,
      description: page.applications.description,
      items: (page.applications.items ?? []).map((item) => ({ label: item.label, body: item.body })),
    },
    gallery: {
      eyebrow: page.gallery.eyebrow,
      heading: page.gallery.heading,
      description: page.gallery.description,
      items: (page.gallery.items ?? []).map((item) => {
        const dims = mediaDims(item.image);
        return {
          image: mediaUrl(item.image),
          imageWidth: dims.width,
          imageHeight: dims.height,
          alt: item.alt,
          eyebrow: item.eyebrow,
          title: item.title,
        };
      }),
    },
    process: {
      eyebrow: page.process.eyebrow,
      heading: page.process.heading,
      steps: (page.process.steps ?? []).map((step) => ({ title: step.title, body: step.body })),
    },
    technicalSpecs: {
      eyebrow: page.technicalSpecs.eyebrow,
      heading: page.technicalSpecs.heading,
      description: page.technicalSpecs.description,
      specs: (page.technicalSpecs.specs ?? []).map((spec) => ({ label: spec.label, value: spec.value })),
    },
    closingCta: {
      eyebrow: page.closingCta.eyebrow,
      heading: page.closingCta.heading,
      description: page.closingCta.description,
      linkText: page.closingCta.linkText,
      image: mediaUrl(page.closingCta.image),
      imageWidth: closingCtaDims.width,
      imageHeight: closingCtaDims.height,
      imageAlt: page.closingCta.imageAlt,
    },
    seo: {
      metaTitle: page.seo?.metaTitle ?? "",
      metaDescription: page.seo?.metaDescription ?? "",
      ogImage: mediaUrl(page.seo?.ogImage),
      noIndex: page.seo?.noIndex ?? false,
    },
  };
}
