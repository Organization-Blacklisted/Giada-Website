import type { Metadata } from "next";
import OurStoryPageClient from "@/components/sections/our-story/OurStoryPageClient";
import { getOurStoryPage, getOurStoryRaw } from "@/lib/api/our-story";
import { buildPageMetadata } from "@/lib/metadata";

const DEFAULT_TITLE = "Our Story";
const DEFAULT_DESCRIPTION =
  "Four generations. One passion. The century-long story of Giada — from a family loom in India to the world's most extraordinary interiors.";

// CMS-editable now (the "SEO" tab on the our-story-page global) — these
// constants stay as the fallback when those fields are left blank, same
// real copy this page always had before the SEO tab existed.
export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getOurStoryPage();
  return buildPageMetadata({
    title: seo.metaTitle || DEFAULT_TITLE,
    description: seo.metaDescription || DEFAULT_DESCRIPTION,
    path: "/our-story",
    image: seo.ogImage || undefined,
    noIndex: seo.noIndex,
  });
}

export default async function OurStoryPage() {
  const raw = await getOurStoryRaw();

  return <OurStoryPageClient initialData={raw} />;
}
