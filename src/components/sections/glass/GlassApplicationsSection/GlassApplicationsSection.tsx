import type { GlassApplicationsSectionProps } from "./GlassApplicationsSection.types";

// Ported from the real source's GlassLandingPage.astro "Applications"
// section. The "01"-"04" numbering isn't a stored field — it's derived
// from each row's own array order, same reasoning as Gallery never
// storing a computed `shape`.
export default function GlassApplicationsSection({
  eyebrow,
  heading,
  description,
  items,
  className = "",
}: GlassApplicationsSectionProps) {
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

          <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-[1.85] text-stone-500">{description}</p>
        </div>

        <div className="grid gap-px border border-stone-200 bg-stone-200 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => (
            <article
              key={item.label}
              className="group flex min-h-[270px] flex-col bg-white p-7 transition-colors duration-300 hover:bg-stone-50 md:p-8"
            >
              <p className="font-didot text-[13px] tracking-widest text-stone-300">
                {String(index + 1).padStart(2, "0")}
              </p>

              <h3 className="mt-7 font-didot text-2xl font-normal leading-tight text-stone-900">{item.label}</h3>

              <p className="mt-5 text-[14px] leading-[1.75] text-stone-500">{item.body}</p>

              <div className="mt-auto pt-8">
                <div className="h-px w-10 bg-stone-300 transition-all duration-300 group-hover:w-16 group-hover:bg-stone-900" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
