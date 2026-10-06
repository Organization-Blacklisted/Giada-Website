export interface GalleryItem {
  image: string;
  imageWidth: number;
  imageHeight: number;
  alt: string;
  category: string;
  shape: "portrait" | "landscape" | "square";
}

export interface GalleryWallSectionProps {
  items: GalleryItem[];
  className?: string;
}
