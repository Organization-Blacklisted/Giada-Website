import Image from "next/image";
import type { FoundersSectionProps } from "./FoundersSection.types";

// Ported from the real source's components/about/Founders.astro. The
// `border-t` here reproduces the real source's lone `<div class="border-t">`
// sibling that follows StoryPresent.astro (Present itself renders no
// border) rather than carrying that stray element over literally.
export default function FoundersSection({ eyebrow, quote, attribution, people, className = "" }: FoundersSectionProps) {
  return (
    <section className={`border-t border-stone-200 mx-auto max-w-6xl px-5 py-16 md:px-10 md:py-24 lg:px-16 lg:py-28 ${className}`}>
      <header className="mx-auto mb-12 max-w-4xl text-center lg:mb-16">
        <div data-reveal className="mb-8 flex items-center justify-center gap-4">
          <span className="h-px w-12 bg-stone-300" aria-hidden="true" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-stone-500">{eyebrow}</p>
          <span className="h-px w-12 bg-stone-300" aria-hidden="true" />
        </div>
        <blockquote data-reveal className="m-0">
          <p className="mb-6 font-didot text-3xl font-normal leading-snug tracking-tight text-stone-900 md:text-4xl lg:text-5xl">
            {quote}
          </p>
          <footer>
            <cite className="text-xs font-semibold not-italic uppercase tracking-[0.25em] text-stone-500">
              {attribution}
            </cite>
          </footer>
        </blockquote>
      </header>

      <div className="grid gap-12 md:grid-cols-2 lg:gap-16">
        {people.map((person) => (
          <article key={person.name} data-reveal className="group">
            <div className="relative aspect-[3/4] w-full overflow-hidden">
              <Image
                src={person.image}
                alt={person.alt}
                fill
                sizes="(max-width: 767px) calc(100vw - 40px), 42vw"
                className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
            </div>
            <div className="pt-7">
              <h3 className="mb-2 font-didot text-2xl font-normal text-stone-900 md:text-3xl">{person.name}</h3>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-stone-500">{person.role}</p>
              <div className="my-5 h-px w-10 bg-stone-200" aria-hidden="true" />
              <p className="text-base leading-8 text-stone-600">{person.bio}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
