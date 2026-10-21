import { unstable_cache } from "next/cache";
import { getPayload } from "payload";
import config from "@payload-config";
import type { TermsPage } from "@/payload-types";
import { mapLegalDocument, type LegalDocumentData } from "./legal-map";

export * from "./legal-map";

export const getTermsRaw = unstable_cache(
  async (): Promise<TermsPage> => {
    const payload = await getPayload({ config });
    return payload.findGlobal({ slug: "terms-page", draft: false });
  },
  ["terms-raw"],
  { tags: ["terms"] }
);

export async function getTermsPage(): Promise<LegalDocumentData> {
  return mapLegalDocument(await getTermsRaw());
}
