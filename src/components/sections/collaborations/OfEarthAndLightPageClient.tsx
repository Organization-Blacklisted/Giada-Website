"use client";

import { useLivePreview } from "@payloadcms/live-preview-react";
import CollaborationHeroSection from "@/components/sections/collaborations/CollaborationHeroSection";
import CollaborationStatementSection from "@/components/sections/collaborations/CollaborationStatementSection";
import CollaborationProductsSection from "@/components/sections/collaborations/CollaborationProductsSection";
import CollaborationDesignerSection from "@/components/sections/collaborations/CollaborationDesignerSection";
import ContactCtaBanner from "@/components/ui/ContactCtaBanner";
import { mapCollaborationItem } from "@/lib/api/collaborations-map";
import { mapOfEarthAndLightPage } from "@/lib/api/of-earth-and-light-page-map";
import type { Collaboration, OfEarthAndLightPage } from "@/payload-types";
import type { ProductListItemData } from "@/lib/api/products-catalog-map";

// Was missing entirely before — same bug as FragmentsPageClient.tsx,
// fixed for the same reason. This page draws from two separate
// documents an editor can open independently (the `collaborations`
// collection item for name/tagline/heroImage/designerName, and the
// of-earth-and-light-page global for the statement/designer bio) — so
// it runs two independent useLivePreview instances, one per document.
// Whichever one is actually open in the admin is the one that updates
// live; the other just keeps its last-fetched value, same as
// `products` below (a separate query, not itself live-previewed).
export default function OfEarthAndLightPageClient({
  initialCollaboration,
  initialPage,
  products,
}: {
  initialCollaboration: Collaboration;
  initialPage: OfEarthAndLightPage;
  products: ProductListItemData[];
}) {
  const { data: rawCollaboration } = useLivePreview<Collaboration>({
    initialData: initialCollaboration,
    serverURL: typeof window !== "undefined" ? window.location.origin : "",
    depth: 1,
  });
  const { data: rawPage } = useLivePreview<OfEarthAndLightPage>({
    initialData: initialPage,
    serverURL: typeof window !== "undefined" ? window.location.origin : "",
    depth: 2,
  });

  const collaboration = mapCollaborationItem(rawCollaboration);
  const page = mapOfEarthAndLightPage(rawPage);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Collaborations", item: "/collaborations" },
      { "@type": "ListItem", position: 2, name: collaboration.name, item: "/collaborations/of-earth-and-light" },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
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
