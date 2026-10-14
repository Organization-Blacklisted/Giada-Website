import Image from "next/image";
import type { GlassGallerySectionProps } from "./GlassGallerySection.types";

// Ported from the real source's GlassLandingPage.astro "In Context" /
// gallery section.
export default function GlassGallerySection({
  eyebrow,
  heading,
  description,
  items,
  className = "",
}: GlassGallerySectionProps) {
  return (
    <section className={`bg-white px-5 py-14 md:px-10 md:py-16 lg:px-16 lg:py-20 ${className}`}>
      <div className="mx-auto max-w-[88rem]">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <div className="mb-7 flex items-center justify-center gap-4">
            <span className="h-px w-12 bg-stone-300" aria-hidden="true" />
            <p className="text-[11px] font-medium uppercase tracking-[0.45em] text-stone-500">{eyebrow}</p>
            <span className="h-px w-12 bg-stone-300" aria-hidden="true" />
          </div>

          <h2 className="font-didot text-3xl font-normal leading-tight tracking-tight text-stone-900 md:text-4xl">
            {heading}
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-[1.85] text-stone-500">{description}</p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {items.map((item) => (
            <article key={item.image} className="bg-white">
              <div className="overflow-hidden bg-stone-100">
                <Image
                  src={item.image}
                  alt={item.alt}
                  width={item.imageWidth}
                  height={item.imageHeight}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="h-auto w-full"
                  loading="lazy"
                />
              </div>

              <div className="border-x border-b border-stone-200 px-6 py-6">
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.35em] text-stone-400">
                  {item.eyebrow}
                </p>

                <h3 className="font-didot text-2xl font-normal leading-tight text-stone-900">{item.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
