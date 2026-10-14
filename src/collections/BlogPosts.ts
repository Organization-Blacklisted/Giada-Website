import type { CollectionConfig } from "payload";
import { revalidateTag } from "next/cache";

// Ported from the real source's Astro content collection (src/assets/
// data/blog/*.mdx, defined in content.config.ts: title, description,
// pubDate, image, author?). A real Payload COLLECTION, not a Global —
// same reasoning as Products/Collaborations: many like-shaped documents,
// not one page's content.
//
// Deliberately NOT including a body/content field yet — this collection
// only needs to support the /blog LISTING page for now. The /blog/[slug]
// detail page is being rebuilt from a new Figma design (separate, later
// task), and whatever body-content shape that design actually needs
// should be added then, not guessed at now.
export const BlogPosts: CollectionConfig = {
  slug: "posts",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "coverImage", "slug", "pubDate"],
    group: "Catalog",
    // Not ready to reveal to the client yet — the /blog listing page
    // isn't part of this deploy. Remove this line when it ships.
    hidden: true,
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
