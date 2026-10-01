import { SectionHeadingProps } from "./SectionHeading.types";

// Lookups (never interpolated into a class string) so Tailwind can see
// every literal class name at build time — same technique as Container.
const alignStyles = { center: "text-center", left: "" };
const justifyStyles = { center: "justify-center", left: "" };
const descriptionWidth = { center: "mx-auto max-w-xl", left: "max-w-2xl" };
const eyebrowColors = { "stone-400": "text-stone-400", "stone-500": "text-stone-500" };

/**
 * Confirmed real, repeated pattern — eyebrow (flanked by two lines) +
 * Didot heading + optional description. Found verbatim across
 * ProcessStrip, WhyGiada, CategoryGrid, OurClients, and ContactCTA in
 * the real Astro source (see ARCHITECTURE.md "Design tokens" for the
 * eyebrowColor/mt-6-vs-mb-6 discrepancies this normalizes).
 */
export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  eyebrowColor = "stone-400",
  className = "",
}: SectionHeadingProps) {
  return (
    <div className={`mb-12 lg:mb-16 ${alignStyles[align]} ${className}`}>
      <div data-reveal className={`mb-8 flex items-center gap-4 ${justifyStyles[align]}`}>
        <span className="h-px w-12 bg-stone-300" aria-hidden="true" />
        <p
          className={`text-[11px] font-semibold uppercase tracking-[0.35em] ${eyebrowColors[eyebrowColor]}`}
        >
          {eyebrow}
        </p>
        <span className="h-px w-12 bg-stone-300" aria-hidden="true" />
      </div>

      <h2
        data-reveal
        data-reveal-delay="150"
        className="font-heading text-4xl font-normal tracking-tight text-stone-900 md:text-5xl"
      >
        {title}
      </h2>

      {description && (
        <p
          data-reveal
          data-reveal-delay="300"
          className={`mt-6 text-[15px] leading-[1.8] text-stone-500 ${descriptionWidth[align]}`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
