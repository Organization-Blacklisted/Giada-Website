import SectionHeading from "@/components/ui/SectionHeading";
import TestimonialBook from "@/components/ui/TestimonialBook";
import type { TestimonialsSectionProps } from "./TestimonialsSection.types";

// Wrapper around the reusable TestimonialBook, matching the real
// source's Testimonials.astro section shell (border-t, padding, max-w-6xl).
// TestimonialBook itself has no page/section knowledge — it just takes
// a testimonials array, so it can be reused wherever else a testimonial
// carousel is needed later without dragging this section chrome along.
export default function TestimonialsSection({ eyebrow, heading, testimonials, className = "" }: TestimonialsSectionProps) {
  return (
    <section className={`overflow-hidden border-t border-stone-200 px-5 py-16 md:px-10 md:py-24 lg:px-16 lg:py-28 ${className}`}>
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow={eyebrow} title={heading} />
        <TestimonialBook testimonials={testimonials} ariaLabel="Client testimonials" />
      </div>
    </section>
  );
}
