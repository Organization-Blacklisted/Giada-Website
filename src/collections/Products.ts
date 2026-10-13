import type { CollectionConfig } from "payload";
import { revalidateTag } from "next/cache";

// The real Rugs catalog (75 real items in the Astro source, each its own
// JSON file) — the first real Payload COLLECTION in this project, unlike
// every page built so far (which are singleton Globals). A Collection is
// the right model here: many like-shaped documents, not one page's
// content.
//
// `slug` is a separate, manually-entered field — NOT derived from
// `title` — because the real source's URLs come from each JSON file's
// FILENAME, which often has nothing to do with the product's display
// title (e.g. the real file `arrow-band.json` has `title: "Cadence"`).
// Keeping slug independent preserves those exact existing URLs.
//
// `category`/`weavingStyle`/`composition`/`size`/`collection` are plain
// text, not selects — the real source treats these as open, dynamically
// -derived values (ProductsListing.astro builds its filter dropdown
// options from whatever distinct values exist in the data, not a fixed
// enum), so a select here would fight that same flexibility.
//
// `collection` is intentionally NOT validated against real Collaborations
// entries — confirmed against the real source that it never has been
// (ProductDetail.astro builds `/collaborations/{collection}` from the
// raw string with zero existence check). Two real products reference a
// "Traverse" collection that has no matching Collaborations page and
// genuinely 404s on the live site today; ported faithfully rather than
// silently fixed, per explicit instruction.
//
// "Origin: India" was a hardcoded template constant on the real detail
// page (`value: "India"`), not read from any product field — made into
// a real, editable `origin` field here instead (defaulting to "India",
// since every real product is from the same family mill) per explicit
// request, rather than carrying the hardcoding forward.
//
// `active` controls listing/search visibility only — confirmed via the
// real `[slug].astro`'s own `getStaticPaths()`, which builds a detail
// page for every product regardless of `active`. `inStock` is a
// separate, purely cosmetic "In Stock" badge.
export const Products: CollectionConfig = {
  slug: "products",
  admin: {
    useAsTitle: "title",
    // "title" must stay first — Payload always wraps the FIRST active
    // column in the link to the document's edit view (confirmed in
    // @payloadcms/ui's buildColumnState: `isLinkedColumn: colIndex ===
    // activeColumnsIndices[0]`), and the custom thumbnail Cell below
    // doesn't implement that link behavior. Putting "images" first once
    // silently broke click-to-edit for every row.
    defaultColumns: ["title", "images", "slug", "category", "active", "inStock"],
    group: "Catalog",
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: "title", type: "text", required: true },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: { description: "Used for the /products/[slug] URL. Matches the real site's existing URLs." },
    },
    { name: "category", type: "text", required: true, defaultValue: "Rug" },
    { name: "active", type: "checkbox", defaultValue: true, label: "Active (shown on /rugs and in search/filters)" },
    { name: "inStock", type: "checkbox", defaultValue: true, label: "In Stock" },
    { name: "color", type: "text" },
    { name: "weavingStyle", type: "text" },
    { name: "composition", type: "text" },
    { name: "size", type: "text", admin: { description: 'E.g. `9\'-0" W x 12\'-0" L`, `9\'-0" D`, or `Made to Order`.' } },
    { name: "origin", type: "text", defaultValue: "India" },
    {
      name: "collection",
      type: "text",
      admin: {
        description:
          'Loose reference, not a real relationship — matches the real source. Known values: "of-earth-and-light", "fragments". Leave blank for none.',
      },
    },
    { name: "description", type: "textarea", required: true },
    {
      name: "images",
      type: "array",
      minRows: 1,
      admin: {
        components: {
          Cell: "@/components/admin/ProductThumbnailCell#ProductThumbnailCell",
        },
      },
      fields: [{ name: "image", type: "upload", relationTo: "media", required: true }],
    },
  ],
  hooks: {
    afterChange: [
      async () => {
        try {
          // Deliberately distinct from the unrelated /products hub
          // global's "products" tag (globals/Products.ts) — this
          // collection is the Rugs catalog, not that page's own copy.
          revalidateTag("products-catalog", { expire: 0 });
        } catch {
          // No request-scoped cache to bust outside a real Next.js
          // request (e.g. a script using the Local API) — nothing to do.
        }
      },
    ],
  },
};
