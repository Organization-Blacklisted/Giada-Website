import type { CollectionConfig } from "payload";
import { revalidateTag } from "next/cache";

// A real Payload COLLECTION, not a Global — same reasoning as Products/
// Collaborations/BlogPosts: the client runs these periodically (private
// previews, trade-fair presences, etc.), so each one needs its own
// editable document at its own `/events/[slug]` URL, not a single fixed
// page. First instance seeded: "Art Basel Miami" (Giada x Casa Giovanni
// private preview), from the Figma node 721:2 design.
//
// `logo` is a single generic upload, not a two-slot "wordmark + badge"
// pair matching this specific event's Figma layer structure — the
// Giada-x-Casa-Giovanni lockup for this one event happens to be two
// composited layers in Figma (a text SVG + a photographic badge), but
// future events won't necessarily share that structure (a different
// partner, a solo Giada event, etc.), so modeling the schema around one
// specific event's asset composition would be the wrong abstraction.
// Editors upload one pre-composed lockup image per event instead.
export const Events: CollectionConfig = {
  slug: "events",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "eventDate", "location"],
    group: "Catalog",
    livePreview: {
      url: ({ data, req }) => {
        const host = req.headers.get("host") || "localhost:3000";
        const protocol = host.startsWith("localhost") ? "http" : "https";
        return `${protocol}://${host}/events/${data.slug}`;
      },
      breakpoints: [
        { label: "Mobile", name: "mobile", width: 375, height: 667 },
        { label: "Tablet", name: "tablet", width: 768, height: 1024 },
        { label: "Desktop", name: "desktop", width: 1440, height: 900 },
      ],
    },
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Content",
          fields: [
            { name: "title", type: "text", required: true, admin: { description: 'E.g. "Art Basel Miami".' } },
            {
              name: "slug",
              type: "text",
              required: true,
              unique: true,
              admin: { description: "Used for this event's /events/[slug] URL." },
            },
            {
              name: "eyebrow",
              type: "text",
              required: true,
              admin: { description: 'Small label above the logo, e.g. "Art Basel Miami . Private Preview".' },
            },
            { name: "logo", type: "upload", relationTo: "media", required: true, admin: { description: "The event's lockup/brand image." } },
            {
              name: "heading",
              type: "text",
              required: true,
              defaultValue: "Reserve Your Place",
              admin: { description: "Main heading above the intro copy." },
            },
            {
              name: "description",
              type: "textarea",
              required: true,
              admin: { description: "Intro copy below the heading. Line breaks are preserved." },
            },
            { name: "eventDate", type: "date", required: true, admin: { date: { pickerAppearance: "dayOnly" } } },
            {
              name: "timeLabel",
              type: "text",
              required: true,
              admin: { description: 'Free-text time range, e.g. "05:00 - 08:00 PM".' },
            },
            { name: "location", type: "text", required: true, admin: { description: 'E.g. "Miami Art Week".' } },
            {
              name: "formHeading",
              type: "text",
              required: true,
              defaultValue: "Kindly Confirm Your Details Below",
            },
            {
              name: "confirmButtonLabel",
              type: "text",
              required: true,
              defaultValue: "Confirm Your Presence",
            },
          ],
        },
        {
          label: "SEO",
          fields: [
            {
              name: "seo",
              type: "group",
              fields: [
                { name: "metaTitle", type: "text", admin: { description: "Leave blank to use this event's own title." } },
                { name: "metaDescription", type: "textarea", admin: { description: "Leave blank to use this event's description." } },
                { name: "ogImage", type: "upload", relationTo: "media", admin: { description: "Leave blank to use this event's logo." } },
                {
                  name: "noIndex",
                  type: "checkbox",
                  defaultValue: false,
                  label: "Hide from search engines (noindex)",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [
      async () => {
        try {
          revalidateTag("events", { expire: 0 });
        } catch {
          // No request-scoped cache to bust outside a real Next.js
          // request (e.g. a script using the Local API) — nothing to do.
        }
      },
    ],
  },
};
