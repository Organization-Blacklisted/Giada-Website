// Ported from the real Astro source's src/pages/api/contact.ts — same
// branded HTML (wordmark header, showroom footer, stone/Didot styling),
// now via shared-template.ts (extracted 2026-10-23 when
// newsletter-emails.ts needed the exact same building blocks). See
// lib/actions/enquiry.ts for where these get sent.
import { siteConfig } from "@/data/site";
import type { EnquiryPayload, EnquiryType } from "@/types/enquiry";
import { escapeHtml, serif, sans, ink, body, muted, rule, hairline, paper, eyebrow, button, baseTemplate, fieldRow } from "./shared-template";

// Matches the labels on Enquiries.ts's `type` select field exactly —
// kept here rather than imported, since that field config isn't
// exported as a standalone label map.
const ENQUIRY_TYPE_LABELS: Record<EnquiryType, string> = {
  "bespoke-rug-project": "Bespoke Rug Project",
  "textile-in-glass-project": "Textile in Glass Project",
  "designer-architect-partnership": "Designer / Architect Partnership",
  "trade-programme": "Trade Programme",
  "showroom-visit": "Showroom Visit",
  "general-enquiry": "General Enquiry",
};

export function buildTeamEnquiryEmail(data: EnquiryPayload): string {
  const name = `${data.firstName} ${data.lastName}`.trim();
  const inquiryLabel = ENQUIRY_TYPE_LABELS[data.type];

  return baseTemplate(
    `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="vertical-align:middle;"><div style="width:40px;height:1px;background-color:${rule};font-size:0;line-height:0;">&nbsp;</div></td>
        <td style="padding:0 0 0 14px;font-family:${sans};font-size:11px;font-weight:500;letter-spacing:0.4em;text-transform:uppercase;color:${body};white-space:nowrap;">New Enquiry</td>
      </tr>
    </table>

    <h1 style="margin:24px 0 12px;font-family:${serif};font-size:27px;font-weight:400;line-height:1.25;letter-spacing:-0.01em;color:${ink};">
      A New Enquiry Has Arrived.
    </h1>

    <p style="margin:0 0 8px;font-family:${sans};font-size:14px;line-height:1.85;color:${body};">
      Submitted through the contact form on ${new URL(siteConfig.url).hostname}.
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:12px;">
      ${fieldRow("Name", escapeHtml(name))}
      ${fieldRow(
        "Email",
        `<a href="mailto:${escapeHtml(data.email)}" style="color:${ink};text-decoration:underline;text-decoration-color:${rule};">${escapeHtml(data.email)}</a>`
      )}
      ${fieldRow("Type of Enquiry", escapeHtml(inquiryLabel))}
    </table>

    <p style="margin:28px 0 10px;font-family:${sans};font-size:11px;font-weight:600;letter-spacing:0.25em;text-transform:uppercase;color:${body};">Message</p>
    <div style="border:1px solid ${hairline};background-color:${paper};padding:20px 22px;">
      <p style="margin:0;font-family:${sans};font-size:14px;line-height:1.85;color:#57534e;white-space:pre-line;">${escapeHtml(data.message)}</p>
    </div>

    <p style="margin:24px 0 0;font-family:${sans};font-size:12px;font-style:italic;color:${muted};">
      Reply directly to this email to reach ${escapeHtml(name)}.
    </p>
  `,
    `New enquiry from ${name} — ${inquiryLabel}`
  );
}

export function buildClientEnquiryConfirmationEmail(firstName: string): string {
  return baseTemplate(
    `
    <div style="text-align:center;">
      ${eyebrow("Message Received")}

      <h1 style="margin:26px 0 16px;font-family:${serif};font-size:29px;font-weight:400;line-height:1.25;letter-spacing:-0.01em;color:${ink};">
        Thank You, ${escapeHtml(firstName)}.<br />Your Enquiry Is on Its Way.
      </h1>

      <p style="margin:0 auto;max-width:420px;font-family:${sans};font-size:14px;line-height:1.85;color:${body};">
        Your message has reached our studio. Every enquiry is read and answered
        personally by one of our founders &mdash; you can expect a reply within
        <span style="color:${ink};">one business day</span>.
      </p>

      <div style="margin:36px auto;width:64px;height:1px;background-color:${hairline};font-size:0;line-height:0;">&nbsp;</div>

      ${button(siteConfig.url, "Visit Giada Studio")}

      <p style="margin:28px 0 0;font-family:${sans};font-size:12px;font-style:italic;color:${muted};">
        In the meantime, feel free to explore our latest collections.
      </p>
    </div>
  `,
    "Thank you for reaching out — one of our founders will respond within one business day."
  );
}

// Real recipient list from the Astro source's contact.ts — confirm these
// founder addresses are still monitored if this ever needs updating.
export const ENQUIRY_TEAM_RECIPIENTS = ["nitin@giada-studio.com", "julien@giada-studio.com", "office@giada-studio.com"];
