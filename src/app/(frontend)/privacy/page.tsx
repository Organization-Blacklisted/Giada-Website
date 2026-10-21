import type { Metadata } from "next";
import { notFound } from "next/navigation";
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
  // Not ready to reveal to the client yet. Code ships with this push,
  // but the route 404s publicly. Remove this line when /privacy is
  // ready to go live (matches Payload's own hidden: true on Privacy.ts,
  // Terms.ts, Shipping.ts).
  notFound();

  const raw = await getPrivacyRaw();

  return <PrivacyPageClient initialData={raw} />;
}
