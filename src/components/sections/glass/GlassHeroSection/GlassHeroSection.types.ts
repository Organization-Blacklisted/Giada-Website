export interface GlassHeroImage {
  image: string;
  imageWidth: number;
  imageHeight: number;
  alt: string;
}

export interface GlassHeroSectionProps {
  eyebrow: string;
  heading: string;
  lead: string;
  ctaLabel: string;
  badgeLabel: string;
  images: GlassHeroImage[];
  className?: string;
}
