"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ScrollTrigger } from "@/lib/gsap-init";

/**
 * Mount once in the root layout. Renders nothing — sets up the
 * [data-reveal] fade-in IntersectionObserver and refreshes ScrollTrigger
 * on every page.
 *
 * Astro's version hooked `astro:page-load` (re-init on every page) and
 * `astro:before-swap` (kill ScrollTriggers before the next page's DOM
 * takes over) — those events don't exist here. `usePathname()` as the
 * effect dependency is the App Router equivalent: the effect re-runs on
 * every client-side navigation, and its cleanup (which kills all
 * ScrollTriggers) fires right before that re-run, same shape as the
 * Astro page-load/before-swap pair.
 *
 * No stagger delay. The real Astro source authors `data-reveal-delay="150"`
 * (numeric ms) on ~every [data-reveal] element, but its own reveal script
 * (layouts/Layout.astro's `initFadeReveal()`) never reads it — confirmed
 * by reading that script directly, not just grepping for absence: every
 * `[data-reveal]` element gets its own independent IntersectionObserver
 * entry and fades in the instant *that* element crosses the 0.12
 * threshold, full stop. A past version of this component "restored" the
 * delay as a real `transition-delay` since the authored values looked
 * concrete and intentional — that diverged from live (confirmed
 * 2026-10-05 when the user caught the FAQ closing-CTA band staggering
 * item-by-item instead of fading as one cluster, the way it does live).
 * Elements that are visually close together already read as "fading
 * together" under plain independent observation, since they cross the
 * 12% threshold within the same frame or two during a normal scroll —
 * no delay needed to produce that effect.
 *
 * NOT restored: the `data-reveal="fade"/"left"/"scale"` variant values.
 * Those names imply distinct transform treatments (slide, scale-up) but
 * — unlike the delay — no actual transform amounts exist anywhere in the
 * source to restore; inventing pixel/scale values now would be a new
 * design decision dressed up as a restoration. All variants still render
 * as the same opacity-only fade (matches confirmed live behavior)
 * until real values are supplied.
 */
export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]");

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));

    ScrollTrigger.refresh();

    return () => {
      io.disconnect();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [pathname]);

  return null;
}
