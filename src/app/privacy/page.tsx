import Container from "@/components/layouts/Container";

export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <Container className="py-24">
      <h1 className="text-3xl font-semibold tracking-tight">Privacy Policy</h1>
      <p className="mt-4 text-stone-600">
        TODO: real content, ported from the Astro source&apos;s
        PrivacyPolicy.astro. Note: the live site&apos;s &quot;Download
        PDF&quot; link is currently broken (filename mismatch) — fix as
        part of this port, not carry the bug forward.
      </p>
    </Container>
  );
}
