import { unstable_cache } from "next/cache";
import { getPayload } from "payload";
import config from "@payload-config";
import type { RugsPage } from "@/payload-types";
import { mapRugsData, type RugsPageData } from "./rugs-map";

export * from "./rugs-map";

export const getRugsRaw = unstable_cache(
  async (): Promise<RugsPage> => {
    const payload = await getPayload({ config });
    return payload.findGlobal({ slug: "rugs-page", draft: false });
  },
  ["rugs-raw"],
  { tags: ["rugs"] }
);

export async function getRugsPage(): Promise<RugsPageData> {
  return mapRugsData(await getRugsRaw());
}
