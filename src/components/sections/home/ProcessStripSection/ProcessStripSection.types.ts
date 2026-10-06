export type ProcessStep = {
  step: string;
  title: string;
  body: string;
};

export interface ProcessStripSectionProps {
  eyebrow: string;
  heading: string;
  description: string;
  steps: ProcessStep[];
  className?: string;
}
