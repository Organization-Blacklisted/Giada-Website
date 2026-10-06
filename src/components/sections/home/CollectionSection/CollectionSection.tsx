import Image from "next/image";
import { Link } from "next-view-transitions";
import type { CollectionSectionProps } from "./CollectionSection.types";

// Ported from the real source's Collection.astro (imported there as
// `ImageWithText`) — appears right after the hero in real page order.
// Confirmed only one real usage site across the whole source (Home,
// `reverse` never set to true) despite being built with reusable-looking
// props — kept as a Home-only section rather than a ui/ primitive for
// that reason, same call as HeroSlideshowSection. The props stay real
// (subheading/button/reverse all genuinely exist in the source), so
// promoting this later if a second usage shows up is a non-event.
//
// `reverse` fixed, not ported as-is: the real source applies the same
// `md:order-1` to BOTH the image and text wrapper when `reverse` is
// true, which doesn't actually reorder anything (both end up tied at
// order 1). Dormant bug, not a real-behavior deviation — `reverse` is
// never exercised on the live site, so there's no confirmed live
// behavior to preserve faithfully here, just an unexercised code path
// worth implementing correctly rather than copying a bug nobody's ever
// seen trigger.
//
// `subheading` matching the Hero's own eyebrow text ("From Our Atelier
// to Your Vision") is confirmed real, not a copy-paste mistake — the
// real site shows the same line twice in a row, by design.
//
// Image uses real `width`/`height`, NOT `fill` (2026-10-06 fix) — user
// caught the image rendering visibly shorter than live. Root cause
// confirmed by measuring both directly: same width (541px) on both, but
// live's image column was 631px tall vs. our 484px — both builds'
// image/text columns matched each other within themselves (confirming
// CSS Grid `items-stretch` itself works correctly in both), and the
// text content/wrapping was pixel-identical between builds too — so the
// row's natural height genuinely comes from the image, not the text.
// `fill` makes the underlying `<img>` `position: absolute`, which
// contributes zero intrinsic size for Grid's `auto` row-height
// calculation to work with. The real source's `<Image width={1200}
// height={1400} class="h-full w-full object-cover">` keeps the `<img>`
// in normal flow with real HTML width/height attributes — modern
// browsers imply an `aspect-ratio` from those for layout purposes, and
// Grid's auto-sizing genuinely accounts for it, which is what was
// stretching the real row taller. Switched to match: real width/height
// props instead of `fill`, `h-full w-full object-cover` instead of
// `absolute inset-0`.
export default function CollectionSection({
  image,
  alt,
  heading,
  subheading,
  description,
  buttonText,
  buttonLink,
  reverse = false,
  className = "",
}: CollectionSectionProps) {
  return (
    <section
      className={`flex justify-center border-t border-stone-200 px-5 py-16 md:px-10 md:py-24 lg:px-16 lg:py-28 ${className}`}
    >
      <div className="grid w-full max-w-6xl grid-cols-1 items-stretch gap-0 md:grid-cols-2">
        <div
          data-reveal
          className={`flex h-full w-full justify-center ${reverse ? "md:order-2" : ""}`}
        >
          <div className="relative aspect-[5/6] w-[94%] overflow-hidden md:aspect-auto md:h-full">
            <Image
              src={image}
              alt={alt}
              width={1200}
              height={1400}
              sizes="(max-width: 768px) 94vw, 50vw"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div
          data-reveal
          className={`mt-10 flex h-full w-full justify-center md:mt-0 ${reverse ? "md:order-1" : ""}`}
        >
          <div className="flex h-full w-full max-w-lg flex-col justify-center px-6 text-center md:px-10 lg:px-12">
            {subheading && (
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-stone-400">
                {subheading}
              </p>
            )}

            <h2 className="font-heading text-3xl font-normal tracking-tight text-stone-900 md:text-4xl lg:text-5xl">
              {heading}
            </h2>

            <div className="mx-auto mb-0 mt-5 h-px w-10 bg-stone-300" aria-hidden="true" />

            <div className="mx-auto mt-6 max-w-sm space-y-5 whitespace-pre-line text-[15px] leading-[1.85] text-stone-600 md:text-base">
              <p>{description}</p>
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
        </div>
      </div>
    </section>
  );
}
