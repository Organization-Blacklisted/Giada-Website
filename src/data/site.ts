export const siteConfig = {
  name: "Giada",
  // SEO meta description — confirmed from the real source's Layout.astro default.
  description:
    "Giada creates refined rugs and textiles shaped by craft, material, and timeless design.",
  // Longer brand-story paragraph used in the footer only — different copy,
  // different purpose, confirmed from the real source's Footer.astro.
  footerDescription:
    "For over a century, Giada has woven beauty into the foundations of extraordinary spaces. Each rug is an heirloom in the making, a testament to four generations of textile mastery, where ancestral savoir-faire meets contemporary vision. More than a furnishing, it is the soul of a room.",
  url: "https://www.giada-studio.com",
  locations: [
    {
      city: "Montréal",
      lines: ["8106 Blvd Décarie", "Montréal, QC H4P 2S8", "Canada"],
      phone: "+1 650 360-0009",
      phoneHref: "tel:+16503600009",
    },
    {
      city: "Miami",
      lines: ["8020 NE 4th Ave., Suite 115", "Miami, FL 33138", "USA"],
      phone: "+1 305 761-9997",
      phoneHref: "tel:+13057619997",
    },
  ],
  social: {
    instagram: "https://www.instagram.com/giada__studio/",
    linkedin: "https://www.linkedin.com/company/giada-studio",
  },
} as const;
