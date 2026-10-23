import type { CollectionConfig } from "payload";

// Stores EnquiryForm submissions (components/sections/contact/EnquiryForm) —
// previously posted to a guessed Laravel `/enquiries` endpoint that never
// existed, now saved via Payload's Local API instead (see
// lib/actions/enquiry.ts, which also sends the team notification + client
// confirmation emails via Brevo, added 2026-10-23). Still saved here
// regardless of whether the email sends successfully, so nothing
// submitted is ever lost.
export const Enquiries: CollectionConfig = {
  slug: "enquiries",
  admin: {
    useAsTitle: "email",
    defaultColumns: ["firstName", "lastName", "email", "type", "createdAt"],
    group: "Submissions",
  },
  access: {
    // Submitted by anonymous site visitors via a Server Action, not an
    // authenticated admin session — same reasoning as EventRegistrations.
    create: () => true,
    read: () => true,
  },
  fields: [
    { name: "firstName", type: "text", required: true },
    { name: "lastName", type: "text", required: true },
    { name: "email", type: "email", required: true },
    {
      name: "type",
      type: "select",
      required: true,
      options: [
        { label: "Bespoke Rug Project", value: "bespoke-rug-project" },
        { label: "Textile in Glass Project", value: "textile-in-glass-project" },
        { label: "Designer / Architect Partnership", value: "designer-architect-partnership" },
        { label: "Trade Programme", value: "trade-programme" },
        { label: "Showroom Visit", value: "showroom-visit" },
        { label: "General Enquiry", value: "general-enquiry" },
      ],
    },
    { name: "message", type: "textarea", required: true },
  ],
};
