import type { Metadata } from "next";
import FaqPageClient from "@/components/sections/faq/FaqPageClient";
import { getFaqPage } from "@/lib/api/faq";
import { buildPageMetadata } from "@/lib/metadata";
import { safeJsonLd } from "@/lib/json-ld";

const DEFAULT_TITLE = "FAQ";
const DEFAULT_DESCRIPTION =
  "Answers to the most common questions about Giada's bespoke rug service — sizing, shipping, payment, trade programme, and more.";

// CMS-editable now (the "SEO" tab on the faq-page global) —

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getFaqPage();
  return buildPageMetadata({
    title: seo.metaTitle || DEFAULT_TITLE,
    description: seo.metaDescription || DEFAULT_DESCRIPTION,
    path: "/faq",
    image: seo.ogImage || undefined,
    noIndex: seo.noIndex,
  });
}

export default async function FaqPage() {
  const faqData = await getFaqPage();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqData.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqSchema) }} />

      <FaqPageClient initialData={faqData} />
    </>
  );
}
