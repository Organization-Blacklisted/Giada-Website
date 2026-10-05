export type HeroSlide = {
  src: string;
  alt: string;
};

export interface HeroSlideshowSectionProps {
  eyebrow: string;
  title: string;
  taglineLine1: string;
  taglineLine2: string;
  slides: HeroSlide[];
  className?: string;
}
