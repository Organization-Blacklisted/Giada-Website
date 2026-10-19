import Image from "next/image";
import { Link } from "next-view-transitions";
import type { BlogCardProps } from "./BlogCard.types";

// Ported from the real source's components/global/BlogCard.astro.
// `description` in the real source is called `excerpt` here (matches
// what it actually is — the card's own copy, not an SEO description).
export default function BlogCard({ title, slug, excerpt, coverImage, author, className = "" }: BlogCardProps) {
  return (
    <Link
      href={`/blog/${slug}`}
      className={`group block cursor-pointer transition-transform duration-500 ease-out hover:-translate-y-0.5 ${className}`}
    >
      <div className="relative aspect-square w-full overflow-hidden">
        <Image
          src={coverImage}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
      </div>

      <div className="pt-6">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-stone-400">Article</p>

        <h3 className="font-heading text-xl font-normal tracking-tight text-stone-900 transition-opacity duration-200 group-hover:opacity-60">
          {title}
        </h3>

        <p className="mt-3 text-[14px] leading-[1.75] text-stone-500">{excerpt}</p>

        <p className="mt-3 text-[12px] italic text-stone-400">Written by {author}</p>

        <span
          aria-hidden="true"
          className="mt-5 inline-block h-px w-6 origin-left bg-stone-400 transition-transform duration-300 group-hover:scale-x-125"
        />
      </div>
    </Link>
  );
}
