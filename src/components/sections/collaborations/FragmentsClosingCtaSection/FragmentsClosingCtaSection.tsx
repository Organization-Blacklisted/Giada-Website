import { Link } from "next-view-transitions";
import type { FragmentsClosingCtaSectionProps } from "./FragmentsClosingCtaSection.types";

// Bespoke closing CTA for the Fragments (Ryan Saghian) page — Figma
// node 233:213. Content comes from Payload (Collaborations.customHero.closingCta).
//
// NOT a reuse of the shared ContactCtaBanner (used on FAQ, Our Story,
// Blog, Home, the standard Collaborations hero/detail, etc.) — Figma's
// numbers here (72px heading, 578px paragraph at 18px, 1.92px link
// tracking) are genuinely different from that component's generic
// scale (36-60px heading, 448px/15px paragraph, 0.25em tracking), and
// changing the shared component to match would've changed the closing
// CTA's look on every other page site-wide. Explicit call: keep
// ContactCtaBanner as-is everywhere else, build this bespoke instead.
export default function FragmentsClosingCtaSection({ heading, paragraph, linkText }: FragmentsClosingCtaSectionProps) {
  return (
    <section className="border-t border-stone-200 bg-white px-5 py-16 md:px-10 md:py-24 lg:px-16 lg:py-28">
      <div className="mx-auto flex max-w-[810px] flex-col items-center gap-10 text-center">
        <div className="flex flex-col items-center gap-[30px]">
          <div className="flex flex-col items-center gap-10">
            <h2 className="font-didot text-[42px] font-normal leading-[1.2] text-stone-900 md:text-[56px] lg:text-[72px]">
              {heading}
            </h2>
            <div className="h-px w-[71px] bg-stone-300" aria-hidden="true" />
          </div>
          <p className="mx-auto max-w-[578px] text-[18px] leading-normal text-stone-500">{paragraph}</p>
        </div>

        <Link
          href="/contact"
          className="group inline-flex items-center gap-6 text-[12px] font-semibold uppercase tracking-[1.92px] text-stone-900 no-underline transition-opacity duration-200 hover:opacity-60"
        >
          {linkText}
          <span
            aria-hidden="true"
            className="h-px w-10 origin-left bg-stone-900 transition-transform duration-300 group-hover:scale-x-125"
          />
        </Link>
      </div>
    </section>
  );
}
