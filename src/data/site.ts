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
      type: "Showroom",
      lines: ["8106 Blvd Décarie", "Montréal, QC H4P 2S8", "Canada"],
      region: "QC",
      postalCode: "H4P 2S8",
      phone: "+1 650 360-0009",
      phoneHref: "tel:+16503600009",
      mapUrl:
        "https://www.google.com/maps/search/?api=1&query=8106+Blvd+D%C3%A9carie%2C+Montr%C3%A9al%2C+Qu%C3%A9bec%2C+H4P+2S8%2C+Canada",
      geo: { lat: 45.4976684, lng: -73.6599826 },
    },
    {
      city: "Miami",
      type: "Showroom",
      lines: ["8020 NE 4th Ave., Suite 115", "Miami, FL 33138", "USA"],
      region: "FL",
      postalCode: "33138",
      phone: "+1 305 761-9997",
      phoneHref: "tel:+13057619997",
      mapUrl:
        "https://www.google.com/maps/place/Giada+Studio/@25.848823,-80.1892165,17z/data=!4m15!1m8!3m7!1s0x88d9b17fbe84133b:0x5cf3ec388fec2efb!2s8020+NE+4th+Ave+SUITE+115,+Miami,+FL+33138,+USA!3b1!8m2!3d25.848823!4d-80.1892165!16s%2Fg%2F11n58_z54q!3m5!1s0x88d9b1f88cedf777:0xfe65f8db78e5050!8m2!3d25.8488082!4d-80.1892247!16s%2Fg%2F11z0ykzjrn?entry=ttu&g_ep=EgoyMDI2MDYyNC4wIKXMDSoASAFQAw%3D%3D",
      geo: { lat: 25.8488082, lng: -80.1892247 },
    },
  ],
  social: {
    instagram: "https://www.instagram.com/giada__studio/",
    linkedin: "https://www.linkedin.com/company/giada-studio",
  },
} as const;
