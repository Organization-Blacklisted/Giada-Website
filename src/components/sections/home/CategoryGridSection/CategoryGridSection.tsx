import SectionHeading from "@/components/ui/SectionHeading";
import CategoryCard from "@/components/ui/CategoryCard";
import type { CategoryGridSectionProps } from "./CategoryGridSection.types";

// Matches the real source's CategoryGrid.astro (Home page only — the
// Products page uses CategoryCard directly in its own section, see
// ProductCategoriesSection, since its chrome and behavior differ for real).
//
// Real source also sets `data-magnetic="0.2"`, `data-reveal="scale"`, and
// `data-reveal-delay="200"` (second card only) on each card wrapper there —
// verified none of the three actually does anything live: `magneticHover()`
// exists in lib/animations.ts but is never called on `[data-magnetic]`
// anywhere in the real source; the real reveal script (Layout.astro's
// initFadeReveal()) ignores both the "scale" variant and the delay
// attribute, observing each [data-reveal] element independently with no
// stagger. Matching real *behavior*, not the inert markup: plain
// `data-reveal`, no delay.
export default function CategoryGridSection({ eyebrow, heading, categories, className = "" }: CategoryGridSectionProps) {
  return (
    <section className={`border-t border-stone-200 bg-white px-5 py-16 md:px-10 md:py-24 lg:px-16 lg:py-28 ${className}`}>
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow={eyebrow} title={heading} />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {categories.map((category) => (
            <div key={category.href} data-reveal>
              <CategoryCard {...category} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
