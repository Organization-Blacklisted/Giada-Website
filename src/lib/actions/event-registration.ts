"use server";

import { headers } from "next/headers";
import { getPayload } from "payload";
import config from "@payload-config";
import type { Event } from "@/payload-types";
import { formatEventDate } from "@/lib/api/events-map";
import {
  buildTeamEventRegistrationEmail,
  buildClientEventRegistrationConfirmationEmail,
  EVENT_REGISTRATION_TEAM_RECIPIENTS,
} from "@/lib/email/event-registration-emails";
import { verifyTurnstile } from "@/lib/turnstile";

export type EventRegistrationPayload = {
  eventId: number;
  fullName: string;
  companyName: string;
  email: string;
  mobileNumber: string;
};

// Saves the event registration form's submission via Payload's Local
// API — same pattern as submitEnquiry in lib/actions/enquiry.ts.
//
// Email sending (Brevo, added 2026-10-24) is a second, separate step
// after the save succeeds, same reasoning as submitEnquiry — a delivery
// hiccup shouldn't make a real registrant think their submission was
// lost, since it's already safely stored in Event Registrations either
// way. Recipients deliberately skip nitin@ for this form specifically
// (explicit instruction) — see EVENT_REGISTRATION_TEAM_RECIPIENTS.
//
// Turnstile verification (added 2026-10-29, pre-launch audit) — this
// form had zero bot/spam protection, unlike Contact's enquiry form,
// despite also firing two real outbound emails per submission. Same
// gate-before-anything-else pattern as submitEnquiry.
export async function submitEventRegistration(
  payload: EventRegistrationPayload,
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

  let event: Event | null = null;

  try {
    const cms = await getPayload({ config });
    event = await cms.findByID({ collection: "events", id: payload.eventId });
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
  } catch {
    return { success: false, error: "Something went wrong. Please try again." };
  }

  try {
    const cms = await getPayload({ config });
    const emailData = {
      fullName: payload.fullName,
      companyName: payload.companyName,
      email: payload.email,
      mobileNumber: payload.mobileNumber,
      eventTitle: event.title,
      eventSlug: event.slug,
      eventDateFormatted: formatEventDate(event.eventDate),
      timeLabel: event.timeLabel,
      location: event.location,
    };
    await cms.sendEmail({
      to: EVENT_REGISTRATION_TEAM_RECIPIENTS,
      replyTo: payload.email,
      subject: `New Event Registration — ${payload.fullName}`,
      html: buildTeamEventRegistrationEmail(emailData),
    });
    await cms.sendEmail({
      to: payload.email,
      subject: `You're confirmed — ${event.title}`,
      html: buildClientEventRegistrationConfirmationEmail(emailData),
    });
  } catch (err) {
    console.error("Event registration saved, but sending notification email failed:", err);
  }

  return { success: true };
}
