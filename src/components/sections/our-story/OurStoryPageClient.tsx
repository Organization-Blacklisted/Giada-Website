"use client";

import { useLivePreview } from "@payloadcms/live-preview-react";
import StoryHeroSection from "@/components/sections/our-story/StoryHeroSection";
import StoryOriginSection from "@/components/sections/our-story/StoryOriginSection";
import StoryBeliefsSection from "@/components/sections/our-story/StoryBeliefsSection";
import StoryPresentSection from "@/components/sections/our-story/StoryPresentSection";
import FoundersSection from "@/components/sections/our-story/FoundersSection";
import ContactCtaBanner from "@/components/ui/ContactCtaBanner";
import { mapOurStoryData } from "@/lib/api/our-story-map";
import type { OurStoryPage } from "@/payload-types";

// Imported from our-story-map.ts specifically, NOT our-story.ts —
// our-story.ts also exports getPayload-dependent code that can't be
// bundled into a Client Component (see our-story-map.ts's comment).
export default function OurStoryPageClient({ initialData }: { initialData: OurStoryPage }) {
  const { data: raw } = useLivePreview<OurStoryPage>({
    initialData,
    serverURL: typeof window !== "undefined" ? window.location.origin : "",
    depth: 2,
  });

  const data = mapOurStoryData(raw);

  return (
    <>
      <StoryHeroSection {...data.hero} />
      <StoryOriginSection {...data.origin} />
      <StoryBeliefsSection {...data.beliefs} />
      <StoryPresentSection {...data.present} />
      <FoundersSection {...data.founders} />
      <ContactCtaBanner {...data.closingCta} />
    </>
  );
}
