import { unstable_cache } from "next/cache";
import { getPayload } from "payload";
import config from "@payload-config";
import type { Testimonial } from "@/types/testimonial";
import type { Media } from "@/payload-types";

// Resolves a Payload upload relationship to its served URL. Local API
// calls populate relationships as full docs by default (not just the
// numeric id), but the generated type is still a `number | Media`
// union, so every image reference needs this narrowing regardless.
function mediaUrl(image: number | Media): string {
  return typeof image === "object" ? (image.url ?? "") : "";
}

// Real intrinsic pixel dimensions from the populated Media doc (Payload
// auto-measures every upload via sharp) — used for CategoryItem's and
// Testimonial's width/height fields instead of storing them a second
// time in the CMS schema.
function mediaDims(image: number | Media): { width: number; height: number } {
  return typeof image === "object" ? { width: image.width ?? 0, height: image.height ?? 0 } : { width: 0, height: 0 };
}

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

export type ValueItemData = {
  index: string;
  title: string;
  text: string;
};

export type ValuesSectionData = {
  eyebrow: string;
  heading: string;
  description: string;
  image: string;
  imageAlt: string;
  items: ValueItemData[];
  buttonText: string;
  buttonLink: string;
};

export type ProcessStepData = {
  step: string;
  title: string;
  body: string;
};

export type ProcessStripSectionData = {
  eyebrow: string;
  heading: string;
  description: string;
  steps: ProcessStepData[];
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

export type WhyGiadaPillarData = {
  title: string;
  body: string;
};

export type WhyGiadaSectionData = {
  eyebrow: string;
  heading: string;
  pillars: WhyGiadaPillarData[];
  image: string;
  imageAlt: string;
};

export type ClosingCtaSectionData = {
  heading: string;
  linkText: string;
  href: string;
};

export type CollectionSectionData = {
  image: string;
  alt: string;
  heading: string;
  subheading: string;
  description: string;
  buttonText: string;
  buttonLink: string;
};

export type CollaborationSlideData = {
  image: string;
  imageAlt: string;
  heading: string;
  description: string;
  cardImage: string;
  cardImageAlt: string;
  cardTitle: string;
  cardCaption: string;
  buttonText: string;
  buttonLink: string;
};

export type CollaborationsSliderSectionData = {
  eyebrow: string;
  slides: CollaborationSlideData[];
};

export type HomePageData = {
  hero: HeroSlideshowSectionData;
  collection: CollectionSectionData;
  categoryGrid: CategoryGridSectionData;
  values: ValuesSectionData;
  processStrip: ProcessStripSectionData;
  collaborationsSlider: CollaborationsSliderSectionData;
  pressFeature: PressFeatureSectionData;
  whyGiada: WhyGiadaSectionData;
  testimonials: TestimonialsSectionData;
  closingCta: ClosingCtaSectionData;
  imageReel: ImageReelSectionData;
};

// Full Home page CMS wiring (2026-10-06/07). Every section below is now
// served from Payload's "home" global (src/globals/Home.ts) instead of a
// literal here — started with just Hero as a working test, now extended
// to the whole page the same way. Seeded with the exact real content
// previously hardcoded here (see git history / ARCHITECTURE.md for each
// section's original real-content provenance — the Astro source file it
// came from, or, for `values`/`collaborationsSlider`, the Figma
// mockup that introduced it); this file no longer carries that
// provenance narrative itself since the content now lives in the CMS,
// not in this file's literals.
//
// One real content-shape nuance preserved from the original mock data:
// `collaborationsSlider` still has 3 slides that reuse the same real
// Giada x Dunagan content/images — that was already a deliberate
// placeholder (the client hasn't provided the other 2 collaborations
// yet), not something this migration should silently collapse to 1.
//
// Single findGlobal call wrapped in unstable_cache (tagged "home")
// rather than one cached function per section — Home currently renders
// statically (confirmed via `next build`'s route table: "○ /"), and a
// plain Local API call bypasses Next's Data Cache entirely (that only
// wraps `fetch()`), so without this wrapper the page would never pick up
// edits made in /admin without a full rebuild. The Home global's
// `afterChange` hook calls `revalidateTag("home")` on every save
// (any section), which is why one shared tag for the whole page is the
// right granularity, not a tag per section.
const getHomeFromCMS = unstable_cache(
  async (): Promise<HomePageData> => {
    const payload = await getPayload({ config });
    const home = await payload.findGlobal({ slug: "home" });

    return {
      hero: {
        eyebrow: home.hero.eyebrow,
        title: home.hero.title,
        taglineLine1: home.hero.taglineLine1,
        taglineLine2: home.hero.taglineLine2,
        slides: (home.hero.slides ?? []).map((slide) => ({
          src: mediaUrl(slide.image),
          alt: slide.alt,
        })),
      },
      collection: {
        image: mediaUrl(home.collection.image),
        alt: home.collection.alt ?? "",
        heading: home.collection.heading,
        subheading: home.collection.subheading,
        description: home.collection.description,
        buttonText: home.collection.buttonText ?? "",
        buttonLink: home.collection.buttonLink ?? "",
      },
      categoryGrid: {
        eyebrow: home.categoryGrid.eyebrow,
        heading: home.categoryGrid.heading,
        categories: (home.categoryGrid.categories ?? []).map((cat) => ({
          title: cat.title,
          image: mediaUrl(cat.image),
          imageWidth: mediaDims(cat.image).width,
          imageHeight: mediaDims(cat.image).height,
          href: cat.href,
        })),
      },
      values: {
        eyebrow: home.values.eyebrow,
        heading: home.values.heading,
        description: home.values.description,
        image: mediaUrl(home.values.image),
        imageAlt: home.values.imageAlt,
        items: (home.values.items ?? []).map((item) => ({
          index: item.index,
          title: item.title,
          text: item.text,
        })),
        buttonText: home.values.buttonText ?? "",
        buttonLink: home.values.buttonLink ?? "",
      },
      processStrip: {
        eyebrow: home.processStrip.eyebrow,
        heading: home.processStrip.heading,
        description: home.processStrip.description,
        steps: (home.processStrip.steps ?? []).map((step) => ({
          step: step.step,
          title: step.title,
          body: step.body,
        })),
      },
      collaborationsSlider: {
        eyebrow: home.collaborationsSlider.eyebrow,
        slides: (home.collaborationsSlider.slides ?? []).map((slide) => ({
          image: mediaUrl(slide.image),
          imageAlt: slide.imageAlt,
          heading: slide.heading,
          description: slide.description,
          cardImage: mediaUrl(slide.cardImage),
          cardImageAlt: slide.cardImageAlt,
          cardTitle: slide.cardTitle,
          cardCaption: slide.cardCaption,
          buttonText: slide.buttonText,
          buttonLink: slide.buttonLink,
        })),
      },
      pressFeature: {
        eyebrow: home.pressFeature.eyebrow,
        heading: home.pressFeature.heading,
        description: home.pressFeature.description,
        images: (home.pressFeature.images ?? []).map((img) => ({
          image: mediaUrl(img.image),
          alt: img.alt,
        })),
      },
      whyGiada: {
        eyebrow: home.whyGiada.eyebrow,
        heading: home.whyGiada.heading,
        pillars: (home.whyGiada.pillars ?? []).map((pillar) => ({
          title: pillar.title,
          body: pillar.body,
        })),
        image: mediaUrl(home.whyGiada.image),
        imageAlt: home.whyGiada.imageAlt,
      },
      testimonials: {
        eyebrow: home.testimonials.eyebrow,
        heading: home.testimonials.heading,
        testimonials: (home.testimonials.testimonials ?? []).map((t) => ({
          id: t.id ?? t.name,
          quote: t.quote,
          name: t.name,
          company: t.company,
          logo: mediaUrl(t.logo),
          logoWidth: mediaDims(t.logo).width,
          logoHeight: mediaDims(t.logo).height,
          logoInvert: t.logoInvert ?? undefined,
        })),
      },
      closingCta: {
        heading: home.closingCta.heading,
        linkText: home.closingCta.linkText,
        href: home.closingCta.href,
      },
      imageReel: {
        images: (home.imageReel?.images ?? []).map((img) => ({
          src: mediaUrl(img.image),
          alt: img.alt ?? "",
        })),
      },
    };
  },
  ["home-full"],
  { tags: ["home"] }
);

export async function getHomePage(): Promise<HomePageData> {
  return getHomeFromCMS();
}
