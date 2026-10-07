import type { GlobalConfig } from "payload";
import { revalidateTag } from "next/cache";

// Full Home page CMS wiring (2026-10-06/07) — started with just Hero as a
// working test, now extended to every section in lib/api/home.ts's
// HomePageData. Each tab below is a separate named `group` field (tabs
// are purely a /admin UI grouping — a large single-page form with 10
// sections' worth of fields would be unwieldy to edit otherwise); the
// underlying data shape is unchanged, still `home.<section>.{...}`, so
// the mapping in lib/api/home.ts stays a thin, obvious 1:1 conversion
// same as Hero's.
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
                { name: "title", type: "text", required: true },
                { name: "taglineLine1", type: "text", required: true },
                { name: "taglineLine2", type: "text", required: true },
                {
                  name: "slides",
                  type: "array",
                  minRows: 1,
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
          label: "Collection",
          fields: [
            {
              name: "collection",
              type: "group",
              fields: [
                { name: "image", type: "upload", relationTo: "media", required: true },
                { name: "alt", type: "text" },
                { name: "heading", type: "text", required: true },
                { name: "subheading", type: "text", required: true },
                { name: "description", type: "textarea", required: true },
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
                    { name: "image", type: "upload", relationTo: "media", required: true },
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
                { name: "description", type: "textarea", required: true },
                { name: "image", type: "upload", relationTo: "media", required: true },
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
                { name: "description", type: "textarea", required: true },
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
                    { name: "image", type: "upload", relationTo: "media", required: true },
                    { name: "imageAlt", type: "text", required: true },
                    { name: "heading", type: "text", required: true },
                    { name: "description", type: "textarea", required: true },
                    { name: "cardImage", type: "upload", relationTo: "media", required: true },
                    { name: "cardImageAlt", type: "text", required: true },
                    { name: "cardTitle", type: "text", required: true },
                    { name: "cardCaption", type: "text", required: true },
                    { name: "buttonText", type: "text", required: true },
                    { name: "buttonLink", type: "text", required: true },
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
                { name: "description", type: "textarea", required: true },
                {
                  name: "images",
                  type: "array",
                  minRows: 1,
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
                { name: "image", type: "upload", relationTo: "media", required: true },
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
                    { name: "logo", type: "upload", relationTo: "media", required: true },
                    {
                      name: "logoInvert",
                      type: "checkbox",
                      defaultValue: false,
                      admin: { description: "Invert logo to white — for dark/colored logos that need to read on a light background." },
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
                    { name: "image", type: "upload", relationTo: "media", required: true },
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
