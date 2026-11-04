"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: { sitekey: string }) => string;
      remove: (widgetId: string) => void;
    };
  }
}

// Explicit rendering — replaces the old implicit `.cf-turnstile` div +
// per-form <Script> pattern (each of EnquiryForm/EventRegistrationForm/
// JournalNewsletterForm used to inject its own copy of the same script
// tag). That pattern relied on Cloudflare's script scanning the page for
// `.cf-turnstile` divs ONCE when it loads; since next/script dedupes by
// URL, the script only ever loads (and scans) once per session. Any
// Turnstile div that mounts later via client-side navigation
// (next-view-transitions doesn't hard-reload) after that one scan
// already happened elsewhere never got rendered — a blank, non-
// functional widget until a hard refresh forced the script to load (and
// scan) fresh. Found 2026-11-04 via a real "works after refresh" report.
//
// Explicit rendering sidesteps this: the script itself loads once,
// globally, in the root layout with `render=explicit` (so it never
// attempts its own implicit scan), and each mounted <Turnstile /> calls
// `window.turnstile.render()` itself — safe regardless of whether the
// script already finished loading elsewhere first.
export default function Turnstile() {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let pollInterval: ReturnType<typeof setInterval> | undefined;

    function renderWidget() {
      if (cancelled || !containerRef.current || widgetIdRef.current || !window.turnstile) return;
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "",
      });
    }

    if (window.turnstile) {
      renderWidget();
    } else {
      // The global script may still be loading on a first page load —
      // poll briefly rather than racing its onload.
      pollInterval = setInterval(renderWidget, 100);
    }

    return () => {
      cancelled = true;
      if (pollInterval) clearInterval(pollInterval);
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, []);

  return <div ref={containerRef} />;
}
