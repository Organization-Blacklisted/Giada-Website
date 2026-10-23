// Ported from the real Astro source's src/pages/api/contact.ts — same
// branded HTML (wordmark header, showroom footer, stone/Didot styling),
// adapted to pull showroom/social data from data/site.ts (siteConfig)
// instead of a second hardcoded copy, so it can never drift from the
// real Contact page's own data. See lib/actions/enquiry.ts for where
// these get sent.
import { siteConfig } from "@/data/site";
import type { EnquiryPayload, EnquiryType } from "@/types/enquiry";

const escapeHtml = (value: unknown) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (ch) =>
      (
        { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" } as Record<string, string>
      )[ch] as string
  );

const serif = `Didot, 'Bodoni MT', 'Playfair Display', Georgia, 'Times New Roman', serif`;
const sans = `'Avenir Next', Avenir, 'Helvetica Neue', Helvetica, Arial, sans-serif`;

const ink = "#1c1917"; // stone-900
const body = "#78716c"; // stone-500
const muted = "#a8a29e"; // stone-400
const rule = "#d6d3d1"; // stone-300
const hairline = "#e7e5e4"; // stone-200
const paper = "#fafaf9"; // stone-50

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

const eyebrow = (label: string) => `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto;">
    <tr>
      <td style="vertical-align:middle;"><div style="width:40px;height:1px;background-color:${rule};font-size:0;line-height:0;">&nbsp;</div></td>
      <td style="padding:0 14px;font-family:${sans};font-size:11px;font-weight:500;letter-spacing:0.4em;text-transform:uppercase;color:${body};white-space:nowrap;">${label}</td>
      <td style="vertical-align:middle;"><div style="width:40px;height:1px;background-color:${rule};font-size:0;line-height:0;">&nbsp;</div></td>
    </tr>
  </table>
`;

const button = (href: string, label: string) => `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto;">
    <tr>
      <td style="background-color:${ink};border:1px solid ${ink};">
        <a href="${href}"
           style="display:inline-block;padding:15px 36px;font-family:${sans};font-size:12px;font-weight:600;letter-spacing:0.25em;text-transform:uppercase;color:#ffffff;text-decoration:none;">
          ${label}&nbsp;&nbsp;&rarr;
        </a>
      </td>
    </tr>
  </table>
`;

const baseTemplate = (content: string, preheader = "") => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
</head>
<body style="margin:0;padding:0;background-color:${paper};-webkit-font-smoothing:antialiased;">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${escapeHtml(preheader)}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${paper};">
    <tr>
      <td align="center" style="padding:48px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background-color:#ffffff;border:1px solid ${hairline};">

          <tr>
            <td align="center" style="padding:44px 40px 36px;border-bottom:1px solid ${hairline};">
              <p style="margin:0;font-family:${serif};font-size:27px;font-weight:400;letter-spacing:0.32em;color:${ink};">GIADA</p>
              <p style="margin:12px 0 0;font-family:${sans};font-size:10px;letter-spacing:0.32em;text-transform:uppercase;color:${muted};">${siteConfig.locations.map((l) => l.city).join("&nbsp;&nbsp;&middot;&nbsp;&nbsp;")}</p>
            </td>
          </tr>

          <tr>
            <td style="padding:48px 48px 52px;">
              ${content}
            </td>
          </tr>

          <tr>
            <td style="padding:36px 48px 32px;border-top:1px solid ${hairline};">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  ${siteConfig.locations
                    .map(
                      (loc, i) => `
                  <td width="50%" align="center" style="vertical-align:top;padding:0 16px;${i > 0 ? `border-left:1px solid ${hairline};` : ""}">
                    <p style="margin:0 0 8px;font-family:${sans};font-size:11px;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:${muted};">${loc.city}</p>
                    ${loc.lines
                      .map(
                        (line) =>
                          `<p style="margin:0;font-family:${sans};font-size:12px;line-height:1.7;color:${body};">${line}</p>`
                      )
                      .join("")}
                    <p style="margin:6px 0 0;font-family:${sans};font-size:12px;color:${body};">${loc.phone}</p>
                  </td>`
                    )
                    .join("")}
                </tr>
              </table>

              <div style="margin:28px auto 0;width:64px;height:1px;background-color:${hairline};font-size:0;line-height:0;">&nbsp;</div>

              <p style="margin:20px 0 0;text-align:center;">
                <a href="${siteConfig.social.instagram}" style="font-family:${sans};font-size:12px;color:${body};text-decoration:none;">Instagram</a>
                <span style="font-family:${sans};font-size:12px;color:${rule};">&nbsp;&nbsp;&middot;&nbsp;&nbsp;</span>
                <a href="${siteConfig.social.linkedin}" style="font-family:${sans};font-size:12px;color:${body};text-decoration:none;">LinkedIn</a>
              </p>

              <p style="margin:16px 0 0;text-align:center;font-family:${sans};font-size:11px;letter-spacing:0.06em;color:${muted};">
                &copy; ${new Date().getFullYear()} Giada. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const fieldRow = (label: string, value: string) => `
  <tr>
    <td style="padding:18px 0 14px;border-bottom:1px solid ${hairline};">
      <p style="margin:0 0 6px;font-family:${sans};font-size:11px;font-weight:600;letter-spacing:0.25em;text-transform:uppercase;color:${body};">${label}</p>
      <p style="margin:0;font-family:${sans};font-size:15px;line-height:1.6;color:${ink};">${value}</p>
    </td>
  </tr>
`;

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
