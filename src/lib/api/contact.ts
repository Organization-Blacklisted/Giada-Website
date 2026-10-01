import { siteConfig } from "@/data/site";

// Owned by this data layer, not imported from the section components —
// lib/api/* must not depend on components/*. Each shape here is the
// contract a real Laravel response would be mapped into; the section
// components declare their own separate prop types that happen to match.
// TypeScript still catches any drift between the two at the `{...x}`
// spread call sites in page.tsx, so nothing is lost by not sharing the
// type directly — the dependency just points the correct way (data layer
// independent, UI layer depends on it, never the reverse).
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
};

// Mirrors the Torque Pharma `lib/api/<page>.ts` pattern: page.tsx and the
// section components only ever see this typed, already-shaped data — same
// contract a real Laravel-backed fetch would return. Right now this just
// returns static content (real copy, confirmed from the Astro source), but
// it's already `async` and already the single place that assembles the
// page's props. Swapping the body for `apiFetch<...>("/pages/contact")`
// later shouldn't require touching page.tsx or any section component.
export async function getContactPage(): Promise<ContactPageData> {
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
      eyebrow: "Contact",
      heading: "Every Great Space Begins with a Conversation.",
      description:
        "Whether you are an interior designer beginning a new commission, an architect exploring a long-term partnership, or a private client with a specific vision — we would love to hear from you. Every enquiry is handled personally by one of our founders.",
    },
    visit: {
      eyebrow: "Visit & Enquiries",
      heading: "Meet us in person, or begin the conversation from anywhere.",
      description:
        "Our showrooms welcome designers, architects, and private clients by appointment. For general enquiries, project discussions, or trade requests, our team can guide you through the first steps personally.",
      generalContact: {
        email: { label: "General Email", value: "office@giada-studio.com", href: "mailto:office@giada-studio.com" },
        studioHours: { label: "Studio Hours", days: "Monday – Friday", hours: "10:00 am – 6:00 pm EST" },
        responseTime: { label: "Response Time", value: "Within one business day." },
      },
      locations,
    },
  };
}
