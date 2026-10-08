import type { Metadata } from "next";
import ContactPageClient from "@/components/sections/contact/ContactPageClient";
import { siteConfig } from "@/data/site";
import { getContactPage, getContactRaw } from "@/lib/api/contact";

const DEFAULT_TITLE = "Contact";
const DEFAULT_DESCRIPTION =
  "Begin your bespoke project, explore a design partnership, or book a private showroom visit. Giada — Montréal & Miami.";

// CMS-editable now (the "SEO" tab on the contact-page global) — these
// constants stay as the fallback when those fields are left blank, same
// real copy this page always had before the SEO tab existed.
export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getContactPage();
  return {
    title: seo.metaTitle || DEFAULT_TITLE,
    description: seo.metaDescription || DEFAULT_DESCRIPTION,
    ...(seo.ogImage ? { openGraph: { images: [{ url: seo.ogImage }] } } : {}),
    ...(seo.noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}

// LocalBusiness JSON-LD per showroom, confirmed from the real source's
// ContactMain.astro. Built from siteConfig.locations directly rather than
// from the `visit.locations` prop shape above — region/postalCode are
// SEO-schema fields, not something ShowroomSection renders, so they stay
// out of that component's props. City slug uses the real source's exact
// (slightly odd) technique — `.replace(/[^a-z]/g, "")` strips the accented
// "é" in "Montréal" too, producing "montral" not "montreal" — kept as-is
// since it's an internal schema id, not user-visible, and matching the
// real source exactly beats guessing a "nicer" slug.
function buildLocalBusinessSchemas() {
  return siteConfig.locations.map((location) => ({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteConfig.url}/contact#showroom-${location.city.toLowerCase().replace(/[^a-z]/g, "")}`,
    name: `Giada Studio — ${location.city}`,
    telephone: location.phone,
    email: "office@giada-studio.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: location.lines[0],
      addressLocality: location.city,
      addressRegion: location.region,
      postalCode: location.postalCode,
      addressCountry: location.lines[2],
    },
    geo: { "@type": "GeoCoordinates", latitude: location.geo.lat, longitude: location.geo.lng },
  }));
}

export default async function ContactPage() {
  const raw = await getContactRaw();
  const localBusinessSchemas = buildLocalBusinessSchemas();

  return (
    <>
      <ContactPageClient initialData={raw} />

      {localBusinessSchemas.map((schema) => (
        <script key={schema["@id"]} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
    </>
  );
}
