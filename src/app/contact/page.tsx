import ContactHeroSection from "@/components/sections/contact/ContactHeroSection";
import ShowroomSection from "@/components/sections/contact/ShowroomSection";
import { siteConfig } from "@/data/site";
import { getContactPage } from "@/lib/api/contact";

export const metadata = {
  title: "Contact",
  description:
    "Begin your bespoke project, explore a design partnership, or book a private showroom visit. Giada — Montréal & Miami.",
};

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
  const { hero, visit } = await getContactPage();
  const localBusinessSchemas = buildLocalBusinessSchemas();

  return (
    <>
      <section className="bg-white px-5 pb-0 pt-24 md:px-10 lg:px-16 lg:pt-32">
        <div className="mx-auto max-w-6xl">
          <ContactHeroSection {...hero} />
          <ShowroomSection {...visit} />
        </div>
      </section>

      {localBusinessSchemas.map((schema) => (
        <script key={schema["@id"]} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
    </>
  );
}
