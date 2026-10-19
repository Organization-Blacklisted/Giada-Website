import type { Block } from "payload";

// The only non-text content shape in a blog post's body besides a single
// full-width image (that's covered by Lexical's own UploadFeature) — the
// Figma detail-page design has exactly one case of two images sitting
// side by side mid-article. Modeled as an explicit Lexical block rather
// than "two consecutive image nodes" so an editor inserts it
// deliberately, instead of the renderer guessing at adjacency.
export const ImagePairBlock: Block = {
  slug: "imagePair",
  labels: { singular: "Image Pair", plural: "Image Pairs" },
  fields: [
    { name: "left", type: "upload", relationTo: "media", required: true },
    { name: "right", type: "upload", relationTo: "media", required: true },
  ],
};
