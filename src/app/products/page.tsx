import ProductCategoriesSection from "@/components/sections/products/ProductCategoriesSection";
import { getProductsPage } from "@/lib/api/products";

export const metadata = {
  title: "Products",
  description: "Explore Giada's handcrafted rugs and art glass, each made to order.",
};

export default async function ProductsPage() {
  const { hero, categories, galleryCta } = await getProductsPage();

  return (
    <ProductCategoriesSection
      {...hero}
      categories={categories}
      galleryCtaLabel={galleryCta.label}
      galleryCtaHref={galleryCta.href}
    />
  );
}
