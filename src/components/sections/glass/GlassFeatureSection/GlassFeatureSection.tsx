import Image from "next/image";
import type { GlassFeatureSectionProps } from "./GlassFeatureSection.types";

// Ported from the real source's GlassLandingPage.astro "Feature" section.
export default function GlassFeatureSection({
  eyebrow,
  heading,
  description,
  image,
  imageWidth,
  imageHeight,
  imageAlt,
  className = "",
}: GlassFeatureSectionProps) {
  return (
    <section className={`bg-white px-5 pb-14 md:px-10 md:pb-16 lg:px-16 lg:pb-20 ${className}`}>
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
          <div className="flex flex-col items-center justify-center border border-stone-200 bg-white p-7 text-center md:p-9 lg:p-10">
            <div>
              <div className="mb-7 flex items-center justify-center gap-4">
                <span className="h-px w-12 bg-stone-300" aria-hidden="true" />
                <p className="text-[11px] font-medium uppercase tracking-[0.45em] text-stone-500">{eyebrow}</p>
                <span className="h-px w-12 bg-stone-300" aria-hidden="true" />
              </div>

              <h2 className="font-didot text-3xl font-normal leading-tight tracking-tight text-stone-900 md:text-4xl">
                {heading}
              </h2>

              <p className="mx-auto mt-7 max-w-xl text-[15px] leading-[1.85] text-stone-500">{description}</p>
            </div>
          </div>

          <div className="overflow-hidden bg-stone-100">
            <Image
              src={image}
              alt={imageAlt}
              width={imageWidth}
              height={imageHeight}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="h-auto w-full"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
