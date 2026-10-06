export type ValueItem = {
  index: string;
  title: string;
  text: string;
};

export interface ValuesSectionProps {
  eyebrow: string;
  heading: string;
  description?: string;
  image: string;
  imageAlt: string;
  items: ValueItem[];
  buttonText?: string;
  buttonLink?: string;
  className?: string;
}
