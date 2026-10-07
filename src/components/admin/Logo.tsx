import Image from "next/image";

// Replaces Payload's default wordmark on the /admin login screen with
// the real site logo (same file Header.tsx uses). The source file is
// black text on a transparent background.
//
// Payload's admin theme is adaptive (follows OS preference by default,
// user-togglable after login) and sets `data-theme="dark"`/`"light"` on
// <html> — that attribute is also what Payload's OWN CSS uses to pick
// the page's actual background color, so keying off it is guaranteed to
// stay in sync with whatever's really rendered.
//
// Tried a plain `prefers-color-scheme` media query first (sidesteps
// Payload's JS/cookie state entirely) — but testing confirmed a real gap:
// in one tested environment, `data-theme` stayed "light" (page background
// genuinely light) while `prefers-color-scheme: dark` still matched,
// which would've inverted the logo to near-white on a light page,
// exactly the invisible-logo problem this is trying to avoid. `data-theme`
// is the one signal guaranteed to track the actual rendered background,
// since Payload's own styles use that same attribute — confirmed by
// reading @payloadcms/ui's ThemeProvider source, not assumed.
//
// Inline <style> + a plain CSS attribute selector, not a Tailwind
// className — Payload's admin UI has its own CSS pipeline, separate
// from this project's Tailwind build (which only targets the
// (frontend) route group's bundle), so Tailwind utilities have no
// guarantee of being loaded here.
export function Logo() {
  return (
    <>
      <style>{`
        html[data-theme='dark'] .giada-admin-logo {
          filter: invert(1);
        }
      `}</style>
      <Image
        src="/images/giada-logo.webp"
        alt="Giada"
        width={328}
        height={134}
        className="giada-admin-logo"
        style={{ height: "64px", width: "auto" }}
        priority
      />
    </>
  );
}
