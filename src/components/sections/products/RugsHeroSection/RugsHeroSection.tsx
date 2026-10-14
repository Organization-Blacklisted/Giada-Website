import { Link } from "next-view-transitions";
import type { RugsHeroSectionProps } from "./RugsHeroSection.types";

// Ported from the real source's pages/rugs.astro hero block.
export default function RugsHeroSection({ eyebrow, heading, description, className = "" }: RugsHeroSectionProps) {
  return (
    <section className={`px-5 pb-12 pt-24 md:px-10 lg:px-16 lg:pt-32 ${className}`}>
      <div className="relative mx-auto max-w-5xl text-center">
        <div className="mb-8 flex items-center justify-center gap-4">
          <span className="h-px w-10 bg-stone-300" aria-hidden="true" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-stone-400">{eyebrow}</p>
          <span className="h-px w-10 bg-stone-300" aria-hidden="true" />
        </div>
        <h1 className="font-didot text-5xl font-normal leading-none tracking-tight text-stone-900 sm:text-6xl lg:text-7xl">
          {heading}
        </h1>
        <p className="mx-auto mt-6 max-w-md text-[14px] leading-[1.8] text-stone-500">{description}</p>
        <div className="mt-8">
          <Link href="/products" className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-400 transition-colors hover:text-stone-700">
            ← All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
