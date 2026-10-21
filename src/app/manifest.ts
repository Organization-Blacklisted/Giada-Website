import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site";

// True app root, not inside (frontend)/ — same lesson learned from
// robots.ts/sitemap.ts/favicon.ico (see ARCHITECTURE.md's "Folder
// structure"): Next's file-convention routes resolve at the real app
// root regardless of route groups, and robots.ts specifically silently
// stopped generating when it was nested inside (frontend) once before.
// Icons are the same Didot "G" monogram already used in favicon.ico —
// re-rendered crisp from the real Didot font file at each target size
// rather than upscaled from the source .ico's small 32x32 bitmap.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
