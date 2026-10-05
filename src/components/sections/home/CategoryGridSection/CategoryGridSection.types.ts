import type { CategoryCardProps } from "@/components/ui/CategoryCard";

export type CategoryGridItem = Omit<CategoryCardProps, "className">;

export interface CategoryGridSectionProps {
  eyebrow: string;
  heading: string;
  categories: CategoryGridItem[];
  className?: string;
}
