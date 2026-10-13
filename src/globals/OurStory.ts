import type { GlobalConfig } from "payload";
import { revalidateTag } from "next/cache";

// Same Content(nested)/SEO tabs + Live Preview pattern as Gallery/
// Contact/Products — this is the initial CMS wiring, no Drafts (that's
// been an explicit, separate ask for the pages that got it so far:
// Home, Faq, and the 3 legal pages).
//
// Real source note: `StoryTimeline.astro` is imported in the real
// source's our-story.astro but never actually rendered — genuinely dead
// code there, not ported here (same "fix pre-existing bugs, don't carry
// them forward" standard as the legal pages' broken PDF links).
export const OurStory: GlobalConfig = {
  slug: "our-story-page",
  admin: {
    group: "Pages",
    // Not ready to reveal to the client yet — frontend isn't part of
    // this deploy. Remove this line when /our-story is ready to go live.
    hidden: true,
    livePreview: {
      url: ({ req }) => {
        const host = req.headers.get("host") || "localhost:3000";
        const protocol = host.startsWith("localhost") ? "http" : "https";
        return `${protocol}://${host}/our-story`;
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
                        { name: "titleLine1", type: "text", required: true },
                        { name: "titleLine2", type: "text", required: true },
                        { name: "lead", type: "textarea", required: true },
                      ],
                    },
                  ],
                },
                {
                  label: "Origin",
                  fields: [
                    {
                      name: "origin",
                      type: "group",
                      fields: [
                        { name: "eyebrow", type: "text", required: true },
                        { name: "quote", type: "textarea", required: true },
                        { name: "attribution", type: "text", required: true },
                        { name: "paragraph1", type: "textarea", required: true },
                        { name: "paragraph2", type: "textarea", required: true },
                        {
                          name: "images",
                          type: "array",
                          minRows: 1,
                          maxRows: 4,
                          admin: { description: "The 4-picture grid — real source always has exactly 4." },
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
                  label: "Beliefs",
                  fields: [
                    {
                      name: "beliefs",
                      type: "group",
                      fields: [
                        { name: "eyebrow", type: "text", required: true },
                        { name: "heading", type: "text", required: true },
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
                        { name: "closingImage", type: "upload", relationTo: "media", required: true },
                        { name: "closingImageAlt", type: "text", required: true },
                        { name: "closingCaption", type: "text", required: true },
                      ],
                    },
                  ],
                },
                {
                  label: "Present",
                  fields: [
                    {
                      name: "present",
                      type: "group",
                      fields: [
                        { name: "eyebrow", type: "text", required: true },
                        { name: "heading", type: "text", required: true },
                        { name: "description", type: "textarea", required: true },
                        {
                          name: "stats",
                          type: "array",
                          minRows: 1,
                          fields: [
                            { name: "value", type: "text", required: true },
                            { name: "label", type: "text", required: true },
                          ],
                        },
                        { name: "linkLabel", type: "text", required: true },
                        { name: "linkHref", type: "text", required: true },
                      ],
                    },
                  ],
                },
                {
                  label: "Founders",
                  fields: [
                    {
                      name: "founders",
                      type: "group",
                      fields: [
                        { name: "eyebrow", type: "text", required: true },
                        { name: "quote", type: "textarea", required: true },
                        { name: "attribution", type: "text", required: true },
                        {
                          name: "people",
                          type: "array",
                          minRows: 1,
                          fields: [
                            { name: "name", type: "text", required: true },
                            { name: "role", type: "text", required: true },
                            { name: "image", type: "upload", relationTo: "media", required: true },
                            { name: "alt", type: "text", required: true },
                            { name: "bio", type: "textarea", required: true },
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
                  admin: { description: 'Leave blank to use the default ("Our Story").' },
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
          revalidateTag("our-story", { expire: 0 });
        } catch {
          // No request-scoped cache to bust outside a real Next.js
          // request (e.g. a script using the Local API) — nothing to do.
        }
      },
    ],
  },
};
