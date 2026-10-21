import { unstable_cache } from "next/cache";
import { getPayload } from "payload";
import config from "@payload-config";
import type { OurStoryPage } from "@/payload-types";
import { mapOurStoryData, type OurStoryPageData } from "./our-story-map";

export * from "./our-story-map";

// Mirrors lib/api/gallery.ts's pattern: caches the RAW document, not the
// mapped OurStoryPageData — Live Preview (OurStoryPageClient.tsx) needs
// the raw shape as `useLivePreview`'s `initialData`. The mapping itself
// (`mapOurStoryData`) lives in our-story-map.ts, a module with no
// Payload runtime imports, specifically so OurStoryPageClient.tsx (a
// Client Component) can import it directly without dragging getPayload
// and this file's other imports into the client bundle.
export const getOurStoryRaw = unstable_cache(
  async (): Promise<OurStoryPage> => {
    const payload = await getPayload({ config });
    return payload.findGlobal({ slug: "our-story-page", draft: false });
  },
  ["our-story-raw"],
  { tags: ["our-story"] }
);

export async function getOurStoryPage(): Promise<OurStoryPageData> {
  return mapOurStoryData(await getOurStoryRaw());
}
