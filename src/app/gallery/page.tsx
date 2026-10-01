import Container from "@/components/layouts/Container";

export const metadata = { title: "Gallery" };

export default function GalleryPage() {
  return (
    <Container className="py-24">
      <h1 className="text-3xl font-semibold tracking-tight">Gallery</h1>
      <p className="mt-4 text-stone-600">
        TODO: portfolio of completed projects, fed from the Laravel gallery
        API.
      </p>
    </Container>
  );
}
