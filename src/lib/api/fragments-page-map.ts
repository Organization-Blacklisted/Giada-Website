// Pure mapping logic for the Fragments (Ryan Saghian) bespoke page's own
// Global — split out from lib/api/fragments-page.ts the same way every
// other page's `-map.ts` is, so a future Client Component (e.g. a Live
// Preview client) can import this without dragging getPayload into the
// client bundle. See lib/api/our-story-map.ts for the identical pattern.
import type { FragmentsPage, Media } from "@/payload-types";
import type { SeoData } from "./seo-types";

function mediaUrl(image: number | Media | null | undefined): string {
  return typeof image === "object" && image !== null ? (image.url ?? "") : "";
}

export type FragmentsPageData = {
  hero: {
    eyebrow: string;
    headline: string;
    paragraph: string;
    backdropImage: string;
    cutoutImage: string;
    unveilingLines: string[];
  };
  artist: {
    eyebrow: string;
    name: string;
    subheadline: string;
    bioParagraphGroup1: string;
    bioParagraphGroup2: string;
    portrait: string;
  };
  inspiration: {
    eyebrow: string;
    heading: string;
    paragraph: string;
    cards: { title: string; caption: string; image: string }[];
    quote: string;
    quoteAttribution: string;
  };
  memories: {
    eyebrow: string;
    heading: string;
    paragraph: string;
    strips: { image: string; alt: string }[];
  };
  meeting: {
    eyebrow: string;
    heading: string;
    subheadline: string;
    paragraph: string;
    imageLeft: string;
    imageRight: string;
  };
  closingCta: {
    heading: string;
    paragraph: string;
    linkText: string;
  };
  seo: SeoData;
};

export function mapFragmentsPage(doc: FragmentsPage): FragmentsPageData {
  return {
    hero: {
      eyebrow: doc.hero.eyebrow,
      headline: doc.hero.headline,
      paragraph: doc.hero.paragraph,
      backdropImage: mediaUrl(doc.hero.backdropImage),
      cutoutImage: mediaUrl(doc.hero.cutoutImage),
      unveilingLines: (doc.hero.unveilingLines ?? []).map((item) => item.line),
    },
    artist: {
      eyebrow: doc.artist.eyebrow,
      name: doc.artist.name,
      subheadline: doc.artist.subheadline,
      bioParagraphGroup1: doc.artist.bioParagraphGroup1,
      bioParagraphGroup2: doc.artist.bioParagraphGroup2,
      portrait: mediaUrl(doc.artist.portrait),
    },
    inspiration: {
      eyebrow: doc.inspiration.eyebrow,
      heading: doc.inspiration.heading,
      paragraph: doc.inspiration.paragraph,
      cards: (doc.inspiration.cards ?? []).map((card) => ({
        title: card.title,
        caption: card.caption,
        image: mediaUrl(card.image),
      })),
      quote: doc.inspiration.quote,
      quoteAttribution: doc.inspiration.quoteAttribution,
    },
    memories: {
      eyebrow: doc.memories.eyebrow,
      heading: doc.memories.heading,
      paragraph: doc.memories.paragraph,
      strips: (doc.memories.strips ?? []).map((strip) => ({
        image: mediaUrl(strip.image),
        alt: strip.alt,
      })),
    },
    meeting: {
      eyebrow: doc.meeting.eyebrow,
      heading: doc.meeting.heading,
      subheadline: doc.meeting.subheadline,
      paragraph: doc.meeting.paragraph,
      imageLeft: mediaUrl(doc.meeting.imageLeft),
      imageRight: mediaUrl(doc.meeting.imageRight),
    },
    closingCta: {
      heading: doc.closingCta.heading,
      paragraph: doc.closingCta.paragraph,
      linkText: doc.closingCta.linkText,
    },
    seo: {
      metaTitle: doc.seo?.metaTitle ?? "",
      metaDescription: doc.seo?.metaDescription ?? "",
      ogImage: mediaUrl(doc.seo?.ogImage),
      noIndex: doc.seo?.noIndex ?? false,
    },
  };
}
