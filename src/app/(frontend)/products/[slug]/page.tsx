import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/sections/products/ProductDetail";
import { getAllProductSlugs, getProductBySlug } from "@/lib/api/products-catalog";
import { buildPageMetadata } from "@/lib/metadata";

// Every product gets a real static page regardless of `active` —
// matches the real source's own getStaticPaths() exactly (inactive
// products stay directly reachable, just unlisted/unsearchable on /rugs).
export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  return buildPageMetadata({
    title: product.title,
    description: product.description,
    path: `/products/${slug}`,
    image: product.images[0] || undefined,
  });
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const canonicalPath = `/products/${slug}`;
  const material = [product.weavingStyle, product.composition].filter((v) => v && v !== "Custom" && v !== "none").join(", ");

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images,
    ...(material && { material }),
    offers: {
      "@type": "Offer",
      availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: canonicalPath,
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Products", item: "/products" },
      { "@type": "ListItem", position: 2, name: product.title, item: canonicalPath },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <ProductDetail
        title={product.title}
        description={product.description}
        color={product.color}
        weavingStyle={product.weavingStyle}
        composition={product.composition}
        size={product.size}
        origin={product.origin}
        collection={product.collection}
        images={product.images}
      />
    </>
  );
}
