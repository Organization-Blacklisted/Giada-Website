"use client";

import { useLivePreview } from "@payloadcms/live-preview-react";
import GalleryHeroSection from "@/components/sections/gallery/GalleryHeroSection";
import GalleryWallSection from "@/components/sections/gallery/GalleryWallSection";
import { mapGalleryData } from "@/lib/api/gallery-map";
import type { GalleryPage } from "@/payload-types";

// Unlike FaqPageClient (a 1:1 shape match), the raw "gallery-page"
// document doesn't match GalleryPageData directly — Media relationships
// come back as full objects, not the flattened url/width/height/shape
// fields the section components expect. `mapGalleryData` is the same
// transform the normal cached SSR path (lib/api/gallery.ts) uses,
// re-run here on every `useLivePreview` update. Imported from
// gallery-map.ts specifically, NOT gallery.ts — gallery.ts also exports
// getPayload-dependent code that can't be bundled into a Client
// Component (see gallery-map.ts's comment).
export default function GalleryPageClient({ initialData }: { initialData: GalleryPage }) {
  const { data: raw } = useLivePreview<GalleryPage>({
    initialData,
    serverURL: typeof window !== "undefined" ? window.location.origin : "",
    depth: 2,
  });

  const data = mapGalleryData(raw);

  return (
    <>
      <GalleryHeroSection {...data.hero} />
      <GalleryWallSection items={data.items} />
    </>
  );
}
