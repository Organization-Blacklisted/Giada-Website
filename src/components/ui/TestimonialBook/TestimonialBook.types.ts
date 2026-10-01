import type { Testimonial } from "@/types/testimonial";

export interface TestimonialBookProps {
  testimonials: Testimonial[];
  /** Autoplay tick interval in ms. Pass 0 to disable autoplay entirely. */
  autoplayMs?: number;
  /** Accessible label for the carousel region — override per usage context. */
  ariaLabel?: string;
  className?: string;
}
