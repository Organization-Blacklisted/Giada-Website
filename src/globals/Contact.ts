import type { GlobalConfig } from "payload";
import { revalidateTag } from "next/cache";

// Same Content/SEO tab pattern as Home/Faq/Gallery.
//
// Showroom `locations` are deliberately NOT a field here — they stay
// sourced from `siteConfig.locations` (lib/api/contact.ts), same as
// before this migration. That data is shared well beyond this page
// (Footer, and page.tsx's own LocalBusiness JSON-LD schema, which needs
// region/postalCode/country fields that aren't even part of this page's
// own `visit.locations` shape) — moving it into this global would mean
// either duplicating it or restructuring how Footer/schema generation
// read it, which is a separate, bigger decision than wiring up this
// page's own editorial copy.
export const Contact: GlobalConfig = {
  slug: "contact-page",
  admin: {
    group: "Pages",
    // Same Live Preview wiring as Home/Faq/Gallery — see Faq.ts's
    // comment for why the URL is derived from the request's own Host
    // header rather than a hardcoded/env-based origin. Unlike Gallery/
    // Home, this page's raw document is ALMOST a 1:1 match with
    // ContactPageData — the one real gap is `visit.locations`, which
    // isn't a CMS field at all (see the comment above), so
    // ContactPageClient.tsx's `mapContactData` call still injects it
    // from siteConfig on every live-preview update, same as the normal
    // SSR path does.
    livePreview: {
      url: ({ req }) => {
        const host = req.headers.get("host") || "localhost:3000";
        const protocol = host.startsWith("localhost") ? "http" : "https";
        return `${protocol}://${host}/contact`;
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
              // Nested tabs, same as Home/Gallery — see Home.ts's
              // comment. Purely a visual grouping for the /admin form;
              // `hero`/`visit` stay top-level fields on the document
              // either way.
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
                  label: "Visit & Enquiries",
                  fields: [
                    {
                      name: "visit",
                      type: "group",
                      fields: [
                        { name: "eyebrow", type: "text", required: true },
                        { name: "heading", type: "text", required: true },
                        { name: "description", type: "textarea", required: true },
                        {
                          name: "generalContact",
                          type: "group",
                          fields: [
                            {
                              name: "email",
                              type: "group",
                              fields: [
                                { name: "label", type: "text", required: true },
                                { name: "value", type: "text", required: true },
                                { name: "href", type: "text", required: true },
                              ],
                            },
                            {
                              name: "studioHours",
                              type: "group",
                              fields: [
                                { name: "label", type: "text", required: true },
                                { name: "days", type: "text", required: true },
                                { name: "hours", type: "text", required: true },
                              ],
                            },
                            {
                              name: "responseTime",
                              type: "group",
                              fields: [
                                { name: "label", type: "text", required: true },
                                { name: "value", type: "text", required: true },
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
                  admin: { description: 'Leave blank to use the default ("Contact").' },
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
          revalidateTag("contact", { expire: 0 });
        } catch {
          // No request-scoped cache to bust outside a real Next.js
          // request (e.g. a script using the Local API) — nothing to do.
        }
      },
    ],
  },
};
