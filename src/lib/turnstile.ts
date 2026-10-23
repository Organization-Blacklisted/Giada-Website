// Server-side verification of a Cloudflare Turnstile token, ported from
// the real Astro source's src/pages/api/contact.ts (same endpoint/shape
// — that version was never actually wired up live, empty site key).
// Called from Server Actions before any DB write/email send, so a
// failed/missing token stops the submission outright.
export async function verifyTurnstile(token: string, ip: string | null): Promise<boolean> {
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      secret: process.env.TURNSTILE_SECRET_KEY,
      response: token,
      ...(ip ? { remoteip: ip } : {}),
    }),
  });
  const data = await res.json();
  return data.success === true;
}
