import type { CategoryCardProps } from "@/components/ui/CategoryCard";

export type ProductCategoryItem = Omit<CategoryCardProps, "className">;

export interface ProductCategoriesSectionProps {
  eyebrow: string;
  heading: string;
  categories: ProductCategoryItem[];
  galleryCtaLabel: string;
  galleryCtaHref: string;
  className?: string;
}
