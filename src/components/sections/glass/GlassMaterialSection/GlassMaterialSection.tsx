import type { GlassMaterialSectionProps } from "./GlassMaterialSection.types";

// Ported from the real source's GlassLandingPage.astro "Material" section.
export default function GlassMaterialSection({
  eyebrow,
  heading,
  pullQuote,
  paragraph1,
  paragraph2,
  className = "",
}: GlassMaterialSectionProps) {
  return (
    <section className={`bg-white px-5 py-14 md:px-10 md:py-16 lg:px-16 lg:py-20 ${className}`}>
      <div className="mx-auto max-w-6xl border-t border-stone-200 pt-14 md:pt-16 lg:pt-20">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <div className="mb-7 flex items-center justify-center gap-4">
            <span className="h-px w-12 bg-stone-300" aria-hidden="true" />
            <p className="text-[11px] font-medium uppercase tracking-[0.45em] text-stone-500">{eyebrow}</p>
            <span className="h-px w-12 bg-stone-300" aria-hidden="true" />
          </div>

          <h2 className="font-didot text-3xl font-normal leading-tight tracking-tight text-stone-900 md:text-4xl">
            {heading}
          </h2>
        </div>

        <p className="mx-auto max-w-3xl text-center font-didot text-2xl font-normal leading-[1.55] tracking-tight text-stone-900 md:text-3xl">
          {pullQuote}
        </p>

        <div className="mx-auto mt-10 grid max-w-4xl gap-7 md:grid-cols-2">
          <p className="text-[15px] leading-[1.85] text-stone-500">{paragraph1}</p>
          <p className="text-[15px] leading-[1.85] text-stone-500">{paragraph2}</p>
        </div>
      </div>
    </section>
  );
}
