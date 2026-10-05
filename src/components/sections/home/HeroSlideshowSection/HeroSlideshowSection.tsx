"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/lib/gsap-init";
import { splitChars } from "@/lib/animations";
import type { HeroSlideshowSectionProps } from "./HeroSlideshowSection.types";

// Ported from the real source's HeroSlideshow.astro — full carousel
// machinery (autoplay, dots, keyboard, swipe, Ken Burns) even though the
// real source currently only configures ONE slide (its `slides` array
// has a single entry; three other images sit unused in its assets
// folder, never wired into the config — not fabricated into extra
// slides here). With one slide `activate()` always normalizes back to
// index 0 and early-returns, same as the real source — harmless, not
// special-cased away, so this keeps working unmodified the moment a
// second slide is added later.
//
// Real source's prev/next arrow buttons are commented out in the markup
// (not rendered on the live site) — not rendered here either. Keyboard
// arrows, dot clicks, swipe, and autoplay are all real and live.
const AUTOPLAY_MS = 5500;
const SWIPE_THRESHOLD = 44;

export default function HeroSlideshowSection({
  eyebrow,
  title,
  taglineLine1,
  taglineLine2,
  slides,
  className = "",
}: HeroSlideshowSectionProps) {
  const total = slides.length;
  const [current, setCurrent] = useState(0);

  const sectionRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollBarRef = useRef<HTMLDivElement>(null);
  const imgRefs = useRef<Array<HTMLImageElement | null>>([]);
  const currentRef = useRef(0);
  const autoplayRef = useRef<number | undefined>(undefined);
  const touchXRef = useRef(0);

  const startKenBurns = useCallback((index: number) => {
    const img = imgRefs.current[index];
    if (!img) return;
    img.style.animation = "none";
    void img.offsetWidth; // force reflow so the animation re-triggers
    img.style.animation = "kenBurns 10s ease-out forwards";
  }, []);

  const activate = useCallback(
    (next: number) => {
      const normalized = ((next % total) + total) % total;
      if (normalized === currentRef.current) return;

      const prevImg = imgRefs.current[currentRef.current];
      if (prevImg) prevImg.style.animationPlayState = "paused";

      currentRef.current = normalized;
      setCurrent(normalized);
      startKenBurns(normalized);
    },
    [total, startKenBurns]
  );

  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current !== undefined) {
      window.clearInterval(autoplayRef.current);
      autoplayRef.current = undefined;
    }
  }, []);

  const startAutoplay = useCallback(() => {
    stopAutoplay();
    autoplayRef.current = window.setInterval(() => {
      activate(currentRef.current + 1);
    }, AUTOPLAY_MS);
  }, [activate, stopAutoplay]);

  // Initial Ken Burns + autoplay
  useEffect(() => {
    startKenBurns(0);
    startAutoplay();
    return stopAutoplay;
  }, [startKenBurns, startAutoplay, stopAutoplay]);

  // Keyboard, touch swipe, hover pause/resume — all on the root element,
  // matching the real source's event target exactly.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        activate(currentRef.current - 1);
        startAutoplay();
      }
      if (e.key === "ArrowRight") {
        activate(currentRef.current + 1);
        startAutoplay();
      }
    };
    const onTouchStart = (e: TouchEvent) => {
      touchXRef.current = e.touches[0].clientX;
    };
    const onTouchEnd = (e: TouchEvent) => {
      const dx = touchXRef.current - e.changedTouches[0].clientX;
      if (Math.abs(dx) > SWIPE_THRESHOLD) {
        activate(dx > 0 ? currentRef.current + 1 : currentRef.current - 1);
        startAutoplay();
      }
    };
    const onMouseEnter = () => stopAutoplay();
    const onMouseLeave = () => startAutoplay();

    el.addEventListener("keydown", onKeyDown);
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    el.addEventListener("mouseenter", onMouseEnter);
    el.addEventListener("mouseleave", onMouseLeave);
    return () => {
      el.removeEventListener("keydown", onKeyDown);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("mouseenter", onMouseEnter);
      el.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [activate, startAutoplay, stopAutoplay]);

  // Entrance animation: eyebrow fade, title char-stagger, line scale,
  // tagline fade, scroll indicator fade, looping scroll-bar, and a
  // scroll-driven parallax on the whole overlay — exact timeline offsets
  // from the real source's <script>, runs once on mount.
  useEffect(() => {
    const title = titleRef.current;
    if (!title) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const d = (n: number) => (reduced ? 0.01 : n);

    const chars = splitChars(title);
    // Chars must be pinned to their starting state synchronously, before the
    // title container is revealed below. tl.from() targets default to
    // immediateRender:false when they're inside a timeline, so without this
    // the chars sit at their natural (visible, y:0) state for the ~0.5s
    // between this effect running and the timeline's playhead actually
    // reaching the char tween (0.2s timeline delay + 0.3s position) — the
    // full title flashes in at rest, then snaps to y:60/opacity:0 and
    // staggers back up. Confirmed this exact sequence via GSAP's own
    // documented immediateRender-in-timelines behavior, not a guess.
    //
    // Using fromTo() below (not from()) is required once this gsap.set()
    // exists: from()'s implicit "to" value is inferred from GSAP's own
    // tracked current value for that property, which this gsap.set() call
    // just overwrote — so a from()-only tween would animate from y:60 to
    // y:60 (itself), a zero-delta no-op. Confirmed by testing: chars stayed
    // permanently invisible with from(). fromTo()'s explicit end values
    // sidestep that inference entirely.
    gsap.set(chars, { y: reduced ? 0 : 60, opacity: 0 });
    gsap.set(title, { opacity: 1 });

    const tl = gsap.timeline({ delay: 0.2 });
    tl.to(eyebrowRef.current, { opacity: 1, y: 0, duration: d(0.7), ease: "expo.out" }, 0);
    tl.fromTo(
      chars,
      { y: reduced ? 0 : 60, opacity: 0 },
      { y: 0, opacity: 1, duration: d(1.1), stagger: reduced ? 0 : 0.04, ease: "expo.out" },
      0.3
    );
    tl.to(lineRef.current, { opacity: 1, scaleX: 1, duration: d(0.8), ease: "expo.out" }, 1.2);
    tl.to(taglineRef.current, { opacity: 1, y: 0, duration: d(0.7), ease: "expo.out" }, 1.5);
    tl.to(scrollRef.current, { opacity: 1, duration: d(0.5), ease: "expo.out" }, 1.9);

    let scrollBarTween: gsap.core.Tween | undefined;
    if (scrollBarRef.current && !reduced) {
      scrollBarTween = gsap.to(scrollBarRef.current, {
        y: "100%",
        opacity: 0,
        duration: 1.4,
        ease: "power2.in",
        repeat: -1,
        delay: 2.2,
        onRepeat() {
          gsap.set(scrollBarRef.current, { y: "-100%", opacity: 0.8 });
        },
      });
    }

    let scrollTrigger: ScrollTrigger | undefined;
    if (overlayRef.current && sectionRef.current) {
      const parallax = gsap.to(overlayRef.current, {
        y: -80,
        ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: true },
      });
      scrollTrigger = parallax.scrollTrigger;
    }

    return () => {
      tl.kill();
      scrollBarTween?.kill();
      scrollTrigger?.kill();
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className={`relative h-[90vh] w-full select-none overflow-hidden lg:h-screen ${className}`}
      aria-label="Hero image slideshow"
      aria-roledescription="carousel"
      tabIndex={0}
    >
      {slides.map((slide, i) => (
        <div
          key={slide.src}
          className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
          role="group"
          aria-roledescription="slide"
          aria-label={`Slide ${i + 1} of ${total}`}
          aria-hidden={i !== current}
        >
          <Image
            ref={(node) => {
              imgRefs.current[i] = node;
            }}
            src={slide.src}
            alt={slide.alt}
            fill
            sizes="100vw"
            className="absolute inset-0 h-full w-full object-cover"
            priority={i === 0}
            loading={i === 0 ? "eager" : "lazy"}
          />
        </div>
      ))}

      <div className="pointer-events-none absolute inset-0 z-[2] bg-black/25" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-48 bg-gradient-to-t from-black/40 to-transparent"
        aria-hidden="true"
      />

      <div
        ref={overlayRef}
        className="pointer-events-none absolute inset-0 z-[5] flex flex-col items-center justify-center px-6 text-center text-white"
      >
        <p
          ref={eyebrowRef}
          className="mb-7 text-[9px] font-normal uppercase tracking-[0.55em] text-white"
          style={{ opacity: 0 }}
        >
          {eyebrow}
        </p>

        <h1
          ref={titleRef}
          className="font-heading text-3xl font-normal tracking-[0.06em] text-white md:text-7xl"
          style={{ opacity: 0 }}
        >
          {title}
        </h1>

        <div
          ref={lineRef}
          className="mt-8 h-px w-14 origin-center bg-white/45"
          style={{ opacity: 0, transform: "scaleX(0)" }}
          aria-hidden="true"
        />

        <p
          ref={taglineRef}
          className="mt-6 max-w-xl text-center text-[11px] font-normal leading-[1.8] tracking-[0.1em] text-white drop-shadow-sm"
          style={{ opacity: 0 }}
        >
          {taglineLine1}
          <br className="hidden sm:block" /> {taglineLine2}
        </p>
      </div>

      <div
        ref={scrollRef}
        className="pointer-events-none absolute bottom-20 left-1/2 z-[5] flex -translate-x-1/2 flex-col items-center gap-2"
        style={{ opacity: 0 }}
        aria-hidden="true"
      >
        <span className="text-[8px] uppercase tracking-[0.45em] text-white/50">Scroll</span>
        <div className="relative h-9 w-px overflow-hidden bg-white/20">
          <div ref={scrollBarRef} className="absolute inset-x-0 top-0 bg-white/70" style={{ height: "100%" }} />
        </div>
      </div>

      <div
        className="absolute bottom-7 left-1/2 z-[20] flex -translate-x-1/2 items-center gap-2"
        role="tablist"
        aria-label="Slideshow navigation"
      >
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === current}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => {
              activate(i);
              startAutoplay();
            }}
            className={`h-[2px] cursor-pointer rounded-full bg-white transition-all duration-500 ${
              i === current ? "w-8 opacity-90" : "w-3 opacity-35"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
