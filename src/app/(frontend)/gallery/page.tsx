import type { Metadata } from "next";
import GalleryPageClient from "@/components/sections/gallery/GalleryPageClient";
import { getGalleryPage, getGalleryRaw } from "@/lib/api/gallery";

const DEFAULT_TITLE = "Gallery";
const DEFAULT_DESCRIPTION = "A visual record of craft, spaces, people, and process — the world behind Giada.";

// CMS-editable now (the "SEO" tab on the gallery-page global) — these
// constants stay as the fallback when those fields are left blank, same
// real copy this page always had before the SEO tab existed.
export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getGalleryPage();
  return {
    title: seo.metaTitle || DEFAULT_TITLE,
    description: seo.metaDescription || DEFAULT_DESCRIPTION,
    ...(seo.ogImage ? { openGraph: { images: [{ url: seo.ogImage }] } } : {}),
    ...(seo.noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function GalleryPage() {
  const raw = await getGalleryRaw();

  return <GalleryPageClient initialData={raw} />;
}
