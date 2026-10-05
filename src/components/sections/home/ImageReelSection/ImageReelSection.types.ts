export type ImageReelImage = {
  src: string;
  alt: string;
};

export interface ImageReelSectionProps {
  images: ImageReelImage[];
  className?: string;
}
