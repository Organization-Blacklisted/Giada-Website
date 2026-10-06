import Container from "@/components/layouts/Container";

export const metadata = { title: "Blog" };

export default function BlogPage() {
  return (
    <Container className="py-24">
      <h1 className="text-3xl font-semibold tracking-tight">Blog</h1>
      <p className="mt-4 text-stone-600">
        TODO: post list, fed from a Payload Blog collection.
      </p>
    </Container>
  );
}
