import type { GlobalConfig } from "payload";
import { revalidateTag } from "next/cache";

// Same pattern as Home/Faq (src/globals/Home.ts, Faq.ts): a singleton
// global, Content/SEO tabs purely for /admin UI grouping — no data-path
// change, `hero`/`items` stay top-level fields on the document. No
// drafts yet — that was added to Home/Faq as a separate, later request,
// not part of the initial CMS wiring.
//
// `shape` ("portrait"/"landscape"/"square") is deliberately NOT a field
// here — it's a pure function of the image's real aspect ratio (see
// lib/api/gallery-map.ts's `computeShape`), same reasoning as Home never
// storing Media width/height a second time. The curated weaving ORDER
// (the real reason items aren't just grouped by category) lives in the
// array's own row order, which admin users can drag-reorder.
export const Gallery: GlobalConfig = {
  slug: "gallery-page",
  admin: {
    group: "Pages",
    // Same Live Preview wiring as Home/Faq — see Faq.ts's comment for
    // why the URL is derived from the request's own Host header rather
    // than a hardcoded/env-based origin. Like Home, the raw document
    // doesn't match GalleryPageData directly (Media relationships are
    // full objects, not flattened url/width/height), so
    // GalleryPageClient.tsx re-runs gallery-map.ts's `mapGalleryData`
    // transform on every update.
    livePreview: {
      url: ({ req }) => {
        const host = req.headers.get("host") || "localhost:3000";
        const protocol = host.startsWith("localhost") ? "http" : "https";
        return `${protocol}://${host}/gallery`;
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
              // Nested tabs, same as Home — see its comment. Purely a
              // visual grouping for the /admin form; `hero`/`items`
              // stay top-level fields on the document either way.
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
                        { name: "description", type: "textarea", required: true },
                      ],
                    },
                  ],
                },
                {
                  label: "Items",
                  fields: [
                    {
                      name: "items",
                      type: "array",
                      minRows: 1,
                      fields: [
                        { name: "image", type: "upload", relationTo: "media", required: true },
                        { name: "alt", type: "text", required: true },
                        {
                          name: "category",
                          type: "select",
                          required: true,
                          options: [
                            { label: "Spaces", value: "Spaces" },
                            { label: "Behind the Craft", value: "Behind the Craft" },
                          ],
                        },
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
                  admin: { description: 'Leave blank to use the default ("Gallery").' },
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
          revalidateTag("gallery", { expire: 0 });
        } catch {
          // No request-scoped cache to bust outside a real Next.js
          // request (e.g. a script using the Local API) — nothing to do.
        }
      },
    ],
  },
};
