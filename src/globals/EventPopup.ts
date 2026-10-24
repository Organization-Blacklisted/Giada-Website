import type { GlobalConfig } from "payload";
import { revalidateTag } from "next/cache";

// A site-wide popup slot (singleton — hence a Global, same reasoning as
// Home/Faq), not a field on `Events` itself: only one event can be
// promoted site-wide at a time regardless of how many Events documents
// exist, and editors need an explicit on/off switch independent of
// whether an event document exists. Reuses the linked event's own
// `logo`/`eventDate`/`timeLabel`/`location` (see Events.ts) rather than
// duplicating uploads here — this popup's job is just the invite-specific
// copy layered on top, from Figma node 935:485 ("You're Invited" teaser
// for Art Basel Miami), not a second copy of the event's own data.
export const EventPopup: GlobalConfig = {
  slug: "event-popup",
  admin: {
    group: "Pages",
    description: "The site-wide invite popup shown ~5s after a visitor lands on the site.",
  },
  fields: [
    {
      name: "enabled",
      type: "checkbox",
      defaultValue: false,
      admin: { description: "Turn the popup on or off site-wide without deleting its content." },
    },
    {
      name: "event",
      type: "relationship",
      relationTo: "events",
      admin: { description: "Which event this popup promotes — its logo, date, time, and location are reused directly." },
    },
    {
      name: "heading",
      type: "text",
      defaultValue: "You're Invited",
    },
    {
      name: "description",
      type: "textarea",
      admin: { description: "Invite copy shown in the popup. Line breaks are preserved." },
    },
    {
      name: "ctaLabel",
      type: "text",
      defaultValue: "Reserve Your Place",
      admin: { description: "Button label. Links to the event's own /events/[slug] page." },
    },
    {
      name: "delaySeconds",
      type: "number",
      defaultValue: 5,
      min: 0,
      admin: { description: "How many seconds after page load the popup appears." },
    },
  ],
  hooks: {
    afterChange: [
      async () => {
        try {
          revalidateTag("event-popup", { expire: 0 });
        } catch {
          // No request-scoped cache to bust outside a real Next.js
          // request (e.g. a script using the Local API) — nothing to do.
        }
      },
    ],
  },
};
