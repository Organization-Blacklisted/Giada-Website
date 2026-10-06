import Container from "@/components/layouts/Container";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <Container size="narrow" className="py-24">
      <h1 className="text-3xl font-semibold tracking-tight">Post: {slug}</h1>
      <p className="mt-4 text-stone-600">
        TODO: single post content, fed from a Payload Blog collection.
      </p>
    </Container>
  );
}
