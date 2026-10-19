import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogPostPageClient from "@/components/sections/blog/BlogPostPageClient";
import { getAllBlogSlugs, getPostBySlug, getPostBySlugRaw, getRelatedPosts } from "@/lib/api/blog";

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  const { seo } = post;
  return {
    title: seo.metaTitle || post.title,
    description: seo.metaDescription || post.excerpt,
    ...((seo.ogImage || post.coverImage) ? { openGraph: { images: [{ url: seo.ogImage || post.coverImage }] } } : {}),
    ...(seo.noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const raw = await getPostBySlugRaw(slug);
  if (!raw) notFound();

  const relatedPosts = await getRelatedPosts(slug);

  return <BlogPostPageClient initialData={raw} relatedPosts={relatedPosts} />;
}
