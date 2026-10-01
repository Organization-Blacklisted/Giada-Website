import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site";
import { navItems } from "@/data/nav.config";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", ...navItems.map((item) => item.href)];

  return staticRoutes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
  }));
}
