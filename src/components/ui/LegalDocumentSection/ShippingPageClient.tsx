"use client";

import { useLivePreview } from "@payloadcms/live-preview-react";
import LegalDocumentSection from "@/components/ui/LegalDocumentSection";
import { mapLegalDocument } from "@/lib/api/legal-map";
import type { ShippingPage } from "@/payload-types";

export default function ShippingPageClient({ initialData }: { initialData: ShippingPage }) {
  const { data: raw } = useLivePreview<ShippingPage>({
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
      currentPath="/shipping"
    />
  );
}
