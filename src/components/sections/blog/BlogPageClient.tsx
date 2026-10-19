"use client";

import { useLivePreview } from "@payloadcms/live-preview-react";
import BlogHeroSection from "@/components/sections/blog/BlogHeroSection";
import BlogGridSection from "@/components/sections/blog/BlogGridSection";
import ContactCtaBanner from "@/components/ui/ContactCtaBanner";
import { mapBlogPage, type BlogPostData } from "@/lib/api/blog-map";
import type { BlogPage } from "@/payload-types";

// Same split as CollaborationsPageClient — only the page's own copy
// (hero/closingCta) is live-previewed here; `posts` come from the
// separate `posts` collection as plain server-fetched props, since each
// post live-previews itself from its own edit screen.
export default function BlogPageClient({ initialData, posts }: { initialData: BlogPage; posts: BlogPostData[] }) {
  const { data: raw } = useLivePreview<BlogPage>({
    initialData,
    serverURL: typeof window !== "undefined" ? window.location.origin : "",
    depth: 2,
  });

  const data = mapBlogPage(raw);

  return (
    <>
      <BlogHeroSection {...data.hero} />
      <BlogGridSection posts={posts} />
      <ContactCtaBanner {...data.closingCta} />
    </>
  );
}
