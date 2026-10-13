"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import type { ProductGalleryProps } from "./ProductGallery.types";

const SCROLL_PX = 156;

// Ported from the real source's ProductDetail.astro gallery script:
// crossfading slides (not a scrolling carousel), a cursor-following
// zoom (1.72x, same math as ui/ZoomCard) on the currently visible slide
// only, and a thumbnail strip with prev/next arrows that both scroll the
// strip AND change the active slide. Direct DOM style mutation on
// mousemove (via refs), not React state, for the same reason as
// ZoomCard — avoids a re-render on every mouse-move event.
//
// The real component's "no images" Didot-letter placeholder isn't
// ported — `images` is required with `minRows: 1` on the Products
// collection, so that branch can't occur here.
export default function ProductGallery({ images, title, className = "" }: ProductGalleryProps) {
  const [current, setCurrent] = useState(0);
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const thumbStripRef = useRef<HTMLDivElement>(null);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const multipleImages = images.length > 1;

  function resetZoom(img: HTMLImageElement | null) {
    if (!img) return;
    img.style.transition =
      "transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform-origin 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
    img.style.transform = "scale(1)";
    img.style.transformOrigin = "center center";
  }

  function show(index: number) {
    if (images.length < 2) return;
    const next = ((index % images.length) + images.length) % images.length;
    if (next === current) return;
    resetZoom(imgRefs.current[current]);
    setCurrent(next);
    thumbRefs.current[next]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
  }

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const img = imgRefs.current[current];
    if (!img) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    img.style.transition = "transform 0.38s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform-origin 0.18s ease-out";
    img.style.transformOrigin = `${x}% ${y}%`;
    img.style.transform = "scale(1.72)";
  }

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <div
        className="relative aspect-[4/5] select-none overflow-hidden bg-stone-50"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => resetZoom(imgRefs.current[current])}
      >
        {images.map((image, i) => (
          <div
            key={image}
            className={`absolute inset-0 transition-opacity duration-400 ease-in-out ${i === current ? "opacity-100" : "pointer-events-none opacity-0"}`}
          >
            <Image
              ref={(node) => {
                imgRefs.current[i] = node;
              }}
              src={image}
              alt={`${title} — image ${i + 1}`}
              width={800}
              height={1000}
              className="h-full w-full object-cover will-change-transform"
              loading={i === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}
      </div>

      {multipleImages && (
        <div className="flex items-stretch gap-2">
          <button
            type="button"
            aria-label="Previous image"
            onClick={() => {
              thumbStripRef.current?.scrollBy({ left: -SCROLL_PX, behavior: "smooth" });
              show(current - 1);
            }}
            className="group flex w-8 shrink-0 items-center justify-center bg-white text-stone-400 transition-all duration-300 hover:text-stone-900"
          >
            <svg className="size-3.5 transition-transform duration-300 group-hover:-translate-x-px" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>

          <div className="relative min-w-0 flex-1 overflow-hidden">
            <div
              ref={thumbStripRef}
              className="flex gap-2 overflow-x-auto scroll-smooth"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {images.map((image, i) => (
                <button
                  key={image}
                  ref={(node) => {
                    thumbRefs.current[i] = node;
                  }}
                  type="button"
                  aria-label={`View image ${i + 1}`}
                  onClick={() => show(i)}
                  className={`group aspect-[4/5] w-[70px] shrink-0 overflow-hidden border-2 transition-all duration-300 ${i === current ? "border-stone-800 opacity-100" : "border-transparent opacity-50 hover:border-stone-300 hover:opacity-80"}`}
                >
                  <Image
                    src={image}
                    alt={`${title} — thumbnail ${i + 1}`}
                    width={140}
                    height={175}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            aria-label="Next image"
            onClick={() => {
              thumbStripRef.current?.scrollBy({ left: SCROLL_PX, behavior: "smooth" });
              show(current + 1);
            }}
            className="group flex w-8 shrink-0 items-center justify-center bg-white text-stone-400 transition-all duration-300 hover:text-stone-900"
          >
            <svg className="size-3.5 transition-transform duration-300 group-hover:translate-x-px" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
