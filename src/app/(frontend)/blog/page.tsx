import type { Metadata } from "next";
import BlogPageClient from "@/components/sections/blog/BlogPageClient";
import { getAllBlogPosts, getBlogPageRaw, mapBlogPage } from "@/lib/api/blog";
import { buildPageMetadata } from "@/lib/metadata";

// Bare "Journal", not "Journal | Giada" — the root layout's own
// "%s | Giada" title template appends that automatically (same
// convention as every other page's DEFAULT_TITLE); baking it in here
// too produced a real "Journal | Giada | Giada" title bug.
const DEFAULT_TITLE = "Journal";
const DEFAULT_DESCRIPTION =
  "Perspectives on craft, material, and the art of the handmade — from the studio that has spent a century weaving beauty into extraordinary spaces.";

export async function generateMetadata(): Promise<Metadata> {
  const raw = await getBlogPageRaw();
  const { seo } = mapBlogPage(raw);
  return buildPageMetadata({
    title: seo.metaTitle || DEFAULT_TITLE,
    description: seo.metaDescription || DEFAULT_DESCRIPTION,
    path: "/blog",
    image: seo.ogImage || undefined,
    noIndex: seo.noIndex,
  });
}

export default async function BlogPage() {
  const [raw, posts] = await Promise.all([getBlogPageRaw(), getAllBlogPosts()]);

  return <BlogPageClient initialData={raw} posts={posts} />;
}
