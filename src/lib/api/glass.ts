import { unstable_cache } from "next/cache";
import { getPayload } from "payload";
import config from "@payload-config";
import type { GlassPage } from "@/payload-types";
import { mapGlassData, type GlassPageData } from "./glass-map";

export * from "./glass-map";

// Mirrors lib/api/gallery.ts's pattern: caches the RAW document, not the
// mapped GlassPageData — Live Preview (GlassPageClient.tsx) needs the
// raw shape as `useLivePreview`'s `initialData`. The mapping itself
// (`mapGlassData`) lives in glass-map.ts, a module with no Payload
// runtime imports, specifically so GlassPageClient.tsx (a Client
// Component) can import it directly without dragging getPayload and
// this file's other imports into the client bundle.
export const getGlassRaw = unstable_cache(
  async (): Promise<GlassPage> => {
    const payload = await getPayload({ config });
    return payload.findGlobal({ slug: "glass-page", draft: false });
  },
  ["glass-raw"],
  { tags: ["glass"] }
);

export async function getGlassPage(): Promise<GlassPageData> {
  return mapGlassData(await getGlassRaw());
}
