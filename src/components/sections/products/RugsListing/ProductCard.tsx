import Image from "next/image";
import { Link } from "next-view-transitions";
import type { ProductListItemData } from "./RugsListing.types";

// Ported from the real source's ProductsListing.astro card markup. The
// "no cover image" Didot-letter fallback isn't ported — `images` is
// required with `minRows: 1` on the Products collection, so every real
// product has a coverImage; that branch can't occur here.
export default function ProductCard({ title, category, inStock, coverImage, slug }: ProductListItemData) {
  return (
    <li>
      <Link href={`/products/${slug}`} className="group block">
        <div className="relative aspect-[3/4] overflow-hidden bg-stone-100 transition-all duration-300 group-hover:-translate-y-0.5">
          <Image
            src={coverImage}
            alt={title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
            loading="lazy"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />

          {inStock && (
            <span className="absolute left-2.5 top-2.5 bg-white px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-stone-700">
              In Stock
            </span>
          )}
        </div>

        <div className="mt-3 px-0.5">
          <p className="text-[12px] leading-snug text-stone-800">{title}</p>
          {category && <p className="mt-0.5 text-[10px] uppercase tracking-[0.18em] text-stone-400">{category}</p>}
        </div>
      </Link>
    </li>
  );
}
