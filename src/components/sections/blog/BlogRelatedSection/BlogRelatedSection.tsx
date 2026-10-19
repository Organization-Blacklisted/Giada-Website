import BlogCard from "@/components/ui/BlogCard";
import type { BlogPostData } from "@/lib/api/blog-map";

// Figma's own version of this section is a single flattened mockup image
// (a composite that LOOKS like 3 real cards, confirmed by screenshotting
// the node directly and finding no card layers underneath it at all) —
// not real content to extract. Built as real BlogCards instead, same
// component the /blog listing page uses, populated with the most recent
// posts excluding the current one.
export default function BlogRelatedSection({ posts, className = "" }: { posts: BlogPostData[]; className?: string }) {
  if (posts.length === 0) return null;

  return (
    <section className={`border-t border-stone-200 px-5 py-20 md:px-10 lg:px-16 lg:py-28 ${className}`}>
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-14 text-center font-heading text-4xl font-normal capitalize text-stone-900 md:text-5xl">
          Related Blogs
        </h2>
        <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <div key={post.id} data-reveal>
              <BlogCard title={post.title} slug={post.slug} excerpt={post.excerpt} coverImage={post.coverImage} author={post.author} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
