import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";

// TEMPORARY, one-off endpoint (added 2026-11-05) — uploads the real
// Figma-sourced founders photo (node 1035:606) to production Media and
// links it as the Our Story page's new shared founders image. Same
// reasoning as the earlier /api/backfill-sheets route: runs inside
// Vercel's production runtime so the image lands directly in the real
// Media/Object Storage, no local file needs shipping through git.
// Remove this route once triggered.
const FIGMA_ASSET_URL = "https://www.figma.com/api/mcp/asset/ae4bfbfa-e07a-41c1-a88a-73489d7ef55f/3a4e3.png";

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-revalidate-secret");
  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ success: false, message: "Invalid secret" }, { status: 401 });
  }

  const assetRes = await fetch(FIGMA_ASSET_URL);
  if (!assetRes.ok) {
    return NextResponse.json({ success: false, message: `Failed to fetch asset (${assetRes.status})` }, { status: 502 });
  }
  const buffer = Buffer.from(await assetRes.arrayBuffer());

  const payload = await getPayload({ config });

  const media = await payload.create({
    collection: "media",
    data: { alt: "Julien Hakoun and Nitin Garg, co-founders of Giada" },
    file: {
      data: buffer,
      mimetype: "image/png",
      name: "founders-shared.png",
      size: buffer.length,
    },
  });

  const story = await payload.findGlobal({ slug: "our-story-page" });
  await payload.updateGlobal({
    slug: "our-story-page",
    data: {
      founders: {
        ...story.founders,
        sharedImage: media.id,
      },
    },
  });

  return NextResponse.json({ success: true, mediaId: media.id });
}
