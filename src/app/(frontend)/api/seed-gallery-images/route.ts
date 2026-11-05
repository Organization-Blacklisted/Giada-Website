import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";

// TEMPORARY, one-off endpoint (added 2026-11-05) — bulk-uploads a batch
// of client-provided gallery photos to production Media and appends
// them to the Gallery page's `items` array, all tagged "Spaces" with a
// generic alt (client's explicit instruction: "assign spaces to all and
// use the generic spaces alt for all"). Same reasoning as the earlier
// /api/backfill-sheets and /api/seed-founders-photo routes — runs
// inside Vercel's production runtime so images land directly in real
// Media/Object Storage; images themselves are compressed client-side
// (sharp, ~2000px long edge, JPEG q82) before this ever gets called.
// Remove this route once triggered.
const GENERIC_SPACES_ALT = "A handcrafted rug in an interior setting.";

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-revalidate-secret");
  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ success: false, message: "Invalid secret" }, { status: 401 });
  }

  const formData = await request.formData();
  const files = formData.getAll("images").filter((f): f is File => f instanceof File);
  if (files.length === 0) {
    return NextResponse.json({ success: false, message: "No files under field 'images'" }, { status: 400 });
  }

  const payload = await getPayload({ config });
  const results: { file: string; mediaId?: number; error?: string }[] = [];

  for (const file of files) {
    try {
      const buffer = Buffer.from(await file.arrayBuffer());
      const media = await payload.create({
        collection: "media",
        data: { alt: GENERIC_SPACES_ALT },
        file: { data: buffer, mimetype: file.type || "image/jpeg", name: file.name, size: buffer.length },
      });
      results.push({ file: file.name, mediaId: media.id });
    } catch (err) {
      results.push({ file: file.name, error: String(err) });
    }
  }

  const gallery = await payload.findGlobal({ slug: "gallery-page" });
  const newItems = results
    .filter((r) => r.mediaId)
    .map((r) => ({ image: r.mediaId as number, alt: GENERIC_SPACES_ALT, category: "Spaces" as const }));

  await payload.updateGlobal({
    slug: "gallery-page",
    data: { items: [...(gallery.items ?? []), ...newItems] },
  });

  return NextResponse.json({ success: true, uploaded: newItems.length, results });
}
