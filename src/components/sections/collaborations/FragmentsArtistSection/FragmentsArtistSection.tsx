import Image from "next/image";
import type { FragmentsArtistSectionProps } from "./FragmentsArtistSection.types";

// Bespoke "The Artist Behind The Collection" section for the Fragments
// (Ryan Saghian) page — Figma node 233:135. All content comes from
// Payload (Collaborations.customHero.artist) — the standard
// CollaborationDesignerSection is already skipped for this collaboration
// (see page.tsx) since its copy/portrait don't match this design.
//
// bioParagraphGroup1/2 are each a single CMS textarea rendered with
// whitespace-pre-line, not split into separate hardcoded <p> tags like
// the first pass — the two "paragraphs" within each group run tight
// with no gap (just a manual line break in the CMS field), while the
// real gap between group1 and group2 is a margin on group2 (see below).
//
// Re-verified against Figma's exact numbers (first pass used generic
// Tailwind scale values — max-w-6xl, gap-12/16, etc. — that were close
// but not exact):
// - This page's content column is 1280px wide (every Figma frame here
//   uses x:320/width:1280 on the 1920 canvas), not Container's default
//   max-w-6xl (1152px) — using a dedicated wrapper here instead of the
//   shared Container component. The wrapper itself is capped at 1408px
//   (1280 + the lg:px-16 gutter's 64px on each side), so the gutter is
//   accounted for and the actual CONTENT area is a true 1280px, not
//   1280 minus the padding.
// - Image 596px + gap 59px + text 625px = 1280px exactly — expressed as
//   percentages of that 1280 so it still scales below lg.
// - The bio paragraphs aren't evenly spaced: Figma's own code has all
//   four paragraphs at mb-0 (no gap) EXCEPT a literal double <br/> after
//   the 2nd paragraph — i.e. paragraphs 1+2 run tight, then one real
//   gap, then paragraphs 3+4 run tight. That gap is ONE blank line
//   (32px, mb-8), not two — the first <br/> just ends the already-
//   wrapped text line (no visible gap by itself), only the second one
//   adds actual empty space. Originally implemented as mb-16 (64px),
//   doubled by miscounting the two <br/> tags as two blank lines.
export default function FragmentsArtistSection({
  eyebrow,
  name,
  subheadline,
  bioParagraphGroup1,
  bioParagraphGroup2,
  portrait,
}: FragmentsArtistSectionProps) {
  return (
    <section className="border-t border-stone-200 bg-white py-20 md:py-28 lg:py-32">
      <div className="mx-auto w-full max-w-[1408px] px-5 md:px-10 lg:px-16">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-[4.609375%]">
          <div className="relative aspect-[596/624] w-full shrink-0 overflow-hidden bg-stone-200 lg:w-[46.5625%]">
            <Image
              src={portrait}
              alt={`${name} in his studio, surrounded by moodboards and furniture references`}
              fill
              sizes="(max-width: 1024px) 100vw, 47vw"
              className="object-cover"
            />
          </div>

          <div className="flex w-full flex-col items-start lg:w-[48.828125%] lg:shrink-0">
            <p className="text-[14px] font-semibold uppercase tracking-[2.8px] text-stone-400">{eyebrow}</p>
            <div className="mt-6 h-px w-[62px] bg-stone-300" aria-hidden="true" />

            <h2 className="mt-[30px] font-didot text-4xl font-normal capitalize leading-normal text-stone-900 md:text-5xl">
              {name}
            </h2>
            <p className="text-base leading-[2] text-stone-900">{subheadline}</p>

            <div className="mt-4 text-base leading-[2] text-stone-500">
              <p className="whitespace-pre-line">{bioParagraphGroup1}</p>
              <p className="mt-8 whitespace-pre-line">{bioParagraphGroup2}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
