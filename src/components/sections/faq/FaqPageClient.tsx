"use client";

import { useLivePreview } from "@payloadcms/live-preview-react";
import ContactCtaBanner from "@/components/ui/ContactCtaBanner";
import FaqHeroSection from "@/components/sections/faq/FaqHeroSection";
import FaqListSection from "@/components/sections/faq/FaqListSection";
import type { FaqPageData } from "@/lib/api/faq";

// Only the visible sections need to be reactive — the JSON-LD schema
// script stays server-rendered from the initial fetch in page.tsx, since
// it's for crawlers, not something a client-side editor preview needs.
// The raw "faq-page" global document is a 1:1 shape match with
// FaqPageData (unlike Home, which flattens Media relationships into
// plain strings) so no client-side transform is needed here.
export default function FaqPageClient({ initialData }: { initialData: FaqPageData }) {
  const { data } = useLivePreview<FaqPageData>({
    initialData,
    serverURL: process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000",
    depth: 2,
  });

  return (
    <>
      <FaqHeroSection {...data.hero} />
      <FaqListSection items={data.items} />
      <ContactCtaBanner {...data.closingCta} />
    </>
  );
}
