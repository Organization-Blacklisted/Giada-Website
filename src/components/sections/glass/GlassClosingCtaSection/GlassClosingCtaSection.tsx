import Image from "next/image";
import { Link } from "next-view-transitions";
import type { GlassClosingCtaSectionProps } from "./GlassClosingCtaSection.types";

// Ported from the real source's GlassLandingPage.astro closing CTA —
// deliberately NOT the shared ContactCtaBanner primitive, since this
// section's two-column text-card + image layout is genuinely different
// from that component's centered single-column strip.
export default function GlassClosingCtaSection({
  eyebrow,
  heading,
  description,
  linkText,
  image,
  imageWidth,
  imageHeight,
  imageAlt,
  className = "",
}: GlassClosingCtaSectionProps) {
  return (
    <section className={`border-t border-stone-200 bg-white px-5 py-14 md:px-10 md:py-16 lg:px-16 lg:py-20 ${className}`}>
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-5 lg:grid-cols-2 lg:items-stretch">
          <div className="flex min-h-[460px] flex-col items-center justify-center border border-stone-200 bg-white p-8 text-center md:p-12 lg:p-14">
            <div>
              <div className="mb-7 flex items-center justify-center gap-4">
                <span className="h-px w-12 bg-stone-300" aria-hidden="true" />
                <p className="text-[11px] font-medium uppercase tracking-[0.45em] text-stone-500">{eyebrow}</p>
                <span className="h-px w-12 bg-stone-300" aria-hidden="true" />
              </div>

              <h2 className="font-didot text-4xl font-normal leading-tight tracking-tight text-stone-900 md:text-5xl">
                {heading}
              </h2>

              <p className="mx-auto mt-7 max-w-xl text-[15px] leading-[1.85] text-stone-500">{description}</p>

              <Link
                href="/contact"
                className="group mt-9 inline-flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.25em] text-stone-900 no-underline"
              >
                {linkText}
                <span
                  aria-hidden="true"
                  className="h-px w-10 origin-left bg-stone-900 transition-transform duration-300 group-hover:scale-x-125"
                />
              </Link>
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
