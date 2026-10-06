import type { GalleryHeroSectionProps } from "./GalleryHeroSection.types";

// Ported from the real source's pages/gallery.astro hero block. The live
// "{n} images" count that sits right under the description there is NOT
// included here — it's driven by filter state, which lives in
// GalleryWallSection (the client component right below this one), not
// here. Splitting it out this way keeps this hero a plain static server
// component, same as every other page hero in this project (FAQ,
// Contact) — matches the real source's actual coupling (count only ever
// changes alongside the filter nav/grid, never independently), just
// rendered as the first thing inside the next section instead of the
// tail end of this one.
export default function GalleryHeroSection({ eyebrow, heading, description, className = "" }: GalleryHeroSectionProps) {
  return (
    <section className={`px-5 pb-12 pt-24 md:px-10 md:pb-14 lg:px-16 lg:pt-32 ${className}`}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-center gap-4">
          <span className="h-px w-10 bg-stone-300" aria-hidden="true" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-stone-400">{eyebrow}</p>
          <span className="h-px w-10 bg-stone-300" aria-hidden="true" />
        </div>

        <h1 className="text-center font-heading text-5xl font-normal leading-none tracking-tight text-stone-900 sm:text-6xl lg:text-7xl">
          {heading}
        </h1>

        <p className="mx-auto mt-7 max-w-2xl text-center text-base leading-relaxed text-stone-500 md:text-lg">
          {description}
        </p>
      </div>
    </section>
  );
}
