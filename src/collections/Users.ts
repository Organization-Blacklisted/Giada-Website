import type { CollectionConfig } from "payload";

// Admin auth collection — required by Payload, not a Giada content type.
// Email + password come from `auth: true` automatically.
export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "email",
  },
  auth: true,
  fields: [],
};
