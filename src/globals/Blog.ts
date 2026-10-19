import type { GlobalConfig } from "payload";
import { revalidateTag } from "next/cache";

// The /blog LISTING page's own copy only — hero + closing CTA. Same
// split as Products/Collaborations: this Global holds the page's own
// text, the actual posts live in a separate `posts` COLLECTION
// (collections/BlogPosts.ts).
export const Blog: GlobalConfig = {
  slug: "blog-page",
  admin: {
    group: "Pages",
    livePreview: {
      url: ({ req }) => {
        const host = req.headers.get("host") || "localhost:3000";
        const protocol = host.startsWith("localhost") ? "http" : "https";
        return `${protocol}://${host}/blog`;
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
                { name: "description", type: "textarea", required: true },
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
                  admin: { description: 'Leave blank to use the default ("Journal | Giada").' },
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
          revalidateTag("blog", { expire: 0 });
        } catch {
          // No request-scoped cache to bust outside a real Next.js
          // request (e.g. a script using the Local API) — nothing to do.
        }
      },
    ],
  },
};
