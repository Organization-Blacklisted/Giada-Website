import CategoryGridSection from "@/components/sections/home/CategoryGridSection";
import ClosingCtaSection from "@/components/sections/home/ClosingCtaSection";
import HeroSlideshowSection from "@/components/sections/home/HeroSlideshowSection";
import ImageReelSection from "@/components/sections/home/ImageReelSection";
import PressFeatureSection from "@/components/sections/home/PressFeatureSection";
import TestimonialsSection from "@/components/sections/home/TestimonialsSection";
import { getHomePage } from "@/lib/api/home";

// Real source's home page (pages/index.astro) order: HeroSlideshow,
// Collection, CategoryGrid, ProcessStrip, PressFeature, WhyGiada,
// Testimonials, ClosingCTA, ImageBar (last). Of those, HeroSlideshow,
// CategoryGrid, PressFeature, Testimonials, ClosingCTA, and ImageBar (as
// ImageReelSection) are built so far — kept in their real relative order
// even though everything between them is still missing.
export default async function Home() {
  const { hero, categoryGrid, pressFeature, testimonials, closingCta, imageReel } = await getHomePage();

  return (
    <>
      <HeroSlideshowSection {...hero} />
      <CategoryGridSection {...categoryGrid} />
      <PressFeatureSection {...pressFeature} />
      <TestimonialsSection {...testimonials} />
      <ClosingCtaSection {...closingCta} />
      <ImageReelSection {...imageReel} />
    </>
  );
}
