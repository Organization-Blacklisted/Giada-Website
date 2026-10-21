import { unstable_cache } from "next/cache";
import { getPayload } from "payload";
import config from "@payload-config";
import type { ShippingPage } from "@/payload-types";
import { mapLegalDocument, type LegalDocumentData } from "./legal-map";

export * from "./legal-map";

export const getShippingRaw = unstable_cache(
  async (): Promise<ShippingPage> => {
    const payload = await getPayload({ config });
    return payload.findGlobal({ slug: "shipping-page", draft: false });
  },
  ["shipping-raw"],
  { tags: ["shipping"] }
);

export async function getShippingPage(): Promise<LegalDocumentData> {
  return mapLegalDocument(await getShippingRaw());
}
