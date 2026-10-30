// Same branded template as enquiry-emails.ts / newsletter-emails.ts (see
// shared-template.ts) — team notification + registrant confirmation,
// same shape as submitEnquiry. See lib/actions/event-registration.ts for
// where these get sent.
import { escapeHtml, serif, sans, ink, body, muted, rule, eyebrow, baseTemplate, fieldRow } from "./shared-template";

export type EventRegistrationEmailData = {
  fullName: string;
  companyName: string;
  email: string;
  mobileNumber: string;
  eventTitle: string;
  eventSlug: string;
  eventDateFormatted: string;
  timeLabel: string;
  location: string;
};

export function buildTeamEventRegistrationEmail(data: EventRegistrationEmailData): string {
  return baseTemplate(
    `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="vertical-align:middle;"><div style="width:40px;height:1px;background-color:${rule};font-size:0;line-height:0;">&nbsp;</div></td>
        <td style="padding:0 0 0 14px;font-family:${sans};font-size:11px;font-weight:500;letter-spacing:0.4em;text-transform:uppercase;color:${body};white-space:nowrap;">New Event Registration</td>
      </tr>
    </table>

    <h1 style="margin:24px 0 12px;font-family:${serif};font-size:27px;font-weight:400;line-height:1.25;letter-spacing:-0.01em;color:${ink};">
      A New Registration Has Arrived.
    </h1>

    <p style="margin:0 0 8px;font-family:${sans};font-size:14px;line-height:1.85;color:${body};">
      For ${escapeHtml(data.eventTitle)} — ${escapeHtml(data.eventDateFormatted)}, ${escapeHtml(data.timeLabel)}, ${escapeHtml(data.location)}.
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:12px;">
      ${fieldRow("Name", escapeHtml(data.fullName))}
      ${fieldRow("Company", escapeHtml(data.companyName))}
      ${fieldRow(
        "Email",
        `<a href="mailto:${escapeHtml(data.email)}" style="color:${ink};text-decoration:underline;text-decoration-color:${rule};">${escapeHtml(data.email)}</a>`
      )}
      ${fieldRow("Mobile", escapeHtml(data.mobileNumber))}
    </table>

    <p style="margin:24px 0 0;font-family:${sans};font-size:12px;font-style:italic;color:${muted};">
      Reply directly to this email to reach ${escapeHtml(data.fullName)}.
    </p>
  `,
    `New registration from ${data.fullName} for ${data.eventTitle}`
  );
}

// No "View Event Details" button (removed 2026-10-30) — it linked back
// to the event's own page, which also holds the registration form, so a
// visitor who'd just confirmed landed back on a page inviting them to
// register again. The date/time/location are already shown below, so
// nothing is lost by dropping it rather than building a dedicated
// read-only page.
export function buildClientEventRegistrationConfirmationEmail(data: EventRegistrationEmailData): string {
  const firstName = data.fullName.split(" ")[0] || data.fullName;

  return baseTemplate(
    `
    <div style="text-align:center;">
      ${eyebrow("Registration Confirmed")}

      <h1 style="margin:26px 0 16px;font-family:${serif};font-size:29px;font-weight:400;line-height:1.25;letter-spacing:-0.01em;color:${ink};">
        You're Confirmed, ${escapeHtml(firstName)}.
      </h1>

      <p style="margin:0 auto;max-width:420px;font-family:${sans};font-size:14px;line-height:1.85;color:${body};">
        We look forward to welcoming you to <span style="color:${ink};">${escapeHtml(data.eventTitle)}</span>.
      </p>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:28px;max-width:420px;margin-left:auto;margin-right:auto;">
        ${fieldRow("Date", escapeHtml(data.eventDateFormatted))}
        ${fieldRow("Time", escapeHtml(data.timeLabel))}
        ${fieldRow("Location", escapeHtml(data.location))}
      </table>

      <div style="margin:36px auto;width:64px;height:1px;background-color:${rule};font-size:0;line-height:0;">&nbsp;</div>

      <p style="margin:28px 0 0;font-family:${sans};font-size:12px;font-style:italic;color:${muted};">
        If anything changes on our end, we'll reach out to the email address you provided.
      </p>
    </div>
  `,
    `You're confirmed for ${data.eventTitle} — ${data.eventDateFormatted}, ${data.timeLabel}.`
  );
}

// Deliberately skips nitin@ for this form — events-specific per explicit
// instruction (2026-10-24), distinct from ENQUIRY_TEAM_RECIPIENTS in
// enquiry-emails.ts which still includes all three founders.
export const EVENT_REGISTRATION_TEAM_RECIPIENTS = ["julien@giada-studio.com", "office@giada-studio.com"];
