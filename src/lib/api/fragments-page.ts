import { unstable_cache } from "next/cache";
import { getPayload } from "payload";
import config from "@payload-config";
import type { FragmentsPage } from "@/payload-types";
import { mapFragmentsPage, type FragmentsPageData } from "./fragments-page-map";

export * from "./fragments-page-map";

// Mirrors lib/api/our-story.ts's pattern: caches the RAW document, not
// the mapped FragmentsPageData, in case a future Live Preview client
// needs the raw shape as `useLivePreview`'s `initialData`.
export const getFragmentsPageRaw = unstable_cache(
  async (): Promise<FragmentsPage> => {
    const payload = await getPayload({ config });
    return payload.findGlobal({ slug: "fragments-page", draft: false });
  },
  ["fragments-page-raw"],
  { tags: ["fragments-page"] }
);

export async function getFragmentsPage(): Promise<FragmentsPageData> {
  return mapFragmentsPage(await getFragmentsPageRaw());
}
