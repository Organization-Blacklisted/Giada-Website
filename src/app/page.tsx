import Container from "@/components/layouts/Container";

// TestimonialBook + the Testimonials section (components/sections/home/Testimonials)
// are built and verified, just not wired in here yet — kept out of the
// page per request until the rest of the Home page is ready to go live
// alongside it.
export default function Home() {
  return (
    <Container className="py-24">
      <h1 className="text-3xl font-semibold tracking-tight">Giada</h1>
      <p className="mt-4 max-w-xl text-stone-600">
        Home page — awaiting the rest of its real sections (hero,
        collection feature, press, image bar, etc.).
      </p>
    </Container>
  );
}
