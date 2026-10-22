import type { Metadata } from "next";
import ShippingPageClient from "@/components/ui/LegalDocumentSection/ShippingPageClient";
import { getShippingPage, getShippingRaw } from "@/lib/api/shipping";
import { buildPageMetadata } from "@/lib/metadata";

const DEFAULT_TITLE = "Shipping Policy";
const DEFAULT_DESCRIPTION =
  "How Giada handles production, delivery, and customs — all products are handmade to order and shipped worldwide.";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getShippingPage();
  return buildPageMetadata({
    title: seo.metaTitle || DEFAULT_TITLE,
    description: seo.metaDescription || DEFAULT_DESCRIPTION,
    path: "/shipping",
    image: seo.ogImage || undefined,
    noIndex: seo.noIndex,
  });
}

export default async function ShippingPage() {
  const raw = await getShippingRaw();

  return <ShippingPageClient initialData={raw} />;
}
