import type { BlogHeroSectionProps } from "./BlogHeroSection.types";

// Ported from the real source's pages/blog/index.astro hero block —
// same hairline-eyebrow-hairline/h1/paragraph shape as GalleryHeroSection,
// but its own max-w-6xl wrapper (not that component's max-w-7xl) and its
// own bottom padding (pb-16/lg:pb-20, not pb-12/lg:pb-14), both matching
// the real source exactly.
export default function BlogHeroSection({ eyebrow, heading, description, className = "" }: BlogHeroSectionProps) {
  return (
    <section className={`px-5 pb-16 pt-24 md:px-10 lg:px-16 lg:pb-20 lg:pt-32 ${className}`}>
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-center gap-4">
          <span className="h-px w-10 bg-stone-300" aria-hidden="true" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-stone-400">{eyebrow}</p>
          <span className="h-px w-10 bg-stone-300" aria-hidden="true" />
        </div>

        <h1 className="text-center font-heading text-5xl font-normal leading-none tracking-tight text-stone-900 sm:text-6xl lg:text-7xl">
          {heading}
        </h1>

        <p className="mx-auto mt-8 max-w-2xl text-center text-base leading-relaxed text-stone-500 md:text-lg">
          {description}
        </p>
      </div>
    </section>
  );
}
