"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

// Figma originally mocked this row as a flattened screenshot; it now
// ships real icon layers (X, LinkedIn, share — downloaded to
// public/images/blog/share-icons/), so those replace the hand-drawn
// inline SVGs used previously. Still built as real functional share
// links rather than static icons, same reasoning as the Related Blogs
// section being real BlogCards rather than a reused mockup image: a
// "share this article" row that doesn't actually share anything isn't
// a faithful implementation of what the design intends.
export default function ShareButtons({ title }: { title: string }) {
  // Read from window.location at click time rather than accepting a
  // `url` prop computed server-side — this component is already a
  // Client Component, so it's always accurate to whatever domain it's
  // actually running on (localhost, a Vercel preview, production),
  // instead of a parent server component guessing/hardcoding one.
  const currentUrl = () => window.location.href;
  const [copied, setCopied] = useState(false);

  // Auto-dismiss the "Link copied" confirmation.
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const shareOnX = () => {
    const url = currentUrl();
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, "_blank", "noopener");
  };

  const shareOnLinkedIn = () => {
    const url = currentUrl();
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank", "noopener");
  };

  const nativeShare = async () => {
    const url = currentUrl();
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // User dismissed the share sheet — nothing to do.
      }
    } else {
      // Browsers without the Web Share API (e.g. desktop Firefox/Linux)
      // fall back to a clipboard copy — silent otherwise, so surface a
      // brief confirmation instead of a click that looks like it did
      // nothing.
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
      } catch {
        // Clipboard permission denied — nothing more we can do.
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button type="button" onClick={shareOnX} aria-label="Share on X" className="cursor-pointer transition-opacity hover:opacity-80">
        <Image src="/images/blog/share-icons/x.svg" alt="" width={40} height={40} />
      </button>
      <button
        type="button"
        onClick={shareOnLinkedIn}
        aria-label="Share on LinkedIn"
        className="cursor-pointer transition-opacity hover:opacity-80"
      >
        <Image src="/images/blog/share-icons/linkedin.svg" alt="" width={40} height={40} />
      </button>
      <div className="relative">
        <button
          type="button"
          onClick={nativeShare}
          aria-label="Share this article"
          className="relative h-10 w-10 cursor-pointer transition-opacity hover:opacity-80"
        >
          <Image src="/images/blog/share-icons/ellipse.svg" alt="" fill />
          <Image
            src="/images/blog/share-icons/share.svg"
            alt=""
            width={12}
            height={14}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          />
        </button>
        <span
          role="status"
          className={`pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-stone-900 px-2 py-1 text-[11px] text-white transition-opacity duration-200 ${
            copied ? "opacity-100" : "opacity-0"
          }`}
        >
          Link copied
        </span>
      </div>
    </div>
  );
}
