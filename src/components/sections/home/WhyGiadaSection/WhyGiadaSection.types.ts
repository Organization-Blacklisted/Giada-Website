export type WhyGiadaPillar = {
  title: string;
  body: string;
};

export interface WhyGiadaSectionProps {
  eyebrow: string;
  heading: string;
  pillars: WhyGiadaPillar[];
  image: string;
  imageAlt: string;
  className?: string;
}
