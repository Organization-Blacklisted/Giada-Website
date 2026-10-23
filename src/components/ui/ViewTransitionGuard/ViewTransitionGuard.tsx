"use client";

import { useEffect } from "react";

// Fixes a real freeze: `document.startViewTransition()` (the browser API
// next-view-transitions' <Link> calls on every navigation — see
// ARCHITECTURE.md's "Page transitions" section) holds the page in a
// transitional state for the ~250-300ms of the crossfade. Clicking a
// second internal link during that window fires a second, overlapping
// startViewTransition() call before the first one has settled, and the
// browser is left holding the old page's frozen snapshot on screen with
// no way to recover short of a hard refresh — reported by the user
// double/fast-clicking a Collaborations card (2026-10-23), confirmed
// here as the real browser View Transitions API's own documented
// overlapping-transition failure mode, not something specific to this
// component or page.
//
// Fix: monkey-patch startViewTransition once to track whether one is
// currently in flight, and swallow clicks on internal links while it is
// — effectively disabling nav for the crossfade's duration — rather than
// touching every one of the ~20 call sites that import <Link> from
// next-view-transitions.
export default function ViewTransitionGuard() {
  useEffect(() => {
    if (typeof document === "undefined" || typeof document.startViewTransition !== "function") return;

    let transitioning = false;
    const original = document.startViewTransition.bind(document);

    document.startViewTransition = ((callback?: () => void | Promise<void>) => {
      transitioning = true;
      const transition = original(callback);
      transition.finished.finally(() => {
        transitioning = false;
      });
      return transition;
    }) as typeof document.startViewTransition;

    const onClickCapture = (e: MouseEvent) => {
      if (!transitioning) return;
      if ((e.target as HTMLElement)?.closest("a")) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    document.addEventListener("click", onClickCapture, true);

    return () => {
      document.removeEventListener("click", onClickCapture, true);
      document.startViewTransition = original;
    };
  }, []);

  return null;
}
