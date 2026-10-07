import type { CollectionConfig } from "payload";
import { revalidateTag } from "next/cache";

// Uploads collection — every image/file across every other collection
// relates to a document here. Kept minimal (no Folders/Tags, unlike
// Payload's own blank-template default) since this project doesn't need
// that organizational layer yet; add it later if the content volume
// actually calls for it.
export const Media: CollectionConfig = {
  slug: "media",
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
    },
  ],
  // `upload: true` (no sizes) meant the admin UI had no small preview
  // variant to fall back on — every thumbnail in /admin (the Media list,
  // and every upload field across Home's sections) requested the FULL
  // original file over the network from Neon Object Storage, some of
  // which are 500KB-1.3MB real photography. Real cause, not assumed:
  // confirmed by reading Payload's own upload types (`adminThumbnail`
  // falls back to the full file when no named size is configured).
  // `thumbnail` here is a real generated+stored 400x400 crop used
  // specifically for admin previews — the live site itself never
  // references `sizes.thumbnail`, only the original (via `mediaUrl()` in
  // lib/api/home.ts), so this doesn't change anything client-facing.
  upload: {
    imageSizes: [
      {
        name: "thumbnail",
        width: 400,
        height: 400,
        fit: "cover",
      },
    ],
    adminThumbnail: "thumbnail",
  },
  hooks: {
    // Home's own `afterChange` hook (src/globals/Home.ts) only fires
    // when the Home global ITSELF is saved — replacing an image's file
    // directly here, in Collections > Media, rather than through the
    // Home global's own form, changes what actually renders on the
    // homepage (same doc id, new bytes/URL) without ever touching Home,
    // so that edit wouldn't otherwise bust the homepage's cache — found
    // during an audit, not hit live. Media doesn't know which specific
    // docs Home references, so this busts the same "home" tag on every
    // Media save/delete rather than only relevant ones; harmless, since
    // revalidation itself is cheap (marks the cache stale, does no real
    // work) and this collection isn't high-traffic.
    afterChange: [
      async () => {
        try {
          revalidateTag("home", { expire: 0 });
        } catch {
          // No request-scoped cache to bust outside a real Next.js
          // request (e.g. a script using the Local API) — nothing to do.
        }
      },
    ],
    afterDelete: [
      async () => {
        try {
          revalidateTag("home", { expire: 0 });
        } catch {
          // Same as above.
        }
      },
    ],
  },
};
