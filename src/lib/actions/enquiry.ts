"use server";

import type { EnquiryPayload } from "@/types/enquiry";

// TODO: replace with a Payload Local API call (e.g. `payload.create({
// collection: "enquiries", data: payload })`) once the Enquiries
// collection exists. Still a placeholder either way — this never
// actually worked (no backend has existed to receive it yet), so
// nothing new broke by Laravel no longer being the target; `API_URL`
// genuinely not being set right now just means the real fix is
// pending infrastructure, not a regression.
export async function submitEnquiry(
  payload: EnquiryPayload
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`${process.env.API_URL}/enquiries`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { success: false, error: body?.message ?? "Something went wrong. Please try again." };
    }

    return { success: true };
  } catch {
    return { success: false, error: "Network error. Please check your connection and try again." };
  }
}
