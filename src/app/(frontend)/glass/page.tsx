import type { Metadata } from "next";
import GlassPageClient from "@/components/sections/glass/GlassPageClient";
import { getGlassPage, getGlassRaw } from "@/lib/api/glass";

const DEFAULT_TITLE = "Textile in Glass";
const DEFAULT_DESCRIPTION =
  "A new dimension in architectural surfaces. Textiles and elements encapsulated in glass — bespoke panels where craft meets transparency.";

// CMS-editable now (the "SEO" tab on the glass-page global) — these
// constants stay as the fallback when those fields are left blank, same
// real copy this page always had before the SEO tab existed.
export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getGlassPage();
  return {
    title: seo.metaTitle || DEFAULT_TITLE,
    description: seo.metaDescription || DEFAULT_DESCRIPTION,
    ...(seo.ogImage ? { openGraph: { images: [{ url: seo.ogImage }] } } : {}),
    ...(seo.noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function GlassPage() {
  const raw = await getGlassRaw();

  return <GlassPageClient initialData={raw} />;
}
