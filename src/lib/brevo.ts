// Brevo Contacts API — distinct from payload.config.ts's SMTP adapter
// (that sends email; this manages the mailing list itself). Needs its
// own API key (BREVO_API_KEY, generated 2026-10-23, scoped to
// Contacts: All only — see .env.example) separate from the SMTP key.
export async function addContactToNewsletterList(email: string): Promise<void> {
  const res = await fetch("https://api.brevo.com/v3/contacts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": process.env.BREVO_API_KEY || "",
    },
    body: JSON.stringify({
      email,
      listIds: [Number(process.env.BREVO_NEWSLETTER_LIST_ID)],
      // Re-subscribing with the same email updates the existing contact
      // instead of Brevo returning a "duplicate" error — expected on a
      // public signup form where the same person might submit twice.
      updateEnabled: true,
    }),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Brevo contact creation failed (${res.status}): ${errorBody}`);
  }
}
