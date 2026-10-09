"use client";

import { useLivePreview } from "@payloadcms/live-preview-react";
import CollaborationsHeroSection from "@/components/sections/collaborations/CollaborationsHeroSection";
import CollaborationsGridSection from "@/components/sections/collaborations/CollaborationsGridSection";
import ContactCtaBanner from "@/components/ui/ContactCtaBanner";
import { mapCollaborationsPageContent, type CollaborationItemData } from "@/lib/api/collaborations-map";
import type { CollaborationsPage } from "@/payload-types";

// Imported from collaborations-map.ts specifically, NOT collaborations.ts
// — collaborations.ts also exports getPayload-dependent code that can't
// be bundled into a Client Component (see collaborations-map.ts's comment).
//
// Only the page's own copy (hero/closingCta) is live-previewed here —
// `items` now come from the separate `collaborations` collection (each
// one promoted to its own document so it gets its own dashboard card
// and edit screen), so they're plain server-fetched props, not part of
// this document's live-preview stream. Each collaboration live-previews
// itself instead, from its own edit screen, pointed at its own
// /collaborations/[slug] detail page.
export default function CollaborationsPageClient({
  initialData,
  items,
}: {
  initialData: CollaborationsPage;
  items: CollaborationItemData[];
}) {
  const { data: raw } = useLivePreview<CollaborationsPage>({
    initialData,
    serverURL: typeof window !== "undefined" ? window.location.origin : "",
    depth: 2,
  });

  const data = mapCollaborationsPageContent(raw);

  return (
    <>
      <CollaborationsHeroSection {...data.hero} />
      <CollaborationsGridSection items={items} />
      <ContactCtaBanner {...data.closingCta} />
    </>
  );
}
