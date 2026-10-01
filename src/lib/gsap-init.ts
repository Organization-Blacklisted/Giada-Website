// Single source of truth for GSAP + ScrollTrigger, so the plugin is
// registered exactly once. Ported verbatim from the real Astro source
// (src/lib/gsap-init.ts) — framework-agnostic, no changes needed.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };
