import type { CollectionConfig } from "payload";
import { revalidateTag } from "next/cache";
import { lexicalEditor, HeadingFeature, UploadFeature, BlocksFeature, FixedToolbarFeature } from "@payloadcms/richtext-lexical";
import { ImagePairBlock } from "./blocks/ImagePairBlock";
import { FeatureListBlock } from "./blocks/FeatureListBlock";

// Ported from the real source's Astro content collection (src/assets/
// data/blog/*.mdx, defined in content.config.ts: title, description,
// pubDate, image, author?). A real Payload COLLECTION, not a Global —
// same reasoning as Products/Collaborations: many like-shaped documents,
// not one page's content.
//
// `content`/`faqs` added once the real Figma detail-page design
// confirmed what body-content shape was actually needed (per-post FAQ,
// a real rich-text article body with embedded images) rather than
// guessing earlier. No separate `readTime` or `toc` field — both are
// derived at render time from `content` itself (word count, and the
// heading nodes actually present), so there's nothing for an editor to
// forget to keep in sync. No `heroImage` either — the detail page's
// banner reuses `coverImage`, the same photo the listing/related-posts
// card already shows, just cropped differently.
export const BlogPosts: CollectionConfig = {
  slug: "posts",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "coverImage", "slug", "pubDate"],
    group: "Catalog",
    livePreview: {
      url: ({ data, req }) => {
        const host = req.headers.get("host") || "localhost:3000";
        const protocol = host.startsWith("localhost") ? "http" : "https";
        return `${protocol}://${host}/blog/${data.slug}`;
      },
      breakpoints: [
        { label: "Mobile", name: "mobile", width: 375, height: 667 },
        { label: "Tablet", name: "tablet", width: 768, height: 1024 },
        { label: "Desktop", name: "desktop", width: 1440, height: 900 },
      ],
    },
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Content",
          fields: [
            { name: "title", type: "text", required: true },
            {
              name: "slug",
              type: "text",
              required: true,
              unique: true,
              admin: { description: "Used for this post's /blog/[slug] URL. Matches the real site's existing URLs." },
            },
            {
              name: "excerpt",
              type: "textarea",
              required: true,
              admin: { description: "Shown on the blog card below the title." },
            },
            { name: "pubDate", type: "date", required: true, admin: { date: { pickerAppearance: "dayOnly" } } },
            { name: "coverImage", type: "upload", relationTo: "media", required: true },
            {
              name: "author",
              type: "text",
              defaultValue: "Giada",
              admin: { description: 'Shown as "Written by [Author]". Leave as "Giada" for studio-authored posts.' },
            },
            {
              name: "content",
              type: "richText",
              required: true,
              admin: {
                description:
                  "The article body. Use Heading 2 for each major section — those headings automatically become the page's table of contents, in the order they appear here. Insert a single image via the toolbar's image button, an \"Image Pair\" block for two images side by side, or a \"Feature List\" block for a bulleted list of bold-lead-in tips (with optional nested sub-points).",
              },
              editor: lexicalEditor({
                features: ({ defaultFeatures }) => [
                  ...defaultFeatures.filter(
                    (feature) => !["heading", "upload", "relationship"].includes(feature.key)
                  ),
                  HeadingFeature({ enabledHeadingSizes: ["h2"] }),
                  UploadFeature({ collections: { media: { fields: [] } } }),
                  BlocksFeature({ blocks: [ImagePairBlock, FeatureListBlock] }),
                  FixedToolbarFeature(),
                ],
              }),
            },
            {
              name: "faqs",
              type: "array",
              label: "FAQs",
              admin: { description: "Questions specific to this article — rendered as an accordion at the bottom of the page." },
              fields: [
                { name: "question", type: "text", required: true },
                { name: "answer", type: "textarea", required: true },
              ],
            },
            {
              name: "sidebarCta",
              type: "group",
              label: "Sidebar CTA Card",
              admin: {
                description:
                  "The dark card shown below the table of contents on this article's page. Leave all fields blank to use the site default (promotes the rug catalog) — set them per post when a specific article should point somewhere else instead (e.g. a specific collection or product).",
              },
              fields: [
                {
                  name: "title",
                  type: "text",
                  admin: { description: 'Leave blank to use the default ("Explore the latest Rugs collections by GIADA").' },
                },
                {
                  name: "description",
                  type: "textarea",
                  admin: { description: "Optional supporting line shown below the title. Leave blank to omit it." },
                },
                {
                  name: "linkText",
                  type: "text",
                  admin: { description: 'Leave blank to use the default ("Our Collections").' },
                },
                {
                  name: "href",
                  type: "text",
                  admin: {
                    description:
                      'Where the link goes. Leave blank to use the default ("/rugs"). Use a relative path (e.g. "/products/thar-dusk") for pages on this site, or a full URL for an external link.',
                  },
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
                  admin: { description: "Leave blank to use this post's own title." },
                },
                {
                  name: "metaDescription",
                  type: "textarea",
                  admin: { description: "Leave blank to use this post's excerpt." },
                },
                { name: "ogImage", type: "upload", relationTo: "media", admin: { description: "Leave blank to use this post's cover image." } },
                {
                  name: "noIndex",
                  type: "checkbox",
                  defaultValue: false,
                  label: "Hide from search engines (noindex)",
                  admin: {
                    description:
                      "Tells Google and other search engines not to list this post. Leave unchecked for normal posts.",
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
