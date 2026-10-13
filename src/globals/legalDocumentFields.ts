import type { Field } from "payload";
import {
  BoldFeature,
  HeadingFeature,
  ItalicFeature,
  lexicalEditor,
  LinkFeature,
  OrderedListFeature,
  ParagraphFeature,
  UnderlineFeature,
  UnorderedListFeature,
} from "@payloadcms/richtext-lexical";

// Shared by Privacy.ts/Terms.ts/Shipping.ts — all three are built from
// the exact same shape in the real Astro source (one shared
// LegalDocument.astro component, just different section data), so the
// field definitions are shared here rather than copy-pasted three times.
// Mirrors that same real/shared-component reasoning on the frontend
// side too — see components/ui/LegalDocumentSection.
//
// 2026-10-08 rebuild: `body`/`items`/`subsections` (three separate field
// types, bullets as individual array rows requiring an "+Add Item"
// click each) collapsed into one `content` richText field — flagged as
// too tedious to actually edit (Terms alone has 18 sections, several
// with 10-15 bullets each). Admin now just types naturally and uses the
// editor's own bullet-list button; the frontend renders real Lexical
// list/heading nodes through custom JSXConverters that reproduce the
// exact same visual style the old array-based bullets had (see
// components/ui/LegalDocumentSection's converters) — not a downgrade in
// output, only in how tediously it has to be authored.
export function legalDocumentFields(): Field[] {
  return [
    {
      type: "tabs",
      tabs: [
        {
          label: "Hero",
          fields: [
            {
              name: "hero",
              type: "group",
              fields: [
                { name: "title", type: "text", required: true },
                { name: "intro", type: "textarea", required: true },
              ],
            },
          ],
        },
        {
          label: "Sections",
          fields: [
            {
              name: "sections",
              type: "array",
              minRows: 1,
              // No dbName override needed here (unlike the old
              // `subsections`/`items` nesting this replaced) — richText
              // stores as a single JSONB column, not its own relational
              // sub-table, so "sections" is back to one level of array
              // nesting and comfortably under Postgres's 63-character
              // identifier limit with its auto-generated name.
              fields: [
                { name: "title", type: "text", required: true },
                {
                  name: "content",
                  type: "richText",
                  required: true,
                  // Scoped to exactly what legal copy needs — no
                  // relationships/uploads/blockquotes/horizontal rules,
                  // which would be distracting toolbar buttons for this
                  // content type. `h4` only, matching the one heading
                  // level the old `subsections.heading` style used.
                  editor: lexicalEditor({
                    features: [
                      ParagraphFeature(),
                      BoldFeature(),
                      ItalicFeature(),
                      UnderlineFeature(),
                      LinkFeature(),
                      HeadingFeature({ enabledHeadingSizes: ["h4"] }),
                      UnorderedListFeature(),
                      OrderedListFeature(),
                    ],
                  }),
                },
                { name: "note", type: "textarea" },
                {
                  name: "isContactSection",
                  type: "checkbox",
                  defaultValue: false,
                  label: "Render as the contact section",
                  admin: {
                    description:
                      "Appends the Giada Inc. contact block (email/website) after this section's content — used for the closing \"Contact Us\" section.",
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "questionLabel",
      type: "text",
      defaultValue: "Questions?",
      admin: {
        description:
          'Label above the contact prompt at the bottom of the page — e.g. Shipping\'s real copy overrides this to "Questions about your shipment?".',
      },
    },
    {
      name: "pdfDocument",
      type: "upload",
      relationTo: "media",
      filterOptions: {
        mimeType: { equals: "application/pdf" },
      },
      admin: {
        description:
          "Optional — upload a PDF version of this policy. The Download PDF button only appears on the live page once one is attached here.",
      },
    },
  ];
}
