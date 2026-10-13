import type { CollaborationItemData } from "@/lib/api/collaborations-map";

export interface CollaborationsGridSectionProps {
  items: CollaborationItemData[];
  className?: string;
}
