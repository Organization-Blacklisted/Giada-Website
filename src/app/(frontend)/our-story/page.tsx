import type { Metadata } from "next";
import OurStoryPageClient from "@/components/sections/our-story/OurStoryPageClient";
import { getOurStoryPage, getOurStoryRaw } from "@/lib/api/our-story";

const DEFAULT_TITLE = "Our Story";
const DEFAULT_DESCRIPTION =
  "Four generations. One passion. The century-long story of Giada — from a family loom in India to the world's most extraordinary interiors.";

// CMS-editable now (the "SEO" tab on the our-story-page global) — these
// constants stay as the fallback when those fields are left blank, same
// real copy this page always had before the SEO tab existed.
export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getOurStoryPage();
  return {
    title: seo.metaTitle || DEFAULT_TITLE,
    description: seo.metaDescription || DEFAULT_DESCRIPTION,
    ...(seo.ogImage ? { openGraph: { images: [{ url: seo.ogImage }] } } : {}),
    ...(seo.noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function OurStoryPage() {
  const raw = await getOurStoryRaw();

  return <OurStoryPageClient initialData={raw} />;
}
