// Pure mapping logic split out of lib/api/blog.ts — same reasoning as
// every other page's `-map.ts` (see lib/api/collaborations-map.ts).
import type { BlogPage, Post, Media } from "@/payload-types";
import type { AccordionItem } from "@/components/ui/Accordion";
import { extractHeadings, estimateReadTime, type HeadingEntry } from "@/lib/richtext-utils";
import type { SeoData } from "./seo-types";

function mediaUrl(image: number | Media | null | undefined): string {
  return typeof image === "object" && image !== null ? (image.url ?? "") : "";
}

export type BlogPageData = {
  hero: {
    eyebrow: string;
    heading: string;
    description: string;
  };
  closingCta: {
    eyebrow: string;
    heading: string;
    description: string;
  };
  seo: SeoData;
};

export function mapBlogPage(doc: BlogPage): BlogPageData {
  return {
    hero: {
      eyebrow: doc.hero.eyebrow,
      heading: doc.hero.heading,
      description: doc.hero.description,
    },
    closingCta: {
      eyebrow: doc.closingCta.eyebrow,
      heading: doc.closingCta.heading,
      description: doc.closingCta.description,
    },
    seo: {
      metaTitle: doc.seo?.metaTitle ?? "",
      metaDescription: doc.seo?.metaDescription ?? "",
      ogImage: mediaUrl(doc.seo?.ogImage),
      noIndex: doc.seo?.noIndex ?? false,
    },
  };
}

export type BlogPostData = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  pubDate: string;
  coverImage: string;
  author: string;
};

export function mapBlogPost(doc: Post): BlogPostData {
  return {
    id: String(doc.id),
    title: doc.title,
    slug: doc.slug,
    excerpt: doc.excerpt,
    pubDate: doc.pubDate,
    coverImage: mediaUrl(doc.coverImage),
    author: doc.author || "Giada",
  };
}

function formatPubDate(pubDate: string): string {
  return new Date(pubDate).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
}

// Matches what BlogTableOfContents' CollectionsCta always hardcoded
// before this became per-post editable — unset posts look identical to
// before.
const DEFAULT_SIDEBAR_CTA_TITLE = "Explore the latest Rugs collections by GIADA";
const DEFAULT_SIDEBAR_CTA_LINK_TEXT = "Our Collections";
const DEFAULT_SIDEBAR_CTA_HREF = "/rugs";

export type BlogPostDetailData = BlogPostData & {
  pubDateFormatted: string;
  readTime: number;
  headings: HeadingEntry[];
  content: Post["content"];
  faqs: AccordionItem[];
  sidebarCta: { title: string; description: string; linkText: string; href: string };
  seo: SeoData;
};

// `content` is passed through raw (not re-shaped) — BlogContent renders
// it directly via Payload's own RichText component, and headings/readTime
// are both derived from this exact same raw value (see lib/richtext-utils),
// so there's nothing here that could drift out of sync with it.
export function mapBlogPostDetail(doc: Post): BlogPostDetailData {
  return {
    ...mapBlogPost(doc),
    pubDateFormatted: formatPubDate(doc.pubDate),
    readTime: estimateReadTime(doc.content),
    headings: extractHeadings(doc.content),
    content: doc.content,
    faqs: (doc.faqs ?? []).map((faq) => ({ title: faq.question, content: faq.answer })),
    sidebarCta: {
      title: doc.sidebarCta?.title || DEFAULT_SIDEBAR_CTA_TITLE,
      description: doc.sidebarCta?.description ?? "",
      linkText: doc.sidebarCta?.linkText || DEFAULT_SIDEBAR_CTA_LINK_TEXT,
      href: doc.sidebarCta?.href || DEFAULT_SIDEBAR_CTA_HREF,
    },
    seo: {
      metaTitle: doc.seo?.metaTitle ?? "",
      metaDescription: doc.seo?.metaDescription ?? "",
      ogImage: mediaUrl(doc.seo?.ogImage),
      noIndex: doc.seo?.noIndex ?? false,
    },
  };
}
