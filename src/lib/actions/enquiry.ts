"use server";

import { headers } from "next/headers";
import { getPayload } from "payload";
import config from "@payload-config";
import type { EnquiryPayload } from "@/types/enquiry";
import { buildTeamEnquiryEmail, buildClientEnquiryConfirmationEmail, ENQUIRY_TEAM_RECIPIENTS } from "@/lib/email/enquiry-emails";
import { verifyTurnstile } from "@/lib/turnstile";

// Saves the submission via Payload's Local API (direct in-process call,
// no HTTP round-trip) instead of the old guessed Laravel `/enquiries`
// endpoint, which never existed — visible in /admin's Enquiries
// collection regardless of what happens with email below.
//
// Turnstile verification (added 2026-10-23) gates everything below it —
// a missing/invalid token stops the submission before it's ever saved,
// ported from the real Astro source's contact.ts (never actually wired
// up live there, empty site key — this project is the first time it's
// really enforced).
//
// Email sending (Brevo, added 2026-10-23) is deliberately a second,
// separate step after the save succeeds, and its own failure doesn't
// fail the submission — the enquiry is already safely stored either
// way, and a delivery hiccup shouldn't make a real visitor think their
// message was lost. Logged server-side so it's not silently swallowed.
export async function submitEnquiry(
  payload: EnquiryPayload,
  turnstileToken: string
): Promise<{ success: boolean; error?: string }> {
  if (!turnstileToken) {
    return { success: false, error: "Verification failed. Please try again." };
  }

  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for")?.split(",")[0].trim() ?? null;
  if (!(await verifyTurnstile(turnstileToken, ip))) {
    return { success: false, error: "Verification failed. Please try again." };
  }

  try {
    const cms = await getPayload({ config });
    await cms.create({ collection: "enquiries", data: payload });
  } catch {
    return { success: false, error: "Something went wrong. Please try again." };
  }

  try {
    const cms = await getPayload({ config });
    const name = `${payload.firstName} ${payload.lastName}`.trim();
    await cms.sendEmail({
      to: ENQUIRY_TEAM_RECIPIENTS,
      replyTo: payload.email,
      subject: `New Enquiry — ${name}`,
      html: buildTeamEnquiryEmail(payload),
    });
    await cms.sendEmail({
      to: payload.email,
      subject: "We received your enquiry — Giada Studio",
      html: buildClientEnquiryConfirmationEmail(payload.firstName || name),
    });
  } catch (err) {
    console.error("Enquiry saved, but sending notification email failed:", err);
  }

  return { success: true };
}
