import Image from "next/image";
import type { WhyGiadaSectionProps } from "./WhyGiadaSection.types";

// Ported from the real source's WhyGiada.astro — sixth section on Home,
// right after Press feature. Confirmed used exactly once across the
// whole source and fully hardcoded there (the 3 pillars are a literal
// array, zero Astro.props) — kept as a Home-only section, not a ui/
// primitive, same reasoning as every other single-usage Home section.
//
// The header (eyebrow + heading, no description) doesn't reuse
// SectionHeading here — deliberately: SectionHeading's `mb-12 lg:mb-16`
// wrapper margin is meant to sit directly above a content grid, but this
// section's real spacing between the heading and the pillar grid below
// it matches exactly what SectionHeading already provides, so it's used
// as-is with no description passed.
//
// The bottom image (press-feature-tv.webp) is real and used — this
// corrects an earlier note in "Press feature (zoom cards)" above, which
// flagged this same file as "real but unused anywhere in the source."
// That was true relative to PressFeature.astro specifically, but it
// turns out it's wired into WhyGiada.astro instead — not unused, just
// not where it was first assumed to be.
//
// `unoptimized` (2026-10-06) — same fix as ZoomCard, same root cause:
// user caught this image looking blurry on the real dev server.
// Confirmed by capturing the actual served bytes: dimensions matched
// the real 3600x2403 source exactly (no under-sizing), but the served
// file was smaller (242KB vs. the original 378KB) because next/image
// still re-encodes at quality 75 even when it doesn't need to resize
// anything. Visible here for the same reason it was visible on Press
// Feature — dense, repeating fine detail (patterned rug, book spines,
// shelf texture) that lossy WebP recompression degrades first, unlike
// CollectionSection's plain interior shot, which stayed sharp under
// standard optimization.
export default function WhyGiadaSection({
  eyebrow,
  heading,
  pillars,
  image,
  imageAlt,
  className = "",
}: WhyGiadaSectionProps) {
  return (
    <section className={`border-t border-stone-200 px-5 py-16 md:px-10 md:py-24 lg:px-16 lg:py-28 ${className}`}>
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center lg:mb-16">
          <div data-reveal className="mb-8 flex items-center justify-center gap-4">
            <span className="h-px w-12 bg-stone-300" aria-hidden="true" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-stone-400">{eyebrow}</p>
            <span className="h-px w-12 bg-stone-300" aria-hidden="true" />
          </div>
          <h2 data-reveal className="font-heading text-4xl font-normal tracking-tight text-stone-900 md:text-5xl">
            {heading}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-12">
          {pillars.map((pillar) => (
            <article
              key={pillar.title}
              data-reveal
              className="flex flex-col gap-5 border-t border-stone-200 pt-8"
            >
              <h3 className="font-heading text-xl font-normal text-stone-900 md:text-2xl">{pillar.title}</h3>
              <p className="text-sm leading-7 text-stone-600">{pillar.body}</p>
            </article>
          ))}
        </div>

        <div
          data-reveal="fade"
          className="group relative mt-12 aspect-[3600/2403] w-full overflow-hidden border border-stone-200"
        >
          <Image
            src={image}
            alt={imageAlt}
            fill
            loading="lazy"
            unoptimized
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        </div>
      </div>
    </section>
  );
}
