import { unstable_cache } from "next/cache";
import { getPayload } from "payload";
import config from "@payload-config";
import type { ContactPage } from "@/payload-types";
import { mapContactData, type ContactPageData } from "./contact-map";

export * from "./contact-map";

// Mirrors lib/api/home.ts's pattern: caches the RAW document, not the
// mapped ContactPageData — Live Preview (ContactPageClient.tsx) needs
// the raw shape as `useLivePreview`'s `initialData`. The mapping itself
// (`mapContactData`) lives in contact-map.ts, a module with no Payload
// runtime imports, specifically so ContactPageClient.tsx (a Client
// Component) can import it directly without dragging getPayload/this
// file's other imports into the client bundle.
export const getContactRaw = unstable_cache(
  async (): Promise<ContactPage> => {
    const payload = await getPayload({ config });
    return payload.findGlobal({ slug: "contact-page", draft: false });
  },
  ["contact-raw"],
  { tags: ["contact"] }
);

export async function getContactPage(): Promise<ContactPageData> {
  return mapContactData(await getContactRaw());
}
