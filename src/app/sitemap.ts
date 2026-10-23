import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site";
import { navItems } from "@/data/nav.config";
import { getAllProductSlugs } from "@/lib/api/products-catalog";
import { getAllBlogSlugs } from "@/lib/api/blog";
import { getAllCollaborationSlugs } from "@/lib/api/collaborations";
import { getAllEventSlugs } from "@/lib/api/events";

// Was previously just navItems (7 nav pages) — found during a content
// audit (2026-10-23) that every dynamic detail page (72+ products, 8
// blog posts, 2 collaborations, 1 event) and several real static routes
// not in the main nav (/glass, /rugs, /privacy, /terms, /shipping) were
// silently missing from the sitemap the whole time, confirmed by
// actually reading the generated sitemap.xml against the real route
// list, not assumed. /contact/success is deliberately excluded — it's
// marked noIndex in its own metadata (a transactional thank-you page,
// not content), so listing it here would send a contradictory signal.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    ...navItems.map((item) => item.href),
    "/glass",
    "/rugs",
    "/privacy",
    "/terms",
    "/shipping",
  ];

  const [productSlugs, blogSlugs, collaborationSlugs, eventSlugs] = await Promise.all([
    getAllProductSlugs(),
    getAllBlogSlugs(),
    getAllCollaborationSlugs(),
    getAllEventSlugs(),
  ]);

  const dynamicRoutes = [
    ...productSlugs.map((slug) => `/products/${slug}`),
    ...blogSlugs.map((slug) => `/blog/${slug}`),
    ...collaborationSlugs.map((slug) => `/collaborations/${slug}`),
    ...eventSlugs.map((slug) => `/events/${slug}`),
  ];

  return [...staticRoutes, ...dynamicRoutes].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
  }));
}
