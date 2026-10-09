import Image from "next/image";
import { Link } from "next-view-transitions";
import type { CollaborationDesignerSectionProps } from "./CollaborationDesignerSection.types";

// Ported from the real source's CollaborationDetail.astro designer
// section. The real "no portrait" placeholder isn't ported — `portrait`
// is required on the Collaborations global's designer group.
export default function CollaborationDesignerSection({ name, bio, portrait }: CollaborationDesignerSectionProps) {
  const bioParagraphs = bio.split("\n\n").filter(Boolean);

  return (
    <section className="border-t border-stone-200 bg-white px-5 py-20 md:px-10 md:py-28 lg:px-16 lg:py-32">
      <div className="mx-auto max-w-5xl">
        <div data-reveal className="mb-14 md:mb-16 lg:mb-20">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.32em] text-stone-400">The Designer</p>
          <div className="h-px w-10 bg-stone-300" />
        </div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-[2fr_3fr] md:gap-16 lg:gap-24">
          <div data-reveal className="relative">
            <div className="relative aspect-[3/4] overflow-hidden bg-stone-200">
              <Image src={portrait} alt={`${name} — portrait`} fill sizes="(max-width: 768px) 100vw, 40vw" className="object-cover object-top" />
            </div>
            <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-400 md:hidden">{name}</p>
          </div>

          <div data-reveal className="flex flex-col justify-center">
            <h2 className="font-didot text-3xl font-normal tracking-tight text-stone-900 md:text-4xl">{name}</h2>
            <div className="my-6 h-px w-10 bg-stone-300" />
            {bioParagraphs.map((para) => (
              <p key={para} className="mb-5 text-[15px] leading-[1.85] text-stone-600 last:mb-0">
                {para}
              </p>
            ))}
            <Link
              href="/contact"
              className="group mt-10 inline-flex items-center gap-4 self-start text-[11px] font-semibold uppercase tracking-[0.25em] text-stone-900 no-underline transition-colors duration-200 hover:text-stone-600"
            >
              Enquire About This Collaboration
              <span aria-hidden="true" className="h-px w-8 origin-left bg-current transition-transform duration-300 group-hover:scale-x-125" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
