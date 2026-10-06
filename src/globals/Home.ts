import type { GlobalConfig } from "payload";
import { revalidateTag } from "next/cache";

// First real CMS-editable piece of the Home page (2026-10-06) — scoped to
// just the Hero section as a working test before the rest of Home's
// sections get migrated off the lib/api/home.ts mock data the same way.
// Field shape mirrors HeroSlideshowSectionData exactly (eyebrow, title,
// taglineLine1/2, slides[].image+alt) so the mapping in
// lib/api/home.ts stays a thin, obvious 1:1 conversion.
export const Home: GlobalConfig = {
  slug: "home",
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
  hooks: {
    // Home currently renders statically (confirmed via `next build`'s
    // route table: "○ /"); the Hero fetch in lib/api/home.ts wraps the
    // Payload call in `unstable_cache` tagged "home" specifically so this
    // hook has something to invalidate — without a tag, revalidateTag
    // here would be a no-op and editing in /admin would never show up
    // without a full rebuild.
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
