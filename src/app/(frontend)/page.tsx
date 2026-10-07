import HomePageClient from "@/components/sections/home/HomePageClient";
import { getHomeRaw } from "@/lib/api/home";

// Real source's home page (pages/index.astro) order, fully built, plus
// two new client-provided sections not in the real source: `values`
// ("Living Art Beyond Simple Decor", via Figma, 2026-10-06), placed
// between CategoryGrid and ProcessStrip per the client's own mockup,
// and `collaborationsSlider` ("Where Two Visions Weave as One", via
// Figma node 579:90, 2026-10-06), placed below ProcessStrip per
// explicit instruction. Section order itself lives in HomePageClient.tsx
// now — this just hands it the raw document for Live Preview to drive.
export default async function Home() {
  const raw = await getHomeRaw();

  return <HomePageClient initialData={raw} />;
}
