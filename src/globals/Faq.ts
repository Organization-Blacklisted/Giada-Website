import type { GlobalConfig } from "payload";
import { revalidateTag } from "next/cache";

// Same pattern as Home (src/globals/Home.ts): a singleton global, not a
// collection, since the FAQ page has exactly one instance. Wrapped in
// `tabs` now (Content + SEO) purely for /admin UI grouping, same as
// Home — the `tabs` field itself has no `name`, so this doesn't change
// the underlying data shape at all; `hero`/`items`/`closingCta` stay
// top-level fields on the document exactly as before.
export const Faq: GlobalConfig = {
  slug: "faq-page",
  admin: {
    // See Home.ts's identical `group` for why — renames the sidebar
    // section from Payload's default "Globals" to "Pages".
    group: "Pages",
    // Renders the real /faq route in an iframe next to the edit form,
    // live-updating as fields change (before saving) via the
    // `useLivePreview` hook on the page side — see FaqPageClient.tsx.
    // Trying this on FAQ first since its lib/api shape is a clean 1:1
    // match with the raw document (no media/testimonial transforms to
    // duplicate client-side the way Home would need).
    //
    // Derived from the incoming request's own Host header, not a
    // hardcoded/env-based origin — a fixed `NEXT_PUBLIC_SERVER_URL`
    // fallback broke Live Preview on the deployed Vercel domain (the
    // iframe tried to load the admin's *local* machine's localhost,
    // which the production page obviously can't reach). This way the
    // preview always points at whatever origin /admin itself is being
    // viewed from — localhost in dev, the real domain in prod, any
    // Vercel preview deployment — with no per-environment config needed.
    livePreview: {
      url: ({ req }) => {
        const host = req.headers.get("host") || "localhost:3000";
        const protocol = host.startsWith("localhost") ? "http" : "https";
        return `${protocol}://${host}/faq`;
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
              ],
            },
            {
              name: "items",
              type: "array",
              minRows: 1,
              fields: [
                { name: "question", type: "text", required: true },
                { name: "answer", type: "textarea", required: true },
              ],
            },
            {
              name: "closingCta",
              type: "group",
              fields: [
                { name: "eyebrow", type: "text", required: true },
                { name: "heading", type: "text", required: true },
                { name: "description", type: "textarea", required: true },
                { name: "linkText", type: "text", required: true },
                { name: "href", type: "text", required: true },
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
                  admin: { description: 'Leave blank to use the default ("FAQ").' },
                },
                {
                  name: "metaDescription",
                  type: "textarea",
                  admin: { description: "Leave blank to use the default description." },
                },
                { name: "ogImage", type: "upload", relationTo: "media" },
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
          revalidateTag("faq", { expire: 0 });
        } catch {
          // No request-scoped cache to bust outside a real Next.js
          // request (e.g. a script using the Local API) — nothing to do.
        }
      },
    ],
  },
};
