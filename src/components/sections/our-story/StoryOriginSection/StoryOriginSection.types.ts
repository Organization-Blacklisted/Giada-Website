export interface StoryOriginImage {
  image: string;
  alt: string;
}

export interface StoryOriginSectionProps {
  eyebrow: string;
  quote: string;
  attribution: string;
  paragraph1: string;
  paragraph2: string;
  images: StoryOriginImage[];
  className?: string;
}
