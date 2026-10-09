// Pure mapping logic split out of lib/api/collaborations.ts so it can be
// imported as a VALUE from CollaborationsPageClient.tsx (a Client
// Component) without dragging getPayload/@payload-config/unstable_cache
// into the client bundle — same reasoning as lib/api/gallery-map.ts's
// split from lib/api/gallery.ts.
//
// Two separate sources feed this page now: the `collaborations-page`
// GLOBAL (hero/closingCta/seo — this page's own copy) and the
// `collaborations` COLLECTION (each real collaboration as its own
// document — promoted from an array field so each one gets its own
// dashboard card, edit screen, and Live Preview pointed at its own
// /collaborations/[slug] detail page). `mapCollaborationItem` and
// `mapCollaborationsPageContent` are kept separate for exactly that
// reason — CollaborationsPageClient.tsx live-previews only the page
// content, not the items list (each item live-previews itself,
// separately, from its own edit screen).
import type { SeoData } from "./seo-types";
import type { Collaboration, CollaborationsPage, Media } from "@/payload-types";

function mediaUrl(image: number | Media | null | undefined): string {
  return typeof image === "object" && image !== null ? (image.url ?? "") : "";
}

export type CollaborationCustomHeroData = {
  eyebrow: string;
  headline: string;
  paragraph: string;
  backdropImage: string;
  cutoutImage: string;
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
} | null;

export type CollaborationItemData = {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  active: boolean;
  heroImage: string;
  productCount: number;
  description: string;
  designer: {
    name: string;
    bio: string;
    portrait: string;
  };
  // Non-null only for a collaboration with a fully bespoke, one-off hero
  // (built from a real Figma design) instead of the shared
  // CollaborationHeroSection template every other collaboration uses.
  customHero: CollaborationCustomHeroData;
};

export function mapCollaborationItem(doc: Collaboration): CollaborationItemData {
  const customHero =
    doc.customHero?.headline && doc.customHero?.eyebrow && doc.customHero?.paragraph
      ? {
          eyebrow: doc.customHero.eyebrow,
          headline: doc.customHero.headline,
          paragraph: doc.customHero.paragraph,
          backdropImage: mediaUrl(doc.customHero.backdropImage),
          cutoutImage: mediaUrl(doc.customHero.cutoutImage),
          artist: {
            eyebrow: doc.customHero.artist?.eyebrow ?? "",
            name: doc.customHero.artist?.name ?? "",
            subheadline: doc.customHero.artist?.subheadline ?? "",
            bioParagraphGroup1: doc.customHero.artist?.bioParagraphGroup1 ?? "",
            bioParagraphGroup2: doc.customHero.artist?.bioParagraphGroup2 ?? "",
            portrait: mediaUrl(doc.customHero.artist?.portrait),
          },
          inspiration: {
            eyebrow: doc.customHero.inspiration?.eyebrow ?? "",
            heading: doc.customHero.inspiration?.heading ?? "",
            paragraph: doc.customHero.inspiration?.paragraph ?? "",
            cards: (doc.customHero.inspiration?.cards ?? []).map((card) => ({
              title: card.title ?? "",
              caption: card.caption ?? "",
              image: mediaUrl(card.image),
            })),
            quote: doc.customHero.inspiration?.quote ?? "",
            quoteAttribution: doc.customHero.inspiration?.quoteAttribution ?? "",
          },
          memories: {
            eyebrow: doc.customHero.memories?.eyebrow ?? "",
            heading: doc.customHero.memories?.heading ?? "",
            paragraph: doc.customHero.memories?.paragraph ?? "",
            strips: (doc.customHero.memories?.strips ?? []).map((strip) => ({
              image: mediaUrl(strip.image),
              alt: strip.alt ?? "",
            })),
          },
          meeting: {
            eyebrow: doc.customHero.meeting?.eyebrow ?? "",
            heading: doc.customHero.meeting?.heading ?? "",
            subheadline: doc.customHero.meeting?.subheadline ?? "",
            paragraph: doc.customHero.meeting?.paragraph ?? "",
            imageLeft: mediaUrl(doc.customHero.meeting?.imageLeft),
            imageRight: mediaUrl(doc.customHero.meeting?.imageRight),
          },
          closingCta: {
            heading: doc.customHero.closingCta?.heading ?? "",
            paragraph: doc.customHero.closingCta?.paragraph ?? "",
            linkText: doc.customHero.closingCta?.linkText ?? "",
          },
        }
      : null;

  return {
    id: String(doc.id),
    name: doc.name,
    slug: doc.slug,
    tagline: doc.tagline,
    active: doc.active !== false,
    heroImage: mediaUrl(doc.heroImage),
    productCount: doc.productCount ?? 0,
    description: doc.description,
    designer: {
      name: doc.designer.name,
      bio: doc.designer.bio,
      portrait: mediaUrl(doc.designer.portrait),
    },
    customHero,
  };
}

export type CollaborationsPageContentData = {
  hero: { eyebrow: string; heading: string; subheadline: string };
  closingCta: { eyebrow: string; heading: string; description: string };
  seo: SeoData;
};

// Reused by both the normal cached SSR path (lib/api/collaborations.ts's
// getCollaborationsPage) and CollaborationsPageClient.tsx's live-preview
// render, where `page` is whatever raw document `useLivePreview` holds.
export function mapCollaborationsPageContent(page: CollaborationsPage): CollaborationsPageContentData {
  return {
    hero: {
      eyebrow: page.hero.eyebrow,
      heading: page.hero.heading,
      subheadline: page.hero.subheadline,
    },
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

export type CollaborationsPageData = CollaborationsPageContentData & {
  items: CollaborationItemData[];
};
