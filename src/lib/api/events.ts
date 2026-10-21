import { unstable_cache } from "next/cache";
import { getPayload } from "payload";
import config from "@payload-config";
import type { Event } from "@/payload-types";
import { mapEvent, type EventData } from "./events-map";

export * from "./events-map";

export const getAllEventSlugs = unstable_cache(
  async (): Promise<string[]> => {
    const payload = await getPayload({ config });
    const result = await payload.find({ collection: "events", limit: 0, depth: 0 });
    return result.docs.map((doc) => doc.slug);
  },
  ["event-slugs"],
  { tags: ["events"] }
);

// Caches the RAW document, not the mapped EventData — Live Preview
// (EventPageClient.tsx) needs the raw shape as `useLivePreview`'s
// `initialData`, same reasoning as every other getXBySlugRaw in this
// project (see lib/api/blog.ts's getPostBySlugRaw).
export async function getEventBySlugRaw(slug: string): Promise<Event | null> {
  return unstable_cache(
    async () => {
      const payload = await getPayload({ config });
      const result = await payload.find({ collection: "events", where: { slug: { equals: slug } }, limit: 1, depth: 1 });
      return result.docs[0] ?? null;
    },
    ["event-raw", slug],
    { tags: ["events"] }
  )();
}

export async function getEventBySlug(slug: string): Promise<EventData | null> {
  const doc = await getEventBySlugRaw(slug);
  return doc ? mapEvent(doc) : null;
}
