import Image from "next/image";
import { Link } from "next-view-transitions";
import SectionHeading from "@/components/ui/SectionHeading";
import type { ValuesSectionProps } from "./ValuesSection.types";

// New, explicitly reusable primitive — not ported from the real Astro
// source (unlike every other section in this project so far). This is
// client-provided Figma content for a new Home section ("Living Art
// Beyond Simple Decor"), explicitly requested to double as the base for
// Our Story's eventual "Values That Endure" rebuild too.
//
// Checked the real source's closest equivalent before building —
// components/our_story/StoryBeliefs.astro — confirmed it's a related
// but genuinely different layout: its image sits AFTER the item list
// (with a quote-caption overlay, no button), not before, and it has no
// button at all. Per explicit instruction, Our Story's eventual build
// keeps its own real content/copy (Authenticity/Excellence/Partnership)
// when that page is actually built — this primitive's props cover
// today's real Home usage; the image-position/caption-vs-button
// structural difference is a discussion for when Our Story is actually
// built, not resolved here.
//
// The bordered item-row layout (index | title | text per row, divided
// by top/bottom borders) is carried over from StoryBeliefs' real grid
// pattern — confirmed genuinely similar between the two, not guessed.
//
// Verified against the actual Figma file directly (2026-10-06), not
// just the earlier screenshot transcription — caught four real value
// mismatches in the process, in three separate passes (two found
// together, then width, then font-size, each only after the user caught
// it live) — which is why SectionHeading ends up with four separate
// opt-in overrides instead of one. The description needs `stone-600`
// (#57534d exactly), `max-w-[985px]`, and `16px` — not
// SectionHeading's shared stone-500/max-w-xl/15px defaults (added as
// opt-in overrides there, not changed as the defaults, since the other
// 5 real sections using it are independently confirmed correct at the
// narrower/smaller originals); and the item index ("01"/"02"/"03")
// needs `text-base` (16px) + `stone-600`, not the `text-sm`/`stone-400`
// first ported from StoryBeliefs' real index styling.
// The font-size miss specifically was a self-inflicted one: the 16px
// value was already visible in the first Figma data pull, but got
// judged "close enough" to the existing 15px and left unfixed instead
// of applied — a tolerance call the user never asked for. Lesson: when
// exact design-source values are available, apply them exactly: don't
// round differences away.
export default function ValuesSection({
  eyebrow,
  heading,
  description,
  image,
  imageAlt,
  items,
  buttonText,
  buttonLink,
  className = "",
}: ValuesSectionProps) {
  return (
    <section className={`border-t border-stone-200 bg-white px-5 py-16 md:px-10 md:py-24 lg:px-16 lg:py-28 ${className}`}>
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow={eyebrow}
          title={heading}
          description={description}
          descriptionColor="stone-600"
          descriptionMaxWidth="mx-auto max-w-[985px]"
          descriptionFontSize="16px"
        />

        <div data-reveal="scale" className="relative mb-12 aspect-[1280/520] w-full overflow-hidden lg:mb-16">
          <Image src={image} alt={imageAlt} fill unoptimized className="object-cover" />
        </div>

        <div className="border-t border-stone-200">
          {items.map((item) => (
            <article
              key={item.index}
              data-reveal
              className="grid border-b border-stone-200 py-8 md:grid-cols-[2.5rem_minmax(13rem,0.42fr)_1fr] md:items-start md:gap-x-10 md:py-10"
            >
              <p className="mb-4 font-heading text-base italic text-stone-600 md:mb-0 md:mt-1">{item.index}</p>
              <h3 className="mb-3 font-heading text-2xl font-normal italic text-stone-900 md:mb-0 md:text-3xl">
                {item.title}
              </h3>
              <p className="text-sm leading-7 text-stone-600">{item.text}</p>
            </article>
          ))}
        </div>

        {buttonText && buttonLink && (
          <div className="mt-10 flex justify-center">
            <Link
              href={buttonLink}
              className="group inline-flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.25em] text-stone-900 no-underline transition-opacity duration-200 hover:opacity-60"
            >
              {buttonText}
              <span
                aria-hidden="true"
                className="h-px w-10 origin-left bg-stone-900 transition-transform duration-300 group-hover:scale-x-125"
              />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
