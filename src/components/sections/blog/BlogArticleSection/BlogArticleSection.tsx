import BlogContent from "@/components/sections/blog/BlogContent";
import BlogTableOfContents from "@/components/sections/blog/BlogTableOfContents";
import type { Post } from "@/payload-types";
import type { HeadingEntry } from "@/lib/richtext-utils";

// Sidebar 324px + content 876px with an 80px gap = the design's 1280px
// column (324 + 80 + 876). No mobile reference in the Figma file for
// this layout (same situation the Fragments bespoke page hit) — below
// `lg`, BlogTableOfContents renders nothing in normal flow (its sidebar
// is `hidden lg:flex`) and instead surfaces itself as a fixed pill +
// off-canvas drawer, so `aside` collapses to nothing on mobile and the
// article alone fills the column; no stacking/order juggling needed.
export default function BlogArticleSection({
  content,
  headings,
  sidebarCta,
}: {
  content: Post["content"];
  headings: HeadingEntry[];
  sidebarCta: { title: string; description: string; linkText: string; href: string };
}) {
  return (
    <section className="px-5 py-20 md:px-10 lg:px-16">
      <div className="mx-auto flex max-w-7xl flex-col gap-16 lg:flex-row lg:items-start lg:gap-20">
        <aside className="lg:sticky lg:top-24 lg:w-[324px] lg:shrink-0">
          <BlogTableOfContents headings={headings} sidebarCta={sidebarCta} />
        </aside>
        <article className="w-full min-w-0 lg:max-w-[876px]">
          <BlogContent content={content} />
        </article>
      </div>
    </section>
  );
}
