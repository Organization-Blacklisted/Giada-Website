import CategoryGridSection from "@/components/sections/home/CategoryGridSection";
import ClosingCtaSection from "@/components/sections/home/ClosingCtaSection";
import CollectionSection from "@/components/sections/home/CollectionSection";
import HeroSlideshowSection from "@/components/sections/home/HeroSlideshowSection";
import ImageReelSection from "@/components/sections/home/ImageReelSection";
import PressFeatureSection from "@/components/sections/home/PressFeatureSection";
import ProcessStripSection from "@/components/sections/home/ProcessStripSection";
import TestimonialsSection from "@/components/sections/home/TestimonialsSection";
import ValuesSection from "@/components/ui/ValuesSection";
import WhyGiadaSection from "@/components/sections/home/WhyGiadaSection";
import { getHomePage } from "@/lib/api/home";

// Real source's home page (pages/index.astro) order, fully built, plus
// one new client-provided section not in the real source: `values`
// ("Living Art Beyond Simple Decor", via Figma, 2026-10-06), placed
// between CategoryGrid and ProcessStrip per the client's own mockup.
export default async function Home() {
  const {
    hero,
    collection,
    categoryGrid,
    values,
    processStrip,
    pressFeature,
    whyGiada,
    testimonials,
    closingCta,
    imageReel,
  } = await getHomePage();

  return (
    <>
      <HeroSlideshowSection {...hero} />
      <CollectionSection {...collection} />
      <CategoryGridSection {...categoryGrid} />
      <ValuesSection {...values} />
      <ProcessStripSection {...processStrip} />
      <PressFeatureSection {...pressFeature} />
      <WhyGiadaSection {...whyGiada} />
      <TestimonialsSection {...testimonials} />
      <ClosingCtaSection {...closingCta} />
      <ImageReelSection {...imageReel} />
    </>
  );
}
