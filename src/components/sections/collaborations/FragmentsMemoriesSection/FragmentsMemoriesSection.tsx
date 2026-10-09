import Image from "next/image";
import type { FragmentsMemoriesSectionProps } from "./FragmentsMemoriesSection.types";

// Bespoke "When Memories Take Form" section for the Fragments (Ryan
// Saghian) page — Figma node 233:166. Heading/paragraph and each strip's
// image+alt come from Payload (Collaborations.customHero.memories).
//
// The 8 staggered rug-texture strips are purely decorative (no labels,
// prices, or links in the Figma design — not a product grid). Their
// POSITIONS (left/top percentages) stay hardcoded here, matched to this
// exact Figma composition by index — only the image and alt text for
// each of the 8 slots are CMS fields, so an editor can't break the
// staggered layout by reordering/resizing.
//
// Positions and sizes are percentages of the 980x624 Figma group,
// preserved via an aspect-ratio wrapper so the staggered composition
// holds together at any width instead of only at exactly 980px.
//
// Re-verified against Figma: this whole section (heading block + strips)
// sits in a 980px column, NOT the 1280px column the rest of this page
// uses — a real miss in the first pass, which wrapped it at 1280/1408.
// Within that 980 column, the heading block (eyebrow+heading) is its
// own narrower 814px box and the paragraph is independently wider at
// 880px — not the same box, each centered on its own.
const STRIP_POSITIONS = [
  { left: 0, top: 0 },
  { left: 12.65, top: 15.71 },
  { left: 25.31, top: 9.78 },
  { left: 37.96, top: 31.25 },
  { left: 50.61, top: 3.2 },
  { left: 63.27, top: 12.18 },
  { left: 75.92, top: 27.88 },
  { left: 88.57, top: 13.94 },
];

export default function FragmentsMemoriesSection({ eyebrow, heading, paragraph, strips }: FragmentsMemoriesSectionProps) {
  return (
    <section className="border-t border-stone-200 bg-white py-20 md:py-28 lg:py-32">
      <div className="mx-auto w-full max-w-[1108px] px-5 md:px-10 lg:px-16">
        <div className="mx-auto flex max-w-[814px] flex-col items-center text-center">
          <div className="flex items-center justify-center gap-4">
            <span className="h-px w-[62px] bg-stone-300" aria-hidden="true" />
            <p className="text-[14px] font-semibold uppercase tracking-[2.8px] text-stone-400">{eyebrow}</p>
            <span className="h-px w-[62px] bg-stone-300" aria-hidden="true" />
          </div>
          <h2 className="mt-[30px] font-didot text-4xl font-normal leading-normal text-stone-900 md:text-5xl">{heading}</h2>
        </div>
        <p className="mx-auto mt-4 max-w-[880px] text-center text-[18px] leading-[32px] text-stone-500">{paragraph}</p>

        <div className="relative mx-auto mt-[60px] w-full max-w-[980px]" style={{ aspectRatio: "980 / 624" }}>
          {strips.map((strip, i) => {
            const position = STRIP_POSITIONS[i];
            if (!position) return null;
            return (
              <div
                key={i}
                className="absolute"
                style={{ left: `${position.left}%`, top: `${position.top}%`, width: "11.43%", height: "68.75%" }}
              >
                <Image src={strip.image} alt={strip.alt} fill sizes="(max-width: 768px) 12vw, 112px" className="object-cover" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
