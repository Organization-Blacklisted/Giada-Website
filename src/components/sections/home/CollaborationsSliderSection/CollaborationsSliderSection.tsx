"use client";

import { useCallback, useSyncExternalStore } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import Image from "next/image";
import { Link } from "next-view-transitions";
import type { CollaborationsSliderSectionProps } from "./CollaborationsSliderSection.types";

const AUTOPLAY_MS = 5500;

type EmblaApi = NonNullable<ReturnType<typeof useEmblaCarousel>[1]>;

// Subscribes to Embla's selected-slide index via useSyncExternalStore
// rather than the more commonly-seen `useEffect(() => { onSelect();
// emblaApi.on(...) }, ...)` pattern — that pattern calls setState
// synchronously inside an effect body, which this project's stricter
// react-hooks/set-state-in-effect rule flags (cascading-render risk).
// useSyncExternalStore is the React-idiomatic fix: subscribe/getSnapshot
// instead of a manual effect + setState, which also happens to handle
// the "read the already-correct initial value" case for free.
function useEmblaSelectedIndex(emblaApi: EmblaApi | undefined) {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      if (!emblaApi) return () => {};
      emblaApi.on("select", onStoreChange).on("reInit", onStoreChange);
      return () => {
        emblaApi.off("select", onStoreChange).off("reInit", onStoreChange);
      };
    },
    [emblaApi]
  );
  const getSnapshot = useCallback(() => emblaApi?.selectedScrollSnap() ?? 0, [emblaApi]);

  return useSyncExternalStore(subscribe, getSnapshot, () => 0);
}

function CollaborationNav({
  selected,
  total,
  onPrev,
  onNext,
}: {
  selected: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="mt-6 flex items-center justify-end gap-6">
      <button
        type="button"
        onClick={onPrev}
        aria-label="Previous collaboration"
        className="text-stone-900 transition-opacity duration-200 hover:opacity-60"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <p className="text-base text-stone-400">
        {String(selected + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </p>

      <button
        type="button"
        onClick={onNext}
        aria-label="Next collaboration"
        className="rotate-180 text-stone-900 transition-opacity duration-200 hover:opacity-60"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}

// New Figma-sourced section ("Creative Collaborations" / "Where Two
// Visions Weave as One", node 579:90, 2026-10-06) — not ported from the
// real Astro source, unlike most sections in this project. Sits below
// ProcessStripSection on Home per explicit instruction.
//
// Real autoplay + crossfade carousel via Embla (embla-carousel-react +
// the official autoplay/fade plugins), per explicit instruction
// (2026-10-06) — initially shipped as a plain useState prev/next
// swapper since Figma itself only shows static arrows, but the user
// wanted real autoplay with a fade transition, which Embla's Fade
// plugin handles natively (it swaps the engine's translate-based slide
// to opacity-based, so no custom animation needed). The whole two-column
// slide (image + text + card + nav) is one Embla slide, so everything
// crossfades together on change.
//
// Pagination is right-aligned under the text column, not left — caught
// by the user after the first build; Figma's own absolute x-position for
// that control sits toward the right edge of the content column, not
// the left edge like a plain flex-start would produce.
//
// Pagination (CollaborationNav) renders INSIDE each slide's text column,
// directly after the card — originally tried as one shared row below
// the whole carousel, which the user then caught as "too much space
// above the arrows". Root cause: the two-column grid uses `items-center`
// to vertically center the (shorter) text column against the (taller)
// portrait image, matching Figma's own centered composition — but a nav
// row placed AFTER that grid sits under the GRID's bottom (= the
// image's bottom), not under the actual text content's bottom, leaving
// a large gap sized by however much shorter the text column is than the
// image. Moving nav inside the text column's own normal block flow
// (right after the card) makes it hug the card regardless of the
// image's height; any leftover slack from items-center is now
// redistributed evenly above the eyebrow and below the nav, invisibly,
// matching Figma's own centered block.
//
// Because nav now lives inside each slide, Embla's Fade plugin renders 3
// copies of it (one per slide), stacked via opacity — only the selected
// one is visible, but all 3 would otherwise stay keyboard-focusable
// (aria-hidden alone doesn't remove focusability, and a focusable
// element inside an aria-hidden ancestor is itself a WCAG violation).
// Each inactive slide gets both `aria-hidden` AND `inert` so its
// buttons/links are unreachable by tab or screen reader until selected.
//
// Button text ("Explore The Collaboration") needs `whitespace-nowrap`
// above the xl breakpoint (1280px) only — the card's text column is
// narrow enough (thumbnail + padding eat most of the card's width) that
// it wrapped to two lines without it, which doesn't match Figma's
// single-line design, but forcing nowrap unconditionally instead ran the
// text past the card's right border at narrower column widths (caught
// by the user via screenshot). `xl:whitespace-nowrap` keeps it single-line
// once the column is wide enough to actually fit it, and lets it wrap
// normally below that rather than overflow.
//
// The Link also needs `flex-wrap` below xl (+ `gap-x-4 gap-y-2`
// replacing the plain `gap-4`) — below xl, once the button text wraps to
// two lines, the trailing divider `<span>` is a separate flex item in
// the same nowrap row, so it doesn't wrap WITH the text; it just keeps
// trying to sit beside it and overflows past the card's right border
// (overflow is visible by default, so it visibly pokes through — caught
// by the user via screenshot). `flex-wrap` lets the span drop to its own
// line below the wrapped text instead of overflowing; `gap-y-2` gives
// that dropped line a little breathing room from the text above it.
// `xl:flex-nowrap` turns it back off at the same breakpoint where the
// text itself goes single-line (`xl:whitespace-nowrap` above) and
// genuinely has room — explicit instruction (2026-10-06) to scope it
// rather than leave `flex-wrap` on unconditionally (harmless there in
// practice since nothing needs to wrap once there's room, but scoped
// per instruction for clarity/intent, not just incidental safety).
//
// Three-tier responsive grid (2026-10-06, explicit instruction), not a
// plain single md: breakpoint:
//  - below 768px (this project's established mobile/tablet divide, see
//    ARCHITECTURE.md's footer-tier precedent): single column, stacked.
//  - 768px-990px (tablet): 2 columns at an even 6fr/6fr ratio — tried a
//    narrower 5fr/7fr image-biased ratio first, changed to even 6/6 per
//    explicit instruction (2026-10-06). Written as `grid-cols-[6fr_6fr]`
//    rather than the equivalent `grid-cols-2` to keep the same
//    `[Nfr_Nfr]` shape as the ratio it replaced, for easier side-by-side
//    comparison/diffing later if the ratio changes again.
//  - 991px+ (desktop, custom breakpoint via `min-[991px]:`, not
//    Tailwind's default `lg:` 1024px): the original even 2-col split
//    confirmed against Figma.
//
// The tablet tier is written as `min-[768px]:max-[991px]:...`, an
// explicitly bounded range, NOT `md:grid-cols-[...]` paired with
// `min-[991px]:grid-cols-2` — tried that first, and at 991px+ it still
// rendered the tablet ratio instead of the even desktop split. Both
// `md:` (768px) and `min-[991px]:` match at 991px+, and Tailwind didn't
// order them the way a naive "sorted by pixel value" model predicts, so
// `md:`'s rule won even though it's the "smaller" breakpoint — confirmed
// via direct computed gridTemplateColumns measurement at several widths,
// not assumed. Giving the tablet tier an explicit upper bound makes the
// three ranges mutually exclusive, so correctness no longer depends on
// which rule Tailwind happens to emit last.
//
// The bound is `max-[991px]`, not `max-[990px]` — Tailwind v4 compiles
// arbitrary `max-[Npx]:` to `@media not (min-width: Npx)`, which
// EXCLUDES Npx itself (i.e. `max-[990px]` really means "width < 990px").
// With `max-[990px]` paired against `min-[991px]`, exactly 990px matched
// neither range and silently fell back to the base single-column rule —
// caught via direct measurement at width=990, not assumed. `max-[991px]`
// (width < 991) is the exact complement of `min-[991px]` (width >= 991),
// closing the gap with no overlap.
//
// Both images use `unoptimized` proactively (not waiting for a blur
// report this time) — same next/image re-compression issue hit on
// Press Feature, WhyGiada, and Collection earlier in this project.
//
// User explicitly said to reuse the same content/image across all 3
// slides for now ("we will update later") — real per-slide
// collaboration content is still TBD, not a shortcut taken
// unilaterally here.
//
// Chevron path/viewBox copied exactly from the Figma asset (downloaded
// via download_assets, not redrawn/guessed): `M15 18L9 12L15 6` in a
// 24x24 viewBox. Figma's "next" arrow is the same path with a
// rotate-180 + scaleY(-1) transform; since the chevron is vertically
// symmetric the scaleY has no visible effect, so a plain rotate-180 on
// the button reproduces it exactly.
export default function CollaborationsSliderSection({
  eyebrow,
  slides,
  className = "",
}: CollaborationsSliderSectionProps) {
  const total = slides.length;
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Fade(),
    Autoplay({ delay: AUTOPLAY_MS }),
  ]);
  const selected = useEmblaSelectedIndex(emblaApi);

  return (
    <section
      className={`border-t border-stone-200 bg-white px-5 py-16 md:px-10 md:py-24 lg:px-16 lg:py-28 ${className}`}
    >
      <div className="mx-auto max-w-6xl">
        <div data-reveal className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {slides.map((slide, i) => (
              <div
                key={i}
                className="min-w-0 flex-[0_0_100%]"
                aria-hidden={i !== selected}
                inert={i !== selected ? true : undefined}
              >
                <div className="grid grid-cols-1 gap-10 min-[768px]:max-[991px]:grid-cols-[6fr_6fr] min-[768px]:max-[991px]:items-center min-[991px]:grid-cols-2 min-[991px]:items-center min-[991px]:gap-16">
                  <div className="relative aspect-[549/642] w-full overflow-hidden">
                    <Image
                      src={slide.image}
                      alt={slide.imageAlt}
                      fill
                      unoptimized
                      sizes="(max-width: 767px) 100vw, (max-width: 990px) 42vw, 50vw"
                      className="object-cover"
                    />
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-stone-400">
                      {eyebrow}
                    </p>
                    <div className="mt-4 h-px w-16 bg-stone-300" aria-hidden="true" />

                    <h2 className="mt-8 font-heading text-3xl font-normal tracking-tight text-stone-900 md:text-4xl lg:text-5xl">
                      {slide.heading}
                    </h2>

                    <p className="mt-6 text-[16px] leading-[1.85] text-stone-600">{slide.description}</p>

                    <div className="mt-10 flex items-stretch border border-stone-200">
                      <div className="relative h-auto w-[110px] shrink-0 overflow-hidden sm:w-[170px]">
                        <Image
                          src={slide.cardImage}
                          alt={slide.cardImageAlt}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                      <div className="flex min-w-0 flex-col justify-center gap-[5px] px-4 py-6 sm:px-8">
                        <h3 className="font-heading text-2xl font-normal leading-[28px] text-stone-900">
                          {slide.cardTitle}
                        </h3>
                        <p className="text-base leading-[1.85] text-stone-600">{slide.cardCaption}</p>
                        <Link
                          href={slide.buttonLink}
                          className="group mt-4 inline-flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold uppercase tracking-[0.25em] text-stone-900 no-underline transition-opacity duration-200 hover:opacity-60 xl:flex-nowrap xl:whitespace-nowrap"
                        >
                          {slide.buttonText}
                          <span
                            aria-hidden="true"
                            className="h-px w-10 shrink-0 origin-left bg-stone-900 transition-transform duration-300 group-hover:scale-x-125"
                          />
                        </Link>
                      </div>
                    </div>

                    <CollaborationNav
                      selected={selected}
                      total={total}
                      onPrev={() => emblaApi?.scrollPrev()}
                      onNext={() => emblaApi?.scrollNext()}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
