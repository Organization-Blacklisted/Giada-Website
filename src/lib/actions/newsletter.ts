"use server";

import { getPayload } from "payload";
import config from "@payload-config";
import { addContactToNewsletterList } from "@/lib/brevo";
import { buildNewsletterConfirmationEmail, buildNewsletterTeamNotificationEmail, NEWSLETTER_TEAM_RECIPIENT } from "@/lib/email/newsletter-emails";

// Deliberately Brevo-only, no Payload collection — discussed and agreed
// 2026-10-23: the subscriber list needs to live wherever the client will
// actually compose and send newsletter campaigns from (Brevo), and
// mirroring it into Payload too would just be a second source of truth
// that can drift (someone unsubscribes in Brevo, a Payload copy would
// still say "subscribed" forever). See ARCHITECTURE.md if this decision
// needs revisiting.
//
// `name` collected and passed through to Brevo (as FIRSTNAME) since
// 2026-10-23, per explicit request — email copy using it is a separate,
// still-pending discussion, not wired into the templates yet.
export async function subscribeToNewsletter(
  name: string,
  email: string
): Promise<{ success: boolean; error?: string }> {
  if (!name.trim()) {
    return { success: false, error: "Please enter your name." };
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: "Please enter a valid email address." };
  }

  try {
    await addContactToNewsletterList(email, name);
  } catch (err) {
    console.error("Newsletter signup failed:", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }

  // Same pattern as submitEnquiry: the subscriber is already added to
  // the list at this point, so an email hiccup doesn't fail the
  // signup itself — just logged, not surfaced to the visitor.
  try {
    const cms = await getPayload({ config });
    await cms.sendEmail({
      to: email,
      subject: "You're subscribed — Giada Studio",
      html: buildNewsletterConfirmationEmail(),
    });
    await cms.sendEmail({
      to: NEWSLETTER_TEAM_RECIPIENT,
      subject: "New Newsletter Subscriber",
      html: buildNewsletterTeamNotificationEmail(email),
    });
  } catch (err) {
    console.error("Subscriber added to Brevo, but sending notification email failed:", err);
  }

  return { success: true };
}
