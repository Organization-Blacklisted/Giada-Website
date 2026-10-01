import Container from "@/components/layouts/Container";

export const metadata = { title: "Contact" };

// EnquiryForm (components/sections/contact/EnquiryForm) is built and
// verified, just not wired in here yet — kept off the page per request
// until the rest of the Contact page (the real source's two-column
// layout + showroom section: Google Maps embeds, general contact row,
// LocalBusiness JSON-LD per city) is ready to go live alongside it.
export default function ContactPage() {
  return (
    <Container size="narrow" className="py-24">
      <h1 className="text-3xl font-semibold tracking-tight">Contact</h1>
      <p className="mt-4 text-stone-600">
        Contact page — awaiting the rest of its real sections.
      </p>
    </Container>
  );
}
