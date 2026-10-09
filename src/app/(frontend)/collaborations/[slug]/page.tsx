import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CollaborationHeroSection from "@/components/sections/collaborations/CollaborationHeroSection";
import FragmentsHeroSection from "@/components/sections/collaborations/FragmentsHeroSection";
import FragmentsArtistSection from "@/components/sections/collaborations/FragmentsArtistSection";
import FragmentsInspirationSection from "@/components/sections/collaborations/FragmentsInspirationSection";
import FragmentsMemoriesSection from "@/components/sections/collaborations/FragmentsMemoriesSection";
import FragmentsMeetingSection from "@/components/sections/collaborations/FragmentsMeetingSection";
import FragmentsClosingCtaSection from "@/components/sections/collaborations/FragmentsClosingCtaSection";
import CollaborationStatementSection from "@/components/sections/collaborations/CollaborationStatementSection";
import CollaborationProductsSection from "@/components/sections/collaborations/CollaborationProductsSection";
import CollaborationDesignerSection from "@/components/sections/collaborations/CollaborationDesignerSection";
import ContactCtaBanner from "@/components/ui/ContactCtaBanner";
import { getAllCollaborationSlugs, getCollaborationBySlug } from "@/lib/api/collaborations";
import { getProductsByCollectionSlug } from "@/lib/api/products-catalog";

// Every collaboration gets a real page regardless of `active` — matches
// the real source's own getStaticPaths() (one page per JSON file, no
// active filtering at the routing level; only the listing page cares
// about `active`). No Live Preview here — collaborations are array rows
// inside one global document, not individually previewable the way a
// singleton page is (same scope decision as the Products catalog's
// detail pages).
export async function generateStaticParams() {
  const slugs = await getAllCollaborationSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const collaboration = await getCollaborationBySlug(slug);
  if (!collaboration) return {};

  return {
    title: collaboration.name,
    description: collaboration.customHero?.paragraph || collaboration.tagline || collaboration.description.split("\n")[0],
  };
}

export default async function CollaborationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const collaboration = await getCollaborationBySlug(slug);
  if (!collaboration) notFound();

  const products = await getProductsByCollectionSlug(slug);
  const customHero = collaboration.customHero;

  const canonicalPath = `/collaborations/${slug}`;
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Collaborations", item: "/collaborations" },
      { "@type": "ListItem", position: 2, name: collaboration.name, item: canonicalPath },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {customHero ? (
        <FragmentsHeroSection
          eyebrow={customHero.eyebrow}
          headline={customHero.headline}
          paragraph={customHero.paragraph}
          unveilingLines={collaboration.description.split("\n").filter(Boolean)}
          backdropImage={customHero.backdropImage}
          cutoutImage={customHero.cutoutImage}
        />
      ) : (
        <CollaborationHeroSection name={collaboration.name} tagline={collaboration.tagline} heroImage={collaboration.heroImage} />
      )}
      {!customHero && <CollaborationStatementSection tagline={collaboration.tagline} description={collaboration.description} />}
      {customHero && (
        <FragmentsArtistSection
          eyebrow={customHero.artist.eyebrow}
          name={customHero.artist.name}
          subheadline={customHero.artist.subheadline}
          bioParagraphGroup1={customHero.artist.bioParagraphGroup1}
          bioParagraphGroup2={customHero.artist.bioParagraphGroup2}
          portrait={customHero.artist.portrait}
        />
      )}
      {customHero && (
        <FragmentsInspirationSection
          eyebrow={customHero.inspiration.eyebrow}
          heading={customHero.inspiration.heading}
          paragraph={customHero.inspiration.paragraph}
          cards={customHero.inspiration.cards}
          quote={customHero.inspiration.quote}
          quoteAttribution={customHero.inspiration.quoteAttribution}
        />
      )}
      {customHero && (
        <FragmentsMemoriesSection
          eyebrow={customHero.memories.eyebrow}
          heading={customHero.memories.heading}
          paragraph={customHero.memories.paragraph}
          strips={customHero.memories.strips}
        />
      )}
      {customHero && (
        <FragmentsMeetingSection
          eyebrow={customHero.meeting.eyebrow}
          heading={customHero.meeting.heading}
          subheadline={customHero.meeting.subheadline}
          paragraph={customHero.meeting.paragraph}
          imageLeft={customHero.meeting.imageLeft}
          imageRight={customHero.meeting.imageRight}
        />
      )}
      {products.length > 0 && <CollaborationProductsSection products={products} />}
      {!customHero && collaboration.designer.name && (
        <CollaborationDesignerSection
          name={collaboration.designer.name}
          bio={collaboration.designer.bio}
          portrait={collaboration.designer.portrait}
        />
      )}
      {customHero ? (
        <FragmentsClosingCtaSection
          heading={customHero.closingCta.heading}
          paragraph={customHero.closingCta.paragraph}
          linkText={customHero.closingCta.linkText}
        />
      ) : (
        <ContactCtaBanner
          eyebrow="Bespoke Service"
          heading="Looking for something unique?"
          description="Every piece can be made to your exact specifications: size, colour, composition, and more. Reach out to begin your custom project."
        />
      )}
    </>
  );
}
