"use client";

import { useLivePreview } from "@payloadcms/live-preview-react";
import GlassHeroSection from "@/components/sections/glass/GlassHeroSection";
import GlassMaterialSection from "@/components/sections/glass/GlassMaterialSection";
import GlassFeatureSection from "@/components/sections/glass/GlassFeatureSection";
import GlassApplicationsSection from "@/components/sections/glass/GlassApplicationsSection";
import GlassGallerySection from "@/components/sections/glass/GlassGallerySection";
import GlassProcessSection from "@/components/sections/glass/GlassProcessSection";
import GlassTechSpecsSection from "@/components/sections/glass/GlassTechSpecsSection";
import GlassClosingCtaSection from "@/components/sections/glass/GlassClosingCtaSection";
import { mapGlassData } from "@/lib/api/glass-map";
import type { GlassPage } from "@/payload-types";

// Imported from glass-map.ts specifically, NOT glass.ts — glass.ts also
// exports getPayload-dependent code that can't be bundled into a Client
// Component (see glass-map.ts's comment).
export default function GlassPageClient({ initialData }: { initialData: GlassPage }) {
  const { data: raw } = useLivePreview<GlassPage>({
    initialData,
    serverURL: typeof window !== "undefined" ? window.location.origin : "",
    depth: 2,
  });

  const data = mapGlassData(raw);

  return (
    <>
      <GlassHeroSection {...data.hero} />
      <GlassMaterialSection {...data.material} />
      <GlassFeatureSection {...data.feature} />
      <GlassApplicationsSection {...data.applications} />
      <GlassGallerySection {...data.gallery} />
      <GlassProcessSection {...data.process} />
      <GlassTechSpecsSection {...data.technicalSpecs} />
      <GlassClosingCtaSection {...data.closingCta} />
    </>
  );
}
