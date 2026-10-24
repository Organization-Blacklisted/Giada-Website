import { unstable_cache } from "next/cache";
import { getPayload } from "payload";
import config from "@payload-config";
import type { Event } from "@/payload-types";
import { mapEvent, type EventData } from "./events-map";

export type EventPopupData = {
  eyebrow: string;
  heading: string;
  description: string;
  ctaLabel: string;
  delaySeconds: number;
  cooldownDays: number;
  // Keyed to the linked event, not a static string — switching which
  // event this popup promotes naturally re-shows it to visitors who
  // already dismissed the previous one, with no separate "reset" field.
  dismissKey: string;
  event: EventData;
};

// Tagged with both "event-popup" (this Global's own afterChange) and
// "events" (Events.ts's afterChange) — editing the linked event's date,
// logo, or location should refresh this popup too, not just editing the
// popup's own fields.
export const getEventPopup = unstable_cache(
  async (): Promise<EventPopupData | null> => {
    const payload = await getPayload({ config });
    // depth: 2, not 1 — depth: 1 only populates `event` itself as a full
    // Event document; the event's own `logo` relation (a further level
    // of nesting) would still come back as a bare media id, which
    // mapEvent's mediaUrl() silently turns into "" (confirmed as the
    // cause of the popup rendering with no image).
    const doc = await payload.findGlobal({ slug: "event-popup", depth: 2 });

    if (!doc.enabled || !doc.event || typeof doc.event !== "object") {
      return null;
    }

    const event = mapEvent(doc.event as Event);

    return {
      eyebrow: doc.eyebrow || event.eyebrow,
      heading: doc.heading || "You're Invited",
      description: doc.description || "",
      ctaLabel: doc.ctaLabel || "Reserve Your Place",
      delaySeconds: doc.delaySeconds ?? 5,
      cooldownDays: doc.cooldownDays ?? 7,
      dismissKey: `giada-event-popup-${event.id}`,
      event,
    };
  },
  ["event-popup"],
  { tags: ["event-popup", "events"] }
);
