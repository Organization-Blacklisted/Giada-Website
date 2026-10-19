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
