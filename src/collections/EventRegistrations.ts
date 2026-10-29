import type { CollectionConfig } from "payload";

// Stores the event registration form's submissions (one event per
// registration, via a `relationship` to `events`). Separate from
// `Enquiries` rather than one shared "submissions" collection — the two
// forms have genuinely different shapes (this one is tied to a specific
// event and has no message/enquiry-type field), and overloading one
// collection with optional fields for both would be harder to read in
// admin than two small, specific ones. No email notification yet — same
// as Enquiries, pending the Resend/Brevo decision.
export const EventRegistrations: CollectionConfig = {
  slug: "event-registrations",
  admin: {
    useAsTitle: "email",
    defaultColumns: ["event", "fullName", "email", "mobileNumber", "createdAt"],
    group: "Submissions",
  },
  access: {
    // Submitted by anonymous site visitors via a Server Action, not an
    // authenticated admin session.
    create: () => true,
    // Fixed 2026-10-29, pre-launch audit: same issue as Enquiries.ts —
    // this was `() => true`, publicly exposing every registrant's name,
    // company, email, and phone number via the REST/GraphQL API with no
    // authentication. Gated to logged-in admin users only.
    read: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    { name: "event", type: "relationship", relationTo: "events", required: true },
    { name: "fullName", type: "text", required: true },
    { name: "companyName", type: "text", required: true },
    { name: "email", type: "email", required: true },
    { name: "mobileNumber", type: "text", required: true },
  ],
};
