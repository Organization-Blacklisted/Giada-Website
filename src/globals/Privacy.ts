import type { GlobalConfig } from "payload";
import { revalidateTag } from "next/cache";
import { legalDocumentFields } from "./legalDocumentFields";

// Same Content(nested)/SEO tabs + Live Preview + Drafts pattern as every
// other page global now — see legalDocumentFields.ts for the shared
// field shape used by this, Terms.ts, and Shipping.ts. Drafts made sense
// here from the start (unlike Gallery/Contact/Products, which got it
// added later only for Home/Faq) — legal copy is exactly the kind of
// content that benefits from a review step before going live, more so
// than most marketing copy.
export const Privacy: GlobalConfig = {
  slug: "privacy-page",
  admin: {
    group: "Pages",
    // Not ready to reveal to the client yet — frontend isn't part of
    // this deploy. Remove this line when /privacy is ready to go live.
    hidden: true,
    livePreview: {
      url: ({ req }) => {
        const host = req.headers.get("host") || "localhost:3000";
        const protocol = host.startsWith("localhost") ? "http" : "https";
        return `${protocol}://${host}/privacy`;
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
                  admin: { description: 'Leave blank to use the default ("Privacy Policy").' },
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
          revalidateTag("privacy", { expire: 0 });
        } catch {
          // No request-scoped cache to bust outside a real Next.js
          // request (e.g. a script using the Local API) — nothing to do.
        }
      },
    ],
  },
};
