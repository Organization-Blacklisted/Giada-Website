import Image from "next/image";
import { Link } from "next-view-transitions";
import type { CollaborationProductsSectionProps } from "./CollaborationProductsSection.types";

// Ported from the real source's CollaborationDetail.astro products grid.
// Rendered by the parent page only when `products.length > 0` — the real
// source's own `products.length === 0 ? <div/> : (...)` check means the
// WHOLE section (including its "No pieces..." inner empty state) never
// actually renders when there are no products, so that inner empty
// state is dead code, not ported (same standard as skipping
// StoryTimeline.astro's unused import).
//
// Deliberately image-only, no title/category caption — unlike
// RugsListing's ProductCard, the real source's card here really is just
// the bare image.
export default function CollaborationProductsSection({ products }: CollaborationProductsSectionProps) {
  return (
    <section className="border-t border-stone-200 bg-white px-5 py-20 md:px-10 md:py-24 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div data-reveal className="mb-12 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.32em] text-stone-400">Selected Works</p>
            <h2 className="font-didot text-3xl font-normal tracking-tight text-stone-900 md:text-4xl">
              Pieces from this Collaboration
            </h2>
          </div>
          <p className="text-[13px] text-stone-400">
            {products.length} {products.length === 1 ? "piece" : "pieces"}
          </p>
        </div>

        <ul className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 lg:grid-cols-4" role="list">
          {products.map((product) => (
            <li key={product.slug} data-reveal>
              <Link href={`/products/${product.slug}`} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden bg-stone-100 transition-all duration-300 group-hover:-translate-y-0.5">
                  <Image
                    src={product.coverImage}
                    alt={product.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    loading="lazy"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-16 pt-10 text-center">
          <Link
            href="/products"
            className="group inline-flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-stone-500 no-underline transition-colors duration-200 hover:text-stone-900"
          >
            <span aria-hidden="true" className="h-px w-8 origin-right bg-current transition-transform duration-300 group-hover:scale-x-125" />
            View All Products
            <span aria-hidden="true" className="h-px w-8 origin-left bg-current transition-transform duration-300 group-hover:scale-x-125" />
          </Link>
        </div>
      </div>
    </section>
  );
}
