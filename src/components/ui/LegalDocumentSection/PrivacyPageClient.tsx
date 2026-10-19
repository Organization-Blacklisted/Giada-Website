"use client";

import { useLivePreview } from "@payloadcms/live-preview-react";
import LegalDocumentSection from "@/components/ui/LegalDocumentSection";
import { mapLegalDocument } from "@/lib/api/legal-map";
import type { PrivacyPage } from "@/payload-types";

// Same pattern as every other <Page>Client.tsx — `mapLegalDocument` is
// imported from legal-map.ts specifically (a module with zero Payload
// runtime imports), not from lib/api/privacy.ts, which also exports
// getPayload-dependent code that can't be bundled into a Client
// Component.
export default function PrivacyPageClient({ initialData }: { initialData: PrivacyPage }) {
  const { data: raw } = useLivePreview<PrivacyPage>({
    initialData,
    serverURL: typeof window !== "undefined" ? window.location.origin : "",
    depth: 2,
  });

  const data = mapLegalDocument(raw);

  return (
    <LegalDocumentSection
      title={data.hero.title}
      intro={data.hero.intro}
      sections={data.sections}
      questionLabel={data.questionLabel}
      pdfUrl={data.pdfUrl}
      currentPath="/privacy"
    />
  );
}
