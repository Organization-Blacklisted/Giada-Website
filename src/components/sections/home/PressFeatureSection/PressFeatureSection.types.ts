import type { ZoomCardProps } from "@/components/ui/ZoomCard";

export type PressImage = Omit<ZoomCardProps, "className">;

export interface PressFeatureSectionProps {
  eyebrow: string;
  heading: string;
  description: string;
  images: PressImage[];
  className?: string;
}
