import EnquiryForm from "@/components/sections/contact/EnquiryForm";
import type { ContactHeroSectionProps } from "./ContactHeroSection.types";

// Title/lead + the enquiry form, as one grid — matches the real source's
// ContactMain.astro, which lays both columns out together
// (`grid-cols-[minmax(22rem,0.48fr)_1fr]`). Kept as a single section
// rather than two, since splitting them would fragment one cohesive
// visual unit in the real design.
export default function ContactHeroSection({ eyebrow, heading, description, className = "" }: ContactHeroSectionProps) {
  return (
    <div
      className={`grid gap-16 pb-20 md:pb-28 lg:grid-cols-[minmax(22rem,0.48fr)_1fr] lg:gap-0 lg:pb-32 ${className}`}
    >
      {/* Left: title + lead */}
      <div className="lg:pr-14 xl:pr-18">
        <div data-reveal className="mb-8 flex items-center gap-4">
          <span className="h-px w-10 bg-stone-300" />
          <p className="text-[11px] font-medium uppercase tracking-[0.45em] text-stone-500">{eyebrow}</p>
        </div>

        <h1
          data-reveal
          className="mb-6 font-didot text-4xl font-normal leading-tight tracking-tight text-stone-900 sm:text-5xl"
        >
          {heading}
        </h1>

        <p data-reveal className="text-[14px] leading-[1.85] text-stone-500">
          {description}
        </p>
      </div>

      {/* Right: form */}
      <div data-reveal className="border-t border-stone-200 pt-16 lg:border-l lg:border-t-0 lg:pl-14 xl:pl-20">
        <EnquiryForm />
      </div>
    </div>
  );
}
