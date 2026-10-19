import type { Metadata } from "next";
import BlogPageClient from "@/components/sections/blog/BlogPageClient";
import { getAllBlogPosts, getBlogPageRaw, mapBlogPage } from "@/lib/api/blog";

const DEFAULT_TITLE = "Journal | Giada";
const DEFAULT_DESCRIPTION =
  "Perspectives on craft, material, and the art of the handmade — from the studio that has spent a century weaving beauty into extraordinary spaces.";

export async function generateMetadata(): Promise<Metadata> {
  const raw = await getBlogPageRaw();
  const { seo } = mapBlogPage(raw);
  return {
    title: seo.metaTitle || DEFAULT_TITLE,
    description: seo.metaDescription || DEFAULT_DESCRIPTION,
    ...(seo.ogImage ? { openGraph: { images: [{ url: seo.ogImage }] } } : {}),
    ...(seo.noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function BlogPage() {
  const [raw, posts] = await Promise.all([getBlogPageRaw(), getAllBlogPosts()]);

  return <BlogPageClient initialData={raw} posts={posts} />;
}
