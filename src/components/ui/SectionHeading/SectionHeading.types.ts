export interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  /** Confirmed real layout: centered in most sections, left-aligned in OurClients. */
  align?: "center" | "left";
  /**
   * Confirmed real values only. 4 of 5 real instances use stone-400;
   * OurClients uses stone-500 (looks like an authoring slip, not
   * intentional, but kept as an explicit option rather than dropped —
   * team decision 2026-09-29).
   */
  eyebrowColor?: "stone-400" | "stone-500";
  className?: string;
}
