"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap-init";
import styles from "./ImageReelSection.module.css";
import type { ImageReelSectionProps } from "./ImageReelSection.types";

// Scroll animation driven by GSAP instead of a CSS @keyframes animation
// (the CSS Module version wasn't actually applying under this project's
// Turbopack build — switched to GSAP since it's already this project's
// established animation library, used by ScrollReveal and EnquiryForm's
// field stagger). Functionally identical to the real source: linear,
// infinite, xPercent: -33.333 (exactly one of the three tripled copies)
// — gsap's xPercent, like CSS translateX(%), is relative to the
// element's own box width, so the math carries over directly.
//
// Responsive duration uses a plain `window.matchMedia` + change listener
// (same pattern as EnquiryForm's reduced-motion check and Header's
// resize handling) rather than `gsap.matchMedia()` — confirmed via
// direct testing that `gsap.matchMedia().add()`'s callback never fires
// in this project's setup, while a bare `gsap.to()` call animates
// correctly. Not worth chasing further when a proven, already-used
// pattern does the same job.
//
// Note on a real-source quirk NOT carried forward: ImageBar.astro has a
// `.image-reel:hover .image-reel-track { animation-play-state: running }`
// rule — verified it's dead code (the track's default state is already
// "running", so the hover rule sets the same value). Not reproducing a
// no-op. The per-image hover scale-up IS real and working, and is kept
// (see the className below).
export default function ImageReelSection({ images, className = "" }: ImageReelSectionProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const reelImages = [...images, ...images, ...images];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const mobileQuery = window.matchMedia("(max-width: 768px)");
    let tween = gsap.to(track, {
      xPercent: -33.333,
      duration: mobileQuery.matches ? 24 : 34,
      ease: "none",
      repeat: -1,
    });

    const onBreakpointChange = (e: MediaQueryListEvent) => {
      const progress = tween.progress();
      tween.kill();
      tween = gsap.to(track, {
        xPercent: -33.333,
        duration: e.matches ? 24 : 34,
        ease: "none",
        repeat: -1,
      });
      tween.progress(progress);
    };
    mobileQuery.addEventListener("change", onBreakpointChange);

    return () => {
      mobileQuery.removeEventListener("change", onBreakpointChange);
      tween.kill();
    };
  }, []);

  return (
    <section
      className={`w-full overflow-hidden border-t border-stone-200 bg-white py-12 md:py-16 ${styles.wrap} ${className}`}
    >
      <div className={styles.reel}>
        <div ref={trackRef} className={styles.track}>
          {reelImages.map((image, i) => (
            <div key={`${image.src}-${i}`} className={styles.item}>
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 68vw, 22vw"
                className="pointer-events-none object-cover transition-transform duration-700 ease-out select-none hover:scale-[1.06]"
                draggable={false}
                loading={i < images.length ? "eager" : "lazy"}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
