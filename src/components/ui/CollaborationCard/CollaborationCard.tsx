import Image from "next/image";
import { Link } from "next-view-transitions";
import type { CollaborationCardProps } from "./CollaborationCard.types";

// Ported from the real source's CollaborationCard.astro. `active` drives
// two genuinely different branches, not just a style toggle: an active
// card is a real `<a>` to the detail page with hover zoom/darken and an
// "Explore" link; an inactive one is a non-interactive `<div
// aria-disabled>` with no hover effects and a static "Coming Soon" label
// instead, matching the real component's own `collection.active !== false`
// logic exactly (currently unused by either real item, but ported so the
// capability exists if a future collaboration isn't ready to reveal yet).
//
// The real source's "no heroImage" hatch-pattern fallback isn't ported —
// `heroImage` is a required field on the Collaborations global, so that
// branch can't occur here.
export default function CollaborationCard({
  name,
  slug,
  tagline,
  active,
  heroImage,
  productCount,
  designerName,
  className = "",
}: CollaborationCardProps) {
  const wrapperClass = `group relative block aspect-[3/3] overflow-hidden bg-stone-900 ${active ? "" : "cursor-not-allowed"} ${className}`;

  const content = (
    <>
      <Image
        src={heroImage}
        alt={name}
        fill
        sizes="(max-width: 640px) 100vw, 50vw"
        loading="lazy"
        className={`object-cover ${active ? "transition-transform duration-700 ease-out will-change-transform group-hover:scale-[1.04]" : ""}`}
      />

      <div
        className={`absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/30 to-transparent ${active ? "transition-opacity duration-500 group-hover:from-stone-950/95" : ""}`}
      />

      {active && productCount > 0 && (
        <div className="absolute left-6 top-6 z-10 translate-y-2 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="inline-flex items-center border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-white backdrop-blur-sm">
            {productCount} {productCount === 1 ? "Piece" : "Pieces"}
          </span>
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 z-10 p-7 md:p-8 lg:p-9">
        {tagline && <p className="mt-2.5 line-clamp-2 text-[13px] leading-[1.7] text-stone-100">{tagline}</p>}

        <h3 className="mb-2 font-didot text-[1.65rem] font-normal leading-tight tracking-tight text-white md:text-3xl">
          {name}
        </h3>

        {designerName && (
          <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-stone-300">
            Designed with {designerName}
          </p>
        )}

        {active ? (
          <div className="mt-6 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/70 transition-all duration-300 group-hover:text-white">
            <span>Explore</span>
            <span className="h-px w-6 origin-left bg-current transition-transform duration-500 group-hover:w-10 group-hover:scale-x-125" />
          </div>
        ) : (
          <div className="mt-6 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/50">
            <span>Coming Soon</span>
          </div>
        )}
      </div>
    </>
  );

  if (!active) {
    return (
      <div className={wrapperClass} aria-disabled="true">
        {content}
      </div>
    );
  }

  return (
    <Link href={`/collaborations/${slug}`} className={wrapperClass}>
      {content}
    </Link>
  );
}
