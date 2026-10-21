import Image from "next/image";
import type { StoryBeliefsSectionProps } from "./StoryBeliefsSection.types";

// Ported from the real source's StoryBeliefs.astro: the 3 values render
// as a stacked list of full-width rows (index / title / text columns),
// NOT a 3-up card grid (that was an earlier, wrong guess). The closing
// image's caption is overlaid on the image itself, bottom-left, over a
// dark gradient — not a separate caption line below it.
export default function StoryBeliefsSection({
  eyebrow,
  heading,
  items,
  closingImage,
  closingImageAlt,
  closingCaption,
  className = "",
}: StoryBeliefsSectionProps) {
  return (
    <section className={`border-y border-stone-200 bg-white px-5 py-16 md:px-10 md:py-24 lg:px-16 lg:py-28 ${className}`}>
      <div className="mx-auto max-w-6xl">
        <header className="mb-12 text-center lg:mb-16">
          <div data-reveal className="mb-8 flex items-center justify-center gap-4">
            <span className="h-px w-12 bg-stone-300" aria-hidden="true" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-stone-500">{eyebrow}</p>
            <span className="h-px w-12 bg-stone-300" aria-hidden="true" />
          </div>
          <h2
            data-reveal
            className="mx-auto max-w-2xl font-didot text-4xl font-normal leading-tight tracking-tight text-stone-900 md:text-5xl"
          >
            {heading}
          </h2>
        </header>

        <div className="border-t border-stone-200">
          {items.map((item) => (
            <article
              key={item.index}
              data-reveal
              className="grid border-b border-stone-200 py-8 md:grid-cols-[2.5rem_minmax(13rem,0.42fr)_1fr] md:items-start md:gap-x-10 md:py-10"
            >
              <p className="mb-4 font-didot text-sm italic text-stone-400 md:mb-0 md:mt-1">{item.index}</p>
              <h3 className="mb-3 font-didot text-2xl font-normal italic text-stone-900 md:mb-0 md:text-3xl">
                {item.title}
              </h3>
              <p className="text-sm leading-7 text-stone-600">{item.text}</p>
            </article>
          ))}
        </div>

        <figure
          data-reveal
          className="group relative mt-16 overflow-hidden border border-stone-200 lg:mt-20"
        >
          <div className="relative aspect-[21/9] w-full">
            <Image
              src={closingImage}
              alt={closingImageAlt}
              fill
              sizes="(min-width: 1024px) 1152px, 100vw"
              loading="lazy"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
          </div>
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent"
            aria-hidden="true"
          />
          <figcaption className="absolute inset-x-0 bottom-0 px-6 py-6 md:px-10 md:py-8">
            <p className="font-didot text-lg italic leading-snug text-white md:text-xl">{closingCaption}</p>
            <div className="mt-1 h-px w-10 bg-white/40" aria-hidden="true" />
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
