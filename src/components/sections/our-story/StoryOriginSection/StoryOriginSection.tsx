import Image from "next/image";
import type { StoryOriginSectionProps } from "./StoryOriginSection.types";

// Ported from the real source's StoryOrigin.astro: a sticky pull-quote
// column alongside the two body paragraphs, followed by a separate
// 2x2 image grid with a faint cross-divider through the middle — NOT a
// quote+image side-by-side layout (that was an earlier, wrong guess).
export default function StoryOriginSection({
  eyebrow,
  quote,
  attribution,
  paragraph1,
  paragraph2,
  images,
  className = "",
}: StoryOriginSectionProps) {
  return (
    <section className={`border-t border-stone-200 bg-white px-5 py-16 md:px-10 md:py-24 lg:px-16 lg:py-28 ${className}`}>
      <div className="mx-auto max-w-6xl">
        <div data-reveal className="mb-12 flex items-center justify-center gap-4 lg:mb-16">
          <span className="h-px w-12 bg-stone-300" aria-hidden="true" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-stone-500">{eyebrow}</p>
          <span className="h-px w-12 bg-stone-300" aria-hidden="true" />
        </div>

        <div className="mb-16 grid items-start gap-12 lg:mb-20 lg:grid-cols-[1fr_1.15fr] lg:gap-20 xl:gap-28">
          <div data-reveal className="lg:sticky lg:top-32 lg:self-start">
            <blockquote className="m-0">
              <p className="font-didot text-2xl font-normal italic leading-snug tracking-tight text-stone-900 md:text-3xl lg:text-[2.25rem]">
                {quote}
              </p>
              <footer className="mt-7">
                <div className="mb-3 h-px w-10 bg-stone-300" aria-hidden="true" />
                <cite className="not-italic text-xs font-semibold uppercase tracking-[0.25em] text-stone-500">
                  {attribution}
                </cite>
              </footer>
            </blockquote>
          </div>

          <div className="space-y-6">
            <p data-reveal className="text-base leading-8 text-stone-600">
              {paragraph1}
            </p>
            <p data-reveal className="text-base leading-8 text-stone-600">
              {paragraph2}
            </p>
          </div>
        </div>

        <div data-reveal className="relative mx-auto grid max-w-4xl grid-cols-2 gap-6 md:gap-8">
          <div
            className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-stone-300 to-transparent"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-stone-300 to-transparent"
            aria-hidden="true"
          />
          {images.map((item) => (
            <figure key={item.image} className="relative m-0 aspect-square w-full overflow-hidden bg-white">
              <Image
                src={item.image}
                alt={item.alt}
                fill
                sizes="(min-width: 768px) 50vw, 50vw"
                className="object-cover"
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
