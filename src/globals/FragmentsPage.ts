import type { GlobalConfig } from "payload";
import { revalidateTag } from "next/cache";

// The Fragments (Ryan Saghian) collaboration's bespoke, one-off page —
// a real Figma design, not the shared template every other
// collaboration uses (CollaborationHeroSection/CollaborationDesignerSection/
// CollaborationStatementSection). Originally built as an optional
// `customHero` group bolted onto the `collaborations` COLLECTION, which
// was the wrong call: it made every OTHER collaboration's edit screen
// (e.g. Of Earth and Light) show a pile of empty, irrelevant
// Ryan-specific fields (Artist/Inspiration/Memories/Meeting/Closing CTA)
// with no clean way to hide them, since Payload shows a collection's
// fields on every document of that collection regardless of whether a
// given document uses them.
//
// Moved here instead, matching how every other one-off page in this
// project (Home, FAQ, Gallery, Contact, Our Story, Privacy, Terms,
// Shipping, Glass, Rugs) is modeled as a GLOBAL, not a collection field
// — there's only ever one Fragments page, same as there's only ever one
// Home page. The `collaborations` collection document for Fragments
// (slug: "fragments") still exists and still drives the /collaborations
// LISTING page's card (name/tagline/heroImage) and this page's route
// lookup — only the bespoke page CONTENT moved here.
export const FragmentsPage: GlobalConfig = {
  slug: "fragments-page",
  admin: {
    group: "Pages",
    description: "Ryan Saghian's bespoke collaboration page — /collaborations/fragments.",
    livePreview: {
      url: ({ req }) => {
        const host = req.headers.get("host") || "localhost:3000";
        const protocol = host.startsWith("localhost") ? "http" : "https";
        return `${protocol}://${host}/collaborations/fragments`;
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
                        { name: "headline", type: "text", required: true },
                        { name: "paragraph", type: "textarea", required: true },
                        { name: "backdropImage", type: "upload", relationTo: "media", required: true, admin: { description: "Full-bleed textured background behind the whole hero." } },
                        { name: "cutoutImage", type: "upload", relationTo: "media", required: true, admin: { description: "The portrait + mosaic cutout (transparent background) placed on top of the backdrop." } },
                        {
                          name: "unveilingLines",
                          type: "array",
                          minRows: 1,
                          maxRows: 3,
                          admin: { description: 'The "Unveiling at" panel\'s lines (e.g. venue, then date | city).' },
                          fields: [{ name: "line", type: "text", required: true }],
                        },
                      ],
                    },
                  ],
                },
                {
                  label: "Artist",
                  fields: [
                    {
                      name: "artist",
                      type: "group",
                      admin: { description: '"The Artist Behind The Collection" section.' },
                      fields: [
                        { name: "eyebrow", type: "text", required: true },
                        { name: "name", type: "text", required: true },
                        { name: "subheadline", type: "text", required: true },
                        {
                          name: "bioParagraphGroup1",
                          type: "textarea",
                          required: true,
                          admin: { description: "First block of bio copy (runs tight, no gap, above the visual break before group 2)." },
                        },
                        {
                          name: "bioParagraphGroup2",
                          type: "textarea",
                          required: true,
                          admin: { description: "Second block of bio copy (runs tight internally, with one line-height's gap above it)." },
                        },
                        { name: "portrait", type: "upload", relationTo: "media", required: true },
                      ],
                    },
                  ],
                },
                {
                  label: "Inspiration",
                  fields: [
                    {
                      name: "inspiration",
                      type: "group",
                      admin: { description: '"The Inspiration" section — heading, auto-scrolling card gallery, pull quote.' },
                      fields: [
                        { name: "eyebrow", type: "text", required: true },
                        { name: "heading", type: "text", required: true },
                        { name: "paragraph", type: "textarea", required: true },
                        {
                          name: "cards",
                          type: "array",
                          minRows: 6,
                          maxRows: 6,
                          admin: { description: "Exactly 6 — the gallery loops this set three times for the seamless scroll." },
                          fields: [
                            { name: "title", type: "text", required: true },
                            { name: "caption", type: "text", required: true },
                            { name: "image", type: "upload", relationTo: "media", required: true },
                          ],
                        },
                        { name: "quote", type: "textarea", required: true },
                        { name: "quoteAttribution", type: "text", required: true },
                      ],
                    },
                  ],
                },
                {
                  label: "Memories",
                  fields: [
                    {
                      name: "memories",
                      type: "group",
                      admin: { description: '"When Memories Take Form" section — heading + 8 staggered decorative strips.' },
                      fields: [
                        { name: "eyebrow", type: "text", required: true },
                        { name: "heading", type: "text", required: true },
                        { name: "paragraph", type: "textarea", required: true },
                        {
                          name: "strips",
                          type: "array",
                          minRows: 8,
                          maxRows: 8,
                          admin: {
                            description:
                              "Exactly 8, in the same fixed staggered layout every time — position and size are baked into the page design, not editable here. Only the image and alt text for each of the 8 slots change.",
                          },
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
                  label: "Meeting",
                  fields: [
                    {
                      name: "meeting",
                      type: "group",
                      admin: { description: '"A Meeting Of Two Worlds" section — text + two side-by-side photos.' },
                      fields: [
                        { name: "eyebrow", type: "text", required: true },
                        { name: "heading", type: "text", required: true },
                        { name: "subheadline", type: "text", required: true },
                        { name: "paragraph", type: "textarea", required: true },
                        { name: "imageLeft", type: "upload", relationTo: "media", required: true },
                        { name: "imageRight", type: "upload", relationTo: "media", required: true },
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
                      admin: { description: "The page's closing call-to-action banner." },
                      fields: [
                        { name: "heading", type: "text", required: true },
                        { name: "paragraph", type: "textarea", required: true },
                        { name: "linkText", type: "text", required: true },
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
                  admin: { description: 'Leave blank to use the default ("Fragments").' },
                },
                {
                  name: "metaDescription",
                  type: "textarea",
                  admin: { description: "Leave blank to use the hero paragraph as the default description." },
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
          revalidateTag("fragments-page", { expire: 0 });
          revalidateTag("collaborations", { expire: 0 });
        } catch {
          // No request-scoped cache to bust outside a real Next.js
          // request (e.g. a script using the Local API) — nothing to do.
        }
      },
    ],
  },
};
