import type { Metadata } from "next";
import PrivacyPageClient from "@/components/ui/LegalDocumentSection/PrivacyPageClient";
import { getPrivacyPage, getPrivacyRaw } from "@/lib/api/privacy";
import { buildPageMetadata } from "@/lib/metadata";

const DEFAULT_TITLE = "Privacy Policy";
const DEFAULT_DESCRIPTION =
  "How Giada Inc. collects, uses, and protects your personal information when you use our website or services.";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getPrivacyPage();
  return buildPageMetadata({
    title: seo.metaTitle || DEFAULT_TITLE,
    description: seo.metaDescription || DEFAULT_DESCRIPTION,
    path: "/privacy",
    image: seo.ogImage || undefined,
    noIndex: seo.noIndex,
  });
}

export default async function PrivacyPage() {
  const raw = await getPrivacyRaw();

  return <PrivacyPageClient initialData={raw} />;
}
