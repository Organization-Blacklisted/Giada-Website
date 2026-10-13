import type { GlobalConfig } from "payload";
import { revalidateTag } from "next/cache";

// Of Earth and Light's own detail-page content — same reasoning as
// globals/FragmentsPage.ts: the `collaborations` COLLECTION document for
// this one only drives the /collaborations LISTING page's card
// (name/slug/tagline/active/heroImage/productCount/designerName). This
// page's own content (full statement + designer bio/portrait, shown via
// the shared CollaborationStatementSection/CollaborationDesignerSection
// template) used to live as extra fields on that same collection
// document — fields nobody read anywhere for the OTHER collaboration
// (Fragments) either, since it had already moved to its own bespoke
// page. Giving every detail page its own dedicated content document,
// one card schema shared by both, is the consistent version of that fix.
//
// No `hero` group here: CollaborationHeroSection only needs
// name/tagline/heroImage, all of which already live on the card — no
// page-specific hero content to duplicate.
export const OfEarthAndLightPage: GlobalConfig = {
  slug: "of-earth-and-light-page",
  admin: {
    group: "Pages",
    description: "Of Earth and Light's detail page content — /collaborations/of-earth-and-light.",
    livePreview: {
      url: ({ req }) => {
        const host = req.headers.get("host") || "localhost:3000";
        const protocol = host.startsWith("localhost") ? "http" : "https";
        return `${protocol}://${host}/collaborations/of-earth-and-light`;
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
              name: "statement",
              type: "group",
              admin: { description: "Full statement copy shown below the hero." },
              fields: [{ name: "description", type: "textarea", required: true }],
            },
            {
              name: "designer",
              type: "group",
              admin: { description: 'The designer bio section. Name itself lives on the card (Collections → Collaborations) — only bio/portrait live here.' },
              fields: [
                { name: "bio", type: "textarea", required: true },
                { name: "portrait", type: "upload", relationTo: "media", required: true },
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
                  admin: { description: 'Leave blank to use the default ("Of Earth and Light").' },
                },
                {
                  name: "metaDescription",
                  type: "textarea",
                  admin: { description: "Leave blank to use the card's tagline as the default description." },
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
          revalidateTag("of-earth-and-light-page", { expire: 0 });
          revalidateTag("collaborations", { expire: 0 });
        } catch {
          // No request-scoped cache to bust outside a real Next.js
          // request (e.g. a script using the Local API) — nothing to do.
        }
      },
    ],
  },
};
