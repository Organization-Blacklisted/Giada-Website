import { unstable_cache } from "next/cache";
import { getPayload } from "payload";
import config from "@payload-config";
import type { GalleryPage } from "@/payload-types";
import { mapGalleryData, type GalleryPageData } from "./gallery-map";

export * from "./gallery-map";

// Mirrors lib/api/home.ts's pattern: caches the RAW document, not the
// mapped GalleryPageData — Live Preview (GalleryPageClient.tsx) needs
// the raw shape as `useLivePreview`'s `initialData`, since the live
// updates it receives via postMessage from the admin iframe are also
// raw (unmapped) documents. The mapping itself (`mapGalleryData`) lives
// in gallery-map.ts, a module with no Payload runtime imports,
// specifically so GalleryPageClient.tsx (a Client Component) can import
// it directly without dragging getPayload/this file's other imports
// into the client bundle.
export const getGalleryRaw = unstable_cache(
  async (): Promise<GalleryPage> => {
    const payload = await getPayload({ config });
    return payload.findGlobal({ slug: "gallery-page", draft: false });
  },
  ["gallery-raw"],
  { tags: ["gallery"] }
);

export async function getGalleryPage(): Promise<GalleryPageData> {
  return mapGalleryData(await getGalleryRaw());
}
