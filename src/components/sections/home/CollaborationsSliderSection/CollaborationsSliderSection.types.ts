export interface CollaborationSlide {
  image: string;
  imageAlt: string;
  heading: string;
  description: string;
  cardImage: string;
  cardImageAlt: string;
  cardTitle: string;
  cardCaption: string;
  buttonText: string;
  buttonLink: string;
}

export interface CollaborationsSliderSectionProps {
  eyebrow: string;
  slides: CollaborationSlide[];
  className?: string;
}
