import type { Metadata } from "next";
import { GoogleTagManager } from "@next/third-parties/google";
import { ViewTransitions } from "next-view-transitions";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import ScrollReveal from "@/components/ui/ScrollReveal";
import NotFoundContent from "@/components/sections/not-found/NotFoundContent";
import { buildPageMetadata } from "@/lib/metadata";
import { avenir, didot } from "@/fonts";
import "./(frontend)/globals.css";

// True app root, not inside (frontend)/ — same lesson as robots.ts/
// sitemap.ts/favicon.ico/manifest.ts (see ARCHITECTURE.md's "Folder
// structure"). app/(frontend)/not-found.tsx only renders for an explicit
// notFound() call within a route Next has already matched into that
// tree; a URL that matches no route at all (e.g. /events, which has a
// [slug] child but no page.tsx of its own — confirmed live, this fell
// through to Next's bare default 404 instead of the site's own) needs
// this file. Requires `experimental.globalNotFound: true` in
// next.config.ts (confirmed by reading config-schema.js — defaults to
// false, off by default in 16.3.6) — without it Next looks for a plain
// root `not-found.tsx` instead, which in turn requires an actual root
// `layout.tsx` to render inside (confirmed: tried that first, got
// "not-found.tsx doesn't have a root layout" — this project
// deliberately has no root layout.tsx, each route group provides its
// own). global-not-found.tsx sits outside any layout regardless, so it
// renders its own <html>/<body> and repeats the root layout's chrome
// (fonts, Header/Footer, GTM) rather than inheriting it —
// NotFoundContent is shared with the nested not-found.tsx so both 404
// paths show the exact same page, not two that can drift apart.
export const metadata: Metadata = {
  ...buildPageMetadata({
    title: "Page Not Found — Giada",
    description: "The page you are looking for could not be found.",
    path: "/404",
    noIndex: true,
  }),
  title: { absolute: "Page Not Found — Giada" },
};

const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

export default function GlobalNotFound() {
  return (
    <ViewTransitions>
      <html lang="en" className={`h-full antialiased ${avenir.variable} ${didot.variable}`}>
        <body className="min-h-full flex flex-col">
          {gtmId && <GoogleTagManager gtmId={gtmId} />}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:rounded-md focus:bg-stone-900 focus:px-4 focus:py-2 focus:text-white"
          >
            Skip to main content
          </a>
          <Header />
          <main id="main-content" className="flex-1">
            <NotFoundContent />
          </main>
          <Footer />
          <ScrollReveal />
        </body>
      </html>
    </ViewTransitions>
  );
}
