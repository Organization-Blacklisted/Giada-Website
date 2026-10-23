// Journal Newsletter signup emails — same branded template as
// enquiry-emails.ts (see shared-template.ts). Content is the real
// client-provided copy (2026-10-23), placed into the same branded shell
// (wordmark header, eyebrow label, Didot heading, showroom footer) the
// Contact form's emails already use, rather than a plain unstyled
// letter — explicit decision after discussing both options. Wording and
// paragraph order preserved exactly as given, just the Liquid-style
// `{{ first_name | default: ... }}` translated into real JS — the form
// requires a name now, so the "Friend of Giada" fallback is a safety
// net, not the expected case.
import { escapeHtml, serif, sans, ink, body, muted, eyebrow, baseTemplate, fieldRow } from "./shared-template";

export function buildNewsletterConfirmationEmail(name: string): string {
  const displayName = name.trim() || "Friend of Giada";

  return baseTemplate(
    `
    <div style="text-align:center;">
      ${eyebrow("A Personal Note")}

      <h1 style="margin:26px 0 20px;font-family:${serif};font-size:29px;font-weight:400;line-height:1.25;letter-spacing:-0.01em;color:${ink};">
        A Legacy Woven Over Generations.
      </h1>

      <p style="margin:0 auto 16px;max-width:420px;font-family:${sans};font-size:14px;line-height:1.85;color:${ink};text-align:left;">
        Dear ${escapeHtml(displayName)},
      </p>

      <p style="margin:0 auto 16px;max-width:420px;font-family:${sans};font-size:14px;line-height:1.85;color:${body};text-align:left;">
        We're delighted to have you as part of the Giada community.
      </p>

      <p style="margin:0 auto 16px;max-width:420px;font-family:${sans};font-size:14px;line-height:1.85;color:${body};text-align:left;">
        For over a century, we've brought together generations of craftsmanship and contemporary vision to create rugs that become the soul of a room.
      </p>

      <p style="margin:0 auto 28px;max-width:420px;font-family:${sans};font-size:14px;line-height:1.85;color:${body};text-align:left;">
        We look forward to sharing the artistry, stories, and bespoke creations that make Giada special with you.
      </p>

      <p style="margin:0 auto;max-width:420px;font-family:${sans};font-size:14px;line-height:1.85;color:${body};text-align:left;">
        With warm regards,<br />
        Team Giada Studio
      </p>
    </div>
  `,
    "A Legacy Woven Over Generations — welcome to the Giada community."
  );
}

export function buildNewsletterTeamNotificationEmail(name: string, subscriberEmail: string): string {
  return baseTemplate(
    `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="padding:0;font-family:${sans};font-size:11px;font-weight:500;letter-spacing:0.4em;text-transform:uppercase;color:${body};white-space:nowrap;">New Subscriber</td>
      </tr>
    </table>

    <h1 style="margin:24px 0 16px;font-family:${serif};font-size:27px;font-weight:400;line-height:1.25;letter-spacing:-0.01em;color:${ink};">
      New Newsletter Subscription.
    </h1>

    <p style="margin:0 0 20px;font-family:${sans};font-size:14px;line-height:1.85;color:${body};">
      Hi Team, a new subscriber has joined the Giada Studio community. Their email address has been added to the Brevo newsletter list to receive future newsletters, brand updates, and curated design inspiration.
    </p>

    <p style="margin:28px 0 10px;font-family:${sans};font-size:11px;font-weight:600;letter-spacing:0.25em;text-transform:uppercase;color:${body};">Subscriber Details</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      ${fieldRow("Name", escapeHtml(name))}
      ${fieldRow(
        "Email",
        `<a href="mailto:${escapeHtml(subscriberEmail)}" style="color:${ink};text-decoration:underline;text-decoration-color:#d6d3d1;">${escapeHtml(subscriberEmail)}</a>`
      )}
    </table>

    <p style="margin:24px 0 0;font-family:${sans};font-size:12px;font-style:italic;color:${muted};">
      Best regards, Giada Studio Team
    </p>
  `,
    `New newsletter subscriber: ${name} — ${subscriberEmail}`
  );
}

// Internal notification recipient — distinct from the Contact form's
// founder list (nitin@/julien@/office@), since this is a marketing-list
// event, not a direct personal enquiry.
export const NEWSLETTER_TEAM_RECIPIENT = "marketing@giada-studio.com";
