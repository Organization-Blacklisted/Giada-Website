import type { Block } from "payload";

// The Figma detail-page design has one recurring list pattern that plain
// Lexical lists can't express: each item is a bold, Didot-set "lead"
// sentence (styled as its own distinct line, not just bold body text)
// followed by a regular-weight description — and one item also nests a
// plain bullet sub-list plus a trailing unbulleted paragraph. Modeled as
// an explicit block (same reasoning as ImagePairBlock) rather than
// trying to infer this two-tier styling from text formatting.
export const FeatureListBlock: Block = {
  slug: "featureList",
  labels: { singular: "Feature List", plural: "Feature Lists" },
  fields: [
    {
      name: "items",
      type: "array",
      minRows: 1,
      fields: [
        { name: "title", type: "text", required: true },
        { name: "description", type: "textarea", required: true },
        {
          name: "subItems",
          type: "array",
          label: "Sub-points (optional)",
          fields: [{ name: "text", type: "text", required: true }],
        },
        {
          name: "closingText",
          type: "textarea",
          label: "Closing line (optional)",
          admin: { description: "An extra unbulleted paragraph after the sub-points, if needed." },
        },
      ],
    },
  ],
};
