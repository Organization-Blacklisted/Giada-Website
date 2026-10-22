import SectionHeading from "@/components/ui/SectionHeading";
import type { JournalNewsletterSectionProps } from "./JournalNewsletterSection.types";

// Home-only, last section on the page (Figma node 892:506). Visual only
// for now, deliberately — the real Astro source's own newsletter strip
// (StayInTouch.astro) had no submit handler either, just a decorative
// input + button (see ARCHITECTURE.md's "newsletter real-or-drop", still
// an open decision with the client). No <form>/onSubmit wired up here
// either, matching that same real, confirmed state rather than inventing
// backend behavior nobody asked for yet.
//
// No mobile frame in the Figma file for this section — stacks the
// input/button combo full-width below `sm`, matches the Figma's 587px
// (379 + 208) combo width from `sm` up, same reasoning as other sections
// built without a mobile reference (see FragmentsHeroSection/
// BlogArticleSection's own comments on this).
export default function JournalNewsletterSection({
  eyebrow,
  heading,
  description,
  emailPlaceholder,
  buttonLabel,
  className = "",
}: JournalNewsletterSectionProps) {
  return (
    <section className={`border-t border-stone-200 bg-white px-5 py-16 md:px-10 md:py-24 lg:px-16 lg:py-28 ${className}`}>
      <div className="mx-auto max-w-[677px]">
        <SectionHeading eyebrow={eyebrow} title={heading} description={description} align="center" descriptionFontSize="14px" />

        <div className="mx-auto flex max-w-[587px] flex-col sm:flex-row" data-reveal>
          <input
            type="email"
            placeholder={emailPlaceholder}
            aria-label={emailPlaceholder}
            className="h-12 w-full border border-stone-200 bg-white px-4 text-[16px] text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-900 sm:flex-1 sm:border-r-0"
          />
          <button
            type="button"
            className="group flex h-12 shrink-0 items-center justify-center gap-6 whitespace-nowrap bg-stone-900 px-8 text-[12px] font-semibold uppercase tracking-[1.92px] text-white"
          >
            {buttonLabel}
            <span aria-hidden="true" className="h-px w-10 bg-white" />
          </button>
        </div>
      </div>
    </section>
  );
}
