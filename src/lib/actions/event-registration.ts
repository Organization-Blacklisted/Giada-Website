"use server";

import { getPayload } from "payload";
import config from "@payload-config";

export type EventRegistrationPayload = {
  eventId: number;
  fullName: string;
  companyName: string;
  email: string;
  mobileNumber: string;
};

// Saves the event registration form's submission via Payload's Local
// API — same pattern as submitEnquiry in lib/actions/enquiry.ts. No
// email notification yet, pending the Resend/Brevo decision; for now
// this just makes sure nothing submitted is lost, visible in /admin's
// Event Registrations collection.
export async function submitEventRegistration(
  payload: EventRegistrationPayload
): Promise<{ success: boolean; error?: string }> {
  try {
    const cms = await getPayload({ config });
    await cms.create({
      collection: "event-registrations",
      data: {
        event: payload.eventId,
        fullName: payload.fullName,
        companyName: payload.companyName,
        email: payload.email,
        mobileNumber: payload.mobileNumber,
      },
    });
    return { success: true };
  } catch {
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
