export interface StoryBeliefItem {
  index: string;
  title: string;
  text: string;
}

export interface StoryBeliefsSectionProps {
  eyebrow: string;
  heading: string;
  items: StoryBeliefItem[];
  closingImage: string;
  closingImageAlt: string;
  closingCaption: string;
  className?: string;
}
