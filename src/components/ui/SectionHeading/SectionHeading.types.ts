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
  className?: string;
}
