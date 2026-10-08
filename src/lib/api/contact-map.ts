// Pure mapping logic split out of lib/api/contact.ts so it can be
// imported as a VALUE from ContactPageClient.tsx (a Client Component)
// without dragging getPayload/@payload-config/unstable_cache into the
// client bundle — same reasoning, and the same real failure mode, as
// lib/api/home-map.ts's split from lib/api/home.ts. `siteConfig` is a
// plain data module (no server-only imports), so it's safe to pull in
// here too.
import { siteConfig } from "@/data/site";
import type { SeoData } from "./seo-types";
import type { ContactPage, Media } from "@/payload-types";

export type ContactHeroData = {
  eyebrow: string;
  heading: string;
  description: string;
};

export type ShowroomLocationData = {
  city: string;
  type: string;
  lines: string[];
  phone: string;
  phoneHref: string;
  mapUrl: string;
  geo: { lat: number; lng: number };
};

export type GeneralContactData = {
  email: { label: string; value: string; href: string };
  studioHours: { label: string; days: string; hours: string };
  responseTime: { label: string; value: string };
};

export type ShowroomSectionData = {
  eyebrow: string;
  heading: string;
  description: string;
  generalContact: GeneralContactData;
  locations: ShowroomLocationData[];
};

export type ContactPageData = {
  hero: ContactHeroData;
  visit: ShowroomSectionData;
  seo: SeoData;
};

function mediaUrl(image: number | Media | null | undefined): string {
  return typeof image === "object" && image !== null ? (image.url ?? "") : "";
}

// Reused by both the normal cached SSR path (lib/api/contact.ts's
// getContactPage) and ContactPageClient.tsx's live-preview render.
// `locations` stays sourced from siteConfig, not the raw CMS doc — see
// Contact.ts's own comment for why (shared with Footer and this page's
// own LocalBusiness JSON-LD schema, which needs fields this page's
// content shape doesn't have).
export function mapContactData(contact: ContactPage): ContactPageData {
  const locations: ShowroomLocationData[] = siteConfig.locations.map((location) => ({
    city: location.city,
    type: location.type,
    lines: [...location.lines],
    phone: location.phone,
    phoneHref: location.phoneHref,
    mapUrl: location.mapUrl,
    geo: location.geo,
  }));

  return {
    hero: {
      eyebrow: contact.hero.eyebrow,
      heading: contact.hero.heading,
      description: contact.hero.description,
    },
    visit: {
      eyebrow: contact.visit.eyebrow,
      heading: contact.visit.heading,
      description: contact.visit.description,
      generalContact: {
        email: contact.visit.generalContact.email,
        studioHours: contact.visit.generalContact.studioHours,
        responseTime: contact.visit.generalContact.responseTime,
      },
      locations,
    },
    seo: {
      metaTitle: contact.seo?.metaTitle ?? "",
      metaDescription: contact.seo?.metaDescription ?? "",
      ogImage: mediaUrl(contact.seo?.ogImage),
      noIndex: contact.seo?.noIndex ?? false,
    },
  };
}
