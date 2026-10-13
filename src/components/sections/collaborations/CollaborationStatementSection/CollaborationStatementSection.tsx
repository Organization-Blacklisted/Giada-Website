import type { CollaborationStatementSectionProps } from "./CollaborationStatementSection.types";

// Ported from the real source's CollaborationDetail.astro statement
// section. `description` is split on blank lines into paragraphs,
// matching the real source's own `.split('\n\n').filter(Boolean)` — most
// real collaborations only have one paragraph today, so this usually
// renders as a single <p>.
export default function CollaborationStatementSection({ tagline, description }: CollaborationStatementSectionProps) {
  const paragraphs = description.split("\n\n").filter(Boolean);

  return (
    <section className="bg-white px-5 py-20 md:px-10 md:py-28 lg:px-16 lg:py-32">
      <div className="mx-auto max-w-2xl text-center">
        {tagline && (
          <>
            <p data-reveal className="font-didot text-2xl font-normal leading-[1.45] tracking-tight text-stone-900 md:text-3xl">
              {tagline}
            </p>
            <div data-reveal className="mx-auto mb-10 mt-8 h-px w-12 bg-stone-300" />
          </>
        )}

        {paragraphs.map((para) => (
          <p key={para} data-reveal className="mb-6 text-[15px] leading-[1.9] text-stone-600 last:mb-0">
            {para}
          </p>
        ))}
      </div>
    </section>
  );
}
