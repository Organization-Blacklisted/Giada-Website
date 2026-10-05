import type { Testimonial } from "@/types/testimonial";

// Owned by this data layer, not imported from the section components —
// same reasoning as lib/api/contact.ts and lib/api/faq.ts.
export type TestimonialsSectionData = {
  eyebrow: string;
  heading: string;
  testimonials: Testimonial[];
};

export type ImageReelSectionData = {
  images: { src: string; alt: string }[];
};

export type CategoryItem = {
  title: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  href: string;
};

export type CategoryGridSectionData = {
  eyebrow: string;
  heading: string;
  categories: CategoryItem[];
};

export type HeroSlideData = {
  src: string;
  alt: string;
};

export type HeroSlideshowSectionData = {
  eyebrow: string;
  title: string;
  taglineLine1: string;
  taglineLine2: string;
  slides: HeroSlideData[];
};

export type PressImageData = {
  image: string;
  alt: string;
};

export type PressFeatureSectionData = {
  eyebrow: string;
  heading: string;
  description: string;
  images: PressImageData[];
};

export type ClosingCtaSectionData = {
  heading: string;
  linkText: string;
  href: string;
};

export type HomePageData = {
  hero: HeroSlideshowSectionData;
  categoryGrid: CategoryGridSectionData;
  pressFeature: PressFeatureSectionData;
  testimonials: TestimonialsSectionData;
  closingCta: ClosingCtaSectionData;
  imageReel: ImageReelSectionData;
};

// Home page itself isn't built out yet (see app/page.tsx) — this exists
// so each real Home section is already wired the same way every other
// section in this project is, ready for whenever Home gets composed for
// real.
//
// hero: real content confirmed from the Astro source's
// components/home/HeroSlideshow.astro. Only one slide configured —
// matches the real source's own `slides` array exactly (it has three
// other hero images sitting unused in its assets folder, never wired
// into the config; not fabricated into extra slides here). The carousel
// machinery (dots, keyboard, swipe, autoplay) is still fully real and
// functional in HeroSlideshowSection, same as the real source — it just
// has nothing to switch to yet.
//
// testimonials: real content confirmed from the Astro source's
// components/home/Testimonials.astro, folded in from the old
// data/testimonials.ts, which only this section ever consumed.
// logoWidth/logoHeight on each testimonial are each logo's actual
// measured pixel dimensions (via sharp), not guesses — required by
// next/image to avoid CLS. Note: despite the .webp extension on all
// three source files, testimonial-fam is actually HEIF-encoded and
// testimonial-kelli-richards is actually a GIF (confirmed by inspecting
// file contents, not the extension) — harmless since browsers sniff real
// content, but worth knowing if a future image-processing step assumes
// the extension is accurate.
//
// imageReel: real content confirmed from the Astro source's
// components/home/ImageBar.astro. Order ([1, 3, 5, 4, 2]) matches the
// real source's own reordering of the five source files — not arbitrary,
// kept exactly as authored there. alt text is empty strings, matching
// the real source (the images are decorative, not individually
// captioned).
//
// categoryGrid: real content confirmed from the Astro source's
// components/home/CategoryGrid.astro. hrefs point to `/products?category=rugs`
// /`glass` rather than the real source's separate top-level `/rugs`/`/glass`
// routes — this project already consolidated those into one `/products`
// listing with a `category` field (see types/product.ts, decided earlier
// in the project), so matching the real source's literal hrefs would
// just 404 here. The Products page itself doesn't filter by that query
// param yet (still a placeholder) — the hrefs are just structured
// correctly for when it does.
//
// pressFeature: real content confirmed from the Astro source's
// components/home/PressFeature.astro. Three images, matching the real
// source's config exactly — it has a fourth image
// (press-feature-tv.webp) sitting unused in its assets folder, never
// wired into the section; not fabricated into a fourth card here.
//
// closingCta: real content confirmed from the Astro source's
// components/home/ClosingCTA.astro — a hardcoded, zero-props component
// (no eyebrow/description), distinct from the generic, prop-driven
// components/global/ContactCTA.astro used elsewhere (FAQ, Our Story,
// Blog, Collaborations). Both render through the shared
// ContactCtaBanner primitive; Home's ClosingCtaSection just omits
// eyebrow/description to reproduce this simpler real variant.
export async function getHomePage(): Promise<HomePageData> {
  return {
    hero: {
      eyebrow: "From Our Atelier to Your Vision",
      title: "A Legacy Woven Over Generations",
      taglineLine1: "Over 100 years of family-owned craftsmanship in fine rug making from India.",
      taglineLine2: "Four generations of weaving mastery — from the selection of noble fibres to the final gesture of installation.",
      slides: [
        {
          src: "/images/home/slideshow/hero-living-room.webp",
          alt: "A bespoke hand-knotted rug anchoring a refined contemporary living room",
        },
      ],
    },
    testimonials: {
      eyebrow: "What Designers Say",
      heading: "Client Notes",
      testimonials: [
        {
          id: "fam",
          quote:
            "We truly feel fortunate to work with Giada. Julien and Nitin are not only incredibly kind and generous with their time — they consistently go above and beyond.",
          name: "Vanessa Brisset",
          company: "FAMDESIGN",
          logo: "/images/testimonials/testimonial-fam.webp",
          logoWidth: 330,
          logoHeight: 26,
          logoInvert: true,
        },
        {
          id: "kelli-richards",
          quote:
            "Working with Giada has been a fantastic experience for our design studio. Their craftsmanship, attention to detail, and commitment to quality are truly exceptional.",
          name: "Kelli Richards",
          company: "Interior Montréal",
          logo: "/images/testimonials/testimonial-kelli-richards.webp",
          logoWidth: 1500,
          logoHeight: 522,
        },
        {
          id: "ali-budd",
          quote:
            "The ABI team loves Nitin and Julien from the Giada team. They are always bringing us new ideas and samples.",
          name: "Susie Park",
          company: "Ali Budd Interiors",
          logo: "/images/testimonials/testimonial-ali-budd.webp",
          logoWidth: 1369,
          logoHeight: 576,
        },
      ],
    },
    categoryGrid: {
      eyebrow: "Our Products",
      heading: "The Complete Collection",
      categories: [
        {
          title: "Rugs",
          image: "/images/categories/category-rugs.webp",
          imageWidth: 1536,
          imageHeight: 2730,
          href: "/products?category=rugs",
        },
        {
          title: "Glass",
          image: "/images/categories/category-glass.webp",
          imageWidth: 1122,
          imageHeight: 1402,
          href: "/products?category=glass",
        },
      ],
    },
    pressFeature: {
      eyebrow: "Press Feature",
      heading: "As Seen in Florida Design",
      description:
        "Giada and its founders were recently the subject of a full editorial spread — a reflection of the craft and vision behind every piece we create.",
      images: [
        {
          image: "/images/home/press/press-magazine-spread.webp",
          alt: "The Giada team featured in Florida Design magazine",
        },
        {
          image: "/images/home/press/press-magazine-1.webp",
          alt: "Florida Design editorial feature — page one",
        },
        {
          image: "/images/home/press/press-magazine-2.webp",
          alt: "Florida Design editorial feature — page two",
        },
      ],
    },
    closingCta: {
      heading: "Every Great Space Begins with a Conversation.",
      linkText: "Connect With Us",
      href: "/contact",
    },
    imageReel: {
      images: [
        { src: "/images/home/image-bar-1.webp", alt: "" },
        { src: "/images/home/image-bar-3.webp", alt: "" },
        { src: "/images/home/image-bar-5.webp", alt: "" },
        { src: "/images/home/image-bar-4.webp", alt: "" },
        { src: "/images/home/image-bar-2.webp", alt: "" },
      ],
    },
  };
}
