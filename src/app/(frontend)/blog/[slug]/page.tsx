import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogPostPageClient from "@/components/sections/blog/BlogPostPageClient";
import { getAllBlogSlugs, getPostBySlug, getPostBySlugRaw, getRelatedPosts } from "@/lib/api/blog";
import { buildPageMetadata } from "@/lib/metadata";

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  const { seo } = post;
  return buildPageMetadata({
    title: seo.metaTitle || post.title,
    description: seo.metaDescription || post.excerpt,
    path: `/blog/${slug}`,
    image: seo.ogImage || post.coverImage || undefined,
    noIndex: seo.noIndex,
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const raw = await getPostBySlugRaw(slug);
  if (!raw) notFound();

  const relatedPosts = await getRelatedPosts(slug);

  return <BlogPostPageClient initialData={raw} relatedPosts={relatedPosts} />;
}
