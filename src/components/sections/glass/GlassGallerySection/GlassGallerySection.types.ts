export interface GlassGalleryItem {
  image: string;
  imageWidth: number;
  imageHeight: number;
  alt: string;
  eyebrow: string;
  title: string;
}

export interface GlassGallerySectionProps {
  eyebrow: string;
  heading: string;
  description: string;
  items: GlassGalleryItem[];
  className?: string;
}
