import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

// Laravel calls this whenever published content changes, so the ISR cache
// doesn't sit on stale data for the full revalidate window (see fetcher.ts).
export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-revalidate-secret");

  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ success: false, message: "Invalid secret" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const tags: string[] = Array.isArray(body?.tags)
    ? body.tags
    : typeof body?.tag === "string"
      ? [body.tag]
      : [];

  if (tags.length === 0) {
    return NextResponse.json(
      { success: false, message: "Provide 'tag' or 'tags' in the request body" },
      { status: 400 }
    );
  }

  tags.forEach((tag) => revalidateTag(tag, { expire: 0 }));

  return NextResponse.json({ success: true, revalidated: tags, now: Date.now() });
}
