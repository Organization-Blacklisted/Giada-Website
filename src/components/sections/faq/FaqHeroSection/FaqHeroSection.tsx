import type { FaqHeroSectionProps } from "./FaqHeroSection.types";

// pt-24 lg:pt-32 clears the fixed navbar, confirmed pattern (see
// ARCHITECTURE.md "Architecture fact worth remembering for every future page").
export default function FaqHeroSection({ eyebrow, heading, className = "" }: FaqHeroSectionProps) {
  return (
    <section className={`px-5 pb-16 pt-24 md:px-10 lg:px-16 lg:pt-32 ${className}`}>
      <div className="relative mx-auto max-w-5xl text-center">
        <div className="mb-8 flex items-center justify-center gap-4">
          <span className="h-px w-10 bg-stone-300" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-stone-400">{eyebrow}</p>
          <span className="h-px w-10 bg-stone-300" />
        </div>
        <h1 className="font-heading text-5xl font-normal leading-none tracking-tight text-stone-900 sm:text-6xl lg:text-7xl">
          {heading}
        </h1>
      </div>
    </section>
  );
}
