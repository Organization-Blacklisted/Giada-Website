export interface GlassProcessStep {
  title: string;
  body: string;
}

export interface GlassProcessSectionProps {
  eyebrow: string;
  heading: string;
  steps: GlassProcessStep[];
  className?: string;
}
