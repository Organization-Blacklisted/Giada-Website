// Pure mapping logic split out of lib/api/our-story.ts so it can be
// imported as a VALUE from OurStoryPageClient.tsx (a Client Component)
// without dragging getPayload/@payload-config/unstable_cache into the
// client bundle — same reasoning, and the same real failure mode, as
// lib/api/gallery-map.ts's split from lib/api/gallery.ts.
import type { SeoData } from "./seo-types";
import type { OurStoryPage, Media } from "@/payload-types";

function mediaUrl(image: number | Media | null | undefined): string {
  return typeof image === "object" && image !== null ? (image.url ?? "") : "";
}

export type OurStoryHeroData = {
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  lead: string;
};

export type OurStoryOriginData = {
  eyebrow: string;
  quote: string;
  attribution: string;
  paragraph1: string;
  paragraph2: string;
  images: { image: string; alt: string }[];
};

export type OurStoryBeliefsData = {
  eyebrow: string;
  heading: string;
  items: { index: string; title: string; text: string }[];
  closingImage: string;
  closingImageAlt: string;
  closingCaption: string;
};

export type OurStoryPresentData = {
  eyebrow: string;
  heading: string;
  description: string;
  stats: { value: string; label: string }[];
  linkLabel: string;
  linkHref: string;
};

export type OurStoryFoundersData = {
  eyebrow: string;
  quote: string;
  attribution: string;
  people: { name: string; role: string; image: string; alt: string; bio: string }[];
};

export type OurStoryClosingCtaData = {
  eyebrow: string;
  heading: string;
  description: string;
  linkText: string;
  href: string;
};

export type OurStoryPageData = {
  hero: OurStoryHeroData;
  origin: OurStoryOriginData;
  beliefs: OurStoryBeliefsData;
  present: OurStoryPresentData;
  founders: OurStoryFoundersData;
  closingCta: OurStoryClosingCtaData;
  seo: SeoData;
};

// Reused by both the normal cached SSR path (lib/api/our-story.ts's
// getOurStoryPage) and OurStoryPageClient.tsx's live-preview render,
// where `story` is whatever raw document `useLivePreview` currently holds.
export function mapOurStoryData(story: OurStoryPage): OurStoryPageData {
  return {
    hero: {
      eyebrow: story.hero.eyebrow,
      titleLine1: story.hero.titleLine1,
      titleLine2: story.hero.titleLine2,
      lead: story.hero.lead,
    },
    origin: {
      eyebrow: story.origin.eyebrow,
      quote: story.origin.quote,
      attribution: story.origin.attribution,
      paragraph1: story.origin.paragraph1,
      paragraph2: story.origin.paragraph2,
      images: (story.origin.images ?? []).map((item) => ({
        image: mediaUrl(item.image),
        alt: item.alt,
      })),
    },
    beliefs: {
      eyebrow: story.beliefs.eyebrow,
      heading: story.beliefs.heading,
      items: (story.beliefs.items ?? []).map((item) => ({
        index: item.index,
        title: item.title,
        text: item.text,
      })),
      closingImage: mediaUrl(story.beliefs.closingImage),
      closingImageAlt: story.beliefs.closingImageAlt,
      closingCaption: story.beliefs.closingCaption,
    },
    present: {
      eyebrow: story.present.eyebrow,
      heading: story.present.heading,
      description: story.present.description,
      stats: (story.present.stats ?? []).map((stat) => ({
        value: stat.value,
        label: stat.label,
      })),
      linkLabel: story.present.linkLabel,
      linkHref: story.present.linkHref,
    },
    founders: {
      eyebrow: story.founders.eyebrow,
      quote: story.founders.quote,
      attribution: story.founders.attribution,
      people: (story.founders.people ?? []).map((person) => ({
        name: person.name,
        role: person.role,
        image: mediaUrl(person.image),
        alt: person.alt,
        bio: person.bio,
      })),
    },
    closingCta: {
      eyebrow: story.closingCta.eyebrow,
      heading: story.closingCta.heading,
      description: story.closingCta.description,
      linkText: story.closingCta.linkText,
      href: story.closingCta.href,
    },
    seo: {
      metaTitle: story.seo?.metaTitle ?? "",
      metaDescription: story.seo?.metaDescription ?? "",
      ogImage: mediaUrl(story.seo?.ogImage),
      noIndex: story.seo?.noIndex ?? false,
    },
  };
}
