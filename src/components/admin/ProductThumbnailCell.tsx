import Image from "next/image";
import type { Payload } from "payload";

// Custom admin list-view Cell for the Products collection's `images`
// field — shows a small thumbnail of the first image instead of raw
// array data, so editors can tell e.g. "Woodgrain" from "Windward" at a
// glance without opening each row.
//
// A Server Component (no "use client"), not a Client one — Payload
// dispatches either based on the file's own directive, and a server
// Cell gets the full `payload` Local API instance as a prop, which is
// needed here: the admin list view's own `find()` query is hardcoded to
// `depth: 0` (confirmed by reading @payloadcms/next's List view source
// directly), so `rowData.images[0].image` arrives as a raw numeric ID,
// never a populated Media doc — this resolves it itself via
// `payload.findByID`.
//
// Plain inline styles, not Tailwind classNames — same reasoning as
// admin/Logo.tsx: the admin UI has its own separate CSS pipeline.
export async function ProductThumbnailCell({
  payload,
  rowData,
}: {
  payload: Payload;
  rowData: Record<string, unknown>;
}) {
  const images = Array.isArray(rowData.images) ? rowData.images : [];
  const firstImageId = images[0]?.image;

  if (!firstImageId) {
    return (
      <div
        style={{
          width: 48,
          height: 48,
          background: "var(--theme-elevation-100)",
          border: "1px solid var(--theme-elevation-150)",
        }}
      />
    );
  }

  // A single stale reference (e.g. the Media doc was deleted directly)
  // shouldn't break the whole list table — fail that one cell quietly.
  const media = await payload.findByID({ collection: "media", id: firstImageId, depth: 0 }).catch(() => null);
  const src = media?.sizes?.thumbnail?.url ?? media?.url;

  if (!src) return null;

  return (
    <Image
      src={src}
      alt=""
      width={48}
      height={48}
      style={{ width: 48, height: 48, objectFit: "cover", border: "1px solid var(--theme-elevation-150)" }}
    />
  );
}
