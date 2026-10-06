import type { CollectionConfig } from "payload";

// Uploads collection — every image/file across every other collection
// relates to a document here. Kept minimal (no Folders/Tags, unlike
// Payload's own blank-template default) since this project doesn't need
// that organizational layer yet; add it later if the content volume
// actually calls for it.
export const Media: CollectionConfig = {
  slug: "media",
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
    },
  ],
  upload: true,
};
