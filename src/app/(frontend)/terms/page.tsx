import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TermsPageClient from "@/components/ui/LegalDocumentSection/TermsPageClient";
import { getTermsPage, getTermsRaw } from "@/lib/api/terms";
import { buildPageMetadata } from "@/lib/metadata";

const DEFAULT_TITLE = "Terms & Conditions";
const DEFAULT_DESCRIPTION = "The General Terms & Conditions that govern all sales by Giada Inc.";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getTermsPage();
  return buildPageMetadata({
    title: seo.metaTitle || DEFAULT_TITLE,
    description: seo.metaDescription || DEFAULT_DESCRIPTION,
    path: "/terms",
    image: seo.ogImage || undefined,
    noIndex: seo.noIndex,
  });
}

export default async function TermsPage() {
  // Not ready to reveal to the client yet. Code ships with this push,
  // but the route 404s publicly. Remove this line when /terms is ready
  // to go live (matches Payload's own hidden: true on Privacy.ts,
  // Terms.ts, Shipping.ts).
  notFound();

  const raw = await getTermsRaw();

  return <TermsPageClient initialData={raw} />;
}
