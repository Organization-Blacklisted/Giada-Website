import type { GlobalConfig } from "payload";
import { revalidateTag } from "next/cache";

// Same Content(nested)/SEO tabs + Live Preview pattern as Our Story —
// this is the real source's single standalone marketing/landing page
// (components/products/GlassLandingPage.astro), NOT a product catalog.
// Confirmed directly against the real source: Glass has zero individual
// SKU/JSON data anywhere in the Astro project, no detail-page route, and
// isn't wired to ProductsListing.astro at all — it's pure static copy,
// currently framed as pre-launch ("Coming Soon" hero badge, "Launching
// Soon" closing CTA). Ported that framing as-is since it's real,
// confirmed content — flag to the user if Glass has since gone live and
// that copy needs to change.
//
// Numbering (applications "01"-"04", process steps "01"-"04") is NOT a
// stored field — it's derived from each array's own row order at render
// time, same reasoning as Gallery never storing a computed `shape`.
export const Glass: GlobalConfig = {
  slug: "glass-page",
  admin: {
    group: "Pages",
    // Not ready to reveal to the client yet — frontend isn't part of
    // this deploy. Remove this line when /glass is ready to go live.
    hidden: true,
    livePreview: {
      url: ({ req }) => {
        const host = req.headers.get("host") || "localhost:3000";
        const protocol = host.startsWith("localhost") ? "http" : "https";
        return `${protocol}://${host}/glass`;
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
              type: "tabs",
              tabs: [
                {
                  label: "Hero",
                  fields: [
                    {
                      name: "hero",
                      type: "group",
                      fields: [
                        { name: "eyebrow", type: "text", required: true },
                        { name: "heading", type: "text", required: true },
                        { name: "lead", type: "textarea", required: true },
                        { name: "ctaLabel", type: "text", required: true },
                        { name: "badgeLabel", type: "text", required: true },
                        {
                          name: "images",
                          type: "array",
                          minRows: 3,
                          maxRows: 3,
                          admin: { description: "The 3-image triptych below the hero text — always exactly 3." },
                          fields: [
                            { name: "image", type: "upload", relationTo: "media", required: true },
                            { name: "alt", type: "text", required: true },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  label: "Material",
                  fields: [
                    {
                      name: "material",
                      type: "group",
                      fields: [
                        { name: "eyebrow", type: "text", required: true },
                        { name: "heading", type: "text", required: true },
                        { name: "pullQuote", type: "textarea", required: true },
                        { name: "paragraph1", type: "textarea", required: true },
                        { name: "paragraph2", type: "textarea", required: true },
                      ],
                    },
                  ],
                },
                {
                  label: "Feature",
                  fields: [
                    {
                      name: "feature",
                      type: "group",
                      fields: [
                        { name: "eyebrow", type: "text", required: true },
                        { name: "heading", type: "text", required: true },
                        { name: "description", type: "textarea", required: true },
                        { name: "image", type: "upload", relationTo: "media", required: true },
                        { name: "imageAlt", type: "text", required: true },
                      ],
                    },
                  ],
                },
                {
                  label: "Applications",
                  fields: [
                    {
                      name: "applications",
                      type: "group",
                      fields: [
                        { name: "eyebrow", type: "text", required: true },
                        { name: "heading", type: "text", required: true },
                        { name: "description", type: "textarea", required: true },
                        {
                          name: "items",
                          type: "array",
                          minRows: 1,
                          fields: [
                            { name: "label", type: "text", required: true },
                            { name: "body", type: "textarea", required: true },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  label: "Gallery",
                  fields: [
                    {
                      name: "gallery",
                      type: "group",
                      fields: [
                        { name: "eyebrow", type: "text", required: true },
                        { name: "heading", type: "text", required: true },
                        { name: "description", type: "textarea", required: true },
                        {
                          name: "items",
                          type: "array",
                          minRows: 1,
                          fields: [
                            { name: "image", type: "upload", relationTo: "media", required: true },
                            { name: "alt", type: "text", required: true },
                            { name: "eyebrow", type: "text", required: true },
                            { name: "title", type: "text", required: true },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  label: "Process",
                  fields: [
                    {
                      name: "process",
                      type: "group",
                      fields: [
                        { name: "eyebrow", type: "text", required: true },
                        { name: "heading", type: "text", required: true },
                        {
                          name: "steps",
                          type: "array",
                          minRows: 1,
                          fields: [
                            { name: "title", type: "text", required: true },
                            { name: "body", type: "textarea", required: true },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  label: "Technical Specs",
                  fields: [
                    {
                      name: "technicalSpecs",
                      type: "group",
                      fields: [
                        { name: "eyebrow", type: "text", required: true },
                        { name: "heading", type: "text", required: true },
                        { name: "description", type: "textarea", required: true },
                        {
                          name: "specs",
                          type: "array",
                          minRows: 1,
                          fields: [
                            { name: "label", type: "text", required: true },
                            { name: "value", type: "text", required: true },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  label: "Closing CTA",
                  fields: [
                    {
                      name: "closingCta",
                      type: "group",
                      fields: [
                        { name: "eyebrow", type: "text", required: true },
                        { name: "heading", type: "text", required: true },
                        { name: "description", type: "textarea", required: true },
                        { name: "linkText", type: "text", required: true },
                        { name: "image", type: "upload", relationTo: "media", required: true },
                        { name: "imageAlt", type: "text", required: true },
                      ],
                    },
                  ],
                },
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
                  admin: { description: 'Leave blank to use the default ("Textile in Glass").' },
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
          revalidateTag("glass", { expire: 0 });
        } catch {
          // No request-scoped cache to bust outside a real Next.js
          // request (e.g. a script using the Local API) — nothing to do.
        }
      },
    ],
  },
};
