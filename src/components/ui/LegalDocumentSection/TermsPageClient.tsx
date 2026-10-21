"use client";

import { useLivePreview } from "@payloadcms/live-preview-react";
import LegalDocumentSection from "@/components/ui/LegalDocumentSection";
import { mapLegalDocument } from "@/lib/api/legal-map";
import type { TermsPage } from "@/payload-types";

export default function TermsPageClient({ initialData }: { initialData: TermsPage }) {
  const { data: raw } = useLivePreview<TermsPage>({
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
      currentPath="/terms"
    />
  );
}
