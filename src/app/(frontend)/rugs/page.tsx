import type { Metadata } from "next";
import RugsPageClient from "@/components/sections/products/RugsPageClient";
import { getRugsPage, getRugsRaw } from "@/lib/api/rugs";
import { getActiveProducts } from "@/lib/api/products-catalog";

const DEFAULT_TITLE = "Rugs";
const DEFAULT_DESCRIPTION = "Explore Giada's handcrafted rugs, each made to order in our family-owned mill in India.";

// CMS-editable now (the "SEO" tab on the rugs-page global) — these
// constants stay as the fallback when those fields are left blank, same
// real copy this page always had before the SEO tab existed.
export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getRugsPage();
  return {
    title: seo.metaTitle || DEFAULT_TITLE,
    description: seo.metaDescription || DEFAULT_DESCRIPTION,
    ...(seo.ogImage ? { openGraph: { images: [{ url: seo.ogImage }] } } : {}),
    ...(seo.noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function RugsPage() {
  const [raw, products] = await Promise.all([getRugsRaw(), getActiveProducts()]);

  return <RugsPageClient initialData={raw} products={products} />;
}
