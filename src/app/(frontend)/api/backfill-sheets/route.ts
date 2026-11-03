import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";
import type { Event } from "@/payload-types";
import { appendEventRegistrationToSheet } from "@/lib/google-sheets";

// TEMPORARY, one-off endpoint (added 2026-11-03) — backfills every
// existing Event Registration into the new per-event Google Sheet tabs
// (see lib/google-sheets.ts), since registrations collected before
// today predate the feature. Deliberately runs inside Vercel's
// production runtime rather than querying the prod DB from a local
// machine — this project's standing rule is that production DB
// credentials never touch a local .env (see ARCHITECTURE.md /
// 2026-10-21/22 incidents). Reuses REVALIDATE_SECRET rather than
// provisioning a new env var for a single run. Remove this route once
// the backfill has been triggered.
export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-revalidate-secret");
  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ success: false, message: "Invalid secret" }, { status: 401 });
  }

  const payload = await getPayload({ config });

  const results: { id: number; event: string; ok: boolean; error?: string }[] = [];

  let page = 1;
  let hasNextPage = true;
  while (hasNextPage) {
    const res = await payload.find({
      collection: "event-registrations",
      depth: 1,
      limit: 100,
      page,
      sort: "createdAt",
    });

    for (const reg of res.docs) {
      const event = reg.event as Event;
      try {
        await appendEventRegistrationToSheet({
          eventTitle: event.title,
          fullName: reg.fullName,
          companyName: reg.companyName,
          email: reg.email,
          mobileNumber: reg.mobileNumber,
          submittedAt: new Date(reg.createdAt),
        });
        results.push({ id: reg.id, event: event.title, ok: true });
      } catch (err) {
        results.push({ id: reg.id, event: event.title, ok: false, error: String(err) });
      }
    }

    hasNextPage = res.hasNextPage;
    page += 1;
  }

  return NextResponse.json({ success: true, total: results.length, results });
}
