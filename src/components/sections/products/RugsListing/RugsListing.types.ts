import type { ProductListItemData } from "@/lib/api/products-catalog-map";

export type { ProductListItemData };

export interface RugsListingProps {
  products: ProductListItemData[];
  defaultCategory?: string;
  className?: string;
}

export type FilterGroupKey = "weavingStyle" | "composition" | "size";
