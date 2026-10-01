# Giada — Next.js Frontend

Migration target for giada-studio.com (currently Astro) + a new Laravel
backend. This doc is the shared reference for the frontend team and the
Laravel dev — keep it updated as decisions get made.

## Status

- [x] Astro source ZIP received and audited (`giada-studio.com-handover.zip`, 2026-09-29 — see "Astro source audit" below)
- [x] Real fonts wired up (`next/font/local`, exact weight/style mapping from the real source)
- [x] GSAP installed + `gsap-init.ts`/`animations.ts`/`[data-reveal]` ported (see "Design tokens" → "Animations")
- [x] Real Header + Footer built (see "Header & Footer" below) — verified in a real browser (Playwright), not just build success
- [x] 404 page built (`Glitchy404` canvas + framer-motion effect) — see "404 page" below, verified rendering real canvas content in a real browser
- [x] FAQ page built (`Accordion` UI primitive + real content) — see "Accordion & FAQ" below, verified interaction behavior in a real browser
- [x] `TestimonialBook` UI primitive built (3D page-flip "Client Notes" carousel) — see "Testimonial book (Client Notes)" below, verified real forward/backward flip animation in a real browser. Built but deliberately not wired into the Home page yet (removed from `page.tsx` per request, 2026-09-30) — Home page itself isn't built out otherwise, so the carousel would be the only real section on an otherwise-placeholder page
- [x] Real favicon (`src/app/favicon.ico` replaced with the real Giada one from the Astro source's `public/favicon.ico` — byte-for-byte identical, confirmed by diffing the actually-served file, not just copying and assuming)
- [x] Contact page built in full (title/lead, `EnquiryForm`, showroom section with map embeds, `/contact/success`) — see "Contact page" below, verified in a real browser including the GSAP field-stagger animation and mobile stacking
- [ ] Page-transition crossfade — attempted (Framer Motion), pulled back out, see "Page transitions" below for why and what's known so far
- [ ] Laravel API contract agreed (endpoints/response shapes)
- [ ] Real content ported page by page
- [ ] Enquiry form wired to Laravel (still posts to a guessed `/enquiries` path, see "Contact page" below)
- [ ] SEO parity check (metadata, sitemap, 301s from old URLs — legacy redirect table found in the Astro source, needs porting)
- [ ] Staging deploy / client UAT
- [ ] Launch

## Stack

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS v4
- GSAP — matches the real Astro source's animation library. Core setup
  ported (`lib/gsap-init.ts`, `lib/animations.ts`, scroll-reveal system)
  — not yet used by any real component (nothing built that needs it yet).
- Backend: Laravel (separate repo, dedicated dev) — CMS + API only, no
  cart/checkout (confirmed: the live site is inquiry-based, not
  e-commerce)

## Folder structure

`src/` layout, matching the structure used on a previous Next.js project
(Torque Pharma) — `@/*` maps to `./src/*` (see `tsconfig.json`).

```
src/app/                   Routes (App Router)
  layout.tsx                Root layout — Header/Footer, skip-link, metadata template
  page.tsx                  Home
  products/page.tsx         Product catalog (rugs / glass)
  products/[slug]/page.tsx  Product detail
  collaborations/page.tsx
  gallery/page.tsx
  our-story/page.tsx
  blog/page.tsx             Post list
  blog/[slug]/page.tsx      Single post
  faq/page.tsx
  contact/page.tsx          Enquiry form
  privacy/, terms/, shipping/page.tsx   Legal pages (footer links here)
  api/revalidate/route.ts   Laravel → Next ISR cache-busting webhook
  sitemap.ts / robots.ts
  globals.css                Imports styles/*, base :root/body only

src/components/
  layouts/                  Header, Footer, Container — one folder each:
                             ComponentName.tsx (+ .types.ts if it takes
                             props) + index.ts barrel export
  sections/{page}/          Page-specific composed sections, same
                             per-component-folder convention. Only
                             sections/contact/EnquiryForm exists so far —
                             add the rest (hero, testimonial carousel,
                             press feature, image bar, ...) once real
                             content lands
  ui/ScrollReveal/          Mounted once in layout.tsx. Sets up the
                             [data-reveal] IntersectionObserver +
                             ScrollTrigger.refresh() on every page — see
                             "Animations" below.
  ui/SectionHeading/        Eyebrow + Didot heading + optional
                             description — confirmed repeated verbatim
                             across 5 real sections, see "Design tokens"
                             below. Not used by any real page yet.
  ui/Accordion/              Generic single-open-at-a-time accordion,
                             not FAQ-specific — see "Accordion & FAQ"

src/data/
  nav.config.ts              Typed nav items
  site.ts                    Site name/description/url/social/locations

src/fonts/
  avenir/, didot/            Real licensed .otf files (from the Astro
                             handover ZIP, not copied off the live site)
  index.ts                   next/font/local — see "Design tokens"

src/lib/
  api/fetcher.ts             Retrying, timeout-guarded, tag-revalidating
                             apiFetch<T>() + ApiError/isNotFoundError.
                             Add per-resource files (products.ts, blog.ts,
                             ...) once the real Laravel endpoints exist —
                             none exist yet, so none are invented here
  actions/enquiry.ts          "use server" — submitEnquiry(), posts to
                             Laravel. Endpoint path is a guess (/enquiries)
                             pending the real contract
  gsap-init.ts, animations.ts Ported verbatim from the real Astro source
                             — see "Animations" below

src/styles/
  colors.css                 @theme — only genuine custom brand colors
  typography.css              @theme — font family tokens
  (spacings.css, rich-text.css intentionally not created yet — no
  verified values for either; see "Design tokens")

src/types/                  One file per content shape: product.ts,
                             gallery.ts, blog.ts, faq.ts, testimonial.ts,
                             enquiry.ts — all provisional, inferred from
                             the live site, not the real API
```

## Conventions

- Use `font-heading` / `font-body` in components, never `font-didot` /
  `font-avenir` directly — see "Design tokens" for why.
- Server Components by default. Only add `"use client"` where actual
  interactivity is needed (forms, carousels, anything with state/effects)
  — this mirrors Astro's islands model, just via Next's client boundary
  instead.
- Data fetching happens in Server Components / Server Actions, calling
  `lib/api/*` — never fetch the Laravel API directly from inside a
  Client Component (`API_URL` is server-only, no `NEXT_PUBLIC_` prefix).
- Component folders: `ComponentName/ComponentName.tsx` (+
  `ComponentName.types.ts` if it takes props) + `index.ts` barrel
  (`export { default } from "./ComponentName";`). Skip `.types.ts` for
  components that take no props (e.g. `Header`, `Footer`).
- Path alias `@/*` maps to `src/*`.

## Known pages (from live site audit)

Products, Collaborations, Gallery, Our Story, Blog, FAQ, Contact — all
scaffolded as placeholder routes already. Home page sections seen on the
live site that still need building once we have real content: hero,
collection feature, testimonial carousel, press feature, image bar.

## EnquiryForm (`components/sections/contact/EnquiryForm`)

Field markup/styling now matches the real `ContactMain.astro` form
exactly (underline inputs, custom-chevron select, bordered textarea,
"Send Message →" button, "We respond within one business day." caption,
"Have a quick question? See our FAQ" link) — confirmed by reading the
real file in full, not the earlier placeholder guess. Verified in a
real browser: fields fillable, select value confirmed via
`inputValue()`, zero console errors.

- Fields: First Name, Last Name, Email, Type of Enquiry (Bespoke Rug
  Project / Textile in Glass Project / Designer / Architect Partnership
  / Trade Programme / Showroom Visit / General Enquiry), Message.
  Enquiry type slug values (`bespoke-rug-project`, etc.) were guessed
  early in the project by replicating the real source's own slugify
  logic (`.toLowerCase().replace(/[\s/]+/g, '-')`) — now confirmed
  against the real file, they matched exactly, no change needed.
- **Submission architecture deliberately differs from the real
  source**: it POSTs to its own `/api/contact` (Astro API route calling
  Resend directly, currently broken — empty API keys) then client-side
  navigates to `/contact/success`. Team decision from the Astro audit:
  Laravel should own email sending entirely instead. This component
  still calls the `submitEnquiry` Server Action in `lib/actions/enquiry.ts`
  — endpoint path is a guess pending the real Laravel contract — and
  shows an inline success message rather than navigating, since
  `/contact/success` doesn't exist in this project yet.
- **Not wired up, deliberately**: Cloudflare Turnstile. The real source
  gates submission on a Turnstile token — also currently non-functional
  on the live site (empty site key) — and anti-spam approach is still
  an open Phase 0 decision. Flagged with a TODO in the component rather
  than silently added or silently ignored.
- `app/contact/page.tsx` is still the placeholder page shell around this
  form — the real `ContactMain` is a full two-column layout (title/lead
  copy + this form) followed by a separate showroom section (Google Maps
  embeds per city, general contact row, `LocalBusiness` JSON-LD) that
  hasn't been built yet.

## Design tokens

Reverse-engineered directly from the live site's compiled CSS
(`/_astro/Layout*.css`, `/_astro/index*.css`) and font preload tags —
inspected, not guessed. Wired into `src/styles/colors.css` +
`src/styles/typography.css`, imported by `src/app/globals.css`.

**Typography — DONE**, wired up from the real licensed files (in the
Astro handover ZIP, not copied off the live site):
- **Avenir** (`src/fonts/avenir/AvenirLTStd-*.otf`) — body/UI font.
  Real weight/style mapping (copied verbatim from the Astro source's
  `astro.config.mjs` `fonts:` block, confirmed against the actual files):
  Light→300, Book→400, **Roman→450** (non-standard, between Book and
  Medium), Medium→500, Heavy→700, Black→900, each with an `*Oblique`
  italic. `next/font/local` config: `src/fonts/index.ts`.
- **Didot** (`src/fonts/didot/Didot*.otf`) — serif accent, applied via
  the `font-heading` utility class on nav links / headings. Real
  mapping: Didot→400, Didot Italic→400 italic, Didot Bold→700, Didot
  Title→900 (no 700/900 italic — matches the live site, no italic files
  exist for those weights).
- **Semantic tokens, not literal family names** (Torque Pharma
  convention): `styles/typography.css` defines `--font-avenir`/
  `--font-didot` (the literal families, matching the real source's own
  CSS var names) and then aliases them to `--font-heading: var(--font-
  didot)` / `--font-body: var(--font-avenir)`. **Components use
  `font-heading`/`font-body`, never `font-avenir`/`font-didot`
  directly** — one place to repoint if the heading/body font ever
  changes. `body` uses `font-family: var(--font-body)`.
- We tried the real source's own approach first — a blanket
  `h1, h2 { font-family: var(--font-didot); font-weight: 400; }` rule —
  and hit a real bug: placeholder pages' `font-semibold` on `<h1>`
  silently beat `font-weight: 400` (a Tailwind utility class always
  wins over a plain-element selector on specificity, regardless of
  source order). Fixed by applying `font-heading` explicitly per
  component instead of relying on an invisible global cascade rule —
  `globals.css` now only keeps `text-wrap: balance` on `h1, h2, h3`
  (merged from the source's separate rules, same effect), since that
  has no such conflict.
- Both applied as classNames on `<html>` in `layout.tsx`;
  `styles/typography.css` uses `@theme inline` with
  `--font-avenir: var(--font-avenir), ...` / same for Didot (looks
  self-referential but isn't — see the comment in that file).
- Type scale, line-heights, tracking (`tight`/`wide`/`widest`), and
  radius scale are all **stock Tailwind v4 defaults** — no overrides
  needed there.
- Body applies Avenir directly (`font-family: var(--font-avenir)` on
  `body`), not via the semantic `--font-sans` token — matches how the
  live site does it, so we mirrored that instead of aliasing `font-sans`.

**Color**
- Neutral palette is Tailwind's **default `stone` scale** (50→950) —
  not a custom brand palette. Use `stone-*` everywhere, not `zinc`/`gray`.
- **`--color-cream: #f5f0e6` is now in question.** Reverse-engineered
  from the *live site's* compiled CSS originally, but the real Astro
  source's `global.css` (from the ZIP) has **no such value anywhere** —
  it uses plain `stone-*` throughout, no custom color token at all.
  Either the cream comes from an image/photo background rather than a
  CSS color, or it's from a build not present in this handover. **Kept
  deliberately for now** (team decision, 2026-09-29) rather than
  confirmed real — reconsider once we know where it actually renders on
  the live page.
- Default body text color is `#1c1917` (`stone-900`) — confirmed both
  from the live site's `body{color:...}` rule and the real source's
  `global.css` (`rgb(28 25 23)` ≈ stone-900) — set as `--foreground`.
- `::selection` — `stone-500` at 15% opacity (`rgb(120 113 108 / 0.15)`),
  confirmed from the real source, added to `globals.css`.
- **No dark mode** — confirmed zero `prefers-color-scheme` rules anywhere
  in the live CSS. Fixed light theme; the create-next-app dark-mode
  media query was removed rather than left in as unused boilerplate.
- No custom breakpoints, container sizes, or shadows — all Tailwind
  defaults apply as-is. Confirmed from the real source: `rounded-full`
  and `rounded-2xl` are the only two border-radius values used anywhere;
  shadows are minimal/inconsistent (`shadow-sm/lg/2xl`) — no dedicated
  radius/shadow tokens needed.

**Layout system — DONE.** The real source has exactly one layout
primitive, applied via two classes in `global.css`: `.site-section`
(horizontal gutter only — `20px` mobile → `40px` at 768px → `64px` at
1024px, all stock Tailwind `spacing.5/.10/.16`) and `.site-container`
(`max-width: 72rem`, stock Tailwind `6xl`, centered). Ported into
`components/layouts/Container`: the `gutter` constant now matches
`.site-section` exactly (was a flat `px-6` before — real fix, not just
documentation), and the existing `max-w-6xl` default already matched
`.site-container`.

**Section vertical rhythm — not tokenized**, by choice for now. The
real source isn't formal about this either (ad-hoc `py-*` per
component, `py-16`/`py-24` dominate at 22/19 uses respectively) — left
as plain Tailwind utility classes per-section when we build them,
rather than inventing a semantic `--spacing-section` token the original
site itself doesn't have.

**Not yet captured**: button/CTA styling, exact hero layout — need
page-by-page porting to nail down. (The "dog-ear" CSS detail spotted
earlier belongs to `home/Testimonials.astro`'s flip-book effect —
identified, not a mystery anymore.)

**Shared components found by comparison, not assumption** —
`components/ui/SectionHeading`: eyebrow (flanked by two `h-px w-12
bg-stone-300` lines) + `font-heading text-4xl md:text-5xl` title +
optional description. Read the real source of `ProcessStrip`,
`WhyGiada`, `CategoryGrid`, `OurClients`, and `ContactCTA` side by side
before extracting this — confirmed genuinely identical markup, not just
similar-looking. Two real discrepancies found between instances,
resolved as:
- Eyebrow color: 4 of 5 instances use `stone-400`, `OurClients` uses
  `stone-500` (one step apart — looks like an authoring slip). Kept as
  an explicit `eyebrowColor` prop rather than silently dropped, so both
  real values stay available (team decision, 2026-09-29).
- Description spacing: some instances use `mt-6` on the paragraph,
  `OurClients` uses `mb-6` on the heading instead — same visual gap, two
  different techniques. Normalized to `mt-6` on the description (one
  technique, not preserved as a variant — this one's cosmetic code
  duplication, not a real design difference).

## Animations

Core GSAP setup ported from the real Astro source — **not yet used by
any component** (nothing built needs it yet, this is just the shared
foundation in place before we do).

- `lib/gsap-init.ts` — registers the ScrollTrigger plugin once. Ported
  verbatim, framework-agnostic.
- `lib/animations.ts` — ported verbatim: `splitChars`/`splitLineChars`
  (per-character reveal spans), `charReveal` (stagger-in from below),
  `magneticHover` (cursor-attraction, no-ops on touch), `curtainReveal`
  (slide-off panel, fires once on scroll), `parallaxElement`
  (scroll-scrubbed vertical parallax). All already `prefers-reduced-
  motion`-aware. Call these from inside a `useEffect` in a Client
  Component — never at module/render scope.
- `components/ui/ScrollReveal` — the one piece that needed a **real
  adaptation, not a straight port**. The Astro source hooked
  `astro:page-load` (re-init the `[data-reveal]` IntersectionObserver +
  `ScrollTrigger.refresh()` on every page) and `astro:before-swap` (kill
  all ScrollTriggers right before the next page's DOM takes over) — View
  Transitions API events that don't exist in Next.js. The App Router
  equivalent: `usePathname()` as a `useEffect` dependency. The effect
  re-runs on every client-side navigation (= page-load), and its cleanup
  — which kills all ScrollTriggers — fires right before that re-run
  (= before-swap). Mounted once in `layout.tsx`, renders nothing.
- `[data-reveal]` CSS (opacity 0 → 1 on `.is-visible`) and the global
  `prefers-reduced-motion` override are both in `globals.css`, confirmed
  from the real source.
- **Stagger delay — restored, deliberately.** The real source authors
  `data-reveal-delay="150"` (concrete ms values) on ~every `[data-reveal]`
  element across the whole site, but — confirmed by grepping the entire
  source — never actually reads it anywhere. No CSS attribute selector,
  no JS. Same for the `data-reveal="fade"/"left"/"scale"` variant values.
  Team decision (2026-09-29): the delay is unambiguous and cheap, so
  `ScrollReveal` now reads `data-reveal-delay` and applies it via a
  `--reveal-delay` CSS custom property (`globals.css`:
  `transition-delay: var(--reveal-delay, 0ms)`). **The `fade`/`left`/
  `scale` variants were NOT restored** — those names imply distinct
  transform treatments, but no actual transform values exist anywhere in
  the source to restore; inventing pixel/scale amounts now would be a
  new design decision, not a restoration. All variants still render as
  the same opacity-only fade until real values are supplied. Flag to the
  client during QA either way, since this is a real, visible behavior
  change vs. the live site (for the better, but still worth a heads-up).
- **Explicitly not ported yet**: the `kenBurns` keyframe (hero-specific,
  will come with the Hero section), the magnetic-cursor effect
  (`Cursor.astro` — already flagged as orphaned/unused in the real
  source anyway). The navbar scroll-shadow toggle was investigated when
  `Header` was built — see "Header & Footer" below, turned out to be
  dead code too, same as `data-reveal-delay`.

## Page transitions — attempted, pulled back out (2026-09-30)

The real source's `<ClientRouter />` (`astro:transitions`) wraps the
browser's native View Transitions API. Confirmed via grep: zero
`transition:animate`/`transition:name`/`transition:persist` directives
anywhere in the source, so it's the *browser's default* crossfade —
per spec, old and new both fade **simultaneously** (~250ms), not
sequentially. Verified this directly against the live site too
(captured the real `::view-transition-old(root)`/`::view-transition-
new(root)` pseudo-elements mid-navigation) — simultaneous, confirmed,
not just spec-assumed.

Built a Framer Motion version (`AnimatePresence` + `motion.div`, keyed
on `usePathname()`, `mode="popLayout"` for true simultaneous overlap
rather than `mode="wait"`'s sequential fade — first attempt used
`wait` and that was visibly wrong, half the point of `popLayout` is
avoiding exactly that). Chose Framer Motion over adding
`next-view-transitions` since framer-motion was already a dependency
(`Glitchy404`).

**Pulled back out, not shipped, because of an unresolved rendering
mismatch**: `getComputedStyle` consistently reported both the exiting
and entering page at real, correct, simultaneously-changing opacity
values mid-transition (confirmed even with the animation artificially
slowed to 3 seconds, removing all timing-precision as a possible
explanation) — but screenshots taken at those exact instants showed
**no visible blend at all**, just an instant cut. Ruled out several
explanations before giving up for now:
- Not a Playwright/headless-Chromium screenshot limitation in general —
  an isolated, minimal Web Animations API crossfade (nothing to do with
  our code) screenshotted correctly at 50/50 opacity.
- Not a missing positioning context for `popLayout`'s `position:
  absolute` exiting element — added `relative` to the `<main>` wrapper,
  no change.
- Full computed-style dump of both elements (visibility, z-index,
  clip-path, transform, filter, isolation, mix-blend-mode, contain,
  background) showed nothing that should hide the exiting element —
  investigation was cut off here by a deliberate decision to stop
  chasing it rather than a resolution.

Whoever picks this back up: start from the full-style-dump approach
(compare exiting vs entering element's computed style, everything, not
just opacity) with real page content rather than placeholder pages —
worth first checking whether this is specific to Next.js dev mode
(Fast Refresh / RSC payload streaming timing) vs a production build,
which wasn't tested. Given the user's own read on it: likely easier to
get right once there's more real content and the placeholder-page
churn has settled down, rather than a good use of time right now.

## Header & Footer

Both built from the real `Navbar.astro`/`Footer.astro`, verified in a
real browser (Playwright: desktop + mobile viewports, active-link
state, mobile menu open/close/scroll-lock/navigate, footer content,
zero console errors) — not just a successful `next build`.

**Header** (`components/layouts/Header`) — `"use client"`, needs
`usePathname()` for active-link state and interactivity for the mobile
menu:
- Split desktop nav (first 3 `navItems` left, rest right) around an
  absolutely-positioned centered logo — confirmed exact structure from
  the real source, not guessed.
- Uses its own `mx-auto max-w-7xl px-6 lg:px-8` container — **not**
  `components/layouts/Container` (which matches `.site-section`/
  `.site-container`, a different, narrower system). Footer is the same:
  full-width with its own custom grid, no `Container`. Confirmed real,
  not an oversight.
- Mobile menu: full-screen slide-in panel, scroll lock via the real
  source's exact fixed-position technique (preserves scroll position on
  close, unlike plain `overflow: hidden`), hamburger/X icon toggle.
- **Real App Router adaptation** (beyond a straight port): the mobile
  menu now also closes on `pathname` change. The real Astro source
  didn't need this — a full page swap always reset DOM state. Our
  `Header` persists across client-side navigations, so without this, a
  stale open menu after browser back/forward would be a real regression
  the App Router introduces that Astro never had. Implemented as a
  conditional state update **during render** (comparing current
  `pathname` to a `prevPathname` state), not inside a `useEffect` —
  React's own recommended pattern for "reset state when a tracked value
  changes" (see "You Might Not Need An Effect" in the React docs).
  `eslint-plugin-react-hooks`'s `set-state-in-effect` rule flags
  `setState` directly in an effect body for exactly this reason (extra
  render cycle); this form doesn't trigger it.
- **Confirmed dead code, not restored**: the navbar scroll-shadow
  toggle. The real source toggles a `nav-scrolled` class on scroll and
  declares `#navbar { transition: box-shadow 0.5s ease; }`, but
  **no CSS rule anywhere defines what `.nav-scrolled` actually looks
  like** — no box-shadow value exists to restore, unlike the
  `data-reveal-delay` case where concrete numbers existed. Implementing
  a shadow now would mean inventing a value, not restoring one — left
  out, flagged here rather than silently dropped.
- Logo asset copied from the real source (`giada-logo.webp`, 328×134px,
  real dimensions read from the file header — not guessed) into
  `public/images/`.
- **Real bug found and fixed, not carried forward** (unlike the
  dead-code cases above): the mobile menu list is vertically centered
  (`flex-col justify-center`) across the *full* panel height, while the
  logo sits above it at a higher z-index (`z-[100]` vs the panel's
  `z-40`). At shorter viewport heights this puts the first link
  ("Products") centered right underneath/behind "GIADA" — reported by
  the user testing against a resized browser window, reproduced at
  480×560, confirmed via actual element bounding-box measurement (not
  just a screenshot look). This is a real, visible defect regardless of
  whether the same code exists in the live site — fixed with `pt-20` on
  the menu's inner wrapper to reserve the navbar's own height, so the
  centered list starts below the logo instead of through it. Verified
  fixed at 480×560 (11px clean gap, measured) with no regression at
  390×844 (the original test size).

**Footer** (`components/layouts/Footer`) — plain Server Component, no
interactivity needed:
- Description, socials (inline SVG icons, copied from the real
  source — generic icon glyphs, no licensing concern unlike the fonts),
  two link columns, two full showroom addresses.
- **Description block full-width on tablet/mobile** (2026-09-30): was
  capped at `max-w-sm`/`sm:max-w-[480px]` at every size, including the
  tablet 2-column tier — user-reported dead space next to the wrapped
  text at 990px. Now `w-full` at base/`sm:`, with the width cap moved to
  `lg:max-w-[480px]` only (desktop's narrower 1.5fr column still wants
  it constrained; tablet/mobile, where it spans the full row, doesn't).
- **Real responsive bug found and fixed, not carried forward** (2026-09-30):
  the real source jumps straight from 1 column to the 4-column desktop
  grid at `md` (768px), with no tablet tier. Confirmed two real problems
  in the 640-1024px range via measured bounding boxes, not just visual
  guessing: a lopsided single column with large dead space next to short
  link lists below 768px, and — just past 768px — 4 columns with nowhere
  near enough room (Contact Us's nested Montréal/Miami split down to
  ~170px, wrapping every word onto its own line). Added a 2-column
  tablet tier (`sm:` 640px+, not in the real source): Description and
  Contact Us each span both columns as full-width rows, Sitemap and
  Company sit side by side. Desktop 4-column layout unchanged, just
  moved from `md` to `lg` (1024px+) — confirmed via re-measurement that
  1024px/1280px render identically to before the fix.
- **Third tier added: `md:grid-cols-3` (768px+), then rebalanced to
  `[1fr_1fr_2fr]`** (2026-09-30, user request, two passes). The `sm:`
  2-column tier above had Contact Us drop to its own full-width row
  below Sitemap/Company — fine at first, but the user wanted all three
  sharing one row at tablet width too, with Description staying on its
  own row above. Added a 3-column tier between `sm:` and `lg:`:
  Description spans all 3 (`md:col-span-3`), Contact Us goes back to 1
  column (`md:col-span-1`, overriding its `sm:col-span-2`), Sitemap/
  Company need no span at any tier (always naturally 1 column).
  First pass used equal thirds (`md:grid-cols-3`) — user immediately
  flagged the wasted space: Company only has 3 short links but got the
  same width as Contact Us, which actually needs it for its nested
  Montréal/Miami split. Rebalanced to `[1fr_1fr_2fr]`, doubling Contact
  Us's share — matches the real ratio already proven at the `lg:` tier
  below (`0.55fr/0.55fr/1.1fr`, same 1:1:2 relationship), not an
  arbitrary new number. Verified across 640–1280px: the `sm:`
  2-column behavior below 768px is unchanged (still needed — 3 columns
  that narrow would reintroduce the word-by-word wrapping bug above),
  all three share a row cleanly from 768px up and the rebalanced ratio
  measurably improved the tightest point (768px: Contact Us went from
  213px to 320px, phone numbers now fit on one line instead of
  wrapping), and the `lg:` 4-column tier at 1024px+ is pixel-identical
  to before.
- **Description's `sm:pr-8` removed** (2026-09-30, user request).
  Right-padding that made sense when Description sat *beside* another
  column — but at every tier below `lg:` it spans the full row width
  with nothing beside it, so the padding was just unused dead space
  eating into the text's width for no reason. `lg:pr-12` untouched
  (still genuinely needed there, Description sits beside Sitemap in
  the real 4-column layout). Confirmed 0px at 768/900px, 48px
  (`lg:pr-12`) still applying at 1280px.
- **Base tier changed from single-column to `grid-cols-2`** (2026-09-30,
  user request): "keep [Sitemap and Company] side by side in mobile they
  can easily fit". Below, the real source (and our own earlier tiers)
  stacked everything in one column down to the smallest width. Sitemap
  and Company are both short link lists, so forcing them to full width
  each was wasted vertical space. Description and Contact Us each get
  `col-span-2` to stay full-width rows (Contact Us still needs the room
  for its nested Montréal/Miami split even on a phone); Sitemap and
  Company sit side by side with no span needed. Verified via
  `getBoundingClientRect` at 320/360/375/390/414/428/599px: all pass,
  same-row top values for Sitemap/Company, no unwanted wrapping — the
  longest Sitemap entry ("Collaborations") stays on one line down to
  320px.
- **Real desktop-breaking bug found and fixed: `sm:col-span-1` never
  compiled into the stylesheet at all** (2026-09-30). Right after the
  base-tier change above, the user reported desktop was visibly broken
  screenshot — Contact Us had dropped to its own row below Sitemap/
  Company instead of sharing the 4-column `lg:` row. Root-caused with
  Playwright, not guessed: `getComputedStyle` on Contact Us's grid item
  showed `grid-column: span 2 / span 2` (its *base* `col-span-2`) at
  every width tested — 800px, 1024px, 1280px, 1920px — meaning its
  `sm:col-span-1` override was never taking effect anywhere, not just at
  `lg:`. Recursively walked every `CSSRule` in every stylesheet looking
  for a `col-span-1` selector: found none. The class was in the JSX as a
  literal static string, same pattern as Description's working
  `sm:col-span-3`/`lg:col-span-1` right next to it, but it simply never
  got generated. Fixed by adding an explicit `lg:col-span-1` alongside
  the existing `sm:col-span-1` (mirroring Description's proven working
  pattern of stating the override at every tier it matters, rather than
  relying on one tier's rule to cascade upward) and saving the file to
  force a fresh compile — re-verified afterward at 800/1024/1280/1920px,
  all four grid children now share one row with the correct track
  widths. **This is likely the same class of issue as the unresolved
  divider discrepancy below** (a Tailwind utility silently not
  generated/applied) — worth remembering if another "measured correct
  but visually wrong" report comes in: check whether the specific
  utility class actually exists in the compiled stylesheet before
  trusting the measurement.
- **Montréal/Miami divider — tried a `::before` pseudo-element
  approach, reverted to the real source's `border-l` (2026-09-30).**
  User reported the divider looked off-center at several points along
  the way (vertical overshoot, then horizontal asymmetry). Each report
  was investigated with real measurements (`getBoundingClientRect`,
  computed styles) and a fresh headless-browser page load — every
  measurement, at every width tested (640px–1920px, on the actual
  `/faq` page), showed the divider exactly centered (symmetric
  top/bottom insets, box widths equal, 10px/10px horizontal gap either
  side). A fresh Playwright screenshot at the same URL/width also showed
  it centered. The discrepancy between that and what the user's own
  browser was showing was never resolved — possibly a stale Fast
  Refresh / Tailwind JIT cache on an arbitrary-value class
  (`-left-2.5`) that didn't exist anywhere else in the codebase before
  this, but not confirmed either way. Rather than keep iterating on an
  unreproducible discrepancy, reverted to the original `border-l
  border-stone-200 pl-5` on the second location div — exactly what the
  real source does. If the "not centered" issue resurfaces against this
  simpler version, that's real signal it wasn't a cache artifact.
- **Sitemap column deliberately differs from the main nav**: includes
  Home, excludes Blog — confirmed real, not a bug. Separate
  `footerSitemapLinks` export in `data/nav.config.ts`, not reused from
  `navItems`.
- **Company column links to 3 new routes** that didn't exist before
  this pass: `/privacy`, `/terms`, `/shipping` — created as placeholder
  pages (same TODO pattern as the rest) so the footer's real links don't
  404. Each placeholder notes the real source's broken "Download PDF"
  link bug (filename mismatch) to fix when real content lands, not
  carry forward.
- **Hash²Code credit removed** — team decision, 2026-09-29. The real
  footer credits the original build agency ("Powered by Hash²Code" +
  logo, linking to hash2code.com); we're the new agency doing this
  migration, so it's gone. Just the copyright line remains.
- **Bottom bar re-centered** (2026-09-30): `justify-between` +
  `max-md:flex-col max-md:items-start` was sized for two items
  (copyright + the now-removed credit link) — with only the copyright
  left, that defaulted it to the far left on every screen. Simplified to
  `justify-center`, one class doing the job instead of three
  now-vestigial responsive ones. Confirmed symmetric (equal left/right
  gap) at 400px/778px/1280px.
- `siteConfig` expanded with real data: full showroom addresses (were
  city+phone only before), the real SEO meta description AND the
  separate, longer footer brand-story paragraph (`footerDescription`) —
  these are two different real pieces of copy for two different
  purposes, confirmed from the source, not conflated.

**Architecture fact worth remembering for every future page**: the
fixed `Header` has no global offset anywhere (no padding on `<main>` in
`layout.tsx`, no `.site-main` CSS rule exists in the real source either
despite the class being used in markup — same "declared, never
implemented" pattern). Each page's own first section carries its own
top padding to clear the fixed navbar: confirmed `pt-24 lg:pt-32` on
`StoryHero`/`LegalDocument` in the real source. The Home page is the
one exception — its hero is deliberately full-bleed under the navbar.
Our current placeholder pages' `py-24` (96px) already happens to clear
the 80px navbar, so nothing's broken yet, but real page sections should
follow the real `pt-24 lg:pt-32` pattern, not assume `Container`'s
default padding is enough.

## 404 page

`src/app/not-found.tsx` + `components/sections/not-found/Glitchy404`.
Ported from the real `pages/404.astro` + `components/ui/Glitchy404.tsx`,
verified in a real browser: canvas confirmed to actually draw content
(76,999 non-transparent pixels, not a blank/failed render), correct
page title, zero unexpected console errors.

- `Glitchy404`: a `<canvas>`-based "fuzzy" static effect drawing a
  hand-authored "404" SVG glyph (precise vector path data, copied
  exactly — not reproducible from a description), each glyph group
  independently shaking via framer-motion (`framer-motion` installed —
  the one dependency in the whole real source that's used by exactly
  this one component).
- **Real Next.js adaptation, not a straight port**: the real source
  uses Astro's `client:only="react"` for this component — skips SSR
  entirely. Not optional here either: `Glitchy404` calls `Math.random()`
  during render (per-glyph shake delay), so a server render and the
  first client render would produce different values and React would
  flag a hydration mismatch. The direct Next.js equivalent is
  `next/dynamic(() => import(...), { ssr: false })`, done in the
  component's own `index.ts` barrel (marked `"use client"`, since
  `ssr: false` can't be called from a Server Component's module graph).
  `not-found.tsx` itself stays a plain Server Component — it just
  renders the already-client-wrapped default export normally.
- Real TypeScript error hit and fixed while porting: `ease: "easeInOut"`
  infers as plain `string`, which this framer-motion version's stricter
  `Easing` type rejects. Likely present in the real source too but never
  caught — Astro's build doesn't run a blocking `tsc` check the way
  `next build` does. Fixed with `as const` (same treatment the source
  already gives `repeatType: "loop" as const` right next to it) — purely
  a type-level fix, zero behavior change.
- Title set via `{ absolute: "Page Not Found — Giada" }` to bypass the
  root layout's `"%s | Giada"` template and match the real source's
  literal title exactly, rather than producing "Page Not Found | Giada".
- Uses `min-h-[calc(100vh-5rem)]` (5rem = the fixed navbar's `h-20`) to
  clear the navbar — a different technique than the `pt-24 lg:pt-32`
  pattern other pages use, confirmed from the real source. Works here
  since it's one centered block, not a tall list (contrast with the
  Header mobile-menu overlap bug, where the same class of "shrink instead
  of offset" approach broke at short viewport heights — this page has
  much less content so the risk is lower, but it's the same category of
  technique, worth remembering if this page ever grows).

## Accordion & FAQ

`components/ui/Accordion` (generic primitive) +
`components/sections/faq/FaqHeroSection` +
`components/sections/faq/FaqListSection` + `app/faq/page.tsx` (thin
composition) + `lib/api/faq.ts` (page data). Verified in a real browser:
default-open first item, single-open-at-a-time switching (opening one
closes any other), toggle-off, all 8 accordion rows and all 8
`FAQPage` schema entries present, zero console errors — not just a
successful build.

- **Retrofitted to the same API-ready architecture as Contact**
  (2026-10-01, standing rule — see [[feedback_api_ready_page_architecture]]
  in memory). First built with the hero markup and the
  `Accordion`+container both directly in `page.tsx`, reading
  `data/faq.ts` straight in; that predated the Contact-page refactor
  that established the pattern as a rule, not a one-off. `page.tsx` now
  just `await getFaqPage()`s and renders `<FaqHeroSection {...hero} />`
  + `<FaqListSection items={items} />`. `data/faq.ts` removed — its
  content folded directly into `lib/api/faq.ts`, same as Contact's copy
  living in `lib/api/contact.ts` rather than a separate `data/contact.ts`
  (neither file was ever consumed anywhere except its own page).
- **`Accordion` is a generic primitive, not FAQ-specific** — its own
  `AccordionItem` shape (`id?`, `title`, `content`), decoupled from
  `FaqItem`. `FaqListSection` maps the FAQ domain shape into that generic
  shape when rendering; reusable later for legal-page sections or
  product specs without pulling in the FAQ domain.
- **One deliberate improvement over a straight port**: the real source
  animates the expand/collapse via a hardcoded `max-height: 500px` —
  clips anything longer. Since this component is meant to be reused (not
  every future use case is guaranteed to fit under 500px), it uses the
  CSS grid-rows trick (`grid-template-rows: 0fr -> 1fr`) instead — same
  visual result, no arbitrary length ceiling, no JS height measurement.
- Real content (now in `lib/api/faq.ts`): the 8 real Q&As, confirmed
  from `pages/faq.astro` — currently hardcoded there too, not
  CMS-driven. Typed against `FaqItem` (`question`/`answer`, not the
  source's `q`/`a`) — kept consistent with the rest of this project
  rather than matching the source's field names.
- `FAQPage` JSON-LD still built in `page.tsx` directly from the `items`
  `getFaqPage()` returns (one source of truth, can't drift out of sync
  with the visible content) — same split Contact's `LocalBusiness`
  schema uses, SEO schema-building stays page-level, not a component prop.
- **Not included yet**: the real source ends with a `ContactCTA` strip
  ("Still Have Questions?") — that shared component doesn't exist yet,
  noted as a TODO in `FaqListSection` rather than built as a one-off here.

## Testimonial book (Client Notes)

`components/ui/TestimonialBook` (reusable primitive) +
`components/sections/home/Testimonials` (Home page section shell,
prop-driven) + `lib/api/home.ts` (page data). Ported from the real
source's `components/home/Testimonials.astro` — a genuine 3D CSS
page-flip "book," not a plain slider. Verified in a real browser
(Playwright):
forward flip animation mid-transition (logo correctly sweeps into view
on the turning page's back face), landing on the right testimonial
after each flip, `Next`/`Prev` disabled correctly at both ends, and
stepping all the way back to the first page — zero console errors.

- **`TestimonialBook` is a generic primitive, same philosophy as
  `Accordion`** — takes a plain `testimonials: Testimonial[]` prop, no
  page/section knowledge (heading, border, padding all live in the Home
  page's `Testimonials` wrapper instead). Reusable wherever else a
  testimonial carousel is needed later without dragging that chrome
  along.
- **First CSS Module in this codebase** (`TestimonialBook.module.css`),
  everything else so far is Tailwind. Deliberate exception: the real
  gradients, spine shadows, `preserve-3d` flip transform, and
  `clamp()` type sizing are genuinely bespoke and would be unreadable
  forced into utility classes.
- **State ported from the source's imperative DOM script to React
  state**, not copied as an effect wrapping the original JS verbatim.
  The source directly mutates `classList`/`style.zIndex` on raw DOM
  nodes; the port derives each page's `is-flipped`/`is-turning`
  class and z-index from `current`/`turning` state on every render
  instead. One correctness detail that took a second pass: `goNext`/
  `goPrev` must not depend on the `current` state value directly (via a
  `useCallback` dependency), or their identity changes on every flip,
  which re-triggers the autoplay `useEffect` and restarts the 6s
  interval after every flip instead of running one persistent timer —
  fixed by reading/writing `current` through a ref inside those
  callbacks instead, matching the real source's flat, uninterrupted
  `setInterval` cadence.
- **Real quirk kept, not "fixed"**: clicking a dot doesn't jump straight
  to that page — it only steps one flip toward it (confirmed in the
  real source's `goto` handler: `if (i > flipped) goNext()`, no direct
  jump). Ported faithfully rather than "improved."
- **Real logo assets copied in** (`public/images/testimonials/`), not
  placeholders — byte-diffed identical against the source files.
  `logoWidth`/`logoHeight` on each `Testimonial` are each file's actual
  measured pixel dimensions (via `sharp`, not guessed), required by
  `next/image` to avoid layout shift. Worth knowing: despite the
  `.webp` extension on all three, `testimonial-fam.webp` is actually
  HEIF-encoded and `testimonial-kelli-richards.webp` is actually a GIF
  (confirmed from file contents, not the extension) — harmless since
  browsers sniff real content, but a trap for any future
  image-processing step that trusts the extension.
- `src/types/testimonial.ts` replaced outright — the pre-existing
  `Testimonial` type (`{ id, name, role?, quote, avatar? }`) predated
  the real ZIP and didn't match the actual shape at all (no `role`/
  `avatar` in the source; real fields are `quote, name, company, logo,
  logoInvert`). Not used anywhere else in the codebase yet, safe to
  replace rather than extend.
- **`Testimonials` retrofitted to the same API-ready architecture as
  Contact and FAQ** (2026-10-01, standing rule — see
  [[feedback_api_ready_page_architecture]]). It took zero props at
  first (imported `data/testimonials.ts` and hardcoded the "What
  Designers Say"/"Client Notes" copy directly) — predated the rule.
  Now takes `eyebrow`/`heading`/`testimonials` via
  `TestimonialsSectionProps`; `data/testimonials.ts` removed, its
  content folded into `lib/api/home.ts`'s `getHomePage()`. `TestimonialBook`
  itself was already correctly prop-driven from the start and needed no
  changes. Home page itself still isn't composed (`app/page.tsx` is
  still a placeholder, doesn't call `getHomePage()` or render
  `Testimonials` — that's a separate, not-yet-made decision), but the
  section is now fully ready for whenever it is, same as every other
  section in this project.

## Contact page

`app/contact/page.tsx` (thin composition) + `app/contact/success/page.tsx`
+ `lib/api/contact.ts` (page data) + two section components —
`components/sections/contact/ContactHeroSection` (title/lead + the
`EnquiryForm` grid) and `components/sections/contact/ShowroomSection`
("Visit & Enquiries": intro, general contact row, showroom cards) — plus
the pre-existing `components/sections/contact/EnquiryForm`. Ported from
the real source's `components/contact/ContactMain.astro` +
`pages/contact/success.astro`. Verified in a real browser: page renders
with no console errors, both `LocalBusiness` JSON-LD blocks present and
correctly populated, GSAP field-stagger animation, and mobile stacking
(single column, showroom cards still readable) all confirmed — including
catching and correcting a false-positive first screenshot (title/lead
looked blank at a 300ms wait, turned out to just be the `[data-reveal]`
fade still mid-transition, not a real bug — confirmed by re-shooting at
1500ms).

- **Refactored into section components + a data layer, matching the
  Torque Pharma project's architecture** (2026-10-01, explicit request —
  the page was first built with every section's markup directly in
  `page.tsx`). `page.tsx` is now just composition: it awaits
  `getContactPage()` and spreads each returned slice into its section
  component (`<ContactHeroSection {...hero} />`,
  `<ShowroomSection {...visit} />`), same shape as Torque's
  `const { info, enquiry, cta } = await getContactPage(); ...
  <ContactInfoSection {...info} />`. `lib/api/contact.ts` exports an
  `async getContactPage(): Promise<ContactPageData>` that currently just
  returns static data (real copy, not placeholder) instead of calling
  Laravel — but the function is already `async`, already the single
  place that assembles the page's props, and already returns the exact
  shape the components expect. Swapping its body for
  `apiFetch<...>("/pages/contact")` (the fetcher already exists,
  `lib/api/fetcher.ts`, ported from Torque earlier but unused until now)
  should be the only change needed later — `page.tsx` and both section
  components stay untouched.
- **`lib/api/contact.ts` declares its own `ContactHeroData`/
  `ShowroomSectionData`/etc. types — it does not import the section
  components' prop types.** First pass did import them directly
  (`ContactPageData = { hero: ContactHeroSectionProps; ... }`), which
  felt safer against drift but actually had the dependency pointing the
  wrong way — the data layer depending on the UI layer, backwards from
  Torque's actual pattern (its `lib/api/contact.ts` defines `ContactPageData`
  independently; components declare their own separate props). Fixed
  2026-10-01: the two shapes are now declared separately and only need to
  stay structurally compatible — TypeScript still catches any mismatch at
  the `<ContactHeroSection {...hero} />` spread call site in `page.tsx`,
  confirmed by a clean build after the change, so nothing was actually
  lost by not sharing the type.
- **`EnquiryForm` deliberately left alone, not folded into a section
  component** — it's interactive and self-contained (its own state,
  submit handler, field markup), not page content to pass as props, same
  treatment Torque gives `ManufacturingForm`/`ExportForm` inside
  `EnquirySupportSection` (rendered as a plain child, not prop-driven).
  `ContactHeroSection` renders it directly.
- **No generic `Section`/`Container` layout wrapper introduced** —
  Torque's `contact-us/page.tsx` wraps each section in its own
  `<Section><Container>` layout primitives, but this project has never
  used that pattern (every real page here matches the Astro source's
  actual wrapper classes directly, e.g. Footer, FAQ). Adding a generic
  Section/Container layer now would be a bigger architectural change
  than what was asked (component boundaries + a data layer) and wasn't
  requested — the outer `<section className="bg-white px-5 pb-0
  pt-24...">` + `max-w-6xl` wrapper stays directly in `page.tsx`, same as
  every other real page in this project.
- **Studio Hours kept as `{ days, hours }`, not one string** — the real
  design renders a different separator between them per breakpoint (a
  `<br>` on mobile, `" · "` from `sm:` up). A single combined string prop
  would lose that distinction without `ShowroomSection` special-casing
  its own content, so the two pieces stay separate in
  `GeneralContactInfo` — still a clean, CMS-shaped prop, just not
  artificially flattened.
- **`region`/`postalCode` stay out of `ShowroomSection`'s props** — those
  two fields exist on `siteConfig.locations` only for the `LocalBusiness`
  JSON-LD schema; `ShowroomSection` never renders them, so they're not
  part of its `ShowroomLocation` prop shape. `page.tsx` builds the schema
  straight from `siteConfig.locations` instead of from the trimmed
  `visit.locations` prop — same split FAQ's page already uses (`faqSchema`
  built directly from `data/faq.ts`, not routed through a component prop).
- **`ContactHero.astro` confirmed dead code, not ported** — exists in the
  real source's `components/contact/` folder but isn't imported by
  `contact.astro` or anywhere else (grepped the whole source). Real
  source's actual hero content is inline in `ContactMain.astro` instead.
- **`siteConfig.locations` extended, not duplicated into a new file** —
  the showroom cards and `LocalBusiness` schema need `type`, `region`,
  `postalCode`, `mapUrl`, `geo` that Footer never needed. Added as extra
  fields on the existing `siteConfig.locations` (Footer only reads
  `city`/`lines`/`phone`/`phoneHref`, unaffected) rather than a second,
  overlapping data source that could drift from the Footer's copy.
- **City-slug quirk kept, not "fixed"**: the real source's
  `LocalBusiness` `@id` slugifies via `.replace(/[^a-z]/g, "")` — an
  ASCII-only pattern that strips the accented "é" in "Montréal" too,
  producing `montral` rather than `montreal`. Kept exactly as the real
  source does it; it's an internal schema id, not user-visible, and
  matching the real behavior beats guessing a "nicer" slug.
- **`EnquiryForm` updated to actually redirect on success** — it
  previously showed an inline "Thanks" message with a TODO noting the
  real source navigates to a dedicated `/contact/success` page that
  didn't exist yet in this project. That page now exists, so the form
  uses `useRouter().push("/contact/success")` on a successful submit,
  matching the real source's `navigate('/contact/success')` (Astro's
  View Transitions client nav — the direct Next.js equivalent, no
  transition system of our own since the page-transition attempt was
  dropped, see "Page transitions" below).
- **GSAP field-stagger animation ported into `EnquiryForm` directly**,
  not left out — the real source's inline `<script>` in `contact.astro`
  staggers every input/select/textarea/submit-button in from the left
  (`x: -20 → 0`, 0.08s stagger, ScrollTrigger `top 80%`, once) on top of
  the generic `[data-reveal]` fade already wrapping the form section.
  Scoped to a `useEffect` + `formRef` inside the component instead of a
  global page script, same pattern as `TestimonialBook`'s self-contained
  animation.
- **Cloudflare Turnstile not wired up** — same as before this page was
  built out: the real source gates submission on a Turnstile token, but
  its site key is empty even in the live site (non-functional there
  too). Anti-spam approach is still an open decision, noted as a TODO in
  the form rather than faked.
- **`/contact/success`'s "Explore the Collection" link points to
  `/products`, not `/rugs`** — the real source links `/rugs` (the live
  site's actual product-listing URL), but this project's established
  route for that page is `/products` (see `data/nav.config.ts`,
  decided earlier in the project). Kept internally consistent with the
  rest of this codebase rather than matching the real source's literal
  href.
- `noindex` set via Next's `metadata.robots` on the success page,
  equivalent to the real source's `<Layout noindex={true}>` prop.

## CMS

Confirmed: no headless CMS on the current site (plain Astro, static
build, content hardcoded/local). Laravel is introducing a CMS for the
first time — no data export/migration from a third-party CMS needed,
but all current content has to be manually extracted from the Astro
source and re-entered once the Laravel admin exists.

## Astro source audit (`giada-studio.com-handover.zip`, extracted 2026-09-29)

Full analysis done, extracted source kept out of this repo (scratch
dir only). Key facts that change/confirm the plan:

- **Stack**: Astro 6 + React 19 + Tailwind v4, Vercel adapter
  (`output: "server"` but every page except `/api/contact` is
  prerendered — effectively static). GSAP for animation, Resend for
  email, only **one** real React island in the whole site
  (`Glitchy404` on the 404 page, `client:only="react"`).
- **Content model**: only blog is a real Astro content collection
  (Zod schema, MDX files: `title, description, pubDate, image, author`).
  Products (75 files, all `category: "Rug"` — zero Glass product data
  exists yet), collaborations (2 files), gallery (1 JSON, 16 images) are
  all ad-hoc JSON with **no schema validation anywhere** — Laravel is
  designing these from scratch.
- **`/glass` is a hardcoded "coming soon" marketing page**, not
  data-driven. `/rugs` is the real filterable product listing. `/products`
  is just a 2-tile hub linking to both.
- **Legacy redirect map**: `astro.config.mjs` has a large hardcoded 301
  table from the old WordPress/WooCommerce site — must be ported to
  `next.config.ts` redirects (or middleware) or SEO equity is lost on
  cutover.
- **Nav confirmed matches** what's already built: flat, no dropdowns —
  Products/Collaborations/Gallery — logo — Our Story/Blog/FAQ/Contact.
  Footer omits Blog from its "Sitemap" link group (intentional, carry
  over) and lists Privacy/Terms/Shipping under "Company," plus both
  showrooms inline. Footer currently credits the original build agency
  ("Powered by Hash²Code") — remove/replace on migration.
- **Pre-existing bugs found in the live site** (flag to client, fix
  during migration rather than port as-is):
  1. Contact form (`pages/api/contact.ts`) has hardcoded **empty**
     Resend API key + Turnstile secret/site keys — cannot send email as
     shipped. Recommend Laravel owns email sending entirely instead
     (Next Server Action → Laravel validates + emails + stores), rather
     than reintroducing Resend directly in the frontend.
  2. Newsletter signup (`StayInTouch.astro`) has no action/handler —
     decorative only.
  3. All three legal-page "Download PDF" buttons 404 — `pdfPath`
     constants are missing the word "Studio" vs. the real filenames in
     `public/`.
  4. `arrow-band.json` product: `title: "Cadence"` doesn't match its
     slug/filename.
  5. Product `collection: "Traverse"` (2 products) has no matching file
     under `collaborations/` — orphaned reference, ask the client if
     it's a real upcoming collection.
- **Dead/orphaned code found** (skip porting unless client asks):
  `Cursor.astro` (magnetic cursor), `ContactHero.astro`, `OurClients.astro`,
  `VideoPlayer.astro`, `CategoryCards.tsx` + `spotlight-card.tsx`
  (`GlowCard`). Also unused deps in `package.json`: `next`, `lenis`,
  `axios`, `decap-cms-app`, `impeccable` — that last one plus a sitemap
  filter for `/hash2code/admin` hints the original agency may have had a
  git-based CMS admin not included in this handover — worth asking about.
- **No analytics anywhere** in the current site (no GA/GTM/Pixel) —
  ask if the client wants it added, since it's not just "missing from
  the handover."

## Env vars

See `.env.example`.
- `API_URL` — Laravel API base URL. Server-only (no `NEXT_PUBLIC_`
  prefix) since all fetching happens server-side.
- `REVALIDATE_SECRET` — shared secret Laravel sends when calling
  `POST /api/revalidate` to bust the ISR cache for a tag.

## Next steps

1. Resolve open decisions with the client (see "Astro source audit"):
   contact form architecture, FAQ/testimonials CMS-editable or static,
   newsletter real-or-drop, the cream color question, the "Traverse"
   collection, redirect map completeness, analytics.
2. Agree the Laravel API contract with the backend dev (resource shapes
   for products, gallery, blog, FAQ, testimonials, enquiries — real
   field lists now known from the audit) and update `types/*` + add
   per-resource files under `lib/api/` to match.
3. Port the legacy redirect table into `next.config.ts`.
4. Build `components/sections/{page}/*` for each page using the real
   Astro source as reference; extract shared pieces into
   `components/ui/*` once a second real use case shows up (not before).
5. Port `lib/animations.ts`'s GSAP utilities (char reveal, magnetic
   hover, curtain reveal, parallax) and the `[data-reveal]`
   IntersectionObserver system as shared Client Component helpers.
6. Replace placeholder copy in every `app/**/page.tsx` with real content,
   fixing the pre-existing bugs found along the way rather than
   preserving them.
