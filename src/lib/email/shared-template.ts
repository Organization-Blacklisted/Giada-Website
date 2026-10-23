// Shared branded HTML email building blocks — extracted from
// enquiry-emails.ts (originally ported from the Astro source's
// contact.ts) when newsletter-emails.ts needed the exact same wordmark
// header / showroom footer / stone-Didot styling, so both stay visually
// identical and can't drift into two different "brand" looks.
import { siteConfig } from "@/data/site";

export const escapeHtml = (value: unknown) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (ch) =>
      (
        { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" } as Record<string, string>
      )[ch] as string
  );

export const serif = `Didot, 'Bodoni MT', 'Playfair Display', Georgia, 'Times New Roman', serif`;
export const sans = `'Avenir Next', Avenir, 'Helvetica Neue', Helvetica, Arial, sans-serif`;

export const ink = "#1c1917"; // stone-900
export const body = "#78716c"; // stone-500
export const muted = "#a8a29e"; // stone-400
export const rule = "#d6d3d1"; // stone-300
export const hairline = "#e7e5e4"; // stone-200
export const paper = "#fafaf9"; // stone-50

export const eyebrow = (label: string) => `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto;">
    <tr>
      <td style="vertical-align:middle;"><div style="width:40px;height:1px;background-color:${rule};font-size:0;line-height:0;">&nbsp;</div></td>
      <td style="padding:0 14px;font-family:${sans};font-size:11px;font-weight:500;letter-spacing:0.4em;text-transform:uppercase;color:${body};white-space:nowrap;">${label}</td>
      <td style="vertical-align:middle;"><div style="width:40px;height:1px;background-color:${rule};font-size:0;line-height:0;">&nbsp;</div></td>
    </tr>
  </table>
`;

export const button = (href: string, label: string) => `
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

export const baseTemplate = (content: string, preheader = "") => `
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

export const fieldRow = (label: string, value: string) => `
  <tr>
    <td style="padding:18px 0 14px;border-bottom:1px solid ${hairline};">
      <p style="margin:0 0 6px;font-family:${sans};font-size:11px;font-weight:600;letter-spacing:0.25em;text-transform:uppercase;color:${body};">${label}</p>
      <p style="margin:0;font-family:${sans};font-size:15px;line-height:1.6;color:${ink};">${value}</p>
    </td>
  </tr>
`;
