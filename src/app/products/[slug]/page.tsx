import Container from "@/components/layouts/Container";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <Container className="py-24">
      <h1 className="text-3xl font-semibold tracking-tight">Product: {slug}</h1>
      <p className="mt-4 text-stone-600">
        TODO: single product detail, fed from the Laravel products API.
      </p>
    </Container>
  );
}
