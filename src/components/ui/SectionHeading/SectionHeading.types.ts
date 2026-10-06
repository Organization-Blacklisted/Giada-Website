export interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  /** Confirmed real layout: centered in most sections, left-aligned in OurClients. */
  align?: "center" | "left";
  /**
   * Confirmed real values only. Most real instances use stone-400;
   * OurClients and PressFeature both use stone-500 — originally assumed
   * to be a one-off authoring slip in OurClients (2026-09-29), but a
   * second independent real instance using the same value (PressFeature,
   * confirmed 2026-10-05) makes "accidental" less likely than it first
   * looked. Kept as a plain explicit option either way, not worth
   * resolving further without more real instances to compare.
   */
  eyebrowColor?: "stone-400" | "stone-500";
  /**
   * Default (stone-500) confirmed real across 5 sections from the live
   * Astro site. `stone-600` added 2026-10-06 for ValuesSection
   * specifically — confirmed via direct Figma design-context data
   * (#57534d, an exact stone-600 match), not a guess or a stylistic
   * preference. Kept opt-in rather than changed as the default, since
   * the other 5 real usages are independently confirmed correct at
   * stone-500 and must not silently change.
   */
  descriptionColor?: "stone-500" | "stone-600";
  /**
   * Default (`max-w-xl` centered / `max-w-2xl` left) confirmed real
   * across the other 5 sections from the live Astro site. Added
   * 2026-10-06 as a raw override escape hatch for ValuesSection, whose
   * Figma spec has the description at 985px — nearly edge-to-edge with
   * its 1005px container, much wider than the shared default. Pass a
   * full className fragment (e.g. `"mx-auto max-w-[985px]"`) to replace
   * the default outright; leave unset to keep the confirmed real width.
   */
  descriptionMaxWidth?: string;
  /**
   * Default (15px) confirmed real across the other 5 sections from the
   * live Astro site. `16px` added 2026-10-06 for ValuesSection — present
   * in the same Figma `get_design_context` data as the color/width
   * overrides above, but wrongly judged "close enough to 15px" and left
   * unfixed in that same pass; the user caught it live afterward. Lesson
   * for next time: apply exact Figma values, don't round differences
   * away as tolerance calls the user never asked for.
   */
  descriptionFontSize?: "15px" | "16px";
  className?: string;
}
