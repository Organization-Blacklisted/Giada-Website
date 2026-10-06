import GalleryHeroSection from "@/components/sections/gallery/GalleryHeroSection";
import GalleryWallSection from "@/components/sections/gallery/GalleryWallSection";
import { getGalleryPage } from "@/lib/api/gallery";

export const metadata = {
  title: "Gallery",
  description:
    "A visual record of craft, spaces, people, and process — the world behind Giada.",
};

export default async function GalleryPage() {
  const { hero, items } = await getGalleryPage();

  return (
    <>
      <GalleryHeroSection {...hero} />
      <GalleryWallSection items={items} />
    </>
  );
}
