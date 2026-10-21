import type { Metadata } from "next";
import CollaborationsPageClient from "@/components/sections/collaborations/CollaborationsPageClient";
import { getCollaborationsPage, getCollaborationsRaw, getCollaborationItemsRaw, mapCollaborationItem } from "@/lib/api/collaborations";
import { buildPageMetadata } from "@/lib/metadata";

const DEFAULT_TITLE = "Collaborations";
const DEFAULT_DESCRIPTION =
  "Giada's designer collaborations — where a singular creative vision meets four generations of hand-knotting mastery. Limited collections, made entirely to order.";

// CMS-editable now (the "SEO" tab on the collaborations-page global) —
// these constants stay as the fallback when those fields are left
// blank, same real copy this page always had before the SEO tab existed.
export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getCollaborationsPage();
  return buildPageMetadata({
    title: seo.metaTitle || DEFAULT_TITLE,
    description: seo.metaDescription || DEFAULT_DESCRIPTION,
    path: "/collaborations",
    image: seo.ogImage || undefined,
    noIndex: seo.noIndex,
  });
}

export default async function CollaborationsPage() {
  const [raw, itemDocs] = await Promise.all([getCollaborationsRaw(), getCollaborationItemsRaw()]);
  const items = itemDocs.map(mapCollaborationItem);

  return <CollaborationsPageClient initialData={raw} items={items} />;
}
