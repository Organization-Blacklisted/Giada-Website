import type { Metadata } from "next";
import ProductsPageClient from "@/components/sections/products/ProductsPageClient";
import { getProductsPage, getProductsRaw } from "@/lib/api/products";
import { buildPageMetadata } from "@/lib/metadata";

const DEFAULT_TITLE = "Products";
const DEFAULT_DESCRIPTION = "Explore Giada's handcrafted rugs and art glass, each made to order.";

// CMS-editable now (the "SEO" tab on the products-page global) — these
// constants stay as the fallback when those fields are left blank, same
// real copy this page always had before the SEO tab existed.
export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getProductsPage();
  return buildPageMetadata({
    title: seo.metaTitle || DEFAULT_TITLE,
    description: seo.metaDescription || DEFAULT_DESCRIPTION,
    path: "/products",
    image: seo.ogImage || undefined,
    noIndex: seo.noIndex,
  });
}

export default async function ProductsPage() {
  const raw = await getProductsRaw();

  return <ProductsPageClient initialData={raw} />;
}
