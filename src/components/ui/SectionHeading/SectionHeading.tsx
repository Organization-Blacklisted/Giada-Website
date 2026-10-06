import { SectionHeadingProps } from "./SectionHeading.types";

// Lookups (never interpolated into a class string) so Tailwind can see
// every literal class name at build time — same technique as Container.
const alignStyles = { center: "text-center", left: "" };
const justifyStyles = { center: "justify-center", left: "" };
const descriptionWidthByAlign = { center: "mx-auto max-w-xl", left: "max-w-2xl" };
const eyebrowColors = { "stone-400": "text-stone-400", "stone-500": "text-stone-500" };
const descriptionColors = { "stone-500": "text-stone-500", "stone-600": "text-stone-600" };
const descriptionFontSizes = { "15px": "text-[15px]", "16px": "text-[16px]" };

/**
 * Confirmed real, repeated pattern — eyebrow (flanked by two lines) +
 * Didot heading + optional description. Found verbatim across
 * ProcessStrip, WhyGiada, CategoryGrid, OurClients, and ContactCTA in
 * the real Astro source (see ARCHITECTURE.md "Design tokens" for the
 * eyebrowColor/mt-6-vs-mb-6 discrepancies this normalizes). Also reused
 * by ValuesSection (2026-10-06) — the one usage not sourced from the
 * live site, confirmed matching this same pattern via direct Figma
 * design-context data rather than the Astro source.
 */
export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  eyebrowColor = "stone-400",
  descriptionColor = "stone-500",
  descriptionMaxWidth,
  descriptionFontSize = "15px",
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
        className="font-heading text-4xl font-normal tracking-tight text-stone-900 md:text-5xl"
      >
        {title}
      </h2>

      {description && (
        <p
          data-reveal
          className={`mt-6 leading-[1.8] ${descriptionFontSizes[descriptionFontSize]} ${descriptionColors[descriptionColor]} ${descriptionMaxWidth ?? descriptionWidthByAlign[align]}`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
