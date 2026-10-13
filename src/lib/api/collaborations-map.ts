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

export type CollaborationItemData = {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  active: boolean;
  heroImage: string;
  productCount: number;
  designerName: string;
};

export function mapCollaborationItem(doc: Collaboration): CollaborationItemData {
  return {
    id: String(doc.id),
    name: doc.name,
    slug: doc.slug,
    tagline: doc.tagline,
    active: doc.active !== false,
    heroImage: mediaUrl(doc.heroImage),
    productCount: doc.productCount ?? 0,
    designerName: doc.designerName,
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
