import type { Metadata } from "next";
import HomePageClient from "@/components/sections/home/HomePageClient";
import { getHomeRaw } from "@/lib/api/home";
import { mapHomeData } from "@/lib/api/home-map";

// CMS-editable via the "SEO" tab on the Home global. Keys are omitted
// (not set to `undefined`) when left blank in the CMS, rather than
// hardcoding a fallback here — Home never had its own metadata export
// before this, relying entirely on the root layout's site-wide default
// (siteConfig.name/description), so leaving the CMS fields blank should
// keep producing exactly that, not some new Home-specific default.
export async function generateMetadata(): Promise<Metadata> {
  const { seo } = mapHomeData(await getHomeRaw());
  return {
    ...(seo.metaTitle ? { title: seo.metaTitle } : {}),
    ...(seo.metaDescription ? { description: seo.metaDescription } : {}),
    ...(seo.ogImage ? { openGraph: { images: [{ url: seo.ogImage }] } } : {}),
  };
}

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
