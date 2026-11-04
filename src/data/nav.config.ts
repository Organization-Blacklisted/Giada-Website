export type NavItem = {
  label: string;
  href: string;
};

// Main header nav — confirmed from the real source's Navbar.astro.
// Split left/right around the centered logo: first 3 left, rest right.
export const navItems: NavItem[] = [
  { label: "Products", href: "/products" },
  { label: "Collaborations", href: "/collaborations" },
  { label: "Gallery", href: "/gallery" },
  // Points directly at the current live event rather than an /events
  // hub — there's only ever been one event document so far, and no
  // Figma design exists for a listing page. Revisit as a real hub once
  // a second event makes this a recurring pattern (discussed explicitly
  // 2026-11-04, client chose the quick link over building the hub now).
  { label: "Miami Art Week", href: "/events/miami-art-week" },
  { label: "Our Story", href: "/our-story" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

// Footer "Sitemap" column — deliberately NOT the same as navItems: includes
// Home, excludes Blog. Confirmed from the real source's Footer.astro.
export const footerSitemapLinks: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Collaborations", href: "/collaborations" },
  { label: "Gallery", href: "/gallery" },
  { label: "Our Story", href: "/our-story" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

// Footer "Company" column — confirmed from the real source's Footer.astro.
export const footerCompanyLinks: NavItem[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Shipping Policy", href: "/shipping" },
];
