"use server";

import { getPayload } from "payload";
import config from "@payload-config";
import type { EnquiryPayload } from "@/types/enquiry";

// Saves the submission via Payload's Local API (direct in-process call,
// no HTTP round-trip) instead of the old guessed Laravel `/enquiries`
// endpoint, which never existed. No email notification yet — pending
// the Resend/Brevo decision; for now this just makes sure nothing
// submitted is lost, visible in /admin's Enquiries collection.
export async function submitEnquiry(
  payload: EnquiryPayload
): Promise<{ success: boolean; error?: string }> {
  try {
    const cms = await getPayload({ config });
    await cms.create({ collection: "enquiries", data: payload });
    return { success: true };
  } catch {
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
