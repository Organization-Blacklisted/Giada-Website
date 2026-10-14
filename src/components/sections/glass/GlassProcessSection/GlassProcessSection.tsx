import type { GlassProcessSectionProps } from "./GlassProcessSection.types";

// Ported from the real source's GlassLandingPage.astro "Process" section.
// Step numbering ("01"-"04") is derived from array order, not stored.
export default function GlassProcessSection({ eyebrow, heading, steps, className = "" }: GlassProcessSectionProps) {
  return (
    <section className={`border-y border-stone-200 bg-white px-5 py-14 md:px-10 md:py-16 lg:px-16 lg:py-20 ${className}`}>
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
        </div>

        <div className="divide-y divide-stone-200 border-y border-stone-200">
          {steps.map((step, index) => (
            <div key={step.title} className="grid gap-5 py-8 md:grid-cols-[80px_1fr_2fr] md:gap-8 md:py-9">
              <p className="font-didot text-[13px] tracking-widest text-stone-300">
                {String(index + 1).padStart(2, "0")}
              </p>

              <h3 className="font-didot text-xl font-normal leading-tight text-stone-900">{step.title}</h3>

              <p className="text-[14px] leading-[1.8] text-stone-500">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
