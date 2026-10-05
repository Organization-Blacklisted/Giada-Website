import { Link } from "next-view-transitions";
import type { ContactCtaBannerProps } from "./ContactCtaBanner.types";

// One primitive covering two real, distinct Astro source components:
// the generic, prop-driven `components/global/ContactCTA.astro` (6
// confirmed real usages — FAQ, Our Story, Blog, Collaborations index +
// detail, the old standalone Rugs page) and the home-only, hardcoded
// `components/home/ClosingCTA.astro`. Merged on request rather than kept
// as two files, since the only real differences are: `eyebrow` and
// `description` being absent on Home, and the `mt-10` spacing delta that
// follows from that (see below) — not enough divergence to justify
// duplicating the shared section/divider/link markup.
//
// Single `data-reveal` on the whole content block, not one per element.
// First built with each element staggered on its own delay (0/150, 300,
// 400/500 — the real source's own data-reveal-delay values), but the
// user caught on the live FAQ page that the real site fades the entire
// block in together, not item-by-item. Root cause: this project's
// ScrollReveal deliberately restored data-reveal-delay as a real
// transition-delay (see globals.css's [data-reveal] rule) even though
// the real source's own JS never reads that attribute anywhere — a
// past enhancement that happened to diverge from live behavior here.
// One reveal on the parent reproduces the real "whole block together"
// fade. The underlying cause turned out to be sitewide, not local to
// this component — confirmed by reading the real reveal script directly
// (layouts/Layout.astro's initFadeReveal()): it observes every
// [data-reveal] element independently with no delay concept at all, so
// `data-reveal-delay` is dead markup everywhere on the real site, not
// just here. ScrollReveal.tsx and globals.css's [data-reveal] rule were
// corrected to match (2026-10-05), and every other section that
// authored a stagger (SectionHeading, PressFeatureSection,
// CategoryGridSection, ContactHeroSection, the 404 and contact-success
// pages) had its data-reveal-delay attributes removed too.
//
// `mt-10` on the link is still conditional on `description` — real,
// confirmed spacing difference (compensates for the extra paragraph),
// unrelated to the reveal-timing fix above.
export default function ContactCtaBanner({
  eyebrow,
  heading,
  description,
  linkText = "Start a Conversation",
  href = "/contact",
  className = "",
}: ContactCtaBannerProps) {
  return (
    <section
      className={`border-t border-stone-200 bg-white px-5 py-16 md:px-10 md:py-24 lg:px-16 lg:py-28 ${className}`}
    >
      <div data-reveal className="mx-auto flex max-w-3xl flex-col items-center text-center">
        {eyebrow && (
          <div className="mb-8 flex items-center justify-center gap-4">
            <span className="h-px w-12 bg-stone-300" aria-hidden="true" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-stone-400">
              {eyebrow}
            </p>
            <span className="h-px w-12 bg-stone-300" aria-hidden="true" />
          </div>
        )}

        <h2 className="font-heading text-4xl font-normal leading-tight tracking-tight text-stone-900 md:text-5xl lg:text-6xl">
          {heading}
        </h2>

        <div className="mx-auto my-8 h-px w-16 bg-stone-400" aria-hidden="true" />

        {description && (
          <p className="max-w-md text-[15px] leading-[1.8] text-stone-500">{description}</p>
        )}

        <Link
          href={href}
          className={`group inline-flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.25em] text-stone-900 no-underline transition-opacity duration-200 hover:opacity-60 ${description ? "mt-10" : ""}`}
        >
          {linkText}
          <span
            aria-hidden="true"
            className="h-px w-10 origin-left bg-stone-900 transition-transform duration-300 group-hover:scale-x-125"
          />
        </Link>
      </div>
    </section>
  );
}
