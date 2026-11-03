// Google Sheets API — appends each event registration to a per-event
// tab in the client's shared spreadsheet (requested 2026-11-03), same
// "best-effort side effect, never blocks the real submission" pattern
// as lib/brevo.ts. Auth is a service account JWT signed by hand (RS256
// via node:crypto) rather than pulling in `googleapis`/
// `google-auth-library` — this project already does raw-fetch API
// calls everywhere else (see brevo.ts), and the JWT-bearer exchange is
// only a few lines.
//
// Service account: giada-sheet-writer@giada-website-integrations.iam.gserviceaccount.com
// (shared as Editor on the target spreadsheet — see GOOGLE_SHEETS_SPREADSHEET_ID).
import { createSign } from "node:crypto";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SHEETS_API = "https://sheets.googleapis.com/v4/spreadsheets";

const ROW_HEADERS = ["Full Name", "Company", "Email", "Mobile Number", "Submitted At"];

function base64url(input: Buffer | string): string {
  return Buffer.from(input).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// Cached across invocations within the same warm serverless instance —
// avoids a token-exchange round trip on every single registration.
let cachedToken: { value: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.value;
  }

  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL || "";
  // Vercel's env var UI collapses literal newlines; support both a
  // real multi-line value and a `\n`-escaped single-line one.
  const privateKey = (process.env.GOOGLE_SHEETS_PRIVATE_KEY || "").replace(/\\n/g, "\n");

  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64url(
    JSON.stringify({
      iss: clientEmail,
      scope: "https://www.googleapis.com/auth/spreadsheets",
      aud: TOKEN_URL,
      exp: now + 3600,
      iat: now,
    })
  );
  const unsigned = `${header}.${payload}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsigned);
  signer.end();
  const signature = base64url(signer.sign(privateKey));
  const jwt = `${unsigned}.${signature}`;

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Google token exchange failed (${res.status}): ${JSON.stringify(data)}`);
  }

  cachedToken = { value: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 };
  return data.access_token;
}

// Sheet tab names can't contain []*/\?: and are capped at 100 chars —
// event titles are short marketing copy so truncation is unlikely in
// practice, but guarded anyway.
function sheetTabName(eventTitle: string): string {
  return eventTitle.replace(/[[\]*/\\?:]/g, "").slice(0, 100).trim() || "Event";
}

async function ensureEventTab(spreadsheetId: string, token: string, tabName: string): Promise<void> {
  const metaRes = await fetch(`${SHEETS_API}/${spreadsheetId}?fields=sheets.properties.title`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const meta = await metaRes.json();
  if (!metaRes.ok) {
    throw new Error(`Failed to read spreadsheet metadata (${metaRes.status}): ${JSON.stringify(meta)}`);
  }

  const existing = (meta.sheets as Array<{ properties: { title: string } }> | undefined)?.some(
    (s) => s.properties.title === tabName
  );
  if (existing) return;

  const createRes = await fetch(`${SHEETS_API}/${spreadsheetId}:batchUpdate`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ requests: [{ addSheet: { properties: { title: tabName } } }] }),
  });
  if (!createRes.ok) {
    throw new Error(`Failed to create sheet tab "${tabName}" (${createRes.status}): ${await createRes.text()}`);
  }

  const headerRes = await fetch(
    `${SHEETS_API}/${spreadsheetId}/values/${encodeURIComponent(`${tabName}!A1`)}?valueInputOption=RAW`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ values: [ROW_HEADERS] }),
    }
  );
  if (!headerRes.ok) {
    throw new Error(`Failed to write header row for "${tabName}" (${headerRes.status}): ${await headerRes.text()}`);
  }
}

export type EventRegistrationRow = {
  eventTitle: string;
  fullName: string;
  companyName: string;
  email: string;
  mobileNumber: string;
  submittedAt: Date;
};

export async function appendEventRegistrationToSheet(row: EventRegistrationRow): Promise<void> {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID || "";
  if (!spreadsheetId) throw new Error("GOOGLE_SHEETS_SPREADSHEET_ID is not set");

  const token = await getAccessToken();
  const tabName = sheetTabName(row.eventTitle);
  await ensureEventTab(spreadsheetId, token, tabName);

  const appendRes = await fetch(
    `${SHEETS_API}/${spreadsheetId}/values/${encodeURIComponent(`${tabName}!A1`)}:append?valueInputOption=USER_ENTERED`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        values: [[row.fullName, row.companyName, row.email, row.mobileNumber, row.submittedAt.toISOString()]],
      }),
    }
  );
  if (!appendRes.ok) {
    throw new Error(`Failed to append registration row (${appendRes.status}): ${await appendRes.text()}`);
  }
}
