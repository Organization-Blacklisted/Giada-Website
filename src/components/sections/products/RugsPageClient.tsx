"use client";

import { useLivePreview } from "@payloadcms/live-preview-react";
import RugsHeroSection from "@/components/sections/products/RugsHeroSection";
import RugsListing from "@/components/sections/products/RugsListing";
import ContactCtaBanner from "@/components/ui/ContactCtaBanner";
import { mapRugsData } from "@/lib/api/rugs-map";
import type { ProductListItemData } from "@/lib/api/products-catalog-map";
import type { RugsPage } from "@/payload-types";

// Live Preview only covers this page's own hero/CTA copy (the
// `rugs-page` global) — the actual product list is plain server-fetched
// data, not live-previewed, since editing happens on each product's own
// document in the Products collection, not here.
export default function RugsPageClient({
  initialData,
  products,
}: {
  initialData: RugsPage;
  products: ProductListItemData[];
}) {
  const { data: raw } = useLivePreview<RugsPage>({
    initialData,
    serverURL: typeof window !== "undefined" ? window.location.origin : "",
    depth: 2,
  });

  const data = mapRugsData(raw);

  return (
    <>
      <RugsHeroSection {...data.hero} />
      <RugsListing products={products} defaultCategory="Rug" />
      <ContactCtaBanner {...data.closingCta} />
    </>
  );
}
