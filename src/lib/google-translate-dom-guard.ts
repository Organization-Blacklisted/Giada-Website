// Defensive patch for a well-documented React + Google Translate conflict:
// Google's widget mutates the DOM directly (wrapping translated text in
// its own nodes) outside React's knowledge. If React later tries to
// remove or insert a node in a position it still thinks is accurate but
// Google has since relocated, the native DOM methods throw
// `NotFoundError: Failed to execute 'removeChild'/'insertBefore' on
// 'Node'` — an uncaught exception that crashes the whole React tree, not
// a recoverable per-component error.
//
// This is a known limitation of combining Google's client-side widget
// with any React/SPA site (not specific to this codebase) — see
// LanguageSwitcher.tsx's own comments for the broader context on why
// this interim approach was chosen. Highest real risk area on this site:
// RugsListing's filter grid, where items are actually added/removed from
// the DOM while French could be active.
//
// The guard: before calling the real method, verify the target node's
// actual parent matches what the caller (React) expects. If Google has
// already moved it elsewhere, the premise of the call is already false —
// skip the native call (which would throw) and return gracefully instead
// of crashing. `__patchedForGoogleTranslate` guards against wrapping the
// prototype method more than once (e.g. if this somehow runs twice in
// dev under Fast Refresh).
export function installGoogleTranslateDomGuard(): void {
  if (typeof Node !== "function" || !Node.prototype) return;

  const proto = Node.prototype as Node & { __patchedForGoogleTranslate?: boolean };
  if (proto.__patchedForGoogleTranslate) return;
  proto.__patchedForGoogleTranslate = true;

  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function <T extends Node>(this: Node, child: T): T {
    if (child.parentNode !== this) {
      console.warn("[google-translate-dom-guard] Skipped removeChild: node already relocated by Google Translate.");
      return child;
    }
    return originalRemoveChild.call(this, child) as T;
  };

  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function <T extends Node>(this: Node, newNode: T, referenceNode: Node | null): T {
    if (referenceNode && referenceNode.parentNode !== this) {
      console.warn("[google-translate-dom-guard] Skipped insertBefore: reference node already relocated by Google Translate.");
      return newNode;
    }
    return originalInsertBefore.call(this, newNode, referenceNode) as T;
  };
}
