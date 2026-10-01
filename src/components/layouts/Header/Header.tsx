"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/data/nav.config";

const leftPages = navItems.slice(0, 3);
const rightPages = navItems.slice(3);

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Real source didn't need this — a full Astro page swap always reset
  // DOM state. Header here persists across client-side navigations, so
  // without this, browser back/forward while the mobile menu is open
  // would leave it stuck open.
  //
  // Adjusted during render, not inside a useEffect — React's own
  // recommended pattern for "reset state when a tracked value changes"
  // (see "You Might Not Need An Effect" in the React docs). Calling
  // setState synchronously in an effect body causes an extra render
  // cycle every time; this conditional-during-render form doesn't.
  // Only fires on an actual pathname change (never on first render,
  // since prevPathname starts equal to pathname — no hydration risk).
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  // Scroll lock while the mobile menu is open — ported from the real
  // source's lockScroll/unlockScroll. Fixed-position technique (not
  // plain overflow:hidden) so unlocking restores the exact scroll
  // position instead of jumping to the top.
  useEffect(() => {
    if (!open) return;

    const scrollY = window.scrollY;
    const html = document.documentElement.style;
    const body = document.body.style;

    html.overflow = "hidden";
    html.height = "100%";
    body.overflow = "hidden";
    body.position = "fixed";
    body.top = `-${scrollY}px`;
    body.left = "0";
    body.right = "0";
    body.width = "100%";

    return () => {
      html.overflow = "";
      html.height = "";
      body.overflow = "";
      body.position = "";
      body.top = "";
      body.left = "";
      body.right = "";
      body.width = "";
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  // Auto-close if the viewport grows past the mobile breakpoint while open.
  useEffect(() => {
    if (!open) return;
    const onResize = () => {
      if (window.innerWidth >= 1024) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [open]);

  const linkClass = (href: string) =>
    `font-heading text-[14px] tracking-[0.06em] transition-colors duration-200 ${
      isActive(pathname, href)
        ? "border-b border-stone-800 pb-0.5 text-stone-900"
        : "text-stone-600 hover:text-stone-900"
    }`;

  return (
    <nav
      id="navbar"
      className="fixed left-0 top-0 z-50 w-full bg-white transition-all duration-300"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="relative flex h-20 items-center justify-between">
          {/* Mobile burger button */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="z-50 cursor-pointer p-1 text-stone-900 transition-opacity duration-200 hover:opacity-50 lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            )}
          </button>

          {/* Left nav desktop */}
          <div className="hidden flex-1 justify-start gap-8 lg:flex">
            {leftPages.map((page) => (
              <Link key={page.href} href={page.href} className={linkClass(page.href)}>
                {page.label}
              </Link>
            ))}
          </div>

          {/* Logo */}
          <div className="pointer-events-none absolute left-1/2 z-[100] -translate-x-1/2">
            <Link href="/" className="pointer-events-auto">
              <Image
                src="/images/giada-logo.webp"
                alt="Giada"
                width={328}
                height={134}
                className="h-14 w-auto"
                priority
              />
            </Link>
          </div>

          {/* Right nav desktop */}
          <div className="hidden flex-1 justify-end gap-8 lg:flex">
            {rightPages.map((page) => (
              <Link key={page.href} href={page.href} className={linkClass(page.href)}>
                {page.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-40 h-dvh overflow-hidden overscroll-none bg-white transition-transform duration-500 ease-in-out lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/*
          pt-20 reserves the navbar's own height (h-20) so the vertically-
          centered list never renders under the logo — the logo sits above
          this panel (z-[100] vs this panel's z-40) at short viewport
          heights without this, "Products" (the first item) can center
          right behind "GIADA". Not present in the real source as a fix
          (real bug, found via testing, not carried forward as-is).
        */}
        <div className="flex h-full flex-col justify-center px-8 pt-20">
          {navItems.map((page) => (
            <div key={page.href} className="border-b border-stone-100 first:border-t">
              <Link
                href={page.href}
                onClick={() => setOpen(false)}
                className="font-heading block py-5 text-center text-xl text-stone-900 transition-opacity duration-200 hover:opacity-60"
              >
                {page.label}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}
