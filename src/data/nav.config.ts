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
