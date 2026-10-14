import type { GlassTechSpecsSectionProps } from "./GlassTechSpecsSection.types";

// Ported from the real source's GlassLandingPage.astro "Technical
// Specifications" section.
export default function GlassTechSpecsSection({
  eyebrow,
  heading,
  description,
  specs,
  className = "",
}: GlassTechSpecsSectionProps) {
  return (
    <section className={`bg-white px-5 py-14 md:px-10 md:py-16 lg:px-16 lg:py-20 ${className}`}>
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <div className="mb-7 flex items-center justify-center gap-4">
            <span className="h-px w-12 bg-stone-300" aria-hidden="true" />
            <p className="text-[11px] font-medium uppercase tracking-[0.45em] text-stone-500">{eyebrow}</p>
            <span className="h-px w-12 bg-stone-300" aria-hidden="true" />
          </div>

          <h2 className="font-didot text-3xl font-normal leading-tight tracking-tight text-stone-900 md:text-4xl">
            {heading}
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-[1.85] text-stone-500">{description}</p>
        </div>

        <div className="grid gap-px border border-stone-200 bg-stone-200 sm:grid-cols-2 lg:grid-cols-3">
          {specs.map((spec) => (
            <div key={spec.label} className="min-h-[135px] bg-white px-6 py-7 transition-colors duration-300 hover:bg-stone-50">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-stone-400">{spec.label}</p>

              <p className="mt-3 text-[14px] leading-[1.65] text-stone-800">{spec.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
