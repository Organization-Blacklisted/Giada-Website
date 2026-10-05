import Image from "next/image";
import { Link } from "next-view-transitions";
import type { CategoryCardProps } from "./CategoryCard.types";

// Generic primitive, same philosophy as Accordion/TestimonialBook — no
// page/section knowledge, just title/image/href. Ported from the real
// source's components/global/CategoryCard.astro, reused there on both
// the Home page (inside CategoryGrid.astro) and the standalone Products
// page — confirmed via grep, not assumed, since those two usages wrap it
// in genuinely different section chrome (see CategoryGridSection vs the
// Products page's own section).
export default function CategoryCard({
  title,
  image,
  imageWidth,
  imageHeight,
  href,
  className = "",
}: CategoryCardProps) {
  return (
    <Link
      href={href}
      className={`group relative block aspect-5/4 cursor-pointer overflow-hidden transition-shadow duration-500 ease-out hover:shadow-2xl hover:shadow-stone-900/20 ${className}`}
    >
      <Image
        src={image}
        alt={title}
        width={imageWidth}
        height={imageHeight}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
      />

      {/* Subtle permanent overlay for text legibility */}
      <div className="absolute inset-0 bg-black/15 transition-colors duration-500 group-hover:bg-black/30" />

      <h3 className="absolute inset-0 flex items-end justify-start p-7 font-didot text-2xl font-normal tracking-wide text-white transition-transform duration-500 ease-out group-hover:-translate-y-1 md:p-8 md:text-3xl">
        {title}
      </h3>
    </Link>
  );
}
