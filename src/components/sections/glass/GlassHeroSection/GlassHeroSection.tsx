import Image from "next/image";
import { Link } from "next-view-transitions";
import type { GlassHeroSectionProps } from "./GlassHeroSection.types";

// Ported from the real source's GlassLandingPage.astro hero block,
// including its "Register Interest" CTA + "Coming Soon" badge pair and
// the 3-image triptych rendered at native aspect ratio (not cropped).
export default function GlassHeroSection({
  eyebrow,
  heading,
  lead,
  ctaLabel,
  badgeLabel,
  images,
  className = "",
}: GlassHeroSectionProps) {
  return (
    <section className={`bg-white px-5 pb-14 pt-24 md:px-10 md:pb-16 lg:px-16 lg:pb-20 lg:pt-32 ${className}`}>
      <div className="mx-auto max-w-[88rem]">
        <div className="mb-8 flex items-center justify-center gap-4">
          <span className="h-px w-10 bg-stone-300" aria-hidden="true" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-stone-400">{eyebrow}</p>
          <span className="h-px w-10 bg-stone-300" aria-hidden="true" />
        </div>

        <h1 className="mb-10 text-center font-didot text-4xl font-normal leading-tight tracking-tight text-stone-900 sm:text-5xl lg:mb-14 lg:text-7xl">
          <span className="block">{heading}</span>
        </h1>

        <p className="mx-auto mb-8 max-w-xl text-center text-base leading-8 text-stone-500 md:text-lg md:leading-9">
          {lead}
        </p>

        <div className="mb-14 flex flex-col items-center justify-center gap-4 sm:flex-row lg:mb-16">
          <Link
            href="/contact"
            className="inline-flex items-center gap-4 border border-stone-900 bg-stone-900 px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-white transition-colors duration-300 hover:bg-stone-700"
          >
            {ctaLabel}
            <span aria-hidden="true">→</span>
          </Link>

          <span className="inline-flex border border-stone-300 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.35em] text-stone-500">
            {badgeLabel}
          </span>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {images.map((item) => (
            <div key={item.image} className="overflow-hidden bg-stone-100">
              <Image
                src={item.image}
                alt={item.alt}
                width={item.imageWidth}
                height={item.imageHeight}
                sizes="(max-width: 768px) 100vw, 33vw"
                className="h-auto w-full"
                loading="eager"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
