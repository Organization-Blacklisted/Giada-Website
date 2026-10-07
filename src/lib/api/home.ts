import { unstable_cache } from "next/cache";
import { getPayload } from "payload";
import config from "@payload-config";
import type { Home } from "@/payload-types";
import { mapHomeData, type HomePageData } from "./home-map";

export * from "./home-map";

// Full Home page CMS wiring (2026-10-06/07). Every section below is now
// served from Payload's "home" global (src/globals/Home.ts) instead of a
// literal here — started with just Hero as a working test, now extended
// to the whole page the same way. Seeded with the exact real content
// previously hardcoded here (see git history / ARCHITECTURE.md for each
// section's original real-content provenance — the Astro source file it
// came from, or, for `values`/`collaborationsSlider`, the Figma
// mockup that introduced it); this file no longer carries that
// provenance narrative itself since the content now lives in the CMS,
// not in this file's literals.
//
// One real content-shape nuance preserved from the original mock data:
// `collaborationsSlider` still has 3 slides that reuse the same real
// Giada x Dunagan content/images — that was already a deliberate
// placeholder (the client hasn't provided the other 2 collaborations
// yet), not something this migration should silently collapse to 1.
//
// Single findGlobal call wrapped in unstable_cache (tagged "home")
// rather than one cached function per section — Home currently renders
// statically (confirmed via `next build`'s route table: "○ /"), and a
// plain Local API call bypasses Next's Data Cache entirely (that only
// wraps `fetch()`), so without this wrapper the page would never pick up
// edits made in /admin without a full rebuild. The Home global's
// `afterChange` hook calls `revalidateTag("home")` on every save
// (any section), which is why one shared tag for the whole page is the
// right granularity, not a tag per section.
//
// Caches the RAW document, not the mapped HomePageData — Live Preview
// (HomePageClient.tsx) needs the raw shape as `useLivePreview`'s
// `initialData`, since the live updates it receives via postMessage from
// the admin iframe are also raw (unmapped) documents. The mapping itself
// (`mapHomeData`) lives in home-map.ts, a module with no Payload runtime
// imports, specifically so HomePageClient.tsx (a Client Component) can
// import it directly without dragging getPayload/this file's other
// imports into the client bundle — see home-map.ts's own comment for
// what broke when that boundary wasn't there.
// `draft: false` is explicit, not relying on it already being the
// default (which it is) — this is the one line standing between
// visitors and ever seeing someone's unpublished draft, now that
// versions.drafts is enabled on the Home global (src/globals/Home.ts),
// worth being unmistakable about rather than implicit.
export const getHomeRaw = unstable_cache(
  async (): Promise<Home> => {
    const payload = await getPayload({ config });
    return payload.findGlobal({ slug: "home", draft: false });
  },
  ["home-raw"],
  { tags: ["home"] }
);

export async function getHomePage(): Promise<HomePageData> {
  return mapHomeData(await getHomeRaw());
}
