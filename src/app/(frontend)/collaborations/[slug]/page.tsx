import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FragmentsHeroSection from "@/components/sections/collaborations/FragmentsHeroSection";
import FragmentsArtistSection from "@/components/sections/collaborations/FragmentsArtistSection";
import FragmentsInspirationSection from "@/components/sections/collaborations/FragmentsInspirationSection";
import FragmentsMemoriesSection from "@/components/sections/collaborations/FragmentsMemoriesSection";
import FragmentsMeetingSection from "@/components/sections/collaborations/FragmentsMeetingSection";
import FragmentsClosingCtaSection from "@/components/sections/collaborations/FragmentsClosingCtaSection";
import CollaborationHeroSection from "@/components/sections/collaborations/CollaborationHeroSection";
import CollaborationStatementSection from "@/components/sections/collaborations/CollaborationStatementSection";
import CollaborationProductsSection from "@/components/sections/collaborations/CollaborationProductsSection";
import CollaborationDesignerSection from "@/components/sections/collaborations/CollaborationDesignerSection";
import ContactCtaBanner from "@/components/ui/ContactCtaBanner";
import { getAllCollaborationSlugs, getCollaborationBySlug } from "@/lib/api/collaborations";
import { getFragmentsPage } from "@/lib/api/fragments-page";
import { getOfEarthAndLightPage } from "@/lib/api/of-earth-and-light-page";
import { getProductsByCollectionSlug } from "@/lib/api/products-catalog";

// Every collaboration gets a real page regardless of `active` — matches
// the real source's own getStaticPaths() (one page per JSON file, no
// active filtering at the routing level; only the listing page cares
// about `active`).
export async function generateStaticParams() {
  const slugs = await getAllCollaborationSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Every collaboration's detail-page content lives in its own dedicated
// Global, keyed by its fixed, real route — the same category as
// /our-story or /privacy, not a dynamic flag derived from document data.
// The `collaborations` COLLECTION document only drives the listing
// page's card (name/slug/tagline/active/heroImage/productCount/
// designerName) and this route's lookup/breadcrumb — see
// collections/Collaborations.ts and each Global for why. There's
// intentionally no generic fallback for an unrecognized slug: a
// collaboration isn't live until its own page Global exists.
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const collaboration = await getCollaborationBySlug(slug);
  if (!collaboration) return {};

  if (slug === "fragments") {
    const fragments = await getFragmentsPage();
    return {
      title: fragments.seo.metaTitle || collaboration.name,
      description: fragments.seo.metaDescription || fragments.hero.paragraph,
      ...(fragments.seo.ogImage ? { openGraph: { images: [{ url: fragments.seo.ogImage }] } } : {}),
      ...(fragments.seo.noIndex ? { robots: { index: false, follow: false } } : {}),
    };
  }

  if (slug === "of-earth-and-light") {
    const page = await getOfEarthAndLightPage();
    return {
      title: page.seo.metaTitle || collaboration.name,
      description: page.seo.metaDescription || collaboration.tagline,
      ...(page.seo.ogImage ? { openGraph: { images: [{ url: page.seo.ogImage }] } } : {}),
      ...(page.seo.noIndex ? { robots: { index: false, follow: false } } : {}),
    };
  }

  return {};
}

export default async function CollaborationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const collaboration = await getCollaborationBySlug(slug);
  if (!collaboration) notFound();

  const canonicalPath = `/collaborations/${slug}`;
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Collaborations", item: "/collaborations" },
      { "@type": "ListItem", position: 2, name: collaboration.name, item: canonicalPath },
    ],
  };
  const breadcrumbScript = (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
  );

  if (slug === "fragments") {
    const fragments = await getFragmentsPage();
    return (
      <>
        {breadcrumbScript}
        <FragmentsHeroSection
          eyebrow={fragments.hero.eyebrow}
          headline={fragments.hero.headline}
          paragraph={fragments.hero.paragraph}
          unveilingLines={fragments.hero.unveilingLines}
          backdropImage={fragments.hero.backdropImage}
          cutoutImage={fragments.hero.cutoutImage}
        />
        <FragmentsArtistSection
          eyebrow={fragments.artist.eyebrow}
          name={fragments.artist.name}
          subheadline={fragments.artist.subheadline}
          bioParagraphGroup1={fragments.artist.bioParagraphGroup1}
          bioParagraphGroup2={fragments.artist.bioParagraphGroup2}
          portrait={fragments.artist.portrait}
        />
        <FragmentsInspirationSection
          eyebrow={fragments.inspiration.eyebrow}
          heading={fragments.inspiration.heading}
          paragraph={fragments.inspiration.paragraph}
          cards={fragments.inspiration.cards}
          quote={fragments.inspiration.quote}
          quoteAttribution={fragments.inspiration.quoteAttribution}
        />
        <FragmentsMemoriesSection
          eyebrow={fragments.memories.eyebrow}
          heading={fragments.memories.heading}
          paragraph={fragments.memories.paragraph}
          strips={fragments.memories.strips}
        />
        <FragmentsMeetingSection
          eyebrow={fragments.meeting.eyebrow}
          heading={fragments.meeting.heading}
          subheadline={fragments.meeting.subheadline}
          paragraph={fragments.meeting.paragraph}
          imageLeft={fragments.meeting.imageLeft}
          imageRight={fragments.meeting.imageRight}
        />
        <FragmentsClosingCtaSection
          heading={fragments.closingCta.heading}
          paragraph={fragments.closingCta.paragraph}
          linkText={fragments.closingCta.linkText}
        />
      </>
    );
  }

  if (slug === "of-earth-and-light") {
    const page = await getOfEarthAndLightPage();
    const products = await getProductsByCollectionSlug(slug);
    return (
      <>
        {breadcrumbScript}
        <CollaborationHeroSection name={collaboration.name} tagline={collaboration.tagline} heroImage={collaboration.heroImage} />
        <CollaborationStatementSection tagline={collaboration.tagline} description={page.statement.description} />
        {products.length > 0 && <CollaborationProductsSection products={products} />}
        <CollaborationDesignerSection name={collaboration.designerName} bio={page.designer.bio} portrait={page.designer.portrait} />
        <ContactCtaBanner
          eyebrow="Bespoke Service"
          heading="Looking for something unique?"
          description="Every piece can be made to your exact specifications: size, colour, composition, and more. Reach out to begin your custom project."
        />
      </>
    );
  }

  notFound();
}
