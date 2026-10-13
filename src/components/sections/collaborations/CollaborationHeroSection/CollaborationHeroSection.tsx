import Image from "next/image";
import { Link } from "next-view-transitions";
import type { CollaborationHeroSectionProps } from "./CollaborationHeroSection.types";

// Ported from the real source's CollaborationDetail.astro hero. The
// real "no heroImage" hatch-pattern fallback isn't ported — `heroImage`
// is required on the Collaborations global's items, so that branch
// can't occur here.
export default function CollaborationHeroSection({ name, tagline, heroImage }: CollaborationHeroSectionProps) {
  return (
    <section className="relative flex min-h-[95vh] flex-col justify-between overflow-hidden">
      <div className="absolute inset-0">
        <Image src={heroImage} alt={name} fill sizes="100vw" priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/40 via-transparent to-stone-950/90" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 px-5 pt-24 md:px-10 lg:px-16 lg:pt-32">
        <nav className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-white" aria-label="Breadcrumb">
          <Link href="/collaborations" className="transition-colors duration-200 hover:text-white">
            Collaborations
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-white">{name}</span>
        </nav>
      </div>

      <div className="relative z-10 px-5 pb-16 md:px-10 md:pb-20 lg:px-16 lg:pb-24">
        <div className="mx-auto max-w-5xl">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-stone-300">Collaboration</p>
          <h1
            data-reveal
            className="font-didot text-5xl font-normal leading-[1.0] tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-[5.5rem]"
          >
            {name}
          </h1>
          {tagline && (
            <p data-reveal className="mt-5 max-w-md text-[16px] leading-[1.8] text-stone-300">
              {tagline}
            </p>
          )}

          <div data-reveal className="mt-10 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-stone-400">
            <span>Scroll to explore</span>
            <svg
              className="scroll-down-arrow size-3.5 text-stone-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
