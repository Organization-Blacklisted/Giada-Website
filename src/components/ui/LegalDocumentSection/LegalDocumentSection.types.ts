import type { SerializedEditorState } from "lexical";

export type LegalSection = {
  id: string;
  title: string;
  content: SerializedEditorState | null;
  note: string;
  isContactSection: boolean;
};

export interface LegalDocumentSectionProps {
  title: string;
  intro: string;
  sections: LegalSection[];
  questionLabel: string;
  pdfUrl: string;
  /** The current page's own path, so "Also see" excludes itself. */
  currentPath: "/privacy" | "/terms" | "/shipping";
  className?: string;
}
