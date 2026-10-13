import { unstable_cache } from "next/cache";
import { getPayload } from "payload";
import config from "@payload-config";
import type { OfEarthAndLightPage } from "@/payload-types";
import { mapOfEarthAndLightPage, type OfEarthAndLightPageData } from "./of-earth-and-light-page-map";

export * from "./of-earth-and-light-page-map";

export const getOfEarthAndLightPageRaw = unstable_cache(
  async (): Promise<OfEarthAndLightPage> => {
    const payload = await getPayload({ config });
    return payload.findGlobal({ slug: "of-earth-and-light-page", draft: false });
  },
  ["of-earth-and-light-page-raw"],
  { tags: ["of-earth-and-light-page"] }
);

export async function getOfEarthAndLightPage(): Promise<OfEarthAndLightPageData> {
  return mapOfEarthAndLightPage(await getOfEarthAndLightPageRaw());
}
