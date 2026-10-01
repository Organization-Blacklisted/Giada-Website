import type { Testimonial } from "@/types/testimonial";

// Owned by this data layer, not imported from the section components —
// same reasoning as lib/api/contact.ts and lib/api/faq.ts.
export type TestimonialsSectionData = {
  eyebrow: string;
  heading: string;
  testimonials: Testimonial[];
};

export type HomePageData = {
  testimonials: TestimonialsSectionData;
};

// Home page itself isn't built out yet (see app/page.tsx) — this exists
// so the Testimonials section is already wired the same way every other
// section in this project is, ready for whenever Home gets composed for
// real. Real content (confirmed from the Astro source's
// components/home/Testimonials.astro), folded in from the old
// data/testimonials.ts, which only this section ever consumed.
//
// logoWidth/logoHeight on each testimonial are each logo's actual
// measured pixel dimensions (via sharp), not guesses — required by
// next/image to avoid CLS. Note: despite the .webp extension on all
// three source files, testimonial-fam is actually HEIF-encoded and
// testimonial-kelli-richards is actually a GIF (confirmed by inspecting
// file contents, not the extension) — harmless since browsers sniff real
// content, but worth knowing if a future image-processing step assumes
// the extension is accurate.
export async function getHomePage(): Promise<HomePageData> {
  return {
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
  };
}
