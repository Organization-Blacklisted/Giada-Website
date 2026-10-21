import { unstable_cache } from "next/cache";
import { getPayload } from "payload";
import config from "@payload-config";
import type { PrivacyPage } from "@/payload-types";
import { mapLegalDocument, type LegalDocumentData } from "./legal-map";

export * from "./legal-map";

export const getPrivacyRaw = unstable_cache(
  async (): Promise<PrivacyPage> => {
    const payload = await getPayload({ config });
    return payload.findGlobal({ slug: "privacy-page", draft: false });
  },
  ["privacy-raw"],
  { tags: ["privacy"] }
);

export async function getPrivacyPage(): Promise<LegalDocumentData> {
  return mapLegalDocument(await getPrivacyRaw());
}
