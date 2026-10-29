"use client";

import { useLivePreview } from "@payloadcms/live-preview-react";
import BlogDetailHeroSection from "@/components/sections/blog/BlogDetailHeroSection";
import BlogArticleSection from "@/components/sections/blog/BlogArticleSection";
import BlogRelatedSection from "@/components/sections/blog/BlogRelatedSection";
import BlogFaqSection from "@/components/sections/blog/BlogFaqSection";
import { mapBlogPostDetail, type BlogPostData } from "@/lib/api/blog-map";
import { safeJsonLd } from "@/lib/json-ld";
import type { Post } from "@/payload-types";

// Same split as BlogPageClient: only this post's own document is
// live-previewed here; `relatedPosts` come from a separate query as
// plain server-fetched props, since each of those posts live-previews
// itself from its own edit screen, not from here.
export default function BlogPostPageClient({
  initialData,
  relatedPosts,
}: {
  initialData: Post;
  relatedPosts: BlogPostData[];
}) {
  const { data: raw } = useLivePreview<Post>({
    initialData,
    serverURL: typeof window !== "undefined" ? window.location.origin : "",
    depth: 2,
  });

  const post = mapBlogPostDetail(raw);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Journal", item: "/blog" },
      { "@type": "ListItem", position: 2, name: post.title, item: `/blog/${post.slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema) }} />
      <BlogDetailHeroSection
        title={post.title}
        excerpt={post.excerpt}
        author={post.author}
        pubDateFormatted={post.pubDateFormatted}
        readTime={post.readTime}
        coverImage={post.coverImage}
      />
      <BlogArticleSection content={post.content} headings={post.headings} sidebarCta={post.sidebarCta} />
      <BlogRelatedSection posts={relatedPosts} />
      {post.faqs.length > 0 && <BlogFaqSection faqs={post.faqs} />}
    </>
  );
}
