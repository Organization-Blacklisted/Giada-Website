import type { CollectionConfig } from "payload";
import { revalidateTag } from "next/cache";

// Each real collaboration (Of Earth and Light, Fragments) as its own
// document — promoted from an array field on the collaborations-page
// GLOBAL (see globals/Collaborations.ts) to a real COLLECTION, same
// reasoning as the Products catalog: each one needs its own dashboard
// card, its own dedicated edit screen, and (new here) its own Live
// Preview pointed at its own /collaborations/[slug] detail page —
// editing one collaboration's array row buried inside one big page
// document was genuinely confusing to navigate.
//
// This collection is deliberately CARD-ONLY: every field here is shown
// on the /collaborations listing page's card (image, eyebrow tagline,
// name, "Designed with X", Explore/Coming Soon). Each collaboration's
// actual detail-page content (full statement, designer bio/portrait,
// and for Fragments, its whole bespoke page) lives in its own dedicated
// GLOBAL instead (globals/FragmentsPage.ts, globals/OfEarthAndLightPage.ts)
// — see those files for why. Keeping the two concerns apart means this
// collection's fields are identical and fully used for every document,
// with nothing required-but-dead sitting on one collaboration because
// another needed it.
//
// `collection` here (the slug/name — NOT the Payload collection itself)
// is a different concept from the `collection` field on the Products
// collection: Products' `collection` field is a loose, unvalidated
// string reference TO one of these documents (by slug). These two are
// related by convention/string matching only, not a real Payload
// relationship field — same reasoning as collections/Products.ts's own
// comment on why that field isn't a relationship either.
export const Collaborations: CollectionConfig = {
  slug: "collaborations",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "slug", "active", "productCount"],
    group: "Catalog",
    livePreview: {
      url: ({ data, req }) => {
        const host = req.headers.get("host") || "localhost:3000";
        const protocol = host.startsWith("localhost") ? "http" : "https";
        return `${protocol}://${host}/collaborations/${data.slug}`;
      },
      breakpoints: [
        { label: "Mobile", name: "mobile", width: 375, height: 667 },
        { label: "Tablet", name: "tablet", width: 768, height: 1024 },
        { label: "Desktop", name: "desktop", width: 1440, height: 900 },
      ],
    },
  },
  fields: [
    { name: "name", type: "text", required: true },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: { description: "Used for this collaboration's /collaborations/[slug] URL." },
    },
    { name: "tagline", type: "text", required: true },
    {
      name: "active",
      type: "checkbox",
      defaultValue: true,
      label: "Active (show as a clickable card, not \"Coming Soon\")",
    },
    { name: "heroImage", type: "upload", relationTo: "media", required: true },
    {
      name: "productCount",
      type: "number",
      defaultValue: 0,
      admin: {
        description:
          'Shown on the listing card\'s hover badge ("N Pieces"). Set manually — the detail page itself shows the real, live count of products in this collection (matched by the Products collection\'s own `collection` field), so keep this in sync if you add or remove any.',
      },
    },
    {
      name: "designerName",
      type: "text",
      required: true,
      admin: { description: 'Shown on the card as "Designed with [Name]". Bio and portrait live on this collaboration\'s own detail-page Global, not here.' },
    },
  ],
  hooks: {
    afterChange: [
      async () => {
        try {
          revalidateTag("collaborations", { expire: 0 });
        } catch {
          // No request-scoped cache to bust outside a real Next.js
          // request (e.g. a script using the Local API) — nothing to do.
        }
      },
    ],
  },
};
