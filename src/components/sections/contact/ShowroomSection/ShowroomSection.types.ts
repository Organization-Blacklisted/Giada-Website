export interface ShowroomLocation {
  city: string;
  type: string;
  lines: string[];
  phone: string;
  phoneHref: string;
  mapUrl: string;
  geo: { lat: number; lng: number };
}

export interface GeneralContactInfo {
  email: { label: string; value: string; href: string };
  // Kept as separate days/hours fields (not one string) because the real
  // design renders a different separator between them per breakpoint
  // (line break on mobile, " · " from sm: up) — a single prop would lose
  // that without the component special-casing its own content string.
  studioHours: { label: string; days: string; hours: string };
  responseTime: { label: string; value: string };
}

export interface ShowroomSectionProps {
  eyebrow: string;
  heading: string;
  description: string;
  generalContact: GeneralContactInfo;
  locations: ShowroomLocation[];
  className?: string;
}
