import type { StoryHeroSectionProps } from "./StoryHeroSection.types";

// Ported from the real source's StoryHero.astro. The real source's
// cinematic wide image is commented out there (dead markup, never
// actually shown) and its GSAP char-split title animation
// (splitLineChars/charReveal) was never wired into any component
// anywhere in this project — porting it here would be new work, not an
// established pattern, so this uses the same plain `data-reveal` fade
// every other section on the site already uses instead.
export default function StoryHeroSection({
  eyebrow,
  titleLine1,
  titleLine2,
  lead,
  className = "",
}: StoryHeroSectionProps) {
  return (
    <section className={`px-5 pt-24 md:px-10 lg:px-16 lg:pt-32 ${className}`}>
      <div className="mx-auto max-w-[88rem]">
        <div data-reveal className="mb-8 flex items-center justify-center gap-4">
          <span className="h-px w-10 bg-stone-300" aria-hidden="true" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-stone-400">{eyebrow}</p>
          <span className="h-px w-10 bg-stone-300" aria-hidden="true" />
        </div>

        <h1
          data-reveal
          className="mb-8 text-center font-didot text-5xl font-normal leading-none tracking-tight text-stone-900 sm:text-6xl lg:text-7xl"
        >
          <span className="block">{titleLine1}</span>
          <span className="block">{titleLine2}</span>
        </h1>

        <p
          data-reveal
          className="mx-auto mb-14 max-w-xl text-center text-base leading-8 text-stone-500 md:text-lg md:leading-9 lg:mb-20"
        >
          {lead}
        </p>
      </div>
    </section>
  );
}
