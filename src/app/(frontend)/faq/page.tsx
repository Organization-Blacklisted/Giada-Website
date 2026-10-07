import type { Metadata } from "next";
import FaqPageClient from "@/components/sections/faq/FaqPageClient";
import { getFaqPage } from "@/lib/api/faq";

const DEFAULT_TITLE = "FAQ";
const DEFAULT_DESCRIPTION =
  "Answers to the most common questions about Giada's bespoke rug service — sizing, shipping, payment, trade programme, and more.";

// CMS-editable now (the "SEO" tab on the faq-page global) — these
// constants stay as the fallback when those fields are left blank,
// same real copy this page always had before the SEO tab existed.
export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getFaqPage();
  return {
    title: seo.metaTitle || DEFAULT_TITLE,
    description: seo.metaDescription || DEFAULT_DESCRIPTION,
    ...(seo.ogImage ? { openGraph: { images: [{ url: seo.ogImage }] } } : {}),
    ...(seo.noIndex ? { robots: { index: false, follow: false } } : {}),
  };
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <FaqPageClient initialData={faqData} />
    </>
  );
}
