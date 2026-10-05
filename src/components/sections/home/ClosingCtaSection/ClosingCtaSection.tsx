import ContactCtaBanner from "@/components/ui/ContactCtaBanner";
import type { ClosingCtaSectionProps } from "./ClosingCtaSection.types";

// Home-only, single confirmed usage — same reasoning as
// HeroSlideshowSection for staying under home/ rather than being a
// primitive itself. Real source's components/home/ClosingCTA.astro has
// no eyebrow/description at all (hardcoded, zero props); passing
// neither to ContactCtaBanner reproduces that exact simpler variant
// (shorter reveal-delay chain, no mt-10 on the link) rather than the
// generic eyebrow+description variant used elsewhere.
export default function ClosingCtaSection({ heading, linkText, href, className = "" }: ClosingCtaSectionProps) {
  return <ContactCtaBanner heading={heading} linkText={linkText} href={href} className={className} />;
}
