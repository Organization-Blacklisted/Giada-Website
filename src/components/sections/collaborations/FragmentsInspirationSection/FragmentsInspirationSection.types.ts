export interface FragmentsInspirationCard {
  title: string;
  caption: string;
  image: string;
}

export interface FragmentsInspirationSectionProps {
  eyebrow: string;
  heading: string;
  paragraph: string;
  cards: FragmentsInspirationCard[];
  quote: string;
  quoteAttribution: string;
}
