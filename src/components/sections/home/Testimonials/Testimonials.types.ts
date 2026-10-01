import type { Testimonial } from "@/types/testimonial";

export interface TestimonialsSectionProps {
  eyebrow: string;
  heading: string;
  testimonials: Testimonial[];
  className?: string;
}
