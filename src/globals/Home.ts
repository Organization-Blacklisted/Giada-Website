import type { GlobalConfig } from "payload";
import { revalidateTag } from "next/cache";

// Full Home page CMS wiring (2026-10-06/07) — started with just Hero as a
// working test, now extended to every section in lib/api/home.ts's
// HomePageData. Each section is a separate named `group` field under its
// own tab (tabs are purely a /admin UI grouping — a large single-page
// form with 10 sections' worth of fields would be unwieldy to edit
// otherwise); the underlying data shape is unchanged, still
// `home.<section>.{...}`, so the mapping in lib/api/home-map.ts stays a
// thin, obvious 1:1 conversion same as Hero's. Nested one level deeper
// (2026-10-07): all 10 section tabs now live inside an outer "Content"
// tab, a sibling of "SEO" — same purely-UI grouping, no data-shape
// change, just visual separation between page content and page metadata.
//
// Per-image `alt`/`imageAlt` fields are kept alongside each `upload`
// field rather than reusing the Media doc's own required `alt` field —
// matches the existing TS types exactly (some, like CategoryItem, never
// had a separate alt in the first place; left that way, not invented
// here) and keeps this migration mechanical rather than a schema
// redesign. Upload fields never duplicate width/height — those come
// from the populated Media relation itself (Payload auto-populates
// `width`/`height` on every upload via sharp), not stored twice.
export const Home: GlobalConfig = {
  slug: "home",
  admin: {
    // Renames the sidebar section Payload's default-generates from
    // "Globals" to "Pages" — reads more naturally for a non-technical
    // client, and sets up for Products/Collaborations/Gallery/Blog etc.
    // (once those exist) to pick their own group instead of everything
    // piling into one generic bucket.
    group: "Pages",
    // Same Live Preview wiring as the Faq global (src/globals/Faq.ts) —
    // see its comment for why the URL is derived from the request's own
    // Host header rather than a hardcoded/env-based origin. Unlike FAQ,
    // the raw document shape here doesn't match HomePageData directly
    // (Media relationships are full objects, not flattened url/width/
    // height strings/numbers), so the live-preview client
    // (HomePageClient.tsx) re-runs lib/api/home.ts's own `mapHomeData`
    // transform on every update instead of rendering the raw data as-is.
    livePreview: {
      url: ({ req }) => {
        const host = req.headers.get("host") || "localhost:3000";
        const protocol = host.startsWith("localhost") ? "http" : "https";
        return `${protocol}://${host}/`;
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
              // Nested tabs — Payload supports a `tabs` field anywhere
              // in a `fields` array, including inside another tab, and
              // renders it as its own (second-level) tab bar. Keeps all
              // 10 page-section tabs grouped under one outer "Content"
              // tab, visually separate from "SEO" below — same purely-
              // UI grouping as the outer tabs, data paths unchanged.
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
                        { name: "title", type: "text", required: true },
                        { name: "taglineLine1", type: "text", required: true },
                        { name: "taglineLine2", type: "text", required: true },
                        {
                          name: "slides",
                          type: "array",
                          minRows: 1,
                          fields: [
                            {
                              name: "image",
                              type: "upload",
                              relationTo: "media",
                              required: true,
                            },
                            { name: "alt", type: "text", required: true },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  label: "Collection",
                  fields: [
                    {
                      name: "collection",
                      type: "group",
                      fields: [
                        {
                          name: "image",
                          type: "upload",
                          relationTo: "media",
                          required: true,
                        },
                        { name: "alt", type: "text" },
                        { name: "heading", type: "text", required: true },
                        { name: "subheading", type: "text", required: true },
                        {
                          name: "description",
                          type: "textarea",
                          required: true,
                        },
                        { name: "buttonText", type: "text" },
                        { name: "buttonLink", type: "text" },
                      ],
                    },
                  ],
                },
                {
                  label: "Category Grid",
                  fields: [
                    {
                      name: "categoryGrid",
                      type: "group",
                      fields: [
                        { name: "eyebrow", type: "text", required: true },
                        { name: "heading", type: "text", required: true },
                        {
                          name: "categories",
                          type: "array",
                          minRows: 1,
                          fields: [
                            { name: "title", type: "text", required: true },
                            {
                              name: "image",
                              type: "upload",
                              relationTo: "media",
                              required: true,
                            },
                            { name: "href", type: "text", required: true },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  label: "Core Values",
                  fields: [
                    {
                      name: "values",
                      type: "group",
                      fields: [
                        { name: "eyebrow", type: "text", required: true },
                        { name: "heading", type: "text", required: true },
                        {
                          name: "description",
                          type: "textarea",
                          required: true,
                        },
                        {
                          name: "image",
                          type: "upload",
                          relationTo: "media",
                          required: true,
                        },
                        { name: "imageAlt", type: "text", required: true },
                        {
                          name: "items",
                          type: "array",
                          minRows: 1,
                          fields: [
                            { name: "index", type: "text", required: true },
                            { name: "title", type: "text", required: true },
                            { name: "text", type: "textarea", required: true },
                          ],
                        },
                        { name: "buttonText", type: "text" },
                        { name: "buttonLink", type: "text" },
                      ],
                    },
                  ],
                },
                {
                  label: "Process Strip",
                  fields: [
                    {
                      name: "processStrip",
                      type: "group",
                      fields: [
                        { name: "eyebrow", type: "text", required: true },
                        { name: "heading", type: "text", required: true },
                        {
                          name: "description",
                          type: "textarea",
                          required: true,
                        },
                        {
                          name: "steps",
                          type: "array",
                          minRows: 1,
                          fields: [
                            { name: "step", type: "text", required: true },
                            { name: "title", type: "text", required: true },
                            { name: "body", type: "textarea", required: true },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  label: "Collaborations",
                  fields: [
                    {
                      name: "collaborationsSlider",
                      type: "group",
                      fields: [
                        { name: "eyebrow", type: "text", required: true },
                        {
                          name: "slides",
                          type: "array",
                          minRows: 1,
                          fields: [
                            {
                              name: "image",
                              type: "upload",
                              relationTo: "media",
                              required: true,
                            },
                            { name: "imageAlt", type: "text", required: true },
                            { name: "heading", type: "text", required: true },
                            {
                              name: "description",
                              type: "textarea",
                              required: true,
                            },
                            {
                              name: "cardImage",
                              type: "upload",
                              relationTo: "media",
                              required: true,
                            },
                            {
                              name: "cardImageAlt",
                              type: "text",
                              required: true,
                            },
                            { name: "cardTitle", type: "text", required: true },
                            {
                              name: "cardCaption",
                              type: "text",
                              required: true,
                            },
                            {
                              name: "buttonText",
                              type: "text",
                              required: true,
                            },
                            {
                              name: "buttonLink",
                              type: "text",
                              required: true,
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  label: "Press Feature",
                  fields: [
                    {
                      name: "pressFeature",
                      type: "group",
                      fields: [
                        { name: "eyebrow", type: "text", required: true },
                        { name: "heading", type: "text", required: true },
                        {
                          name: "description",
                          type: "textarea",
                          required: true,
                        },
                        {
                          name: "images",
                          type: "array",
                          minRows: 1,
                          fields: [
                            {
                              name: "image",
                              type: "upload",
                              relationTo: "media",
                              required: true,
                            },
                            { name: "alt", type: "text", required: true },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  label: "Why Giada",
                  fields: [
                    {
                      name: "whyGiada",
                      type: "group",
                      fields: [
                        { name: "eyebrow", type: "text", required: true },
                        { name: "heading", type: "text", required: true },
                        {
                          name: "pillars",
                          type: "array",
                          minRows: 1,
                          fields: [
                            { name: "title", type: "text", required: true },
                            { name: "body", type: "textarea", required: true },
                          ],
                        },
                        {
                          name: "image",
                          type: "upload",
                          relationTo: "media",
                          required: true,
                        },
                        { name: "imageAlt", type: "text", required: true },
                      ],
                    },
                  ],
                },
                {
                  label: "Testimonials",
                  fields: [
                    {
                      name: "testimonials",
                      type: "group",
                      fields: [
                        { name: "eyebrow", type: "text", required: true },
                        { name: "heading", type: "text", required: true },
                        {
                          name: "testimonials",
                          type: "array",
                          minRows: 1,
                          fields: [
                            { name: "quote", type: "textarea", required: true },
                            { name: "name", type: "text", required: true },
                            { name: "company", type: "text", required: true },
                            {
                              name: "logo",
                              type: "upload",
                              relationTo: "media",
                              required: true,
                            },
                            {
                              name: "logoInvert",
                              type: "checkbox",
                              defaultValue: false,
                              admin: {
                                description:
                                  "Invert logo to white — for dark/colored logos that need to read on a light background.",
                              },
                            },
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
                        { name: "heading", type: "text", required: true },
                        { name: "linkText", type: "text", required: true },
                        { name: "href", type: "text", required: true },
                      ],
                    },
                  ],
                },
                {
                  label: "Image Strip",
                  fields: [
                    {
                      name: "imageReel",
                      type: "group",
                      fields: [
                        {
                          name: "images",
                          type: "array",
                          minRows: 1,
                          fields: [
                            {
                              name: "image",
                              type: "upload",
                              relationTo: "media",
                              required: true,
                            },
                            { name: "alt", type: "text" },
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
          label: "Appearance",
          fields: [
            {
              name: "visibility",
              type: "group",
              admin: {
                description:
                  "Temporarily hide a section from the live homepage without deleting its content. Every section is visible by default.",
              },
              fields: [
                { name: "hero", type: "checkbox", defaultValue: true, label: "Show Hero" },
                { name: "collection", type: "checkbox", defaultValue: true, label: "Show Collection" },
                { name: "categoryGrid", type: "checkbox", defaultValue: true, label: "Show Category Grid" },
                { name: "values", type: "checkbox", defaultValue: true, label: "Show Core Values" },
                { name: "processStrip", type: "checkbox", defaultValue: true, label: "Show Process Strip" },
                {
                  name: "collaborationsSlider",
                  type: "checkbox",
                  defaultValue: true,
                  label: "Show Collaborations",
                },
                { name: "pressFeature", type: "checkbox", defaultValue: true, label: "Show Press Feature" },
                { name: "whyGiada", type: "checkbox", defaultValue: true, label: "Show Why Giada" },
                { name: "testimonials", type: "checkbox", defaultValue: true, label: "Show Testimonials" },
                { name: "closingCta", type: "checkbox", defaultValue: true, label: "Show Closing CTA" },
                { name: "imageReel", type: "checkbox", defaultValue: true, label: "Show Image Strip" },
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
                  admin: {
                    description:
                      'Leave blank to use the default site title ("Giada").',
                  },
                },
                {
                  name: "metaDescription",
                  type: "textarea",
                  admin: {
                    description:
                      "Leave blank to use the default site description.",
                  },
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
    // Home currently renders statically (confirmed via `next build`'s
    // route table: "○ /"); every section's fetch in lib/api/home.ts
    // wraps the Payload call in `unstable_cache` tagged "home"
    // specifically so this hook has something to invalidate — without a
    // tag, revalidateTag here would be a no-op and editing in /admin
    // would never show up without a full rebuild. One hook for the whole
    // global is correct even though it now covers 10 sections — any
    // save busts the same single "home" tag, which is exactly the cache
    // boundary the page itself uses.
    afterChange: [
      async () => {
        // `revalidateTag` throws ("Invariant: static generation store
        // missing") when called outside a real Next.js request context —
        // confirmed by running a standalone seed script that calls
        // `payload.updateGlobal`: the write itself succeeds, but this
        // hook crashed before returning. Real admin-UI edits run inside
        // an actual Next.js route handler so they're unaffected, but any
        // future script/migration that updates this global the same way
        // would otherwise crash too. Caught defensively rather than
        // assumed safe everywhere this hook might run.
        try {
          revalidateTag("home", { expire: 0 });
        } catch {
          // No request-scoped cache to bust outside a real Next.js
          // request — nothing to do.
        }
      },
    ],
  },
};
