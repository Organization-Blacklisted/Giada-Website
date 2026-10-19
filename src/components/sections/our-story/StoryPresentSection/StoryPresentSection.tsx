import { Link } from "next-view-transitions";
import type { StoryPresentSectionProps } from "./StoryPresentSection.types";

// Ported from the real source's StoryPresent.astro: oversized centered
// stats inside a bordered strip, with the description AFTER the stats
// (not a SectionHeading description above them, as an earlier guess
// had it). No border on the section itself — the real source instead
// renders a lone `<div class="border-t">` right after it, reproduced
// here as a border-t on FoundersSection instead of a stray element.
export default function StoryPresentSection({
  eyebrow,
  heading,
  description,
  stats,
  linkLabel,
  linkHref,
  className = "",
}: StoryPresentSectionProps) {
  return (
    <section className={`bg-white px-5 py-16 md:px-10 md:py-24 lg:px-16 lg:py-28 ${className}`}>
      <div className="mx-auto max-w-4xl text-center">
        <div data-reveal className="mb-8 flex items-center justify-center gap-4">
          <span className="h-px w-12 bg-stone-300" aria-hidden="true" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-stone-500">{eyebrow}</p>
          <span className="h-px w-12 bg-stone-300" aria-hidden="true" />
        </div>
        <h2
          data-reveal
          className="mb-14 font-didot text-4xl font-normal leading-tight tracking-tight text-stone-900 md:text-5xl lg:mb-16 lg:text-6xl"
        >
          {heading}
        </h2>

        <div className="mb-14 grid grid-cols-2 gap-4 border-y border-stone-200 py-12 sm:grid-cols-4 sm:gap-8 lg:mb-16 lg:py-16">
          {stats.map((stat) => (
            <div key={stat.label} data-reveal>
              <p className="font-didot text-4xl font-normal text-stone-900 sm:text-5xl md:text-6xl lg:text-7xl">
                {stat.value}
              </p>
              <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-stone-500 sm:text-xs">{stat.label}</p>
            </div>
          ))}
        </div>

        <p data-reveal className="mx-auto mb-10 max-w-xl text-base leading-8 text-stone-600">
          {description}
        </p>

        <Link
          data-reveal
          href={linkHref}
          className="group inline-flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.25em] text-stone-900 no-underline transition-opacity duration-200 hover:opacity-60"
        >
          {linkLabel}
          <span
            aria-hidden="true"
            className="h-px w-12 origin-left bg-stone-900 transition-transform duration-300 group-hover:scale-x-125"
          />
        </Link>
      </div>
    </section>
  );
}
