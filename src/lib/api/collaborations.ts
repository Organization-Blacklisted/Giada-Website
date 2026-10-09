import { unstable_cache } from "next/cache";
import { getPayload } from "payload";
import config from "@payload-config";
import type { Collaboration, CollaborationsPage } from "@/payload-types";
import {
  mapCollaborationItem,
  mapCollaborationsPageContent,
  type CollaborationItemData,
  type CollaborationsPageData,
} from "./collaborations-map";

export * from "./collaborations-map";

// The /collaborations listing page's own copy (hero/closingCta/seo) —
// mirrors lib/api/gallery.ts's pattern: caches the RAW document, not the
// mapped shape, since Live Preview (CollaborationsPageClient.tsx) needs
// the raw shape as `useLivePreview`'s `initialData`.
export const getCollaborationsRaw = unstable_cache(
  async (): Promise<CollaborationsPage> => {
    const payload = await getPayload({ config });
    return payload.findGlobal({ slug: "collaborations-page", draft: false });
  },
  ["collaborations-raw"],
  { tags: ["collaborations"] }
);

// Every real collaboration, in a stable order (sorted by id — the order
// they were created in, which is the order they should display in).
// Tagged "collaborations" too — this collection's own afterChange hook
// (collections/Collaborations.ts) busts the same tag, so editing either
// the listing page's copy or any individual collaboration revalidates
// both.
export const getCollaborationItemsRaw = unstable_cache(
  async (): Promise<Collaboration[]> => {
    const payload = await getPayload({ config });
    const result = await payload.find({ collection: "collaborations", sort: "id", limit: 0, depth: 1 });
    return result.docs;
  },
  ["collaboration-items-raw"],
  { tags: ["collaborations"] }
);

export async function getCollaborationsPage(): Promise<CollaborationsPageData> {
  const [page, items] = await Promise.all([getCollaborationsRaw(), getCollaborationItemsRaw()]);
  return {
    ...mapCollaborationsPageContent(page),
    items: items.map(mapCollaborationItem),
  };
}

// Used by /collaborations/[slug] — every collaboration gets a real
// detail page regardless of `active`, matching the real source's own
// getStaticPaths() (one page per JSON file, no active filtering at the
// routing level — only the listing page cares about `active`).
export const getAllCollaborationSlugs = unstable_cache(
  async (): Promise<string[]> => {
    const payload = await getPayload({ config });
    const result = await payload.find({ collection: "collaborations", limit: 0, depth: 0 });
    return result.docs.map((doc) => doc.slug);
  },
  ["collaboration-slugs"],
  { tags: ["collaborations"] }
);

export async function getCollaborationBySlug(slug: string): Promise<CollaborationItemData | null> {
  return unstable_cache(
    async () => {
      const payload = await getPayload({ config });
      const result = await payload.find({
        collection: "collaborations",
        where: { slug: { equals: slug } },
        limit: 1,
        // depth: 2, not 1 — customHero's bespoke sections nest uploads
        // inside groups AND arrays (e.g. customHero.inspiration.cards[].image),
        // deeper than this collection's other upload fields (heroImage,
        // designer.portrait), which only need depth: 1.
        depth: 2,
      });
      return result.docs[0] ? mapCollaborationItem(result.docs[0]) : null;
    },
    ["collaboration", slug],
    { tags: ["collaborations"] }
  )();
}
