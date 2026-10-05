import SectionHeading from "@/components/ui/SectionHeading";
import ZoomCard from "@/components/ui/ZoomCard";
import type { PressFeatureSectionProps } from "./PressFeatureSection.types";

// Matches the real source's PressFeature.astro. Note the wider
// `max-w-7xl` container — confirmed real, not a typo carried over from
// the other Home sections, most of which use `max-w-6xl`.
export default function PressFeatureSection({
  eyebrow,
  heading,
  description,
  images,
  className = "",
}: PressFeatureSectionProps) {
  return (
    <section className={`border-t border-stone-200 bg-white px-5 py-16 md:px-10 md:py-24 lg:px-16 lg:py-28 ${className}`}>
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow={eyebrow} title={heading} description={description} eyebrowColor="stone-500" />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {images.map((image) => (
            <div key={image.image} data-reveal>
              <ZoomCard {...image} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
