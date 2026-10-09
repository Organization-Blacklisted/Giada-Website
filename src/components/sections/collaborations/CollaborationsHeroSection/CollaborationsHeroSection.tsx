import type { CollaborationsHeroSectionProps } from "./CollaborationsHeroSection.types";

// Ported from the real source's pages/collaborations/index.astro hero block.
export default function CollaborationsHeroSection({
  eyebrow,
  heading,
  subheadline,
  className = "",
}: CollaborationsHeroSectionProps) {
  return (
    <section className={`relative overflow-hidden px-5 pb-16 pt-24 md:px-10 lg:px-16 lg:pb-20 lg:pt-32 ${className}`}>
      <div className="mx-auto max-w-6xl text-center">
        <div data-reveal className="mb-8 flex items-center justify-center gap-4">
          <span className="h-px w-10 bg-stone-300" aria-hidden="true" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-stone-400">{eyebrow}</p>
          <span className="h-px w-10 bg-stone-300" aria-hidden="true" />
        </div>

        <h1 data-reveal className="font-didot text-5xl font-normal leading-none tracking-tight text-stone-900 sm:text-6xl lg:text-7xl">
          {heading}
        </h1>

        <p data-reveal className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-stone-500 md:text-lg">
          {subheadline}
        </p>
      </div>
    </section>
  );
}
