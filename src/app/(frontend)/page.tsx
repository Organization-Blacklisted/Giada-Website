import type { Metadata } from "next";
import HomePageClient from "@/components/sections/home/HomePageClient";
import { getHomeRaw } from "@/lib/api/home";
import { mapHomeData } from "@/lib/api/home-map";
import { buildPageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/data/site";

// CMS-editable via the "SEO" tab on the Home global — blank fields fall
// back to the site-wide defaults (siteConfig.name/description), same
// behavior as before, now routed through buildPageMetadata (lib/
// metadata.ts) so Home also gets real openGraph/twitter title+
// description+type+siteName instead of just an image.
export async function generateMetadata(): Promise<Metadata> {
  const { seo } = mapHomeData(await getHomeRaw());
  return buildPageMetadata({
    title: seo.metaTitle || siteConfig.name,
    description: seo.metaDescription || siteConfig.description,
    path: "",
    image: seo.ogImage || undefined,
    noIndex: seo.noIndex,
  });
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
