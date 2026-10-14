"use client";

import { useLivePreview } from "@payloadcms/live-preview-react";
import ProductCategoriesSection from "@/components/sections/products/ProductCategoriesSection";
import { mapProductsData } from "@/lib/api/products-map";
import type { ProductsPage } from "@/payload-types";

// Same pattern as GalleryPageClient/ContactPageClient — the raw
// "products-page" document doesn't match ProductsPageData directly
// (Media relationships are full objects, not flattened url/width/
// height), so `mapProductsData` re-runs on every `useLivePreview`
// update. Imported from products-map.ts specifically, NOT products.ts —
// products.ts also exports getPayload-dependent code that can't be
// bundled into a Client Component.
export default function ProductsPageClient({ initialData }: { initialData: ProductsPage }) {
  const { data: raw } = useLivePreview<ProductsPage>({
    initialData,
    serverURL: typeof window !== "undefined" ? window.location.origin : "",
    depth: 2,
  });

  const data = mapProductsData(raw);

  return (
    <ProductCategoriesSection
      {...data.hero}
      categories={data.categories}
      galleryCtaLabel={data.galleryCta.label}
      galleryCtaHref={data.galleryCta.href}
    />
  );
}
