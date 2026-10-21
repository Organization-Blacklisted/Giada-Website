"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Link } from "next-view-transitions";
import { toInternalHref, type HeadingEntry } from "@/lib/richtext-utils";

type TocItem = { text: string; slug: string };
type MarkerRect = { top: number; height: number };

// Renders the numbered-free list + stretching active-section marker.
// Mounted twice (desktop sidebar, mobile drawer) — each instance keeps
// its own refs/marker state so the two never fight over the same DOM
// nodes; only `activeIndex` is shared, driven by the single
// IntersectionObserver in the parent.
function TocNav({
  items,
  activeIndex,
  onItemClick,
}: {
  items: TocItem[];
  activeIndex: number;
  onItemClick: (slug: string) => void;
}) {
  const [marker, setMarker] = useState<MarkerRect>({ top: 0, height: 32 });
  const navRef = useRef<HTMLElement | null>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const measure = () => {
      const nav = navRef.current;
      const el = itemRefs.current[activeIndex];
      if (!nav || !el) return;
      setMarker({ top: el.offsetTop - nav.offsetTop, height: el.offsetHeight });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [activeIndex, items]);

  return (
    <div className="flex w-full gap-4">
      <div className="relative w-0.5 shrink-0">
        <div className="absolute inset-0 w-0.5 bg-stone-200" aria-hidden="true" />
        <div
          className="absolute w-0.5 bg-stone-900 transition-[top,height] duration-300 ease-out"
          style={{ top: marker.top, height: marker.height }}
          aria-hidden="true"
        />
      </div>

      <nav ref={navRef} aria-label="Table of contents" className="flex w-full max-w-[308px] flex-col gap-4 text-[16px] leading-[32px]">
        {items.map((item, index) =>
          item.slug ? (
            <a
              key={item.slug}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              href={`#${item.slug}`}
              onClick={(e) => {
                e.preventDefault();
                onItemClick(item.slug);
              }}
              className={index === activeIndex ? "text-stone-900" : "text-stone-900/40 transition-colors hover:text-stone-900/70"}
            >
              {item.text}
            </a>
          ) : (
            <span
              key="introduction"
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              className={index === activeIndex ? "text-stone-900" : "text-stone-900/40"}
            >
              {item.text}
            </span>
          )
        )}
      </nav>
    </div>
  );
}

function CollectionsCta({
  title,
  description,
  linkText,
  href,
}: {
  title: string;
  description: string;
  linkText: string;
  href: string;
}) {
  // Editor-entered href, same habit seen in rich-text links (see
  // toInternalHref's own comment): could be a relative path or the full
  // absolute production URL. Normalize either to a relative Link so an
  // internal destination still gets client-side nav; a genuinely
  // external href falls through to a plain <a>.
  const internalHref = toInternalHref(href);

  return (
    <div className="relative mt-[60px] h-[280px] w-[324px] max-w-full overflow-hidden">
      {/* scale-105: the source image is exactly the container's native
          324x280 size, so sub-pixel rounding on `object-cover` can leave
          a hairline gap at one edge showing the page background through
          — a small overdraw guarantees full coverage regardless. */}
      <Image src="/images/blog/collections-cta-bg.png" alt="" fill sizes="324px" className="scale-105 object-cover" />
      <div className="absolute inset-0 bg-black/30" aria-hidden="true" />
      <div className="absolute left-5 right-5 top-9 flex flex-col gap-2">
        <p className="font-heading text-[28px] capitalize italic text-white">{title}</p>
        {description && <p className="text-[14px] leading-5 text-white/80">{description}</p>}
      </div>
      {internalHref ? (
        <Link
          href={internalHref}
          className="group absolute bottom-9 left-5 flex items-center gap-[clamp(0.75rem,1.25vw,1.5rem)] text-[12px] font-semibold uppercase tracking-[3px] text-white no-underline"
        >
          {linkText}
          <span aria-hidden="true" className="h-px w-10 origin-left bg-white transition-transform duration-300 group-hover:scale-x-125" />
        </Link>
      ) : (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="group absolute bottom-9 left-5 flex items-center gap-[clamp(0.75rem,1.25vw,1.5rem)] text-[12px] font-semibold uppercase tracking-[3px] text-white no-underline"
        >
          {linkText}
          <span aria-hidden="true" className="h-px w-10 origin-left bg-white transition-transform duration-300 group-hover:scale-x-125" />
        </a>
      )}
    </div>
  );
}

// Mobile presentation ported from Torque Pharma's blog TOC pattern (this
// project's structural reference): a fixed pill below `lg` that opens a
// backdrop + left-sliding off-canvas drawer, hand-rolled with plain CSS
// transitions (no Framer Motion/headless-UI dep there, none here either).
// Two deliberate differences from that reference: the drawer also holds
// the Collections CTA (Torque's only holds the TOC list — asked for here
// explicitly), and this adds Escape-to-close + a body scroll lock, which
// Torque's version doesn't have.
export default function BlogTableOfContents({
  headings,
  sidebarCta,
}: {
  headings: HeadingEntry[];
  sidebarCta: { title: string; description: string; linkText: string; href: string };
}) {
  // "Introduction" (the intro paragraphs before the first h2) is always
  // entry 0 — not a real heading in `content`, just this sidebar's own
  // label for "you're at the top of the article."
  const items: TocItem[] = [{ text: "Introduction", slug: "" }, ...headings];
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const isScrollingRef = useRef(false);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const sections = headings
      .map((h) => document.getElementById(h.slug))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    // Tracks whichever heading has most recently crossed the top third
    // of the viewport — a plain "is this heading visible at all" check
    // makes the marker jump between multiple simultaneously-visible
    // short sections; anchoring to one line near the top reads as
    // "which section am I currently reading" the way the design's single
    // 32px marker implies.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !isScrollingRef.current) {
            const index = sections.indexOf(entry.target as HTMLElement);
            if (index !== -1) setActiveIndex(index + 1); // +1 for the "Introduction" row
          }
        }
      },
      { rootMargin: "-10% 0px -80% 0px" }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [headings]);

  // Shared by the desktop sidebar and the mobile drawer's links: jump the
  // active marker immediately, briefly suppress the observer so it
  // doesn't fight the smooth scroll, close the drawer (a no-op on
  // desktop) so a mobile tap both navigates and dismisses it, and
  // actually smooth-scroll to the heading — a plain `href="#slug"` jumps
  // instantly, so the link's onClick preventDefaults and this does the
  // scrolling instead.
  const handleItemClick = (slug: string) => {
    const index = items.findIndex((item) => item.slug === slug);
    if (index !== -1) setActiveIndex(index);
    isScrollingRef.current = true;
    if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    scrollTimerRef.current = setTimeout(() => {
      isScrollingRef.current = false;
    }, 800);
    setIsOpen(false);
    // Deferred a tick: on mobile, closing the drawer also restores the
    // body's scroll lock (see the isOpen effect below) — scrolling
    // before that commits would be scrolling a still-locked body.
    setTimeout(() => {
      document.getElementById(slug)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  };

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden flex-col items-start lg:flex" data-reveal>
        <TocNav items={items} activeIndex={activeIndex} onItemClick={handleItemClick} />
        <CollectionsCta title={sidebarCta.title} description={sidebarCta.description} linkText={sidebarCta.linkText} href={sidebarCta.href} />
      </div>

      {/* Mobile: floating pill trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open table of contents"
        className="fixed bottom-6 left-4 z-40 flex items-center gap-2 rounded-full bg-stone-900 px-5 py-3 text-[12px] font-semibold uppercase tracking-[2px] text-white shadow-lg lg:hidden"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M2 4h12M2 8h8M2 12h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        Table of Contents
      </button>

      {/* Mobile: backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity duration-300 lg:hidden ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile: off-canvas drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Table of contents"
        className={`fixed inset-y-0 left-0 z-50 w-[320px] max-w-[85vw] overflow-y-auto bg-white p-6 shadow-xl transition-transform duration-300 lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-6 flex items-center justify-between">
          <p className="text-[12px] font-semibold uppercase tracking-[2px] text-stone-900/60">Table of Contents</p>
          <button type="button" onClick={() => setIsOpen(false)} aria-label="Close table of contents" className="text-stone-600 hover:text-stone-900">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <TocNav items={items} activeIndex={activeIndex} onItemClick={handleItemClick} />
        <CollectionsCta title={sidebarCta.title} description={sidebarCta.description} linkText={sidebarCta.linkText} href={sidebarCta.href} />
      </div>
    </>
  );
}
