import type { SerializedEditorState } from "lexical";
// Shared pure mapping logic for all 3 legal pages (Privacy/Terms/
// Shipping) — they're structurally identical (one shared field set,
// see src/globals/legalDocumentFields.ts), so one mapper serves all
// three instead of three copy-pasted ones. Split out the same way as
// home-map.ts/gallery-map.ts/etc. so each page's <Page>Client.tsx (a
// Client Component) can import `mapLegalDocument` as a value without
// dragging getPayload/@payload-config into the client bundle.
import type { SeoData } from "./seo-types";
import type { Media } from "@/payload-types";

function mediaUrl(image: number | Media | null | undefined): string {
  return typeof image === "object" && image !== null ? (image.url ?? "") : "";
}

export type LegalSectionData = {
  id: string;
  title: string;
  content: SerializedEditorState | null;
  note: string;
  isContactSection: boolean;
};

export type LegalDocumentData = {
  hero: {
    title: string;
    intro: string;
  };
  sections: LegalSectionData[];
  questionLabel: string;
  pdfUrl: string;
  seo: SeoData;
};

// Payload generates a separate named type per global (PrivacyPage,
// TermsPage, ShippingPage) even though the actual field shape is
// identical — this local type describes that shared shape structurally,
// so any of the three generated types satisfies it without casting.
type RawLegalDocument = {
  hero: { title: string; intro: string };
  sections?:
    | {
        id?: string | null;
        title: string;
        content: SerializedEditorState;
        note?: string | null;
        isContactSection?: boolean | null;
      }[]
    | null;
  questionLabel?: string | null;
  pdfDocument?: number | Media | null;
  seo?: {
    metaTitle?: string | null;
    metaDescription?: string | null;
    ogImage?: number | Media | null;
    noIndex?: boolean | null;
  } | null;
};

export function mapLegalDocument(doc: RawLegalDocument): LegalDocumentData {
  return {
    hero: {
      title: doc.hero.title,
      intro: doc.hero.intro,
    },
    sections: (doc.sections ?? []).map((section, index) => ({
      id: section.id ?? `section-${index}`,
      title: section.title,
      content: section.content ?? null,
      note: section.note ?? "",
      isContactSection: section.isContactSection ?? false,
    })),
    questionLabel: doc.questionLabel ?? "Questions?",
    pdfUrl: mediaUrl(doc.pdfDocument),
    seo: {
      metaTitle: doc.seo?.metaTitle ?? "",
      metaDescription: doc.seo?.metaDescription ?? "",
      ogImage: mediaUrl(doc.seo?.ogImage),
      noIndex: doc.seo?.noIndex ?? false,
    },
  };
}
