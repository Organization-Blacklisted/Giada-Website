import type { GlobalConfig } from "payload";
import { revalidateTag } from "next/cache";

// Same Content/SEO tab pattern (with nested section tabs) + Live
// Preview as Home/Faq/Gallery/Contact. This wires up the existing
// simple category-picker page only — NOT the full 75-product Rugs
// catalog or the separate Glass landing page, both of which are real
// but much bigger, separate pieces of work (confirmed against the live
// site and the real Astro source) that haven't been scoped/started yet.
export const Products: GlobalConfig = {
  slug: "products-page",
  admin: {
    group: "Pages",
    livePreview: {
      url: ({ req }) => {
        const host = req.headers.get("host") || "localhost:3000";
        const protocol = host.startsWith("localhost") ? "http" : "https";
        return `${protocol}://${host}/products`;
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
                      ],
                    },
                  ],
                },
                {
                  label: "Categories",
                  fields: [
                    {
                      name: "categories",
                      type: "array",
                      minRows: 1,
                      fields: [
                        { name: "title", type: "text", required: true },
                        { name: "image", type: "upload", relationTo: "media", required: true },
                        {
                          name: "href",
                          type: "text",
                          required: true,
                          admin: {
                            description:
                              'E.g. "/products?category=rugs" — the full catalog/filtering behind this isn\'t built yet, so this just needs to point somewhere sensible.',
                          },
                        },
                      ],
                    },
                    {
                      name: "galleryCta",
                      type: "group",
                      fields: [
                        { name: "label", type: "text", required: true },
                        { name: "href", type: "text", required: true },
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
                  admin: { description: 'Leave blank to use the default ("Products").' },
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
          revalidateTag("products", { expire: 0 });
        } catch {
          // No request-scoped cache to bust outside a real Next.js
          // request (e.g. a script using the Local API) — nothing to do.
        }
      },
    ],
  },
};
