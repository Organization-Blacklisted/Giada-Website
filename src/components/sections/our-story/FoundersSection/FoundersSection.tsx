import Image from "next/image";
import type { FoundersSectionProps } from "./FoundersSection.types";

// Ported from the real source's components/about/Founders.astro. The
// `border-t` here reproduces the real source's lone `<div class="border-t">`
// sibling that follows StoryPresent.astro (Present itself renders no
// border) rather than carrying that stray element over literally.
//
// Redesigned 2026-11-05 per Figma node 1035:606: a single shared photo
// of both founders together replaces the old one-portrait-per-founder
// layout. On desktop it spans full-width above the two-column bios
// (matching Figma exactly); on mobile it sits between the two founders'
// info, per explicit request — achieved with CSS Grid placement rather
// than duplicated markup, since the shared image's one DOM position
// (between the two <article>s in source order) is already correct for
// mobile's single-column stack, and `md:row-start`/`md:col-start`
// repositions it above both columns only once the grid goes two-wide.
// 16/10 matches the Figma frame's own measured ratio (1024×640) exactly
// — same ratio GalleryWallSection already uses for "landscape" tiles.
export default function FoundersSection({
  eyebrow,
  quote,
  attribution,
  sharedImage,
  sharedImageAlt,
  people,
  className = "",
}: FoundersSectionProps) {
  const [first, second] = people;

  return (
    <section className={`border-t border-stone-200 mx-auto max-w-6xl px-5 py-16 md:px-10 md:py-24 lg:px-16 lg:py-28 ${className}`}>
      <header className="mx-auto mb-12 max-w-4xl text-center lg:mb-16">
        <div data-reveal className="mb-8 flex items-center justify-center gap-4">
          <span className="h-px w-12 bg-stone-300" aria-hidden="true" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-stone-500">{eyebrow}</p>
          <span className="h-px w-12 bg-stone-300" aria-hidden="true" />
        </div>
        <blockquote data-reveal className="m-0">
          <p className="mb-6 font-didot text-3xl font-normal leading-snug tracking-tight text-stone-900 md:text-4xl lg:text-5xl">
            {quote}
          </p>
          <footer>
            <cite className="text-xs font-semibold not-italic uppercase tracking-[0.25em] text-stone-500">
              {attribution}
            </cite>
          </footer>
        </blockquote>
      </header>

      <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-x-16 md:gap-y-16 lg:gap-x-16">
        {first && (
          <article data-reveal className="md:col-start-1 md:row-start-2">
            <h3 className="mb-2 font-didot text-2xl font-normal text-stone-900 md:text-3xl">{first.name}</h3>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-stone-500">{first.role}</p>
            <div className="my-5 h-px w-10 bg-stone-200" aria-hidden="true" />
            <p className="text-base leading-8 text-stone-600">{first.bio}</p>
          </article>
        )}

        {sharedImage && (
          <div data-reveal className="relative aspect-[16/10] w-full overflow-hidden md:col-span-2 md:row-start-1">
            <Image
              src={sharedImage}
              alt={sharedImageAlt}
              fill
              sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1023px) calc(100vw - 80px), 1152px"
              className="object-cover"
            />
          </div>
        )}

        {second && (
          <article data-reveal className="md:col-start-2 md:row-start-2">
            <h3 className="mb-2 font-didot text-2xl font-normal text-stone-900 md:text-3xl">{second.name}</h3>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-stone-500">{second.role}</p>
            <div className="my-5 h-px w-10 bg-stone-200" aria-hidden="true" />
            <p className="text-base leading-8 text-stone-600">{second.bio}</p>
          </article>
        )}
      </div>
    </section>
  );
}
