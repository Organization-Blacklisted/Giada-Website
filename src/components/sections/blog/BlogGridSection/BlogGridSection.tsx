import BlogCard from "@/components/ui/BlogCard";
import type { BlogGridSectionProps } from "./BlogGridSection.types";

// Ported from the real source's pages/blog/index.astro grid section,
// including its empty state (real, reachable in the CMS if every post
// is ever removed — not a hypothetical). 3-column grid (sm:2,
// lg:3) with gap-x-8/gap-y-16, matching the real source exactly — wider
// than CollaborationsGridSection's own grid, since blog cards are
// simple image+text, not full hero-style panels.
export default function BlogGridSection({ posts, className = "" }: BlogGridSectionProps) {
  return (
    <section className={`px-5 pb-16 md:px-10 lg:px-16 lg:pb-20 ${className}`}>
      <div className="mx-auto max-w-6xl">
        <h2 className="sr-only">Latest Articles</h2>

        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-40 text-center">
            <div className="mb-6 h-px w-10 bg-stone-200" />
            <p className="font-heading text-xl text-stone-300">No articles yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <div key={post.id} data-reveal>
                <BlogCard title={post.title} slug={post.slug} excerpt={post.excerpt} coverImage={post.coverImage} author={post.author} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
