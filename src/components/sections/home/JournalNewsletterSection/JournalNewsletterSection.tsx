import SectionHeading from "@/components/ui/SectionHeading";
import JournalNewsletterForm from "./JournalNewsletterForm";
import type { JournalNewsletterSectionProps } from "./JournalNewsletterSection.types";

// Home-only, last section on the page (Figma node 892:506). Wired up to
// Brevo 2026-10-23 (see JournalNewsletterForm) — previously just a
// decorative input/button with no handler at all, matching the real
// Astro source's own newsletter strip (StayInTouch.astro), which also
// had no submit handler.
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
        <JournalNewsletterForm emailPlaceholder={emailPlaceholder} buttonLabel={buttonLabel} />
      </div>
    </section>
  );
}
