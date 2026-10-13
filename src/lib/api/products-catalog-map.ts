// Pure mapping logic for the Rugs catalog (the `products` Payload
// COLLECTION, ~75 real items — collections/Products.ts), kept under this
// name specifically to avoid colliding with lib/api/products-map.ts,
// which is the UNRELATED `products-page` GLOBAL's mapper (the /products
// hub's hero + category cards). Split from products-catalog.ts (the
// getPayload-dependent fetchers) for the same reason as every other
// lib/api/<page>-map.ts split in this project — organizational
// consistency here, since catalog pages don't use Live Preview.
import type { Product, Media } from "@/payload-types";

function mediaUrl(image: number | Media | null | undefined): string {
  return typeof image === "object" && image !== null ? (image.url ?? "") : "";
}

// Matches the real source's ProductsListing.astro's own flattened card
// object exactly — slug/title/category/inStock/weavingStyle/collection/
// color/composition/size/coverImage — used both for rendering the grid
// and as the basis for the client-side filter/search logic.
export type ProductListItemData = {
  slug: string;
  title: string;
  category: string;
  inStock: boolean;
  weavingStyle: string;
  collection: string;
  color: string;
  composition: string;
  size: string;
  coverImage: string;
};

export function mapProductListItem(product: Product): ProductListItemData {
  return {
    slug: product.slug,
    title: product.title,
    category: product.category,
    inStock: product.inStock ?? false,
    weavingStyle: product.weavingStyle ?? "",
    collection: product.collection ?? "",
    color: product.color ?? "",
    composition: product.composition ?? "",
    size: product.size ?? "",
    coverImage: mediaUrl(product.images?.[0]?.image),
  };
}

export type ProductDetailData = {
  slug: string;
  title: string;
  description: string;
  color: string;
  weavingStyle: string;
  composition: string;
  size: string;
  origin: string;
  // Raw string, deliberately unvalidated against real Collaborations
  // entries — matches the real source's ProductDetail.astro exactly,
  // "Traverse" 404 included (see collections/Products.ts's comment).
  collection: string;
  inStock: boolean;
  images: string[];
};

export function mapProductDetail(product: Product): ProductDetailData {
  return {
    slug: product.slug,
    title: product.title,
    description: product.description,
    color: product.color ?? "",
    weavingStyle: product.weavingStyle ?? "",
    composition: product.composition ?? "",
    size: product.size ?? "",
    origin: product.origin ?? "India",
    collection: product.collection && product.collection !== "none" ? product.collection : "",
    inStock: product.inStock ?? false,
    images: (product.images ?? []).map((item) => mediaUrl(item.image)).filter(Boolean),
  };
}
