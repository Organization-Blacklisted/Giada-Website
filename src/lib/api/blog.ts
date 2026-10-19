import { unstable_cache } from "next/cache";
import { getPayload } from "payload";
import config from "@payload-config";
import type { BlogPage, Post } from "@/payload-types";
import {
  mapBlogPage,
  mapBlogPost,
  mapBlogPostDetail,
  type BlogPageData,
  type BlogPostData,
  type BlogPostDetailData,
} from "./blog-map";

export * from "./blog-map";

export const getBlogPageRaw = unstable_cache(
  async (): Promise<BlogPage> => {
    const payload = await getPayload({ config });
    return payload.findGlobal({ slug: "blog-page", draft: false });
  },
  ["blog-page-raw"],
  { tags: ["blog"] }
);

export async function getBlogPage(): Promise<BlogPageData> {
  return mapBlogPage(await getBlogPageRaw());
}

// Newest first — matches the real source's own
// `posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())`.
export const getAllBlogPostsRaw = unstable_cache(
  async (): Promise<Post[]> => {
    const payload = await getPayload({ config });
    const result = await payload.find({ collection: "posts", sort: "-pubDate", limit: 0, depth: 1 });
    return result.docs;
  },
  ["blog-posts-raw"],
  { tags: ["blog"] }
);

export async function getAllBlogPosts(): Promise<BlogPostData[]> {
  const docs = await getAllBlogPostsRaw();
  return docs.map(mapBlogPost);
}

export const getAllBlogSlugs = unstable_cache(
  async (): Promise<string[]> => {
    const payload = await getPayload({ config });
    const result = await payload.find({ collection: "posts", limit: 0, depth: 0 });
    return result.docs.map((doc) => doc.slug);
  },
  ["blog-slugs"],
  { tags: ["blog"] }
);

// Caches the RAW document, not the mapped BlogPostDetailData — Live
// Preview (BlogPostPageClient.tsx) needs the raw shape as
// `useLivePreview`'s `initialData`, same reasoning as getHomeRaw in
// lib/api/home.ts. The mapping (`mapBlogPostDetail`) lives in
// blog-map.ts, a module with no Payload runtime imports, so the Client
// Component can import it directly without dragging getPayload into the
// client bundle.
export async function getPostBySlugRaw(slug: string): Promise<Post | null> {
  return unstable_cache(
    async () => {
      const payload = await getPayload({ config });
      // depth: 2 — the article body's richText embeds uploads (single
      // images and the ImagePair block), one level deeper than
      // coverImage's own depth: 1 would reach.
      const result = await payload.find({ collection: "posts", where: { slug: { equals: slug } }, limit: 1, depth: 2 });
      return result.docs[0] ?? null;
    },
    ["blog-post-raw", slug],
    { tags: ["blog"] }
  )();
}

export async function getPostBySlug(slug: string): Promise<BlogPostDetailData | null> {
  const doc = await getPostBySlugRaw(slug);
  return doc ? mapBlogPostDetail(doc) : null;
}

// Most recent posts excluding the one currently being read — no manual
// curation field, per explicit instruction.
export async function getRelatedPosts(excludeSlug: string, limit = 3): Promise<BlogPostData[]> {
  const docs = await getAllBlogPostsRaw();
  return docs
    .filter((doc) => doc.slug !== excludeSlug)
    .slice(0, limit)
    .map(mapBlogPost);
}
