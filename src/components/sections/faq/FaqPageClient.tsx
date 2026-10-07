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
//
// `serverURL` uses the browser's own current origin, not a hardcoded
// env var — this page and the Payload server are the same Next.js app,
// so wherever this page is being viewed FROM is also where the server
// actually lives (localhost in dev, the real domain in prod, any Vercel
// preview deployment). A fixed `NEXT_PUBLIC_SERVER_URL` fallback here
// would hit the exact same cross-environment breakage as the admin
// side's `livePreview.url` (see src/globals/Faq.ts) once this page is
// ever viewed from somewhere other than localhost.
export default function FaqPageClient({ initialData }: { initialData: FaqPageData }) {
  const { data } = useLivePreview<FaqPageData>({
    initialData,
    serverURL: typeof window !== "undefined" ? window.location.origin : "",
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
