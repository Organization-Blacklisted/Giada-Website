import type { GlobalConfig } from "payload";
import { revalidateTag } from "next/cache";

// Same pattern as Home (src/globals/Home.ts): a singleton global, not a
// collection, since the FAQ page has exactly one instance. No `tabs`
// wrapper here — only 3 logical sections, small enough for a flat form.
export const Faq: GlobalConfig = {
  slug: "faq-page",
  admin: {
    // Renders the real /faq route in an iframe next to the edit form,
    // live-updating as fields change (before saving) via the
    // `useLivePreview` hook on the page side — see FaqPageClient.tsx.
    // Trying this on FAQ first since its lib/api shape is a clean 1:1
    // match with the raw document (no media/testimonial transforms to
    // duplicate client-side the way Home would need).
    livePreview: {
      url: `${process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000"}/faq`,
      breakpoints: [
        { label: "Mobile", name: "mobile", width: 375, height: 667 },
        { label: "Tablet", name: "tablet", width: 768, height: 1024 },
        { label: "Desktop", name: "desktop", width: 1440, height: 900 },
      ],
    },
  },
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
