"use server";

import type { EnquiryPayload } from "@/types/enquiry";

// TODO: confirm the real Laravel endpoint path once the API contract is
// agreed — /enquiries is a placeholder guess.
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
