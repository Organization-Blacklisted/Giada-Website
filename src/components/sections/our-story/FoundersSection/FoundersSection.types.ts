export interface FounderPerson {
  name: string;
  role: string;
  image: string;
  alt: string;
  bio: string;
}

export interface FoundersSectionProps {
  eyebrow: string;
  quote: string;
  attribution: string;
  people: FounderPerson[];
  className?: string;
}
