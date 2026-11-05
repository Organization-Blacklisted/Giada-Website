export interface FounderPerson {
  name: string;
  role: string;
  bio: string;
}

export interface FoundersSectionProps {
  eyebrow: string;
  quote: string;
  attribution: string;
  sharedImage: string;
  sharedImageAlt: string;
  people: FounderPerson[];
  className?: string;
}
