import type { CollectionConfig } from "payload";

// Admin auth collection — required by Payload, not a Giada content type.
// Email + password come from `auth: true` automatically.
//
// Role-based access, added 2026-10-07 (explicit request — previously had
// no `role` field and no access rules, meaning every created user had
// identical full access to everything, including the ability to create
// or delete OTHER admin accounts). Two roles:
//  - admin: full access, including managing other Users.
//  - editor: can edit site content (Home, Media — both left with
//    Payload's own default access, "any authenticated user", since
//    editing content is exactly what this role is for), but cannot
//    create/read-others/update-others/delete Users, and cannot change
//    their OWN `role` field even on their own account (see that field's
//    own `access.update` below) — without that, "can update your own
//    doc" plus "role has no field-level lock" would let an editor just
//    promote themselves to admin.
export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "email",
    // Hidden from the nav for non-admins — the real protection is the
    // access control below, this just keeps editors from seeing a
    // "Users" section they mostly can't use anyway.
    hidden: ({ user }) => user?.role !== "admin",
  },
  auth: true,
  access: {
    // Admins can read every user; everyone can read their own record
    // (the admin UI needs this just to show "logged in as ___").
    read: ({ req: { user } }) => {
      if (!user) return false;
      if (user.role === "admin") return true;
      return { id: { equals: user.id } };
    },
    // Only admins can create new accounts — stops an editor from
    // spawning more accounts for themselves or anyone else.
    create: ({ req: { user } }) => user?.role === "admin",
    // Admins can update any user; everyone can update their own record
    // (e.g. change their own password).
    update: ({ req: { user } }) => {
      if (!user) return false;
      if (user.role === "admin") return true;
      return { id: { equals: user.id } };
    },
    // Only admins can delete accounts.
    delete: ({ req: { user } }) => user?.role === "admin",
  },
  fields: [
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "editor",
      options: [
        { label: "Admin", value: "admin" },
        { label: "Editor", value: "editor" },
      ],
      access: {
        // Field-level lock, separate from the collection-level `update`
        // access above: only an admin can ever set/change this field,
        // even on their own account. Without this, the collection-level
        // "you can update your own doc" rule would let an editor just
        // edit their own user and promote themselves to admin.
        update: ({ req: { user } }) => user?.role === "admin",
      },
      admin: {
        description: "Admins can manage other users and delete content; Editors can edit site content only.",
      },
    },
  ],
};
