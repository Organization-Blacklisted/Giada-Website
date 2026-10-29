"use client";

import { useLivePreview } from "@payloadcms/live-preview-react";
import FragmentsHeroSection from "@/components/sections/collaborations/FragmentsHeroSection";
import FragmentsArtistSection from "@/components/sections/collaborations/FragmentsArtistSection";
import FragmentsInspirationSection from "@/components/sections/collaborations/FragmentsInspirationSection";
import FragmentsMemoriesSection from "@/components/sections/collaborations/FragmentsMemoriesSection";
import FragmentsMeetingSection from "@/components/sections/collaborations/FragmentsMeetingSection";
import FragmentsClosingCtaSection from "@/components/sections/collaborations/FragmentsClosingCtaSection";
import { mapFragmentsPage } from "@/lib/api/fragments-page-map";
import { safeJsonLd } from "@/lib/json-ld";
import type { FragmentsPage } from "@/payload-types";

// Was missing entirely before — /collaborations/[slug]'s "fragments"
// branch was a plain Server Component with no useLivePreview anywhere,
// so editing this page's content in the admin never updated the Live
// Preview iframe (same bug class as the blog detail page, see
// BlogPostPageClient.tsx). `collaborationName` is only used for the
// breadcrumb's JSON-LD, which doesn't need to be reactive, so it's
// passed as a plain static prop rather than its own useLivePreview.
export default function FragmentsPageClient({
  initialData,
  collaborationName,
}: {
  initialData: FragmentsPage;
  collaborationName: string;
}) {
  const { data: raw } = useLivePreview<FragmentsPage>({
    initialData,
    serverURL: typeof window !== "undefined" ? window.location.origin : "",
    depth: 2,
  });

  const fragments = mapFragmentsPage(raw);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Collaborations", item: "/collaborations" },
      { "@type": "ListItem", position: 2, name: collaborationName, item: "/collaborations/fragments" },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema) }} />
      <FragmentsHeroSection
        eyebrow={fragments.hero.eyebrow}
        headline={fragments.hero.headline}
        paragraph={fragments.hero.paragraph}
        unveilingLines={fragments.hero.unveilingLines}
        backdropImage={fragments.hero.backdropImage}
        cutoutImage={fragments.hero.cutoutImage}
      />
      <FragmentsArtistSection
        eyebrow={fragments.artist.eyebrow}
        name={fragments.artist.name}
        subheadline={fragments.artist.subheadline}
        bioParagraphGroup1={fragments.artist.bioParagraphGroup1}
        bioParagraphGroup2={fragments.artist.bioParagraphGroup2}
        portrait={fragments.artist.portrait}
      />
      <FragmentsInspirationSection
        eyebrow={fragments.inspiration.eyebrow}
        heading={fragments.inspiration.heading}
        paragraph={fragments.inspiration.paragraph}
        cards={fragments.inspiration.cards}
        quote={fragments.inspiration.quote}
        quoteAttribution={fragments.inspiration.quoteAttribution}
      />
      <FragmentsMemoriesSection
        eyebrow={fragments.memories.eyebrow}
        heading={fragments.memories.heading}
        paragraph={fragments.memories.paragraph}
        strips={fragments.memories.strips}
      />
      <FragmentsMeetingSection
        eyebrow={fragments.meeting.eyebrow}
        heading={fragments.meeting.heading}
        subheadline={fragments.meeting.subheadline}
        paragraph={fragments.meeting.paragraph}
        imageLeft={fragments.meeting.imageLeft}
        imageRight={fragments.meeting.imageRight}
      />
      <FragmentsClosingCtaSection
        heading={fragments.closingCta.heading}
        paragraph={fragments.closingCta.paragraph}
        linkText={fragments.closingCta.linkText}
      />
    </>
  );
}
