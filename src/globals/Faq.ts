import type { GlobalConfig } from "payload";
import { revalidateTag } from "next/cache";

// Same pattern as Home (src/globals/Home.ts): a singleton global, not a
// collection, since the FAQ page has exactly one instance. No `tabs`
// wrapper here — only 3 logical sections, small enough for a flat form.
export const Faq: GlobalConfig = {
  slug: "faq-page",
  fields: [
    {
      name: "hero",
      type: "group",
      fields: [
        { name: "eyebrow", type: "text", required: true },
        { name: "heading", type: "text", required: true },
      ],
    },
    {
      name: "items",
      type: "array",
      minRows: 1,
      fields: [
        { name: "question", type: "text", required: true },
        { name: "answer", type: "textarea", required: true },
      ],
    },
    {
      name: "closingCta",
      type: "group",
      fields: [
        { name: "eyebrow", type: "text", required: true },
        { name: "heading", type: "text", required: true },
        { name: "description", type: "textarea", required: true },
        { name: "linkText", type: "text", required: true },
        { name: "href", type: "text", required: true },
      ],
    },
  ],
  hooks: {
    afterChange: [
      async () => {
        try {
          revalidateTag("faq", { expire: 0 });
        } catch {
          // No request-scoped cache to bust outside a real Next.js
          // request (e.g. a script using the Local API) — nothing to do.
        }
      },
    ],
  },
};
