// Shared between the TOC sidebar (extractHeadings) and the article
// body's custom heading renderer (BlogContent.tsx) — both derive from
// the post's own `content` field, so a table of contents can never drift
// out of sync with the headings actually in the article. No separate
// `toc`/`readTime` field on the Post collection for the same reason:
// nothing for an editor to forget to update.
//
// Typed loosely (matches the generated `Post.content` shape, which
// Payload itself only types as a generic Lexical root) rather than
// pulling in Lexical's full node types for what's just a plain-object
// tree walk.
import { siteConfig } from "@/data/site";

// Payload's own default link converter always renders a plain <a href>,
// even for a link that points back at this same site — e.g. an editor
// pasting the full "https://www.giada-studio.com/blog/..." URL instead
// of a relative path (confirmed by reading
// @payloadcms/richtext-lexical's link converter source directly, not
// assumed). That bypasses Next's client-side navigation (forces a full
// page reload on every internal link) and would point at the live site
// even when the content is being previewed on a different host
// (localhost, a Vercel preview URL) before go-live. Used by both
// BlogContent.tsx and LegalDocumentSection.converters.tsx to normalize
// any link whose host matches the site's own — relative already, or any
// http/https/www variant of the absolute form — down to a relative path
// rendered through next-view-transitions' Link, matching every other
// internal link in the app. Returns null for a genuinely external URL
// (or mailto:/tel:), which both callers then fall through to a plain
// <a> for, unchanged.
export function toInternalHref(rawUrl: string): string | null {
  try {
    const url = new URL(rawUrl, siteConfig.url);
    const siteHost = new URL(siteConfig.url).hostname.replace(/^www\./, "");
    const linkHost = url.hostname.replace(/^www\./, "");
    if (linkHost !== siteHost) return null;
    return `${url.pathname}${url.search}${url.hash}` || "/";
  } catch {
    return null;
  }
}

type LexicalNode = {
  type?: string;
  tag?: string;
  text?: string;
  children?: LexicalNode[];
  [key: string]: unknown;
};

type LexicalRoot = { root: LexicalNode };

export type HeadingEntry = { text: string; slug: string };

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function collectText(node: LexicalNode): string {
  if (node.type === "text") return node.text ?? "";
  return (node.children ?? []).map(collectText).join("");
}

// Walks every node, not just top-level — a heading could in principle
// sit inside a list item or other container, same reasoning a real HTML
// page's `h2` elements aren't restricted to the document's top level.
function walk(node: LexicalNode, visit: (node: LexicalNode) => void) {
  visit(node);
  (node.children ?? []).forEach((child) => walk(child, visit));
}

export function extractHeadings(content: LexicalRoot): HeadingEntry[] {
  const headings: HeadingEntry[] = [];
  walk(content.root, (node) => {
    if (node.type === "heading" && node.tag === "h2") {
      const text = collectText(node).trim();
      if (text) headings.push({ text, slug: slugify(text) });
    }
  });
  return headings;
}

const WORDS_PER_MINUTE = 200;

export function estimateReadTime(content: LexicalRoot): number {
  let wordCount = 0;
  walk(content.root, (node) => {
    if (node.type === "text" && node.text) {
      wordCount += node.text.trim().split(/\s+/).filter(Boolean).length;
    }
  });
  return Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE));
}
