import Accordion from "@/components/ui/Accordion";
import { faqs } from "@/data/faq";

export const metadata = {
  title: "FAQ",
  description:
    "Answers to the most common questions about Giada's bespoke rug service — sizing, shipping, payment, trade programme, and more.",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero — pt-24 lg:pt-32 clears the fixed navbar, confirmed pattern */}
      <section className="px-5 pb-16 pt-24 md:px-10 lg:px-16 lg:pt-32">
        <div className="relative mx-auto max-w-5xl text-center">
          <div className="mb-8 flex items-center justify-center gap-4">
            <span className="h-px w-10 bg-stone-300" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-stone-400">
              Everything You Need to Know
            </p>
            <span className="h-px w-10 bg-stone-300" />
          </div>
          <h1 className="font-heading text-5xl font-normal leading-none tracking-tight text-stone-900 sm:text-6xl lg:text-7xl">
            Frequently Asked Questions
          </h1>
        </div>
      </section>

      <section className="px-5 pb-24 md:px-10 lg:px-16">
        <div className="mx-auto max-w-3xl">
          <Accordion
            items={faqs.map((item) => ({ id: item.id, title: item.question, content: item.answer }))}
          />
        </div>
      </section>

      {/* TODO: real source ends with a ContactCTA strip ("Still Have
          Questions?") — components/ui/ContactCTA isn't built yet, add
          once it exists. */}
    </>
  );
}
