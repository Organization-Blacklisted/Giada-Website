"use client";

import dynamic from "next/dynamic";

// The real source used Astro's `client:only="react"` here — skips SSR
// entirely for this component. It's not optional: Glitchy404 calls
// Math.random() during render (per-glyph shake delay), so a server
// render and the first client render would produce different values
// and React would flag a hydration mismatch. `ssr: false` is the direct
// Next.js equivalent of `client:only`.
const Glitchy404 = dynamic(() => import("./Glitchy404"), { ssr: false });

export default Glitchy404;

export type { Glitchy404Props } from "./Glitchy404.types";
