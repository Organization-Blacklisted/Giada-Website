import { unstable_cache } from "next/cache";
import { getPayload } from "payload";
import config from "@payload-config";
import type { ProductsPage } from "@/payload-types";
import { mapProductsData, type ProductsPageData } from "./products-map";

export * from "./products-map";

// The /products hub page's own content (hero + category cards + gallery
// CTA) — the `products-page` GLOBAL, not the Rugs catalog collection
// (see lib/api/products-catalog.ts for that).
export const getProductsRaw = unstable_cache(
  async (): Promise<ProductsPage> => {
    const payload = await getPayload({ config });
    return payload.findGlobal({ slug: "products-page", draft: false });
  },
  ["products-raw"],
  { tags: ["products"] }
);

export async function getProductsPage(): Promise<ProductsPageData> {
  return mapProductsData(await getProductsRaw());
}
