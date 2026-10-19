export interface StoryPresentStat {
  value: string;
  label: string;
}

export interface StoryPresentSectionProps {
  eyebrow: string;
  heading: string;
  description: string;
  stats: StoryPresentStat[];
  linkLabel: string;
  linkHref: string;
  className?: string;
}
