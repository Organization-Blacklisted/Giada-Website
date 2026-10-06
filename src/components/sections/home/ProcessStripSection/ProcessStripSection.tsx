import SectionHeading from "@/components/ui/SectionHeading";
import type { ProcessStripSectionProps } from "./ProcessStripSection.types";

// Ported from the real source's ProcessStrip.astro — fourth section on
// Home, right after Category grid. Fully hardcoded in the real source
// (the 5 steps are a literal array, zero Astro.props referenced) and
// confirmed used exactly once across the whole site — kept as a
// Home-only section, not a ui/ primitive, same reasoning as
// HeroSlideshowSection/CollectionSection. The header reuses
// SectionHeading (eyebrow/heading/description matches that pattern
// exactly, same as PressFeatureSection/CategoryGridSection); the step
// grid itself is unique Home content, not worth abstracting for a
// single real usage.
export default function ProcessStripSection({
  eyebrow,
  heading,
  description,
  steps,
  className = "",
}: ProcessStripSectionProps) {
  return (
    <section className={`border-t border-stone-200 bg-white px-5 py-16 md:px-10 md:py-24 lg:px-16 lg:py-28 ${className}`}>
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow={eyebrow} title={heading} description={description} />

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((item) => (
            <article
              key={item.step}
              data-reveal
              className="flex flex-col gap-4 border-t border-stone-300 pt-6"
            >
              <p className="font-heading text-sm italic text-stone-400">{item.step}</p>
              <h3 className="font-heading text-lg font-normal text-stone-900">{item.title}</h3>
              <p className="text-sm leading-7 text-stone-600">{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
