import type { BlogPostData } from "@/lib/api/blog-map";

export interface BlogGridSectionProps {
  posts: BlogPostData[];
  className?: string;
}
