import { Link } from "next-view-transitions";
import type { JSXConvertersFunction } from "@payloadcms/richtext-lexical/react";
import type { DefaultNodeTypes } from "@payloadcms/richtext-lexical";
import { toInternalHref } from "@/lib/richtext-utils";

// Custom rendering for the `content` richText field so a real Lexical
// bullet list / heading still produces the exact same visual design the
// old array-based fields had (a thin dash marker instead of a round
// bullet, the small uppercase tracked label style for a subsection
// heading) — not Payload's own default list/heading styling. Everything
// not overridden here (bold/italic/underline/links/paragraphs) falls
// through to Payload's own default converters.
export const legalConverters: JSXConvertersFunction<DefaultNodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  paragraph: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children });
    if (!children?.length) {
      return null;
    }
    return <p className="text-sm leading-7 text-stone-600">{children}</p>;
  },
  heading: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children });
    return <p className="mb-3 mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">{children}</p>;
  },
  list: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children });
    if (node.listType === "number") {
      return <ol className="mt-4 list-decimal space-y-1.5 pl-5 text-sm leading-6 text-stone-500">{children}</ol>;
    }
    return <ul className="mt-4 space-y-1.5">{children}</ul>;
  },
  listitem: ({ node, nodesToJSX, parent }) => {
    const children = nodesToJSX({ nodes: node.children });
    const isOrdered = "listType" in parent && parent.listType === "number";

    if (isOrdered) {
      return <li className="leading-6">{children}</li>;
    }

    return (
      <li className="flex items-start gap-3 text-sm leading-6 text-stone-500">
        <span className="mt-2.5 h-px w-3 shrink-0 bg-stone-300" aria-hidden="true" />
        <span>{children}</span>
      </li>
    );
  },
  // Same fix as BlogContent.tsx's link/autolink converters — Payload's
  // default always renders a plain <a>, even for a link back at this
  // same site. See toInternalHref's own comment for why that's a real
  // problem, not cosmetic.
  link: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children });
    const rawUrl = node.fields.linkType === "internal" ? undefined : node.fields.url;
    const internalHref = rawUrl ? toInternalHref(rawUrl) : null;
    if (internalHref) {
      return <Link href={internalHref}>{children}</Link>;
    }
    const rel = node.fields.newTab ? "noopener noreferrer" : undefined;
    const target = node.fields.newTab ? "_blank" : undefined;
    return (
      <a href={rawUrl ?? "#"} rel={rel} target={target}>
        {children}
      </a>
    );
  },
  autolink: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children });
    const internalHref = node.fields.url ? toInternalHref(node.fields.url) : null;
    if (internalHref) {
      return <Link href={internalHref}>{children}</Link>;
    }
    const rel = node.fields.newTab ? "noopener noreferrer" : undefined;
    const target = node.fields.newTab ? "_blank" : undefined;
    return (
      <a href={node.fields.url ?? "#"} rel={rel} target={target}>
        {children}
      </a>
    );
  },
});
