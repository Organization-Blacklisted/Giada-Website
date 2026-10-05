import ContactCtaBanner from "@/components/ui/ContactCtaBanner";
import FaqHeroSection from "@/components/sections/faq/FaqHeroSection";
import FaqListSection from "@/components/sections/faq/FaqListSection";
import { getFaqPage } from "@/lib/api/faq";

export const metadata = {
  title: "FAQ",
  description:
    "Answers to the most common questions about Giada's bespoke rug service — sizing, shipping, payment, trade programme, and more.",
};

export default async function FaqPage() {
  const { hero, items, closingCta } = await getFaqPage();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <FaqHeroSection {...hero} />
      <FaqListSection items={items} />
      <ContactCtaBanner {...closingCta} />
    </>
  );
}
