import type { GlobalConfig } from "payload";
import { revalidateTag } from "next/cache";

// The /collaborations LISTING page's own copy only — hero + closing CTA.
// Each real collaboration (Of Earth and Light, Fragments) used to live
// as an array row on this same global, which made editing one feel
// buried inside one big page document with no dedicated edit screen or
// Live Preview of its own. Promoted to a real `collaborations`
// COLLECTION instead (collections/Collaborations.ts) — same split as
// Products (products-page global for hub copy, products collection for
// the actual catalog).
export const Collaborations: GlobalConfig = {
  slug: "collaborations-page",
  admin: {
    group: "Pages",
    livePreview: {
      url: ({ req }) => {
        const host = req.headers.get("host") || "localhost:3000";
        const protocol = host.startsWith("localhost") ? "http" : "https";
        return `${protocol}://${host}/collaborations`;
      },
      breakpoints: [
        { label: "Mobile", name: "mobile", width: 375, height: 667 },
        { label: "Tablet", name: "tablet", width: 768, height: 1024 },
        { label: "Desktop", name: "desktop", width: 1440, height: 900 },
      ],
    },
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Content",
          fields: [
            {
              name: "hero",
              type: "group",
              fields: [
                { name: "eyebrow", type: "text", required: true },
                { name: "heading", type: "text", required: true },
                { name: "subheadline", type: "textarea", required: true },
              ],
            },
            {
              name: "closingCta",
              type: "group",
              fields: [
                { name: "eyebrow", type: "text", required: true },
                { name: "heading", type: "text", required: true },
                { name: "description", type: "textarea", required: true },
              ],
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
                {
                  name: "metaTitle",
                  type: "text",
                  admin: { description: 'Leave blank to use the default ("Collaborations").' },
                },
                {
                  name: "metaDescription",
                  type: "textarea",
                  admin: { description: "Leave blank to use the default description." },
                },
                { name: "ogImage", type: "upload", relationTo: "media" },
                {
                  name: "noIndex",
                  type: "checkbox",
                  defaultValue: false,
                  label: "Hide from search engines (noindex)",
                  admin: {
                    description:
                      "Tells Google and other search engines not to list this page. Leave unchecked for normal pages.",
                  },
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
          revalidateTag("collaborations", { expire: 0 });
        } catch {
          // No request-scoped cache to bust outside a real Next.js
          // request (e.g. a script using the Local API) — nothing to do.
        }
      },
    ],
  },
};
