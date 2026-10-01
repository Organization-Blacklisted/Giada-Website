// Ported verbatim from the real Astro source (src/lib/animations.ts) —
// framework-agnostic (browser-guarded already via `reduced()`), no logic
// changes needed. Call these from inside a useEffect in a Client
// Component, never at module/render scope.
import { gsap } from "./gsap-init";

const reduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const dur = (n: number) => (reduced() ? 0.01 : n);
const staggerVal = (n: number) => (reduced() ? 0 : n);

/**
 * Split an element's direct text into per-character inline-block spans.
 * Returns the inner (animatable) spans.
 */
export function splitChars(el: HTMLElement): HTMLElement[] {
  const text = el.textContent ?? "";
  el.innerHTML = text
    .split("")
    .map((c) =>
      c === " "
        ? `<span style="display:inline-block;width:0.28em"> </span>`
        : `<span style="display:inline-block"><span style="display:inline-block">${c}</span></span>`
    )
    .join("");
  return [...el.querySelectorAll<HTMLElement>("span > span")];
}

/**
 * Split an element whose children are <span class="block"> lines.
 * Splits chars within each line span, returns all inner spans.
 */
export function splitLineChars(el: HTMLElement): HTMLElement[] {
  const lines = [...el.querySelectorAll<HTMLElement>(":scope > span")];
  if (lines.length === 0) return splitChars(el);
  const all: HTMLElement[] = [];
  lines.forEach((line) => all.push(...splitChars(line)));
  return all;
}

/**
 * Animate an array of character spans in from below.
 */
export function charReveal(chars: HTMLElement[], delay = 0): gsap.core.Tween {
  return gsap.from(chars, {
    y: 60,
    opacity: 0,
    duration: dur(1.1),
    stagger: staggerVal(0.04),
    ease: "expo.out",
    delay,
  });
}

/**
 * Magnetic hover: card drifts toward cursor on mousemove, resets on leave.
 * No-ops on touch devices.
 */
export function magneticHover(el: HTMLElement, strength = 0.25): void {
  if (typeof window === "undefined" || window.matchMedia("(pointer: coarse)").matches) return;

  const moveX = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" });
  const moveY = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" });

  el.addEventListener("mousemove", (e) => {
    const r = el.getBoundingClientRect();
    moveX((e.clientX - (r.left + r.width / 2)) * strength);
    moveY((e.clientY - (r.top + r.height / 2)) * strength);
  });
  el.addEventListener("mouseleave", () => {
    moveX(0);
    moveY(0);
  });
}

/**
 * Curtain reveal: a stone-coloured div slides off to the right, revealing
 * the element beneath. Fires once when triggerEl enters the viewport.
 */
export function curtainReveal(curtain: HTMLElement, trigger: HTMLElement): void {
  gsap.to(curtain, {
    xPercent: -101,
    duration: dur(1.2),
    ease: "expo.inOut",
    scrollTrigger: { trigger, start: "top 70%", once: true },
  });
}

/**
 * Subtle vertical parallax on an element as its section scrolls through viewport.
 * The element floats `yRange` px down across the full scroll travel.
 */
export function parallaxElement(el: HTMLElement, section: HTMLElement, yRange = 30): void {
  if (reduced()) return;
  gsap.fromTo(
    el,
    { y: 0 },
    {
      y: yRange,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    }
  );
}
