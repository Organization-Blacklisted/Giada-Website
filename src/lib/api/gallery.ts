export type GalleryItemData = {
  image: string;
  imageWidth: number;
  imageHeight: number;
  alt: string;
  category: string;
  /**
   * Computed once from each real file's measured pixel ratio (height/width
   * > 1.25 => portrait, < 0.75 => landscape, else square), matching the
   * real Astro source's own classification rule exactly (see
   * pages/gallery.astro). `square` is never actually hit by the real 16
   * images (all are portrait or landscape) — implemented anyway, same as
   * CollectionSection's `reverse` prop, so it renders correctly the
   * moment a square photo is added rather than silently mis-cropping it.
   */
  shape: "portrait" | "landscape" | "square";
};

export type GalleryPageData = {
  hero: {
    eyebrow: string;
    heading: string;
    description: string;
  };
  items: GalleryItemData[];
};

// Real content confirmed from the Astro source's pages/gallery.astro +
// assets/data/gallery.json. The real source generates `shape` and the
// row-interleaving order at build time (image dimensions + a
// landscape/portrait weaving algorithm — see that file's own comment:
// "wide landscape shots alternate between the left and right side, with
// a full row of three portraits breaking up the rhythm after every
// second wide row"). Both are baked into this literal array instead of
// being recomputed at request time, matching this project's established
// mock-data-layer pattern — the `items` order below IS the final
// woven order (verified by porting the real interleaving algorithm into
// a throwaway script and running it against these 16 real files' real
// measured shapes, not hand-arranged).
//
// Categories ("Spaces" / "Behind the Craft") and their shared
// alt/description text are real, copied verbatim from gallery.json —
// the real source gives every image in a category the same generic
// alt text (not individual per-photo captions).
export async function getGalleryPage(): Promise<GalleryPageData> {
  const spacesAlt = "A handcrafted rug in an interior setting.";
  const craftAlt =
    "A behind-the-scenes glimpse into the making of our handcrafted rugs.";

  return {
    hero: {
      eyebrow: "Visual Journal",
      heading: "Gallery",
      description:
        "Craft does not announce itself. It reveals itself slowly — in the density of a pile, the depth of a colourway, the way a rug anchors a room. This is our visual record: spaces, hands, process, and the objects they produce.",
    },
    items: [
      { image: "/images/gallery/inspirations-01.webp", imageWidth: 5712, imageHeight: 3213, alt: spacesAlt, category: "Spaces", shape: "landscape" },
      { image: "/images/gallery/inspirations-03.webp", imageWidth: 3213, imageHeight: 5712, alt: spacesAlt, category: "Spaces", shape: "portrait" },
      { image: "/images/gallery/inspirations-05.webp", imageWidth: 3213, imageHeight: 5712, alt: spacesAlt, category: "Spaces", shape: "portrait" },
      { image: "/images/gallery/inspirations-02.webp", imageWidth: 5712, imageHeight: 3213, alt: spacesAlt, category: "Spaces", shape: "landscape" },
      { image: "/images/gallery/inspirations-06.webp", imageWidth: 3213, imageHeight: 5712, alt: spacesAlt, category: "Spaces", shape: "portrait" },
      { image: "/images/gallery/inspirations-07.webp", imageWidth: 3213, imageHeight: 5712, alt: spacesAlt, category: "Spaces", shape: "portrait" },
      { image: "/images/gallery/inspirations-08.webp", imageWidth: 1536, imageHeight: 2730, alt: spacesAlt, category: "Spaces", shape: "portrait" },
      { image: "/images/gallery/inspirations-04.webp", imageWidth: 5712, imageHeight: 3213, alt: spacesAlt, category: "Spaces", shape: "landscape" },
      { image: "/images/gallery/inspirations-09.webp", imageWidth: 1536, imageHeight: 2730, alt: spacesAlt, category: "Spaces", shape: "portrait" },
      { image: "/images/gallery/inspirations-11.webp", imageWidth: 1536, imageHeight: 2730, alt: spacesAlt, category: "Spaces", shape: "portrait" },
      { image: "/images/gallery/inspirations-10.webp", imageWidth: 2730, imageHeight: 1536, alt: spacesAlt, category: "Spaces", shape: "landscape" },
      { image: "/images/gallery/behind-the-craft-01.webp", imageWidth: 1288, imageHeight: 1716, alt: craftAlt, category: "Behind the Craft", shape: "portrait" },
      { image: "/images/gallery/behind-the-craft-02.webp", imageWidth: 1153, imageHeight: 2048, alt: craftAlt, category: "Behind the Craft", shape: "portrait" },
      { image: "/images/gallery/behind-the-craft-03.webp", imageWidth: 1536, imageHeight: 2730, alt: craftAlt, category: "Behind the Craft", shape: "portrait" },
      { image: "/images/gallery/behind-the-craft-04.webp", imageWidth: 1536, imageHeight: 2048, alt: craftAlt, category: "Behind the Craft", shape: "portrait" },
      { image: "/images/gallery/behind-the-craft-05.webp", imageWidth: 1536, imageHeight: 2730, alt: craftAlt, category: "Behind the Craft", shape: "portrait" },
    ],
  };
}
