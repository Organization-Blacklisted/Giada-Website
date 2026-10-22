import type { Metadata } from "next";
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
  const raw = await getTermsRaw();

  return <TermsPageClient initialData={raw} />;
}
