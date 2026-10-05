import { Link } from "next-view-transitions";
import CategoryCard from "@/components/ui/CategoryCard";
import type { ProductCategoriesSectionProps } from "./ProductCategoriesSection.types";

// Matches the real source's pages/products/index.astro — one section,
// not split into sub-sections, since that's genuinely how the real
// markup is structured (unlike Contact's two distinct <section>s).
// Note: the real page has no `data-reveal` anywhere on this hero text,
// unlike most other page heroes in this project (e.g. Contact, FAQ) —
// confirmed by reading the full real source, not an oversight here.
export default function ProductCategoriesSection({
  eyebrow,
  heading,
  categories,
  galleryCtaLabel,
  galleryCtaHref,
  className = "",
}: ProductCategoriesSectionProps) {
  return (
    <section className={`px-5 pb-10 pt-24 md:px-10 lg:pt-32 ${className}`}>
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center lg:mb-16">
          <div className="mb-8 flex items-center justify-center gap-4">
            <span className="h-px w-10 bg-stone-300" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-stone-400">{eyebrow}</p>
            <span className="h-px w-10 bg-stone-300" />
          </div>
          <h1 className="font-didot text-5xl font-normal leading-none tracking-tight text-stone-900 sm:text-6xl lg:text-7xl">
            {heading}
          </h1>
        </div>

        <h2 className="sr-only">All Products</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {categories.map((category) => (
            <CategoryCard key={category.href} {...category} />
          ))}
        </div>

        <p className="mt-12 text-center text-[13px] text-stone-500">
          See these pieces installed —{" "}
          <Link
            href={galleryCtaHref}
            className="text-stone-900 underline decoration-stone-300 underline-offset-2 transition-colors duration-200 hover:decoration-stone-600"
          >
            {galleryCtaLabel}
          </Link>
        </p>
      </div>
    </section>
  );
}
