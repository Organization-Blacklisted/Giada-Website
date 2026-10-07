import FaqPageClient from "@/components/sections/faq/FaqPageClient";
import { getFaqPage } from "@/lib/api/faq";

export const metadata = {
  title: "FAQ",
  description:
    "Answers to the most common questions about Giada's bespoke rug service — sizing, shipping, payment, trade programme, and more.",
};

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
