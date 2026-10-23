// Journal Newsletter signup emails — same branded template as
// enquiry-emails.ts (see shared-template.ts). Confirmation copy is
// deliberately generic placeholder text for now, per explicit request —
// swap buildNewsletterConfirmationEmail's content once real copy is
// provided, nothing else needs to change.
import { escapeHtml, serif, sans, ink, body, muted, eyebrow, baseTemplate } from "./shared-template";

export function buildNewsletterConfirmationEmail(): string {
  return baseTemplate(
    `
    <div style="text-align:center;">
      ${eyebrow("You're In")}

      <h1 style="margin:26px 0 16px;font-family:${serif};font-size:29px;font-weight:400;line-height:1.25;letter-spacing:-0.01em;color:${ink};">
        Thank You for Subscribing.
      </h1>

      <p style="margin:0 auto;max-width:420px;font-family:${sans};font-size:14px;line-height:1.85;color:${body};">
        You're now on the list for new collections, design inspiration, and
        stories from our atelier — delivered thoughtfully to your inbox.
      </p>
    </div>
  `,
    "You're now subscribed to the Giada Journal."
  );
}

export function buildNewsletterTeamNotificationEmail(subscriberEmail: string): string {
  return baseTemplate(
    `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="padding:0 0 0 0;font-family:${sans};font-size:11px;font-weight:500;letter-spacing:0.4em;text-transform:uppercase;color:${body};white-space:nowrap;">New Subscriber</td>
      </tr>
    </table>

    <h1 style="margin:24px 0 12px;font-family:${serif};font-size:27px;font-weight:400;line-height:1.25;letter-spacing:-0.01em;color:${ink};">
      A New Newsletter Subscriber.
    </h1>

    <p style="margin:0;font-family:${sans};font-size:14px;line-height:1.85;color:${body};">
      <a href="mailto:${escapeHtml(subscriberEmail)}" style="color:${ink};text-decoration:underline;">${escapeHtml(subscriberEmail)}</a>
      just subscribed to the Journal newsletter via the website and has been
      added to the Brevo list.
    </p>
  `,
    `New newsletter subscriber: ${subscriberEmail}`
  );
}

// Internal notification recipient — distinct from the Contact form's
// founder list (nitin@/julien@/office@), since this is a marketing-list
// event, not a direct personal enquiry.
export const NEWSLETTER_TEAM_RECIPIENT = "marketing@giada-studio.com";
