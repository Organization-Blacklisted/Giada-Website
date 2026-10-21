import type { Event, Media } from "@/payload-types";
import type { SeoData } from "./seo-types";

function mediaUrl(image: number | Media | null | undefined): string {
  return typeof image === "object" && image !== null ? (image.url ?? "") : "";
}

// "2 December 2026" (day-first) — confirmed from the Figma design text
// exactly, not the month-first "December 2, 2026" US-locale default
// used elsewhere (e.g. blog's formatPubDate) — this page's own design
// uses a different date convention and should match it.
function formatEventDate(date: string): string {
  return new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export type EventData = {
  id: number;
  title: string;
  slug: string;
  eyebrow: string;
  logo: string;
  heading: string;
  description: string;
  eventDateFormatted: string;
  timeLabel: string;
  location: string;
  formHeading: string;
  confirmButtonLabel: string;
  seo: SeoData;
};

export function mapEvent(doc: Event): EventData {
  return {
    id: doc.id,
    title: doc.title,
    slug: doc.slug,
    eyebrow: doc.eyebrow,
    logo: mediaUrl(doc.logo),
    heading: doc.heading,
    description: doc.description,
    eventDateFormatted: formatEventDate(doc.eventDate),
    timeLabel: doc.timeLabel,
    location: doc.location,
    formHeading: doc.formHeading,
    confirmButtonLabel: doc.confirmButtonLabel,
    seo: {
      metaTitle: doc.seo?.metaTitle ?? "",
      metaDescription: doc.seo?.metaDescription ?? "",
      ogImage: mediaUrl(doc.seo?.ogImage),
      noIndex: doc.seo?.noIndex ?? false,
    },
  };
}
