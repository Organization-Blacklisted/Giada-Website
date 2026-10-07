"use client";

import { useLivePreview } from "@payloadcms/live-preview-react";
import CategoryGridSection from "@/components/sections/home/CategoryGridSection";
import ClosingCtaSection from "@/components/sections/home/ClosingCtaSection";
import CollaborationsSliderSection from "@/components/sections/home/CollaborationsSliderSection";
import CollectionSection from "@/components/sections/home/CollectionSection";
import HeroSlideshowSection from "@/components/sections/home/HeroSlideshowSection";
import ImageReelSection from "@/components/sections/home/ImageReelSection";
import PressFeatureSection from "@/components/sections/home/PressFeatureSection";
import ProcessStripSection from "@/components/sections/home/ProcessStripSection";
import TestimonialsSection from "@/components/sections/home/TestimonialsSection";
import ValuesSection from "@/components/ui/ValuesSection";
import WhyGiadaSection from "@/components/sections/home/WhyGiadaSection";
import { mapHomeData } from "@/lib/api/home-map";
import type { Home } from "@/payload-types";

// Unlike FaqPageClient (a 1:1 shape match), the raw "home" document
// doesn't match HomePageData directly — Media relationships come back as
// full objects (or plain ids before Payload's live-preview client
// re-populates them), not the flattened url/width/height fields the
// section components expect. `mapHomeData` is the same transform the
// normal cached SSR path (lib/api/home.ts) uses, re-run here on every
// `useLivePreview` update instead of duplicated. Imported from
// home-map.ts specifically, NOT home.ts — home.ts also exports
// getPayload-dependent code that can't be bundled into a Client
// Component (see home-map.ts's comment for what broke when this
// imported from home.ts instead).
export default function HomePageClient({ initialData }: { initialData: Home }) {
  const { data: raw } = useLivePreview<Home>({
    initialData,
    serverURL: typeof window !== "undefined" ? window.location.origin : "",
    depth: 2,
  });

  const data = mapHomeData(raw);
  const { visibility } = data;

  return (
    <>
      {visibility.hero && <HeroSlideshowSection {...data.hero} />}
      {visibility.collection && <CollectionSection {...data.collection} />}
      {visibility.categoryGrid && <CategoryGridSection {...data.categoryGrid} />}
      {visibility.values && <ValuesSection {...data.values} />}
      {visibility.processStrip && <ProcessStripSection {...data.processStrip} />}
      {visibility.collaborationsSlider && <CollaborationsSliderSection {...data.collaborationsSlider} />}
      {visibility.pressFeature && <PressFeatureSection {...data.pressFeature} />}
      {visibility.whyGiada && <WhyGiadaSection {...data.whyGiada} />}
      {visibility.testimonials && <TestimonialsSection {...data.testimonials} />}
      {visibility.closingCta && <ClosingCtaSection {...data.closingCta} />}
      {visibility.imageReel && <ImageReelSection {...data.imageReel} />}
    </>
  );
}
