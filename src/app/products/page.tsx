import Container from "@/components/layouts/Container";

export const metadata = { title: "Products" };

export default function ProductsPage() {
  return (
    <Container className="py-24">
      <h1 className="text-3xl font-semibold tracking-tight">Products</h1>
      <p className="mt-4 text-stone-600">
        TODO: rugs / glass catalog, fed from the Laravel products API once
        the contract is defined.
      </p>
    </Container>
  );
}
