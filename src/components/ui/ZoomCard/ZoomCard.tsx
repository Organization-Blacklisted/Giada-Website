"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { ZoomCardProps } from "./ZoomCard.types";

// Generic primitive, same philosophy as CategoryCard/Accordion — just an
// image + the cursor-tracked magnifying zoom, no page/section knowledge.
// Ported from the real source's PressFeature.astro inline <script>
// (`[data-press-zoom]`): on hover the image scales to 1.72x with its
// transform-origin following the cursor's position within the card, not
// a static hover-scale. Kept as direct DOM style mutation on mousemove
// (not React state) — matches the real source, and avoids a re-render
// on every mouse-move event, which state would cause.
//
// Deliberate improvement over the real source, not a straight port:
// the real source lets each card's height follow its own image's native
// aspect ratio, so three images of different proportions produce
// visibly uneven row heights (confirmed, not assumed — this is a real
// bug the live site has). Explicit user request: "we are improving
// things here on nextjs," not matching the real source's layout bug for
// its own sake.
//
// Fixed `aspect-[6/7]` on the container + `fill` + `object-cover`,
// rather than relying on CSS Grid's `align-items: stretch` to match
// each card to the tallest sibling — that approach has a circular
// problem here specifically: every card in the row uses `fill`
// (`position: absolute`), so none of them contributes real intrinsic
// height for the grid row to size itself against, and the row collapses
// instead of stretching. A fixed aspect-ratio has no such dependency:
// equal-width grid columns + the same ratio on every card is already
// equal height, deterministically, at any breakpoint. 6/7 (≈0.857) is
// the three real images' own average width/height ratio (0.862, 0.899,
// 0.833) rounded to a clean fraction — grounded in the real content,
// not picked arbitrarily.
//
// `unoptimized` (2026-10-05) — user caught these specific images
// looking visibly softer on this site than on the live one. First tried
// raising next/image's `quality` (75 → 90 → 100 on request), which
// helped but didn't fully close the gap — re-investigated by directly
// capturing what the live site actually serves (navigated to the real
// production site, intercepted the network response): it serves these
// exact files completely unprocessed, at their real original dimensions
// (1189×1323, 1333×1600, 1164×1351 — confirmed byte-for-byte matching
// resolution against this project's own public/ source files). Next's
// image optimizer, even at quality 100, still downsizes to its nearest
// `deviceSizes` bucket (1080px wide — comfortably enough pixels, but
// still less than the real 1164-1600px originals) and re-encodes through
// its own WebP pass on top of whatever encoding the source file already
// has — two lossy passes plus a resize, compounding softness that's most
// visible here specifically because these are dense magazine scans
// (small text, fine photo grain), not simple interior/product shots.
// `unoptimized` serves the exact original file, byte-for-byte, with zero
// resize and zero re-encode — the only way to genuinely match live
// rather than approximate it with a higher quality number. Acceptable
// tradeoff here: these 3 files are already small (187-244KB) and don't
// need Next's responsive-srcset machinery the way a hero image would.
export default function ZoomCard({ image, alt, className = "" }: ZoomCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onMouseEnter = () => {
      const img = imgRef.current;
      if (!img) return;
      img.style.transition =
        "transform 0.38s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform-origin 0.18s ease-out";
      img.style.transform = "scale(1.72)";
    };

    const onMouseMove = (e: MouseEvent) => {
      const img = imgRef.current;
      if (!img) return;
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      img.style.transition =
        "transform 0.38s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform-origin 0.18s ease-out";
      img.style.transformOrigin = `${x}% ${y}%`;
      img.style.transform = "scale(1.72)";
    };

    const onMouseLeave = () => {
      const img = imgRef.current;
      if (!img) return;
      img.style.transition =
        "transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform-origin 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
      img.style.transform = "scale(1)";
      img.style.transformOrigin = "center center";
    };

    container.addEventListener("mouseenter", onMouseEnter);
    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseleave", onMouseLeave);
    return () => {
      container.removeEventListener("mouseenter", onMouseEnter);
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative aspect-[6/7] cursor-zoom-in overflow-hidden shadow-[0_8px_40px_-8px_rgba(0,0,0,0.18)] ring-1 ring-stone-100 ${className}`}
    >
      <Image
        ref={(node) => {
          imgRef.current = node;
        }}
        src={image}
        alt={alt}
        fill
        loading="lazy"
        unoptimized
        className="object-cover will-change-transform"
      />
    </div>
  );
}
