import type { Metadata } from "next";
import CollaborationsPageClient from "@/components/sections/collaborations/CollaborationsPageClient";
import { getCollaborationsPage, getCollaborationsRaw, getCollaborationItemsRaw, mapCollaborationItem } from "@/lib/api/collaborations";

const DEFAULT_TITLE = "Collaborations";
const DEFAULT_DESCRIPTION =
  "Giada's designer collaborations — where a singular creative vision meets four generations of hand-knotting mastery. Limited collections, made entirely to order.";

// CMS-editable now (the "SEO" tab on the collaborations-page global) —
// these constants stay as the fallback when those fields are left
// blank, same real copy this page always had before the SEO tab existed.
export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getCollaborationsPage();
  return {
    title: seo.metaTitle || DEFAULT_TITLE,
    description: seo.metaDescription || DEFAULT_DESCRIPTION,
    ...(seo.ogImage ? { openGraph: { images: [{ url: seo.ogImage }] } } : {}),
    ...(seo.noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function CollaborationsPage() {
  const [raw, itemDocs] = await Promise.all([getCollaborationsRaw(), getCollaborationItemsRaw()]);
  const items = itemDocs.map(mapCollaborationItem);

  return <CollaborationsPageClient initialData={raw} items={items} />;
}
