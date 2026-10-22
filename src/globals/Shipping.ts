import type { GlobalConfig } from "payload";
import { revalidateTag } from "next/cache";
import { legalDocumentFields } from "./legalDocumentFields";

// Same pattern as Privacy.ts — see its comment. Real source's
// `questionLabel` default differs here ("Questions about your
// shipment?" vs. the generic "Questions?") — that's just a seeded field
// value (legalDocumentFields.ts's `questionLabel` schema default stays
// the generic one), not a schema difference.
export const Shipping: GlobalConfig = {
  slug: "shipping-page",
  admin: {
    group: "Pages",
    livePreview: {
      url: ({ req }) => {
        const host = req.headers.get("host") || "localhost:3000";
        const protocol = host.startsWith("localhost") ? "http" : "https";
        return `${protocol}://${host}/shipping`;
      },
      breakpoints: [
        { label: "Mobile", name: "mobile", width: 375, height: 667 },
        { label: "Tablet", name: "tablet", width: 768, height: 1024 },
        { label: "Desktop", name: "desktop", width: 1440, height: 900 },
      ],
    },
  },
  versions: {
    drafts: true,
    max: 50,
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Content",
          fields: legalDocumentFields(),
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
                  admin: { description: 'Leave blank to use the default ("Shipping Policy").' },
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
      async ({ doc }) => {
        if (doc?._status && doc._status !== "published") {
          return;
        }
        try {
          revalidateTag("shipping", { expire: 0 });
        } catch {
          // No request-scoped cache to bust outside a real Next.js
          // request (e.g. a script using the Local API) — nothing to do.
        }
      },
    ],
  },
};
