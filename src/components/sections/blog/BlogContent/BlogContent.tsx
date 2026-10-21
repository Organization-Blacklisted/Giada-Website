import Image from "next/image";
import { Link } from "next-view-transitions";
import {
  RichText,
  defaultJSXConverters,
  type JSXConvertersFunction,
} from "@payloadcms/richtext-lexical/react";
import type { Post } from "@/payload-types";
import { slugify, toInternalHref } from "@/lib/richtext-utils";

type ImagePairBlockProps = {
  blockType: "imagePair";
  left: { url?: string | null; alt?: string | null } | number;
  right: { url?: string | null; alt?: string | null } | number;
};

type FeatureListBlockProps = {
  blockType: "featureList";
  items: {
    id?: string | null;
    title: string;
    description: string;
    subItems?: { id?: string | null; text: string }[] | null;
    closingText?: string | null;
  }[];
};

type ArticleBlockProps = ImagePairBlockProps | FeatureListBlockProps;

function mediaUrl(value: { url?: string | null } | number | null | undefined): string {
  return typeof value === "object" && value !== null ? (value.url ?? "") : "";
}

// Only the node types this article body's editor config actually allows
// (see collections/BlogPosts.ts's `content` field) need a converter here
// — defaultJSXConverters covers the rest (bold/italic/link/lists)
// reasonably, left as-is rather than re-styled per node.
const converters: JSXConvertersFunction<ArticleBlockProps> = ({ defaultConverters }) => ({
  ...defaultJSXConverters,
  ...defaultConverters,
  // h2 only (the editor config only enables h2) — id is derived with the
  // exact same slugify() the TOC sidebar uses, so an anchor link always
  // lands on the right heading.
  // mt-14 (not a uniform wrapper gap) is what actually produces the
  // design's rhythm: a bigger gap before each new section's heading,
  // tighter mb-4 between paragraphs within the same section. first:mt-0
  // so the very first heading (right after the intro paragraphs) doesn't
  // get a redundant top gap on top of the intro's own mb-4.
  heading: ({ node, nodesToJSX }) => {
    const text = node.children
      .map((child: { text?: string }) => child.text ?? "")
      .join("");
    return (
      <h2
        id={slugify(text)}
        // scroll-mt-24: offsets the smooth-scroll landing spot below the
        // site's fixed h-20 header (see Header.tsx), matching the 96px
        // (top-24) offset already used elsewhere for the same reason.
        className="mb-4 mt-14 scroll-mt-24 font-heading text-[28px] font-normal capitalize text-stone-900 first:mt-0"
      >
        {nodesToJSX({ nodes: node.children })}
      </h2>
    );
  },
  // No margin between paragraphs — confirmed from Figma's own export
  // (the feature list's body text uses `mb-0` the same way): consecutive
  // paragraphs within a section flow on leading-[32px] alone, not an
  // added gap. mt-14 on the next heading (or an image's own margins) is
  // what actually produces the gap between sections.
  paragraph: ({ node, nodesToJSX }) => (
    <p className="mb-0 text-[16px] leading-[32px] text-stone-600">{nodesToJSX({ nodes: node.children })}</p>
  ),
  // The default list/listitem converters only emit a bare className
  // (e.g. "list-bullet") with no actual styling — Tailwind's preflight
  // strips native <ul>/<li> bullets and spacing, so without this the
  // list rendered as unstyled run-on text.
  list: ({ node, nodesToJSX }) => {
    const Tag = node.tag === "ol" ? "ol" : "ul";
    return (
      <Tag className="mb-4 ml-5 list-disc space-y-3 text-[16px] leading-[32px] text-stone-600 marker:text-stone-400 last:mb-0">
        {nodesToJSX({ nodes: node.children })}
      </Tag>
    );
  },
  listitem: ({ node, nodesToJSX }) => <li className="pl-1">{nodesToJSX({ nodes: node.children })}</li>,
  // Payload's default link converter always renders a plain <a> — even
  // for a link pointing back at this same site (see toInternalHref's own
  // comment for why that's a real problem, not cosmetic). Anything
  // resolving to this site's own host renders through next-view-
  // transitions' Link instead, matching every other internal link in the
  // app; genuine external links (and mailto:/tel:, which toInternalHref
  // can't parse as same-host) keep the plain <a>.
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
    const internalHref = toInternalHref(node.fields.url);
    if (internalHref) {
      return <Link href={internalHref}>{children}</Link>;
    }
    const rel = node.fields.newTab ? "noopener noreferrer" : undefined;
    const target = node.fields.newTab ? "_blank" : undefined;
    return (
      <a href={node.fields.url} rel={rel} target={target}>
        {children}
      </a>
    );
  },
  upload: ({ node }) => {
    const value = node.value as { url?: string | null; alt?: string | null; width?: number | null; height?: number | null };
    return (
      <div className="relative mb-14 mt-14 aspect-[876/430] w-full overflow-hidden">
        <Image
          src={value.url ?? ""}
          alt={value.alt ?? ""}
          fill
          sizes="(max-width: 1024px) 100vw, 876px"
          className="object-cover"
        />
      </div>
    );
  },
  blocks: {
    imagePair: ({ node }: { node: { fields: ImagePairBlockProps } }) => {
      const { left, right } = node.fields;
      return (
        <div className="mb-14 mt-14 flex items-center gap-4">
          <div className="relative aspect-square w-full overflow-hidden">
            <Image src={mediaUrl(left)} alt="" fill sizes="(max-width: 1024px) 50vw, 430px" className="object-cover" />
          </div>
          <div className="relative aspect-square w-full overflow-hidden">
            <Image src={mediaUrl(right)} alt="" fill sizes="(max-width: 1024px) 50vw, 430px" className="object-cover" />
          </div>
        </div>
      );
    },
    // Matches the Figma design's two-tier list exactly: each item's
    // title is its own single-item bulleted list set in Didot (not just
    // bold body text — a genuinely different typeface/size/color), with
    // the description indented under it via a 28px spacer rather than a
    // second bullet. Sub-points and the closing line are optional, used
    // only by the one item that has them.
    featureList: ({ node }: { node: { fields: FeatureListBlockProps } }) => (
      <div className="mb-4 mt-4 flex flex-col gap-8 last:mb-0">
        {node.fields.items.map((item, index) => (
          <div key={item.id ?? index} className="flex flex-col gap-2">
            <ul className="list-disc ms-[30px]">
              <li>
                <span className="font-heading text-[20px] capitalize text-stone-900">{item.title}</span>
              </li>
            </ul>
            <div className="flex gap-[3px]">
              <div className="w-[28px] shrink-0" aria-hidden="true" />
              <div className="flex-1 text-[16px] leading-[32px] text-stone-600">
                <p className="mb-0">{item.description}</p>
                {item.subItems && item.subItems.length > 0 && (
                  <ul className="list-disc ms-[24px]">
                    {item.subItems.map((sub, subIndex) => (
                      <li key={sub.id ?? subIndex}>{sub.text}</li>
                    ))}
                  </ul>
                )}
                {item.closingText && <p>{item.closingText}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
    ),
  },
});

export default function BlogContent({ content }: { content: Post["content"] }) {
  return <RichText data={content} converters={converters} />;
}
