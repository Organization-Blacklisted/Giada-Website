import { unstable_cache } from "next/cache";
import { getPayload } from "payload";
import config from "@payload-config";
import type { Product } from "@/payload-types";
import { mapProductListItem, mapProductDetail, type ProductListItemData, type ProductDetailData } from "./products-catalog-map";

export * from "./products-catalog-map";

// Used by /rugs — only active products are listed/searchable, matching
// the real source's ProductsListing.astro filtering. `limit: 0` means
// "no limit" in Payload (~75 real products total, trivial either way).
// Tagged "products-catalog", deliberately distinct from the unrelated
// /products hub global's "products" tag (lib/api/products.ts).
export const getActiveProductsRaw = unstable_cache(
  async (): Promise<Product[]> => {
    const payload = await getPayload({ config });
    const result = await payload.find({
      collection: "products",
      where: { active: { equals: true } },
      limit: 0,
      depth: 1,
    });
    return result.docs;
  },
  ["products-active-raw"],
  { tags: ["products-catalog"] }
);

export async function getActiveProducts(): Promise<ProductListItemData[]> {
  const docs = await getActiveProductsRaw();
  return docs.map(mapProductListItem);
}

// Used by /products/[slug]'s generateStaticParams — EVERY product gets a
// real page regardless of `active`, matching the real source's own
// getStaticPaths() exactly (inactive products stay directly reachable,
// just unlisted).
export const getAllProductSlugs = unstable_cache(
  async (): Promise<string[]> => {
    const payload = await getPayload({ config });
    const result = await payload.find({
      collection: "products",
      limit: 0,
      depth: 0,
    });
    return result.docs.map((doc) => doc.slug);
  },
  ["products-all-slugs"],
  { tags: ["products-catalog"] }
);

export async function getProductBySlugRaw(slug: string): Promise<Product | null> {
  return unstable_cache(
    async () => {
      const payload = await getPayload({ config });
      const result = await payload.find({
        collection: "products",
        where: { slug: { equals: slug } },
        limit: 1,
        depth: 1,
      });
      return result.docs[0] ?? null;
    },
    ["product", slug],
    { tags: ["products-catalog"] }
  )();
}

export async function getProductBySlug(slug: string): Promise<ProductDetailData | null> {
  const doc = await getProductBySlugRaw(slug);
  return doc ? mapProductDetail(doc) : null;
}

// Used by /collaborations/[slug]'s "Selected Works" grid. Matches the
// real source's [slug].astro exactly: filters by `collection` only, NOT
// `active` — a product can be inactive (unlisted on /rugs) and still
// show up here.
export async function getProductsByCollectionSlug(collectionSlug: string): Promise<ProductListItemData[]> {
  return unstable_cache(
    async () => {
      const payload = await getPayload({ config });
      const result = await payload.find({
        collection: "products",
        where: { collection: { equals: collectionSlug } },
        limit: 0,
        depth: 1,
      });
      return result.docs.map(mapProductListItem);
    },
    ["products-by-collection", collectionSlug],
    { tags: ["products-catalog"] }
  )();
}
