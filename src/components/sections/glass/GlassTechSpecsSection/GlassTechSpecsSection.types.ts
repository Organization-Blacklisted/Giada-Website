export interface GlassTechSpec {
  label: string;
  value: string;
}

export interface GlassTechSpecsSectionProps {
  eyebrow: string;
  heading: string;
  description: string;
  specs: GlassTechSpec[];
  className?: string;
}
