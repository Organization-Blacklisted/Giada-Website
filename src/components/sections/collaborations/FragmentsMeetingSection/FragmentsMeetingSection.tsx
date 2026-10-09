import Image from "next/image";
import type { FragmentsMeetingSectionProps } from "./FragmentsMeetingSection.types";

// Bespoke "A Meeting Of Two Worlds" section for the Fragments (Ryan
// Saghian) page — Figma node 233:194. All content comes from Payload
// (Collaborations.customHero.meeting).
//
// Re-verified against Figma's exact numbers — same 1280px content
// column as the rest of this page (not Container's 1152px default).
// Text 403px + gap 93px + images 784px = 1280px exactly. The two
// images are 380px each with a 24px gap (380+24+380=784).
export default function FragmentsMeetingSection({
  eyebrow,
  heading,
  subheadline,
  paragraph,
  imageLeft,
  imageRight,
}: FragmentsMeetingSectionProps) {
  return (
    <section className="border-t border-stone-200 bg-white py-20 md:py-28 lg:py-32">
      <div className="mx-auto w-full max-w-[1408px] px-5 md:px-10 lg:px-16">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-[7.265625%]">
          <div className="flex w-full flex-col items-start lg:w-[31.484375%] lg:shrink-0">
            <p className="text-[14px] font-semibold uppercase tracking-[2.8px] text-stone-400">{eyebrow}</p>
            <div className="mt-6 h-px w-[62px] bg-stone-300" aria-hidden="true" />

            <h2 className="mt-[30px] font-didot text-4xl font-normal capitalize leading-normal text-stone-900 md:text-5xl">
              {heading}
            </h2>
            <p className="text-base leading-[2] text-stone-900">{subheadline}</p>
            <p className="mt-4 text-base leading-[2] text-stone-500">{paragraph}</p>
          </div>

          <div className="grid w-full grid-cols-2 gap-[24px] lg:w-[61.25%]">
            <div className="relative aspect-[380/440] w-full overflow-hidden bg-stone-200">
              <Image src={imageLeft} alt="A craftsman hand-weaving a rug" fill sizes="(max-width: 1024px) 50vw, 20vw" className="object-cover" />
            </div>
            <div className="relative aspect-[380/440] w-full overflow-hidden bg-stone-200">
              <Image
                src={imageRight}
                alt="Ryan Saghian reviewing fabric swatches"
                fill
                sizes="(max-width: 1024px) 50vw, 20vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
