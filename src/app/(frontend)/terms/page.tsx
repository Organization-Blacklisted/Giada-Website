import Container from "@/components/layouts/Container";

export const metadata = { title: "Terms & Conditions" };

export default function TermsPage() {
  return (
    <Container className="py-24">
      <h1 className="text-3xl font-semibold tracking-tight">Terms &amp; Conditions</h1>
      <p className="mt-4 text-stone-600">
        TODO: real content, ported from the Astro source&apos;s
        TermsConditions.astro. Note: the live site&apos;s &quot;Download
        PDF&quot; link is currently broken (filename mismatch) — fix as
        part of this port, not carry the bug forward.
      </p>
    </Container>
  );
}
