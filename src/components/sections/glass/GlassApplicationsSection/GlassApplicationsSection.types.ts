export interface GlassApplicationItem {
  label: string;
  body: string;
}

export interface GlassApplicationsSectionProps {
  eyebrow: string;
  heading: string;
  description: string;
  items: GlassApplicationItem[];
  className?: string;
}
