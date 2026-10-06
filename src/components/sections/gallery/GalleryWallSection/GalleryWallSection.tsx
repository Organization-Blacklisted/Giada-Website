"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap-init";
import type { GalleryItem, GalleryWallSectionProps } from "./GalleryWallSection.types";

const aspectByShape: Record<GalleryItem["shape"], string> = {
  portrait: "aspect-[4/5]",
  landscape: "aspect-[16/10]",
  square: "",
};

const spanByShape: Record<GalleryItem["shape"], string> = {
  portrait: "",
  landscape: "sm:col-span-2",
  square: "",
};

const sizesByShape: Record<GalleryItem["shape"], string> = {
  portrait: "(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw",
  landscape: "(max-width: 639px) 100vw, 66vw",
  square: "(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw",
};

function filterBtnClass(isActive: boolean) {
  return `relative cursor-pointer border-none bg-transparent pb-1.5 pt-0.5 text-[11px] font-semibold uppercase tracking-[0.25em] transition-colors duration-300 after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-center after:bg-stone-900 after:transition-transform after:duration-[350ms] after:content-[''] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-[3px] focus-visible:outline-stone-400 ${
    isActive ? "text-stone-900 after:scale-x-100" : "text-stone-400 after:scale-x-0 hover:text-stone-600"
  }`;
}

// Ported from the real source's pages/gallery.astro — the filter nav,
// grid, and lightbox, all together, matching how the real vanilla-JS
// version actually couples them (one filter click changes the active
// button, the live count, AND which tiles are visible, all at once).
// Kept as one client component rather than splitting filter/grid/
// lightbox into three, to avoid faking that coupling back together via
// prop-drilling across component boundaries.
//
// All 16 items stay mounted at all times — filtering toggles a
// `hidden` class, it does NOT remove non-matching items from the
// array/DOM. This matches the real source exactly (it toggles
// `item.style.display`, never unmounts), and is why the entrance
// stagger effect below only needs to run once on mount: there's no
// remount-on-filter-change to worry about re-triggering it.
export default function GalleryWallSection({ items, className = "" }: GalleryWallSectionProps) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const revealedRef = useRef<Set<number>>(new Set());
  const itemTweensRef = useRef<Array<gsap.core.Tween | undefined>>([]);
  const prevFilterRef = useRef<string | null>(null);

  const categories = useMemo(() => [...new Set(items.map((i) => i.category))], [items]);
  const visibleCount = useMemo(
    () => (activeFilter === "all" ? items.length : items.filter((i) => i.category === activeFilter).length),
    [items, activeFilter]
  );

  // Entrance stagger: the real source's bespoke scroll-triggered
  // scale+fade (confirmed this project's shared [data-reveal] system is
  // deliberately plain-opacity only, no scale/stagger support — see
  // ScrollReveal.tsx's own comment — so this needs its own effect, same
  // precedent as HeroSlideshowSection's Ken Burns/entrance timeline).
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tweens = itemTweensRef.current;
    const els = itemRefs.current;
    const revealed = revealedRef.current;
    els.forEach((el, i) => {
      // Guards against React Strict Mode's dev-only double-invoke of
      // this effect (mount -> cleanup -> mount again): `gsap.fromTo()`
      // snaps the element to its `opacity:0` "from" state the instant a
      // new tween is created, even before any ScrollTrigger fires.
      // Without this guard, the second Strict Mode pass silently undid
      // an already-correct reveal (either a natural ScrollTrigger fire
      // or the force-reveal effect below) by creating a fresh tween over
      // it — confirmed via direct inline-style logging, not assumed.
      if (!el || revealed.has(i)) return;
      tweens[i] = gsap.fromTo(
        el,
        { opacity: 0, scale: 0.92 },
        {
          opacity: 1,
          scale: 1,
          duration: reduced ? 0.01 : 0.65,
          ease: "expo.out",
          delay: reduced ? 0 : (i % 4) * 0.07,
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            once: true,
            onEnter: () => revealed.add(i),
          },
        }
      );
    });
    return () => {
      tweens.forEach((tw, i) => {
        if (!tw) return;
        // If this tile's ScrollTrigger already fired (synchronously, for
        // tiles already within view at setup) but React Strict Mode's
        // dev-only cleanup runs before its 0.65s animation actually
        // finishes playing, the tween gets killed mid-flight, stuck at
        // whatever opacity it had reached in that brief window (near 0,
        // since cleanup runs almost immediately after mount). Snap the
        // TWEEN itself to its completed state via `.progress(1)` rather
        // than `gsap.set(el, ...)` — by cleanup time, React's Strict
        // Mode ref-detach cycle has already nulled out `els[i]` (the DOM
        // ref callback fires with `null` before this cleanup runs,
        // confirmed by direct logging, not assumed), so a fix relying on
        // the `el` reference silently no-ops here. GSAP's tween object
        // tracks its own target internally and doesn't need it.
        if (revealed.has(i)) tw.progress(1);
        tw.scrollTrigger?.kill();
        tw.kill();
      });
    };
  }, []);

  // Filtering can reveal tiles whose scroll position was never reached
  // (e.g. filtering straight to "Behind the Craft" — the last 5 tiles in
  // DOM order — before ever scrolling that far down) — their entrance
  // tween would otherwise sit stuck at opacity:0 forever, since
  // ScrollTrigger only fires based on actual scroll position, which
  // filtering doesn't change. Real bug, caught live by the user (a blank
  // grid under the "Behind the Craft" filter) — force-complete the
  // entrance for any tile about to become visible that hasn't
  // organically revealed yet, instead of leaving it invisible.
  //
  // Killing just the ScrollTrigger (not the tween) wasn't enough — the
  // orphaned `fromTo` tween was still live and re-applied its `opacity:0`
  // "from" state right after this ran, silently undoing the gsap.set
  // below (confirmed by logging computed opacity immediately after
  // gsap.set: correctly 1 in the moment, back to 0 by the next check).
  // `tween.kill()` kills both the tween AND its linked ScrollTrigger in
  // one call, which is what actually sticks.
  //
  // Also must NOT run its force-reveal logic on the initial mount
  // (activeFilter starts at "all", so without this guard every tile not
  // yet naturally in view would get force-revealed immediately on page
  // load, defeating the entrance animation entirely — confirmed via
  // logging, not assumed). Only acts on a genuine SUBSEQUENT change to
  // activeFilter (a real filter click), tracked via prevFilterRef rather
  // than a plain "is this the first render" flag, since React Strict
  // Mode's dev-only double-invoke would otherwise still treat its second
  // mount pass as a second distinct opportunity to act.
  useEffect(() => {
    const isRealFilterChange = prevFilterRef.current !== null && prevFilterRef.current !== activeFilter;
    prevFilterRef.current = activeFilter;
    if (!isRealFilterChange) return;

    items.forEach((item, i) => {
      const isVisible = activeFilter === "all" || item.category === activeFilter;
      if (!isVisible || revealedRef.current.has(i)) return;
      const el = itemRefs.current[i];
      if (!el) return;
      itemTweensRef.current[i]?.kill();
      gsap.set(el, { opacity: 1, scale: 1 });
      revealedRef.current.add(i);
    });
  }, [activeFilter, items]);

  // Lightbox: a plain native <dialog> (showModal/close), same as the
  // real source — no carousel/modal library needed for something this
  // simple. The "close" listener is the single source of truth that
  // clears React state, covering all three dismiss paths (close button,
  // Escape key, backdrop click) at once, since all three ultimately just
  // call/trigger the dialog's own native close.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (lightboxItem && !dialog.open) dialog.showModal();
  }, [lightboxItem]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => setLightboxItem(null);
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, []);

  return (
    <>
      <section className={`px-5 md:px-10 lg:px-16 ${className}`}>
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center gap-2 pb-10 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-stone-400">
              {visibleCount} image{visibleCount === 1 ? "" : "s"}
            </p>
          </div>

          <nav
            aria-label="Filter gallery by category"
            className="mb-10 flex flex-wrap items-center justify-center gap-x-9 gap-y-4"
          >
            <button
              type="button"
              aria-pressed={activeFilter === "all"}
              onClick={() => setActiveFilter("all")}
              className={filterBtnClass(activeFilter === "all")}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                aria-pressed={activeFilter === cat}
                onClick={() => setActiveFilter(cat)}
                className={filterBtnClass(activeFilter === cat)}
              >
                {cat}
              </button>
            ))}
          </nav>
        </div>
      </section>

      <section className="px-5 pb-32 md:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-5 [grid-auto-flow:dense] sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, i) => {
              const visible = activeFilter === "all" || item.category === activeFilter;
              return (
                <button
                  key={item.image}
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  type="button"
                  data-category={item.category}
                  onClick={() => setLightboxItem(item)}
                  className={`group relative block w-full cursor-pointer overflow-hidden border-none bg-stone-200 p-0 text-left focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-[3px] focus-visible:outline-stone-400 ${spanByShape[item.shape]} ${visible ? "" : "hidden"}`}
                >
                  <Image
                    src={item.image}
                    alt={item.alt}
                    width={item.shape === "square" ? item.imageWidth : item.shape === "landscape" ? 1600 : 1200}
                    height={item.shape === "square" ? item.imageHeight : item.shape === "landscape" ? 1000 : 1500}
                    sizes={sizesByShape[item.shape]}
                    loading="lazy"
                    className={`block w-full transition-transform duration-[900ms] [transition-timing-function:cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.04] group-focus-visible:scale-[1.04] ${aspectByShape[item.shape]} ${item.shape !== "square" ? "h-full object-cover" : ""}`}
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 flex flex-col items-start justify-end gap-[9px] bg-[rgba(12,10,9,0.26)] p-[22px_24px] opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
                  >
                    <span className="block h-px w-[22px] bg-white/50" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <dialog
        ref={dialogRef}
        aria-label="Image viewer"
        onClick={(e) => {
          if (e.target === dialogRef.current) dialogRef.current?.close();
        }}
        className="fixed inset-0 m-0 hidden h-full max-h-full w-full max-w-full items-center justify-center border-none bg-[rgba(9,8,7,0.96)] p-8 pb-10 pt-12 backdrop:hidden [&[open]]:flex [&[open]]:animate-[lbFadeIn_0.28s_ease_both]"
      >
        <button
          type="button"
          onClick={() => dialogRef.current?.close()}
          aria-label="Close"
          className="absolute right-7 top-[22px] cursor-pointer border-none bg-transparent p-2 leading-none text-white/30 transition-colors duration-200 hover:text-white/80"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>

        {lightboxItem && (
          <figure className="m-0 flex animate-[lbScaleIn_0.38s_cubic-bezier(0.16,1,0.3,1)_0.05s_both] flex-col items-center gap-5">
            <Image
              src={lightboxItem.image}
              alt={lightboxItem.alt}
              width={lightboxItem.imageWidth}
              height={lightboxItem.imageHeight}
              unoptimized
              className="block h-auto max-h-[82vh] w-auto max-w-[min(86vw,1100px)] object-contain"
            />
            <figcaption className="m-0 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/30">
              {lightboxItem.alt}
            </figcaption>
          </figure>
        )}
      </dialog>
    </>
  );
}
