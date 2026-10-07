// Pure mapping logic split out of lib/api/home.ts so it can be imported
// as a VALUE from HomePageClient.tsx (a Client Component) without
// dragging getPayload/@payload-config/unstable_cache into the client
// bundle. home.ts imports `getPayload` and `@payload-config`, which
// transitively imports Media.ts's `revalidateTag` from "next/cache" —
// fine in a Server Component, but Next refuses to bundle it into client
// code at all ("You're importing a module that depends on
// 'revalidateTag' ... only available in Server Components"), which broke
// the homepage outright the first time this lived in home.ts and
// HomePageClient.tsx imported `mapHomeData` from there as a value
// (FaqPageClient only ever imported a *type* from faq.ts, which erases
// at compile time, so it never hit this).
import type { Testimonial } from "@/types/testimonial";
import type { SeoData } from "./seo-types";
import type { Home, Media } from "@/payload-types";

// Resolves a Payload upload relationship to its served URL. Local API
// calls populate relationships as full docs by default (not just the
// numeric id), but the generated type is still a `number | Media`
// union, so every image reference needs this narrowing regardless.
// Widened to accept null/undefined for the SEO group's optional ogImage
// (every other image field on Home is `required: true`, so this was
// never needed until now).
function mediaUrl(image: number | Media | null | undefined): string {
  return typeof image === "object" && image !== null ? (image.url ?? "") : "";
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

// Per-section show/hide toggles (Home's "Appearance" tab) — every key
// defaults to visible, both at the Payload field level (`defaultValue:
// true`) and here (`?? true`), so a section with no explicit value yet
// (e.g. an older doc from before this field existed) stays visible
// rather than silently disappearing.
export type VisibilityData = {
  hero: boolean;
  collection: boolean;
  categoryGrid: boolean;
  values: boolean;
  processStrip: boolean;
  collaborationsSlider: boolean;
  pressFeature: boolean;
  whyGiada: boolean;
  testimonials: boolean;
  closingCta: boolean;
  imageReel: boolean;
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
  seo: SeoData;
  visibility: VisibilityData;
};

// Reused by both the normal cached SSR path (lib/api/home.ts's
// getHomePage) and HomePageClient.tsx's live-preview render, where
// `home` is whatever raw document `useLivePreview` currently holds
// (initially the server-fetched doc, later an updated one from the
// admin iframe's postMessage).
export function mapHomeData(home: Home): HomePageData {
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
    seo: {
      metaTitle: home.seo?.metaTitle ?? "",
      metaDescription: home.seo?.metaDescription ?? "",
      ogImage: mediaUrl(home.seo?.ogImage),
    },
    visibility: {
      hero: home.visibility?.hero ?? true,
      collection: home.visibility?.collection ?? true,
      categoryGrid: home.visibility?.categoryGrid ?? true,
      values: home.visibility?.values ?? true,
      processStrip: home.visibility?.processStrip ?? true,
      collaborationsSlider: home.visibility?.collaborationsSlider ?? true,
      pressFeature: home.visibility?.pressFeature ?? true,
      whyGiada: home.visibility?.whyGiada ?? true,
      testimonials: home.visibility?.testimonials ?? true,
      closingCta: home.visibility?.closingCta ?? true,
      imageReel: home.visibility?.imageReel ?? true,
    },
  };
}
