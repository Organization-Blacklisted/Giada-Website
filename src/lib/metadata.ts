import type { Metadata } from "next";
import { siteConfig } from "@/data/site";

// Shared by every page's generateMetadata — builds the FULL correct
// openGraph/twitter objects explicitly (title/description/images/type/
// siteName/url) instead of leaving each page to set a partial object
// (e.g. just `openGraph.images`, as Blog/Events did before this) and
// hoping Next's parent/child metadata merging fills in the rest. It
// doesn't reliably: a child route's `openGraph` key replaces the
// parent's wholesale rather than deep-merging per sub-field, so a page
// that only set `images` was shipping an Open Graph object with no
// title/description/type/siteName at all. One function, one real
// source of truth, used everywhere instead.
export function buildPageMetadata({
  title,
  description,
  path,
  image,
  noIndex = false,
}: {
  title: string;
  description: string;
  /** Route path, e.g. "/blog/the-bespoke-process" or "" for the home page. */
  path: string;
  /** Absolute or site-relative image URL. Omit if the page has no representative image. */
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const url = `${siteConfig.url}${path}`;
  const images = image ? [{ url: image }] : undefined;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      type: "website",
      locale: "en_US",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images,
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}
