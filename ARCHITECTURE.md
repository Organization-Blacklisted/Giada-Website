# Giada — Next.js + Payload

Migration target for giada-studio.com (currently Astro) + a Payload CMS
backend (embedded in this same Next.js app, backed by Neon Postgres).
Originally scoped with a separate Laravel backend — switched to Payload
2026-10-06 after a cost/timeline pitch to the client was approved; see
"CMS" below for the full reasoning. This doc is the shared reference for
the project — keep it updated as decisions get made.

## Status

- [x] Astro source ZIP received and audited (`giada-studio.com-handover.zip`, 2026-09-29 — see "Astro source audit" below)
- [x] Real fonts wired up (`next/font/local`, exact weight/style mapping from the real source)
- [x] GSAP installed + `gsap-init.ts`/`animations.ts`/`[data-reveal]` ported (see "Design tokens" → "Animations")
- [x] Real Header + Footer built (see "Header & Footer" below) — verified in a real browser (Playwright), not just build success
- [x] 404 page built (`Glitchy404` canvas + framer-motion effect) — see "404 page" below, verified rendering real canvas content in a real browser
- [x] FAQ page built (`Accordion` UI primitive + real content) — see "Accordion & FAQ" below, verified interaction behavior in a real browser
- [x] `TestimonialBook` UI primitive built (3D page-flip "Client Notes" carousel) — see "Testimonial book (Client Notes)" below, verified real forward/backward flip animation in a real browser. Wired into the real Home page 2026-10-05
- [x] Real favicon (`src/app/favicon.ico` replaced with the real Giada one from the Astro source's `public/favicon.ico` — byte-for-byte identical, confirmed by diffing the actually-served file, not just copying and assuming)
- [x] Contact page built in full (title/lead, `EnquiryForm`, showroom section with map embeds, `/contact/success`) — see "Contact page" below, verified in a real browser including the GSAP field-stagger animation and mobile stacking
- [x] Contact/FAQ/Home retrofitted to a consistent API-ready architecture — `lib/api/<page>.ts` mock-data layer + thin `page.tsx` + prop-driven section components, standing rule for every page from now on (2026-10-01)
- [x] Image reel (craftsmanship photo strip) built, GSAP-driven infinite scroll — see "Image reel (craftsmanship strip)" below. Home page now has two real sections (Testimonials + Image reel), rest still placeholder
- [x] Category grid (Rugs/Glass) built — `CategoryCard` reusable primitive + Home's `CategoryGridSection` + the Products page built out for real (`ProductCategoriesSection`) — see "Category grid (Rugs / Glass)" below. Products page is no longer a placeholder (though full catalog/filtering by category isn't built yet)
- [x] Hero slideshow built (`HeroSlideshowSection`) — GSAP entrance timeline, character-split title, Ken Burns, scroll parallax, full carousel machinery (currently one real slide, matching the real source) — see "Hero slideshow" below.
- [x] Press feature built (`ZoomCard` reusable primitive + `PressFeatureSection`) — cursor-tracked magnifying zoom, verified via measured `transform`/`transform-origin`, not just visual — see "Press feature (zoom cards)" below. Home now has five real sections, in real page order
- [x] Page-transition crossfade shipped (`next-view-transitions`, real browser View Transitions API) — see "Page transitions" below. Two prior Framer Motion attempts failed for a confirmed structural reason (App Router's single `children` slot isn't a stable snapshot); switching to the real browser API the live site itself uses resolved it
- [x] Backend switched from Laravel to Payload + Neon, approved by the client 2026-10-06 (see "CMS" below)
- [x] Payload installed into this same Next.js app (not a separate project) — `(frontend)`/`(payload)` route-group split, `payload.config.ts`, `Users`/`Media` starter collections, admin panel reachable at `/admin` — see "Folder structure" below. Verified via a real build + server, not just "it compiled": full site still renders with zero console errors, `/api/revalidate` and Payload's own `/api/[...slug]` coexist without conflict, `robots.txt`/`sitemap.xml` both still generate correctly post-restructure
- [x] Collection section built (`CollectionSection`, image + text, second section on Home) — see "Collection (image + text, Home second section)" below. Home now has six real sections, in real page order
- [x] Process strip built (`ProcessStripSection`, 5-step "Crafted With Purpose", fourth section on Home) — see "Process strip (5-step "Crafted With Purpose")" below. Home now has seven real sections, in real page order
- [x] Why Giada built (`WhyGiadaSection`, 3 pillars + closing hover-zoom image, sixth section on Home) — see "Why Giada (pillars + closing image)" below. Home page matches the real source's complete section order: HeroSlideshow, Collection, CategoryGrid, ProcessStrip, PressFeature, WhyGiada, Testimonials, ClosingCTA, ImageBar
- [x] Values section built (`ValuesSection`, "Living Art Beyond Simple Decor") — see "Values section (\"Living Art Beyond Simple Decor\") — first client-designed section" below. **First section built from new client-provided Figma content rather than the real Astro source** — placed between CategoryGrid and ProcessStrip, built as a genuine reusable `ui/` primitive from the start per explicit client instruction (for eventual reuse on Our Story's real "Values That Endure" section)
- [ ] Neon database created (client-owned org, per the agency's multi-project Neon plan) and `DATABASE_URL` set — `/admin` 500s until this exists, confirmed expected behavior, not a bug
- [ ] Real content model/collections designed for Products, Collaborations, Gallery, Blog, FAQ, Testimonials, Enquiries
- [ ] Real content ported page by page
- [ ] Enquiry form wired to Payload (still posts to a guessed `/enquiries` path against a Laravel API that no longer exists — see "Contact page" below; needs an Enquiries collection + a Local API call)
- [ ] SEO parity check (metadata, sitemap, 301s from old URLs — legacy redirect table found in the Astro source, needs porting) — see "SEO" section below for the current audit (what's real vs. gaps), deferred by explicit request
- [ ] Staging deploy / client UAT
- [ ] Launch

## Stack

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS v4
- GSAP — matches the real Astro source's animation library. Core setup
  ported (`lib/gsap-init.ts`, `lib/animations.ts`, scroll-reveal system)
  — not yet used by any real component (nothing built that needs it yet).
- Backend: Payload CMS, embedded directly in this Next.js app (not a
  separate repo/server) — CMS + API only, no cart/checkout (confirmed:
  the live site is inquiry-based, not e-commerce). Switched from an
  originally-planned separate Laravel backend after a pitch comparing
  build time (~1.5-2.5 weeks for Payload vs. ~4-6 for an equivalent
  hand-built Laravel backend) and stack fit (TypeScript end-to-end,
  same as the frontend) — approved by the client 2026-10-06.
- Database: Neon (serverless Postgres), also used for file/media storage
  (Object Storage, S3-compatible) — one vendor for both instead of a
  separate blob-storage service. Account created under the agency's own
  Neon organization, not the client's — see "CMS" below for why, and the
  claimable-project plan for eventually handing ownership to the client.
- Data fetching inside Next.js uses Payload's **Local API** (direct
  typed function calls into the database, no HTTP round-trip) for
  server-rendered pages, since Payload runs in-process — not REST calls
  the way a separate Laravel backend would have required. Payload's own
  REST/GraphQL endpoints (`/api/*`) still exist and are used only where
  something is genuinely external (client-side fetches after page load,
  the enquiry form submission, any future third-party/mobile consumer).

## Folder structure

`src/` layout, matching the structure used on a previous Next.js project
(Torque Pharma) — `@/*` maps to `./src/*` (see `tsconfig.json`).

Two Next.js route groups split the app in two, each with its own root
layout — required because Payload's admin panel needs full control over
its own `<html>`/`<body>` (its own fonts/styles/providers), completely
separate from Giada's own site shell. Route groups are just folders in
parentheses — they don't appear in the URL, so moving every existing
page into `(frontend)/` changed zero URLs.

```
src/app/
  (frontend)/               Giada's actual site — everything that existed
                             before Payload, unchanged in content, just
                             moved into this group
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
    api/revalidate/route.ts   Payload → Next ISR cache-busting webhook
    globals.css                Imports styles/*, base :root/body only
  (payload)/                Generated by installing Payload — admin panel
                             + API, own root layout/providers, mostly
                             "modify at your own risk" generated files
    layout.tsx                 Payload's own RootLayout/providers
    admin/[[...segments]]/     The actual /admin dashboard
    api/[...slug]/route.ts     Payload's REST API (/api/*)
    api/graphql/, api/graphql-playground/   Not used by the app yet;
                             kept since they're free and may help
                             exploring the schema during development
  robots.ts / sitemap.ts /  Must live at this true app root, NOT inside
  favicon.ico                either route group. Confirmed the hard way,
                             twice: robots.ts silently stopped generating
                             when nested in (frontend)/ (a known Next.js
                             quirk — sitemap.ts works fine nested, robots.ts
                             doesn't), and separately favicon.ico 404'd
                             after the same move (user caught it live —
                             "our favicon is not showing"). Both are
                             Next.js file-convention routes resolved at
                             the true app root regardless of route
                             groups; moved both to the root for
                             consistency. Worth assuming any other
                             file-convention route (icon.tsx, apple-icon,
                             manifest.ts, if ever added) needs the same
                             treatment rather than re-discovering this a
                             third time.

src/components/
  layouts/                  Header, Footer, Container — one folder each:
                             ComponentName.tsx (+ .types.ts if it takes
                             props) + index.ts barrel export
  sections/{page}/          Page-specific composed sections, same
                             per-component-folder convention.
  ui/ScrollReveal/          Mounted once in layout.tsx. Sets up the
                             [data-reveal] IntersectionObserver +
                             ScrollTrigger.refresh() on every page — see
                             "Animations" below.
  ui/SectionHeading/        Eyebrow + Didot heading + optional
                             description — confirmed repeated verbatim
                             across 5 real sections, see "Design tokens"
                             below.
  ui/Accordion/              Generic single-open-at-a-time accordion,
                             not FAQ-specific — see "Accordion & FAQ"

src/collections/           Payload collection configs — one file per
                             content type, registered in payload.config.ts.
  Users.ts                   Admin auth collection (required by Payload,
                             not a Giada content type)
  Media.ts                   Uploads collection every other collection's
                             images will relate to. Deliberately simpler
                             than Payload's own blank-template default —
                             no Folders/Tags organizational layer, not
                             needed at this content volume yet.
  (Products.ts, Collaborations.ts, Gallery.ts, Blog.ts, Faq.ts,
  Testimonials.ts, Enquiries.ts — not built yet, next real step)

src/payload.config.ts      Registers collections, the Postgres (Neon) db
                             adapter, the rich text editor, and the
                             generated-types output path. `@payload-config`
                             resolves here via a tsconfig path alias.

src/data/
  nav.config.ts              Typed nav items
  site.ts                    Site name/description/url/social/locations

src/fonts/
  avenir/, didot/            Real licensed .otf files (from the Astro
                             handover ZIP, not copied off the live site)
  index.ts                   next/font/local — see "Design tokens"

src/lib/
  actions/enquiry.ts          "use server" — submitEnquiry(), still posts
                             to a guessed /enquiries path against an
                             API_URL env var that no longer exists (left
                             over from the Laravel plan). Never actually
                             worked — no backend has existed to receive
                             it yet — so nothing new broke; real fix is a
                             Payload Local API call once an Enquiries
                             collection exists. `lib/api/fetcher.ts` (the
                             old retry/backoff REST client built for a
                             Laravel API) was removed 2026-10-06 — fully
                             unused, and Payload's Local API replaces the
                             need for an HTTP client in the common case.
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
                             the live site, not the real Payload schema
```

## Conventions

- Use `font-heading` / `font-body` in components, never `font-didot` /
  `font-avenir` directly — see "Design tokens" for why.
- Server Components by default. Only add `"use client"` where actual
  interactivity is needed (forms, carousels, anything with state/effects)
  — this mirrors Astro's islands model, just via Next's client boundary
  instead.
- Data fetching happens in Server Components / Server Actions, calling
  `lib/api/*`, which calls Payload's Local API directly (same process,
  no HTTP) — never call Payload from inside a Client Component.
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
  the backend should own email sending entirely instead (originally
  planned as Laravel, now Payload — see "CMS" below). This component
  still calls the `submitEnquiry` Server Action in `lib/actions/enquiry.ts`
  — endpoint path is a guess pending a real Enquiries collection — and
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
- **Stagger delay — restored 2026-09-29, reverted 2026-10-05.** The real
  source authors `data-reveal-delay="150"` (concrete ms values) on
  ~every `[data-reveal]` element across the whole site, but — confirmed
  by grepping the entire source at the time — never actually reads it
  anywhere. No CSS attribute selector, no JS. Team decision (2026-09-29):
  the delay values are unambiguous and cheap, so `ScrollReveal` was given
  a `--reveal-delay` CSS custom property (`globals.css`:
  `transition-delay: var(--reveal-delay, 0ms)`) reading each element's
  `data-reveal-delay` and applying it as a real stagger — framed as a
  deliberate enhancement over source fidelity.
  **Reverted after user feedback (2026-10-05):** caught the FAQ closing
  CTA band fading in item-by-item on this site while the live FAQ page
  fades the whole band in together. Re-investigated by reading the real
  reveal script directly this time, not just grepping for absence of a
  consumer — `layouts/Layout.astro`'s `initFadeReveal()` observes every
  `[data-reveal]` element with its own independent `IntersectionObserver`
  entry and adds `.is-visible` the instant *that* element crosses the
  0.12 threshold, full stop. There is no grouping and no delay concept
  anywhere in the real mechanism. Elements that are visually close
  together (an eyebrow + heading + description block, a tight card grid)
  already read as "fading together" under this plain model, since they
  cross the threshold within the same frame or two during a normal
  scroll — the delay was never needed to produce that effect, and in
  practice it actively fought it. Reverted project-wide: removed the
  `--reveal-delay`-reading code from `ScrollReveal.tsx`, removed
  `transition-delay` from `globals.css`'s `[data-reveal]` rule, and
  stripped the now-dead `data-reveal-delay` attributes from every
  consumer (`SectionHeading`, `PressFeatureSection`, `CategoryGridSection`,
  `ContactHeroSection`, `ContactCtaBanner`, the 404 page, and the
  contact-success page). Verified in a real browser across Home, FAQ,
  Contact, Contact Success, and 404: zero `data-reveal-delay` attributes
  or `--reveal-delay` custom properties remain anywhere, and every
  section still fades in correctly.
  **The `fade`/`left`/`scale` variants were never restored** — those
  names imply distinct transform treatments, but no actual transform
  values exist anywhere in the source to restore; inventing pixel/scale
  amounts now would be a new design decision, not a restoration. All
  variants still render as the same opacity-only fade.
- **Explicitly not ported yet**: the `kenBurns` keyframe (hero-specific,
  will come with the Hero section), the magnetic-cursor effect
  (`Cursor.astro` — already flagged as orphaned/unused in the real
  source anyway). The navbar scroll-shadow toggle was investigated when
  `Header` was built — see "Header & Footer" below, turned out to be
  dead code too, same as `data-reveal-delay`.

## Page transitions (2026-09-30 attempted, 2026-10-05 shipped)

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

### Second attempt (2026-10-05) — root cause actually found this time

Picked back up once there was enough real content to test against (per
the note above). Confirmed first that it's **not a dev-mode artifact**:
rebuilt with `next build && next start` and the exact same symptom
reproduced in production.

Went further than computed-style sampling this time — looked at actual
screenshots across the full transition, not just opacity numbers. That's
what cracked it: **at every single sampled frame, both the "exiting" and
"entering" layers showed the destination page's content. Home never
appeared once, at any opacity, in any frame.** The "exiting" element's
opacity genuinely was animating 1→0 exactly as `getComputedStyle` always
said — it just happened to be animating the wrong *content* out, not the
wrong *opacity*. Cross-fading two copies of the same page is visually
indistinguishable from not cross-fading at all, which is exactly what
"opacity correct, no visible blend" looks like from outside.

**Root cause**: Next.js App Router's root layout only ever exposes one
`children` slot. `usePathname()` and `children` update together,
atomically, in the same commit when a route changes — there is no
intermediate render where you can observe "old pathname paired with old
content" separately from "new pathname paired with new content". Tried
the obvious fix — manually snapshot `children` into local React state
the instant the route changes (same "adjust state during render"
pattern `Header.tsx` already uses, verified via console tracing that the
**pathname** side of this was captured correctly: `state.prev.pathname`
genuinely held `/` right after navigating to `/contact`) — but the
*content* resolved to Contact anyway, even though the React reference
was captured before the navigation. That means the problem is one level
deeper than application code can reach: Next.js's `children` reference
for a Server Component route isn't an inert, frozen value the way a
plain client-side React element is — it's tied to the App Router's
internal cache in a way that can change what a previously-captured
reference resolves to, not just what the live prop currently holds.
This is consistent with why `AnimatePresence`-style libraries are widely
documented as unreliable for this specific combination (App Router +
Server Components) without special handling.

**Conclusion, not just another dead end**: this isn't fixable with
React state patterns alone, at the application-code layer, full stop —
confirmed across two independent implementations (`AnimatePresence`'s
own exit-caching, and a manual snapshot specifically designed to route
around it) hitting the identical wall. The real source doesn't have this
problem because it isn't using a JS animation library to fake a
crossfade at all — it's using the actual browser View Transitions API
(`document.startViewTransition()`), which operates on rendered pixels at
the browser/compositor level, entirely outside of React's tree — so it
has no "stale reference" problem to have in the first place.

### Third attempt (2026-10-05, same session) — shipped

Stopped trying to reproduce the effect with Framer Motion and switched
to the real browser API directly — same technique the live site already
uses — via `next-view-transitions` (the Next.js team's own package for
wiring `document.startViewTransition()` into App Router navigation
correctly). One new dependency, added with explicit sign-off first given
the "no unnecessary dependencies" default on this project and how much
had already been sunk into the Framer Motion approach.

**Implementation**: `<ViewTransitions>` wraps `<html>` in
`app/layout.tsx` (outside it, not inside — it's a context provider, not
a DOM element). Every internal `<Link>` across the app (`Header`,
`Footer`, `EnquiryForm`, `CategoryCard`, `ProductCategoriesSection`,
`/contact/success`, `/not-found` — 7 files, confirmed via grep, not
guessed) now imports `Link` from `next-view-transitions` instead of
`next/link` — its `Link` is what actually triggers the transition on
navigation; a plain `next/link` click wouldn't. No custom
`::view-transition-*` CSS added — same as the real source (zero
`transition:animate`/`name`/`persist` directives there either), so both
use the browser's unstyled default crossfade.

**Verified this one for real, not just "it compiled"**: instrumented
`document.startViewTransition` directly (wrapped it in an init script
before any page code ran) to get actual lifecycle timing rather than
guessed delays — confirmed it's genuinely invoked on navigation, with
`ready` firing ~40ms in and `finished` ~275ms later, matching the real
site's measured ~250ms almost exactly. Screenshots timed against that
real lifecycle (not fixed waits) showed the old page's actual content
present in at least one captured frame before the new page appeared —
something that **never happened once**, in any frame, across either
Framer Motion attempt. That's the real, meaningful difference: the
browser is compositing genuine pixel snapshots of both pages, which is
exactly the mechanism the old React-based approaches structurally
couldn't reach (see the second attempt above for why).

**Found in a later audit, fixed same day**: `EnquiryForm`'s
post-submit redirect (`router.push("/contact/success")`) was still
using `next/navigation`'s `useRouter`, not `next-view-transitions`'s —
only the latter's router (or its `Link`) actually calls
`startViewTransition()`. Every click-based navigation on the site got
the crossfade; this one programmatic redirect silently didn't. Fixed by
swapping to `useTransitionRouter` from `next-view-transitions` — same
`push`/`replace` API, confirmed via a clean build (TypeScript treats it
as a valid drop-in). Not yet verified end-to-end with a real successful
submission, since that requires the real endpoint `submitEnquiry` posts
to, which doesn't exist yet (pending a Payload Enquiries collection) —
worth a real click-through once that's live.

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
`components/sections/home/TestimonialsSection` (Home page section
shell, prop-driven — renamed from `Testimonials` 2026-10-05 for
consistency with every other section's `*Section` naming, e.g.
`ContactHeroSection`/`CategoryGridSection`; it predated that convention
and was never renamed during its own retrofit) + `lib/api/home.ts`
(page data). Ported from the real
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
  page's `TestimonialsSection` wrapper instead). Reusable wherever else
  a testimonial carousel is needed later without dragging that chrome
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
  changes.
- **Wired into `app/page.tsx` for real** (2026-10-05, explicit request —
  "we will use thing directly now"). Home page now renders `<Testimonials
  {...testimonials} />` + `<ImageReelSection {...imageReel} />` (see
  "Image reel" below), in the real source's relative order (Testimonials
  before ImageBar — confirmed from `pages/index.astro`), even though
  everything else from the real Home page (collection feature, process
  strip, press, why-Giada, closing CTA) is still missing. No placeholder
  text left on the page now that it has real sections — the gap is
  tracked in the Status checklist instead.

## Hero slideshow

`components/sections/home/HeroSlideshowSection`. Ported from the real
source's `components/home/HeroSlideshow.astro` — full-bleed image
carousel with a GSAP entrance timeline (eyebrow fade, character-split
title stagger, divider line scale, tagline fade, scroll indicator fade),
a looping scroll-progress bar, a scroll-driven parallax on the whole
text overlay, and per-slide Ken Burns zoom. Verified in a real browser:
zero console errors, title opacity reaches 1 after the timeline
completes, character-split produced exactly 27 `span > span` elements
(matching "A Legacy Woven Over Generations"'s 27 non-space characters —
counted, not assumed), and the hero image's computed `transform` showed
a genuine in-progress scale (`matrix(1.042...)`, between the keyframes'
1.0 and 1.08) partway through the 10s Ken Burns animation, confirming
it's actually running, not just present in a stylesheet.

- **Full carousel machinery built even though only one slide exists.**
  The real source's own `slides` array has exactly one entry
  (`hero-living-room.webp`) — three other images
  (`hero-bedroom`/`hero-showroom`/`hero-texture`) sit in its assets
  folder completely unused, never wired into the config. Not fabricated
  into extra slides here, matching the real source exactly. The dots,
  keyboard-arrow navigation, touch swipe, autoplay timer, and hover
  pause/resume are all real, working code, ported faithfully — with one
  slide, `activate()` always normalizes back to the same index and
  early-returns (identical to the real source's own behavior), so
  nothing currently visibly cycles, but it needs zero changes the moment
  a second slide is added to the `hero.slides` array in `lib/api/home.ts`.
- **Prev/next arrow buttons not rendered** — the real source has them
  literally commented out in its markup (dead code, never shipped to the
  live site). Not restored here either; only dot navigation, keyboard,
  and swipe are real, live interactions on the actual site.
- **Ken Burns ported as a real named `@keyframes` in `globals.css`**,
  not a Tailwind utility — it has to be a genuine CSS animation because
  the retrigger mechanism (`style.animation = 'none'; void
  img.offsetWidth; style.animation = 'kenBurns 10s...'`) relies on the
  browser's own animation-restart-on-reflow behavior, which only works
  with `animation`, not a class toggle. Applied via direct DOM
  manipulation through a `next/image`-forwarded ref (confirmed
  `next/image` forwards its ref to the underlying `<img>` — this is the
  first place in the project that relies on that), matching the real
  source's imperative approach exactly rather than trying to force it
  into React state.
- **`font-heading` used for the `<h1>`, not `font-didot`** — both exist
  in this codebase and resolve to the same font (`--font-heading: var(--font-didot)`
  in `typography.css`), but `font-heading` is the documented, preferred
  semantic token going forward (see `globals.css`'s own comment on this);
  `font-didot` usages elsewhere (e.g. `ContactHeroSection`) predate that
  being settled as the convention.
- Real image copied in (`public/images/home/slideshow/hero-living-room.webp`),
  byte-diffed identical against the source file.
- **Title char-stagger flicker fix (2026-10-05).** User caught it on the
  live dev site: the title flashed in fully, then visibly snapped/bounced
  before the real stagger animation ran. Root cause confirmed by sampling
  `getComputedStyle` on the char spans every frame in a real browser:
  `tl.from(chars, {...}, 0.3)` was a timeline child, and GSAP defaults
  `immediateRender: false` for `.from()` tweens inside a timeline — so the
  chars' starting state (`y: 60, opacity: 0`) wasn't applied until the
  playhead actually reached position 0.3 (0.2s timeline delay + 0.3s
  offset, ~0.5s after mount). In that window the chars sat at their
  natural DOM state (visible, `y: 0`, since `splitChars()` just wraps
  text in fresh spans with no inline style), while `gsap.set(title,
  {opacity: 1})` had already made the container visible synchronously —
  so the full title flashed in at rest, then jumped to hidden/offset and
  staggered back up.
  First fix attempt was wrong and is worth recording so it isn't
  retried: added `gsap.set(chars, {y: 60, opacity: 0})` synchronously
  right after `splitChars()`, before revealing the title. This does stop
  the flash, but it also breaks the animation outright — confirmed via
  the same frame-sampling, chars stayed permanently invisible for the
  full 2.5s sample. Cause: `.from()`'s implicit "to" value (when none is
  given) is inferred from GSAP's own tracked current value for that
  element/property, and the `gsap.set()` call had just overwritten that
  tracked value to `y: 60, opacity: 0` — so the tween animated from
  `y:60` to `y:60`, a zero-delta no-op.
  Shipped fix: keep the synchronous `gsap.set(chars, {...})` (still
  needed to prevent the flash), but swap `tl.from()` for
  `tl.fromTo(chars, { y: 60, opacity: 0 }, { y: 0, opacity: 1, ... },
  0.3)` — explicit start **and** end values sidestep GSAP's inference
  entirely, so the pre-positioning gsap.set() can no longer corrupt the
  implicit target. Re-verified via the same per-frame sampling: chars
  sit correctly hidden from mount to ~280ms (timeline delay), then
  animate monotonically and continuously to `opacity: 1, y: 0` with no
  jump — plus a visual screenshot sequence at 300ms/900ms/1800ms
  confirming no flash frame and a clean left-to-right stagger.

## Collection (image + text, Home second section)

`components/sections/home/CollectionSection`. Ported from the real
source's `Collection.astro` (imported there as `ImageWithText`) — the
second section on Home, right after the hero. Two-column image/text
layout: image left, eyebrow/heading/divider/description/button right,
with an optional `reverse` prop to flip sides.

- **Kept as a Home-only section, not promoted to `components/ui/`** —
  confirmed only one real usage site across the entire source (grepped
  every page/component for the import), despite being built with
  reusable-looking props (optional `subheading`, optional
  `buttonText`/`buttonLink`, `reverse`). Same reasoning as
  `HeroSlideshowSection`: the flexibility is real (kept as genuine props,
  not hardcoded away), just not yet exercised by a second page —
  promoting this later if one shows up is a non-event since the props
  already exist.
- **`reverse` implemented correctly, not ported as-is.** The real
  source applies `md:order-1` to *both* the image and text wrapper when
  `reverse` is true — they'd tie at the same order value and nothing
  would actually flip. This is a dormant bug, not a confirmed-live
  behavior to preserve: `reverse` is never set to `true` anywhere in the
  real source, so there's no real site behavior being deviated from
  here, just an unexercised code path implemented sensibly (`md:order-2`
  on the image, `md:order-1` on the text, when reversed) rather than
  copying a bug nobody has ever seen trigger.
- **`subheading` duplicating the Hero's own eyebrow text** ("From Our
  Atelier to Your Vision") is confirmed real, not a copy-paste mistake —
  the real site shows the identical line twice in a row, by design.
- Real image copied in (`public/images/home/collection-feature.webp`,
  4000×4000 source), byte-diffed identical against the source file.
  Rendered via standard `next/image` optimization (not `unoptimized`,
  unlike `ZoomCard`) — confirmed sharp via a real-browser crop screenshot
  at 2x DPR; this image doesn't have the dense-text/fine-grain content
  that made Press Feature's magazine scans visibly sensitive to
  compression, so the default optimization pipeline is fine here.
- `buttonLink` points at `/collaborations`, matching the real source
  exactly — not a guess, and not normalized to `/products` despite the
  section being about rugs/collections generally.
- Uses a single `data-reveal` per column (image, text), not per
  individual element inside the text column — consistent with the
  project's settled no-stagger reveal timing (see "Animations" above).
- **Image rendered as a flat square instead of tall portrait (2026-10-06
  fix) — a genuinely layered root cause, not a simple styling miss.**
  User caught the live image looking squished/short compared to the
  real site. Three separate, compounding issues, found and fixed in
  sequence:
  1. **`fill` mode doesn't contribute intrinsic size to CSS Grid's
     `items-stretch` row-sizing.** The real source uses a plain `<img
     width={1200} height={1400} class="h-full w-full object-cover">` —
     not absolutely positioned — so the browser's Grid auto-sizing
     algorithm can read its intrinsic aspect ratio when computing the
     row's height. `fill` sets `position: absolute` on the underlying
     `<img>`, removing it from that calculation entirely. Confirmed by
     measuring: both builds' two grid columns matched *each other*
     (proving `items-stretch` itself worked in both), and the text
     content/wrapping was byte-identical between builds — so the real
     row-height difference had to be coming from the image side.
     Fixed by switching from `fill` to real `width={1200} height={1400}`
     props + `h-full w-full object-cover` CSS, matching the real
     source's actual approach instead of the `fill`-based pattern used
     elsewhere in this project (which is fine for sections like
     `ZoomCard`/`WhyGiadaSection` precisely because they don't need
     their container's height to be *derived from* the image).
  2. **Our source image file was the wrong shape.** Fix #1 alone
     produced a perfect square, not the expected tall portrait. Turned
     out `public/images/home/collection-feature.webp` was the original
     4000×4000 *square* photo — real, byte-diffed identical to the Astro
     handover ZIP's source asset, but not what the live site actually
     *serves*. Astro's own build pipeline crops this square original
     down to a non-square 1200×1400 before deploying. Confirmed by
     capturing the real live site's actual served file directly
     (network response, not inferred): genuinely 1200×1400, same photo,
     same framing. Replaced our project's file with this exact
     byte-identical crop rather than deriving one ourselves.
  3. **Next's dev-mode image cache persisted across both a config-free
     file swap and a full dev-server restart.** After fixing the source
     file, the page kept rendering the stale square version. Traced to
     `.next/dev/cache/images/` — a disk cache Next 16's dev server uses
     for optimized image output, keyed partly by `Accept` header (a
     bare `curl` with no `Accept` header hit a different, already-stale
     cache bucket than a real browser's request would, which is why an
     early check looked like it had "cleared" when it hadn't). Confirmed
     by directly fetching with a browser-matching `Accept` header, which
     still returned square — and confirmed a plain server restart alone
     doesn't clear it, since the cache lives on disk, not in process
     memory. Fixed by deleting `.next/dev/cache/images/` specifically,
     then restarting. Worth remembering for any future "I changed the
     file but the image still looks wrong" case on this project — check
     this cache before assuming the code fix didn't work.
  Re-verified post-fix: rendered dimensions (541×631.67px, ratio 0.857)
  match the live site's measured dimensions exactly, both desktop and
  mobile screenshots confirmed correct, zero console errors.

## Press feature (zoom cards)

`components/ui/ZoomCard` (reusable primitive) +
`components/sections/home/PressFeatureSection` + `lib/api/home.ts`'s
`pressFeature`. Ported from the real source's
`components/home/PressFeature.astro`. User spotted this one directly on
the live site and asked to discuss the approach before building — same
pattern as Category grid: confirmed the header (eyebrow + h2 + centered
description) is structurally identical to what `SectionHeading` already
handles, and the "zoom card" is a real, specific interaction (not a
lightbox): a cursor-tracked magnifying zoom, `transform-origin`
following the mouse position within the card, not a static hover-scale.
Verified in a real browser: hovering produces exactly `scale(1.72)`
(matching the real source's value, not approximated), and moving the
cursor to a different point on the card measurably shifts
`transform-origin` to follow it — confirmed via `getComputedStyle`, not
just "it looked right."

- **`ZoomCard` built as a genuine reusable primitive**, same philosophy
  as `CategoryCard`/`Accordion` — owns its complete visual identity
  (shadow, ring, `cursor-zoom-in`, overflow-hidden) and the zoom
  interaction, no page/section knowledge. Only one confirmed usage site
  in the real source so far (unlike `CategoryCard`, which had two
  independently confirmed usages before being extracted) — built as a
  primitive anyway since it's a complete, self-contained interactive
  unit on its own merits, matching how `Accordion`/`TestimonialBook`
  were also built as primitives from the start rather than waiting for a
  second confirmed usage.
- **Direct DOM style mutation on `mousemove`, not React state** — same
  technique the real source's own script uses, and deliberately not
  reimplemented with state: a cursor-tracked zoom fires on every
  pixel of mouse movement, and routing that through `setState` would
  mean a React re-render per mousemove event instead of a single
  imperative style write. Matches the pattern already established by
  `HeroSlideshowSection`'s Ken Burns and `ImageReelSection`'s GSAP
  track — animation-heavy, high-frequency DOM work stays imperative
  even inside otherwise-declarative components.
- **Real fourth image found, not used *here*** — `press-feature-tv.webp`
  sits in the real source's assets folder but is never wired into
  `PressFeature.astro`'s own image list. **Correction (2026-10-06):**
  this isn't actually an orphaned asset — it's wired into `WhyGiada.astro`
  instead (the section right after this one), confirmed when that
  section was built. Not a fourth Press Feature card either way, just
  not "unused" in the way this originally implied — see "Why Giada
  (pillars + closing image)" below.
- **`SectionHeading`'s `eyebrowColor="stone-500"` got a second real
  instance** — its type comment previously described `stone-500` as
  probably a one-off authoring slip, seen only in `OurClients` (not yet
  built). `PressFeature` uses the same value independently, which makes
  "accidental" a weaker explanation than it looked before. Comment
  updated to reflect the new evidence rather than left stale.
- Real images copied in (`public/images/home/press/press-magazine-spread.webp`,
  `-1.webp`, `-2.webp`), byte-diffed identical against the source files.
- **Wider `max-w-7xl` container kept, not normalized** to the `max-w-6xl`
  most other Home sections use — confirmed real in the source, not a typo.
- **Equal card heights — a deliberate deviation from the real source,
  not a port.** The real source lets each card's height follow its own
  image's native aspect ratio, so the three images (different
  proportions) render at visibly uneven heights — confirmed in the real
  source itself, not assumed, and the user independently caught the same
  unevenness on the live site via screenshot and asked for it fixed:
  "DONT FOLLOW ASTRO BLINLDY WE ARE IMPROVING THINGS HERE ON NEXTJS."
  First approach considered was `h-full` + CSS Grid `align-items:
  stretch`, rejected before implementing it: every `ZoomCard` uses
  `next/image`'s `fill` mode (`position: absolute`), so none of the
  three siblings contributes real intrinsic height for the grid row to
  stretch against — the row would collapse instead. Shipped a fixed
  `aspect-[6/7]` (≈0.857) on `ZoomCard`'s container instead — equal-width
  grid columns + the same ratio on every card is already equal height,
  deterministically, with no such dependency. The ratio itself is
  grounded in the three real images' own measured dimensions
  (1164×1351, 1189×1323, 1333×1600 → ratios 0.862, 0.899, 0.833,
  averaging 0.864), not picked arbitrarily. `imageWidth`/`imageHeight`
  dropped from `ZoomCardProps` and `lib/api/home.ts`'s `PressImageData`
  as part of this change — no longer needed once sizing is `fill`-driven
  (`CategoryItem`'s identical-looking fields were left alone; `CategoryCard`
  doesn't use `fill` and still needs real dimensions). Verified in a real
  browser post-change: all three cards measured at identical
  `getBoundingClientRect()` dimensions (416×485 at 1600px viewport), the
  cursor-tracked zoom still produces `scale(1.72)` with `transform-origin`
  correctly following the cursor, and the screenshot shows no cropping
  or distortion artifacts from the `object-cover` crop.
- **`unoptimized` on ZoomCard's `<Image>` (2026-10-05) — not a quality
  bump.** User caught these specific images looking visibly softer on
  this site than on the live one. First attempt raised `next/image`'s
  `quality` (default 75 → 90 → 100 on explicit request, requiring a
  matching `images.qualities` entry in `next.config.ts` — Next 16 400s
  any quality value not explicitly allow-listed there), which helped but
  didn't fully close the gap — user confirmed it was "still blurry" even
  after a hard refresh with `quality={100}` live.
  Re-investigated properly rather than guessing again: navigated an
  actual browser to the real production site and intercepted its network
  responses directly. The live site serves these exact files completely
  **unprocessed**, at their real original dimensions (1189×1323,
  1333×1600, 1164×1351 — confirmed matching this project's own `public/`
  source files exactly). `next/image`'s optimizer, even at quality 100,
  was still downsizing to its nearest `deviceSizes` bucket (1080px wide —
  comfortably enough resolution on paper, but still less than the real
  1164-1600px originals) and re-encoding through its own WebP pass on top
  of whatever encoding the source file already had — two lossy passes
  plus a resize, compounding softness that shows up worst here
  specifically because these are dense magazine scans (small text, fine
  photo grain), unlike the simpler interior/product shots used elsewhere
  on the site.
  Fixed by adding `unoptimized` to the `<Image>` and dropping `sizes`/
  `quality` (meaningless once unoptimized) — this serves the exact
  original file, byte-for-byte, with zero resize and zero re-encode, the
  only way to genuinely match live rather than approximate it with a
  higher quality number. Reverted the now-unneeded `images.qualities`
  entry in `next.config.ts` back out. Verified two ways: (1) intercepted
  the actual browser request and confirmed it now hits
  `/images/home/press/*.webp` directly (bypassing `/_next/image`
  entirely), with response bytes binary-identical (`cmp`) to the
  `public/` source file; (2) re-confirmed the cursor-tracked zoom still
  produces `scale(1.72)` on hover — `unoptimized` only changes how the
  image is fetched, not `fill`/`object-cover` sizing behavior.
  Acceptable tradeoff: these 3 files are already small (187-244KB) and
  don't need Next's responsive-srcset machinery the way a hero image
  would — this is a deliberate, scoped exception for this specific case,
  not a project-wide default.
  Both `next.config.ts` changes in this fix (`images.qualities` added,
  then removed) required a dev-server restart each time to take effect —
  **Next.config changes aren't hot-reloaded.**

## Image reel (craftsmanship strip)

`components/sections/home/ImageReelSection`. Ported from the real
source's `components/home/ImageBar.astro` — five real craftsmanship
photos, tripled and scrolling infinitely, full-bleed edge-to-edge
regardless of where the section sits in the page. Verified in a real
browser: transform genuinely changes over time (confirmed by sampling
computed `transform` a few seconds apart, not just "it compiled"), zero
console errors, correct on both desktop and mobile (`68vw` wide items on
mobile vs the `clamp(180px, 22vw, 360px)` desktop sizing).

- **Animation driven by GSAP, not CSS `@keyframes`** — real source uses
  a pure CSS animation. First port matched that exactly (a CSS Module
  `@keyframes scroll` + `animation: scroll 34s linear infinite`), but it
  silently never applied under this project's Turbopack dev build —
  `transform` stayed `none` indefinitely, confirmed by direct
  measurement, not assumed. Rather than keep chasing why, switched to
  GSAP (explicit request — "we have free hand to make the project
  optimized in nextjs," and GSAP is already this project's established
  animation library: `gsap-init.ts`, `ScrollReveal`, EnquiryForm's field
  stagger). `gsap.to(track, { xPercent: -33.333, duration, ease: "none",
  repeat: -1 })` — `xPercent` is relative to the element's own box width,
  same as CSS `translateX(%)`, so the `-33.333%` (exactly one of the
  three tripled copies) carries over directly.
- **`gsap.matchMedia().add()` tried first for the responsive duration
  switch, dropped after direct testing showed its callback never
  fires** in this setup — confirmed by adding console logging inside the
  callback and inside a bare `gsap.to()` call side by side: the bare
  tween animated correctly (verified via sampled `transform` values),
  the `matchMedia().add()` callback never logged once. Not investigated
  further given a simpler, already-proven pattern exists in this exact
  codebase. Replaced with plain `window.matchMedia("(max-width: 768px)")`
  + a `change` event listener that kills and recreates the tween at the
  new duration, preserving playback position (`tween.progress()` read
  before kill, reapplied after) — same style of direct `matchMedia`
  check EnquiryForm already uses for reduced-motion.
- **Only the genuinely bespoke CSS stayed in a CSS Module** —
  `ImageReelSection.module.css` has just the full-bleed negative-margin
  trick, the flex track, and the `clamp()`-based responsive item sizing.
  Everything else (border, background, padding) is Tailwind classes
  directly on the JSX — matching how the real source itself mixes a
  scoped `<style>` class with inline Tailwind classes on the very same
  `<section>` element, not a stylistic choice invented here.
- **Real quirk found and deliberately NOT carried forward**: the real
  source's CSS has a
  `.image-reel:hover .image-reel-track { animation-play-state: running }`
  rule. Checked carefully — this is dead code, not a "pause on hover"
  feature: the track's animation has no `animation-play-state` set by
  default (so it's already `running`), and the hover rule sets the exact
  same value. A no-op rule isn't "real behavior" worth preserving the
  way the TestimonialBook dot-click quirk or the Montréal slug-stripping
  are — those have an observable effect, this doesn't. The per-image
  hover scale-up (`hover:scale-[1.06]` on each individual photo) IS real
  and working, and is kept.
- Real images copied in (`public/images/home/image-bar-1.webp` through
  `-5.webp`), byte-diffed identical against the source files. Reorder
  `[1, 3, 5, 4, 2]` matches the real source's own reordering of the five
  files — not arbitrary, kept exactly as authored there.
- `loading={i < images.length ? "eager" : "lazy"}` on each `next/image`
  — only the first (non-duplicated) copy of each photo loads eagerly,
  the two duplicate copies used for the seamless loop lazy-load, same
  split the real source's `loading={i < 5 ? "eager" : "lazy"}` makes.
- **Real bug found and fixed in `globals.css`, not scoped to this
  component**: `ImageReelSection`'s full-bleed `width: 100vw` doesn't
  account for the vertical scrollbar's own width, so the page gained a
  horizontal scrollbar — a well-known side effect of that technique.
  Verified the real source already guards against exactly this with
  `overflow-x: hidden` on both `html` and `body` in its global.css — a
  rule this project's `globals.css` had simply never needed until this
  was the first genuinely full-bleed section. Added both rules; confirmed
  fixed via `document.documentElement.scrollWidth === clientWidth` in a
  real browser, not just visually.

## Category grid (Rugs / Glass)

`components/ui/CategoryCard` (reusable primitive) +
`components/sections/home/CategoryGridSection` (Home) +
`components/sections/products/ProductCategoriesSection` (the Products
page, built out for real past its placeholder for the first time) +
`lib/api/home.ts`'s `categoryGrid` + new `lib/api/products.ts`. User
spotted via the real live site that the same two-card grid appears both
on Home and on `/products` and asked to discuss making it reusable
before building — confirmed via the real source (grepped for
`CategoryGrid` usage, read both files in full) that it's real, but more
precisely scoped than it first looked.

- **Only the card itself is actually shared** — `CategoryCard.astro` in
  the real source, ported as `components/ui/CategoryCard`. The
  surrounding chrome is genuinely different in each usage, not just
  styled differently: Home wraps the grid in a centered eyebrow+heading
  section (`CategoryGridSection`, reuses `SectionHeading` — this is
  exactly the pattern it was built for); the Products page has no
  eyebrow+heading section at all, "Products" is literally the page's own
  `<h1>`, followed by an `sr-only` `<h2>All Products</h2>` and a
  "View the Gallery" CTA link that Home's version doesn't have. Built as
  two separate section components composing the one shared primitive,
  not one component trying to serve both — same split already used for
  `Accordion`/`FaqListSection` and `TestimonialBook`/`Testimonials`.
- **`data-magnetic="0.2"` on the real source's cards is dead markup, not
  a real feature — verified, not assumed.** `magneticHover()` already
  exists in `lib/animations.ts` (ported early in the project) and looked
  like a natural fit, but grepping the entire real source turned up
  zero calls to it anywhere — nothing ever reads `[data-magnetic]` and
  invokes it. Not implemented here; matching real *behavior* beats
  wiring up an attribute that doesn't actually do anything on the live
  site. (Said the opposite before verifying, while just discussing this
  from the screenshots — corrected once the real source was actually
  checked.) Likewise `data-reveal="scale"` on each card: this project's
  own `ScrollReveal` already renders every reveal variant identically
  (plain opacity fade, documented in `ScrollReveal.tsx` — no distinct
  transform values exist anywhere in the real source to restore), so
  plain `data-reveal` + the real source's own stagger delay (`200` on
  the second card only) is the faithful port, not a missing feature.
- **hrefs point to `/products?category=rugs`/`glass`, not the real
  source's separate `/rugs`/`/glass` routes.** This project already
  consolidated product categories into one `/products` listing with a
  `category` field (`types/product.ts`, decided earlier in the project,
  confirmed via `nav.config.ts` only ever having one "Products" link) —
  matching the real source's literal hrefs would just 404 here. The
  query-param shape is ready for whenever `/products` actually filters
  by it; that filtering isn't built yet (page is still just the
  category-picker intro, matching the real source's own current scope
  for this route — it doesn't have a full filterable catalog either).
- Real images copied in (`public/images/categories/category-rugs.webp`,
  `category-glass.webp` — renamed from the source's
  `glass-detail-3.webp` for clarity, same image), byte-diffed identical.
- `lib/api/home.ts` and `lib/api/products.ts` both define their own
  independent `CategoryItem`/`ProductCategoryData` types rather than
  importing `CategoryCardProps` — same data-layer-independence reasoning
  as `lib/api/contact.ts` (see "Contact page" below). `CategoryGridSection`
  and `ProductCategoriesSection`'s own `.types.ts` files DO import
  `CategoryCardProps` from `components/ui/CategoryCard` — that's a
  UI-to-UI composition (one component reusing another's prop shape), not
  the data-layer-depends-on-UI-layer pattern that was the actual problem
  before; components depending on other components is normal.

## Values section ("Living Art Beyond Simple Decor") — first client-designed section

`components/ui/ValuesSection` (reusable primitive, not a Home-only
section) + `lib/api/home.ts`'s `values`, placed between Category grid
and Process strip on Home. **First section in this project not sourced
from the real Astro site** — everything else has been a faithful port
(or a deliberate, flagged deviation) from the real live site; this is
genuinely new content the client designed in Figma (2026-10-06) and
asked to be built reusable from the start, explicitly for eventual reuse
on Our Story's "Values That Endure" section too.

- **Checked the real source's closest relative before building** —
  `components/our_story/StoryBeliefs.astro` ("Values That Endure").
  Confirmed related but genuinely different: its image sits *after* the
  item list with a quote-caption overlay and no button, not *before*
  with no caption and a button, the way the new Figma design has it.
  The bordered index/title/text row layout, though, is carried over
  directly from `StoryBeliefs`' real grid pattern — confirmed similar
  enough to reuse as-is (`md:grid-cols-[2.5rem_minmax(13rem,0.42fr)_1fr]`).
- **Built as a genuine `ui/` primitive immediately**, not a Home-only
  section promoted later — different from every other section-reuse
  decision in this project, which waited for a second *confirmed* real
  usage before extracting anything. Here the reuse is explicit, upfront
  client instruction for new content with no "real source" to grep for
  usage counts, so the usual wait-and-see heuristic doesn't apply.
- **Our Story's eventual build keeps its own real content** (the
  existing "Authenticity"/"Excellence"/"Partnership" copy from
  `StoryBeliefs.astro`), per explicit instruction — the Figma redesign's
  new copy ("Expressive Artistry" etc.) is Home-only. The image-position
  (before vs. after the list) and caption-vs-button structural
  difference between the two real usages is **not resolved yet** —
  deliberately deferred until Our Story is actually built for real,
  rather than over-engineering this primitive's props today for a
  usage that doesn't exist yet.
- **Image proactively built `unoptimized`**, not discovered as a bug
  after the fact this time — this is the third dense/high-contrast,
  fine-texture photo in this project (after Press Feature's magazine
  scans and WhyGiada's textured interior), and the same
  `next/image`-recompresses-even-at-matching-dimensions issue was
  already confirmed twice. Applied proactively here instead of waiting
  for a third blur report.
- `buttonLink` set to `/our-story` — an assumption (the Figma mockup
  doesn't specify a destination), flagged to the user, not silently
  guessed and left undocumented.
- Real image copied in (`public/images/home/simple-decor.webp`,
  1280×520) — provided directly by the user into `public/images/home/`,
  not sourced from the Astro handover ZIP (this is new client content).
- **Verified against the actual Figma file directly (2026-10-06)**, via
  the Figma MCP's `get_design_context` on the real node URL the user
  shared — not just the earlier screenshot transcription. This caught
  four real, precise value mismatches across three separate passes (two
  found together initially, then the width, then the font-size — the
  last two only after the user caught them live), which is why
  `SectionHeading` ends up with four separate new opt-in props on it,
  not one:
  - The description needs `stone-600` (`#57534d` exactly), `16px`, and
    `max-w-[985px]` (nearly edge-to-edge with its `1005px` container) —
    not `SectionHeading`'s shared `stone-500`/`15px`/`max-w-xl` (576px)
    defaults. Added as three separate opt-in props
    (`descriptionColor`, `descriptionFontSize`, `descriptionMaxWidth`)
    rather than changed as the defaults — the other 5 real sections
    using `SectionHeading` are independently confirmed correct at the
    smaller/narrower originals from the live Astro site and must not
    silently change. Re-verified post-fix each time: `PressFeatureSection`
    stayed at `stone-500`/15px throughout (sampled computed style
    directly, not assumed).
  - The item index ("01"/"02"/"03") needs `text-base` (16px) +
    `stone-600`, not the `text-sm` (14px) + `stone-400` first carried
    over from `StoryBeliefs.astro`'s real index styling — this
    component's Figma design uses different index styling than its
    real-source relative, confirmed directly rather than assumed to
    match just because the rest of the row layout is similar.
  - **The font-size miss was self-inflicted, not a data gap** — 16px was
    already visible in the very first `get_design_context` pull, but got
    judged "close enough" to the existing 15px and left unfixed instead
    of applied, a tolerance call nobody asked for. The width was missed
    outright the first pass (only color/size were checked that time).
    Both only got caught because the user looked closely at the live
    page, not because a second Figma check turned up new information.
    Lesson going forward: apply exact design-source values when they're
    available, don't round differences away as a judgment call.
  - Heading size/color, eyebrow size/tracking/color, item title
    size/color/italic, item text size/color, and the image container
    dimensions all matched exactly from the first pass — only the
    description's three values and the item index needed correcting.

## Process strip (5-step "Crafted With Purpose")

`components/sections/home/ProcessStripSection`. Ported from the real
source's `ProcessStrip.astro` — fourth section on Home, right after
Category grid. Confirmed used exactly once across the whole source
(grepped every page/component for the import) and fully hardcoded there
(the 5 steps are a literal array inside the component — `Astro.props`
isn't even referenced). Kept as a Home-only section, not a `ui/`
primitive, same reasoning as every other single-usage Home section.

- **Header reuses `SectionHeading`** — eyebrow/heading/description
  matches that established pattern exactly (same as
  `PressFeatureSection`/`CategoryGridSection`), default `eyebrowColor`
  (`stone-400`) and description width both already correct with no
  overrides needed.
- The 5-card step grid itself is unique Home content, not abstracted
  into a separate primitive — single real usage, no second instance
  anywhere in the source to justify it.
- Real content (steps, copy) confirmed from the Astro source, not
  placeholder.
- Each step card uses a single `data-reveal`, no per-card delay —
  consistent with the project's settled no-stagger reveal timing (the
  real source authors `data-reveal-delay={String(i * 100)}` per card,
  but that attribute is dead markup on the real site too — see
  "Animations" above for the full reasoning).

## Why Giada (pillars + closing image)

`components/sections/home/WhyGiadaSection`. Ported from the real
source's `WhyGiada.astro` — sixth section on Home, right after Press
feature. Confirmed used exactly once across the whole source and fully
hardcoded there (the 3 pillars are a literal array, zero `Astro.props`)
— kept as a Home-only section, not a `ui/` primitive, same reasoning as
every other single-usage Home section this session.

- **Header doesn't reuse `SectionHeading`** — unlike `PressFeatureSection`/
  `CategoryGridSection`/`ProcessStripSection`, which all do. Here it's
  eyebrow + heading with no description, and `SectionHeading`'s own
  `mb-12 lg:mb-16` wrapper spacing already matches what's needed, so it's
  still used as-is (not hand-rolled) — just noting explicitly it's the
  no-description case rather than a deviation.
- **Corrects an earlier claim**: the closing image
  (`press-feature-tv.webp`) was previously documented under "Press
  feature (zoom cards)" as a real-but-orphaned asset, never wired into
  anything. That was true relative to `PressFeature.astro` specifically
  — it turns out to be wired into `WhyGiada.astro` instead, confirmed
  once this section was actually built. Not fabricated into a fourth
  Press Feature card; genuinely used here, just not where first assumed.
- **Hover zoom verified via the correct CSS property** — the image uses
  Tailwind's `group-hover:scale-[1.03]`, which Tailwind v4 compiles to
  the native CSS `scale` property, not `transform`. First verification
  attempt checked `getComputedStyle(img).transform` and saw `"none"`,
  which looked like a bug — rechecking `getComputedStyle(img).scale`
  showed the real applied value (`1.03`) immediately. Worth remembering
  for any future Tailwind v4 hover/scale verification: check `scale`,
  not `transform`.
- Real image copied in (`public/images/home/press-feature-tv.webp`,
  3600×2403 source, matching the real `aspect-[3600/2403]` exactly),
  byte-diffed identical against the source file.
- **`unoptimized` added 2026-10-06** — initially shipped with standard
  `next/image` optimization, assumed fine since it's a plain interior
  photo rather than Press Feature's dense text scans. Wrong: user caught
  it looking blurry on the real dev server. Confirmed by capturing the
  actual served bytes — dimensions matched the real 3600×2403 source
  exactly (no under-sizing at all), but the served file was smaller
  (242KB vs. the original 378KB) because `next/image` still re-encodes
  at quality 75 even when it doesn't need to resize anything. This image
  does have dense, repeating fine detail after all (patterned rug, book
  spines, shelf texture) — different content than first assumed, same
  compression sensitivity as Press Feature. Fixed with `unoptimized`,
  same as `ZoomCard`; re-verified the served bytes are now byte-for-byte
  identical to the source file.
- A visible overlap between this section's heading and the fixed header
  showed up in one mobile screenshot during verification — confirmed to
  be a `scrollIntoViewIfNeeded()` test artifact (it snaps content flush
  to the viewport top, directly under the site's `position: fixed`
  80px-tall header), not a real layout bug. Re-verified with a natural
  incremental scroll (mouse wheel, leaving a buffer above the fixed
  header) and the overlap doesn't occur under realistic conditions.

## Contact CTA banner (merged, two real source variants)

`components/ui/ContactCtaBanner` (reusable primitive), used by
`components/sections/home/ClosingCtaSection` on Home and directly in
`app/faq/page.tsx` on FAQ. User spotted the same closing CTA band on
both the live Home and FAQ pages and asked whether a single component
with conditional rendering could cover both — discussed first, then
built on explicit go-ahead, scoped to these two pages only for now.

The real source actually has **two different components**, not one
reused everywhere — confirmed by reading both files, not assumed from
the screenshots alone:

- `components/home/ClosingCTA.astro` — zero props, fully hardcoded
  ("Every Great Space Begins with a Conversation." / "Connect With Us"),
  simpler markup (no eyebrow row, no description paragraph). Only ever
  used once, on Home.
- `components/global/ContactCTA.astro` — the generic, prop-driven one
  (`eyebrow`, `heading`, `description`, `linkText?`, `href?`, defaulting
  to `"Start a Conversation"` / `/contact`). Confirmed real usage on 6
  pages: FAQ, Our Story, Blog index, Collaborations index,
  `CollaborationDetail.astro` (per-collaboration detail), and the old
  standalone `rugs.astro` page (no current Next.js equivalent route —
  `/products` doesn't have a slot for it; flagged, not silently dropped).
  Of those 6, only FAQ is built out for real in this project today — Our
  Story, Blog, and Collaborations are still TODO stubs, so this primitive
  will extend to them naturally as each page gets built for real.

Merging them into one component required getting 2 real conditional
deltas right, not just "render eyebrow/description if present" — these
came directly from diffing the two Astro files, not guessed:

- **`mt-10` on the link is conditional on `description`** — it exists in
  the real source purely to compensate for the extra paragraph's
  spacing; Home's variant (no description) relies solely on the
  divider's own `my-8` and would get visibly more gap than the real site
  if `mt-10` always applied.
- **Defaults match the real generic component exactly**
  (`linkText = "Start a Conversation"`, `href = "/contact"`) — confirmed
  3 of the 6 real usages (Blog, Collaborations index, CollaborationDetail)
  omit `linkText` entirely and rely on this default, not a per-page
  override every time.

**Reveal-timing correction (2026-10-05).** First built with each
element on its own `data-reveal-delay` (`0`/`150` on the heading, `300`
on the divider, `400`/`500` on the description/link — the real source's
own authored values). User caught on the live FAQ page that the real
site fades the whole block in together, not item-by-item, and that
matched this project's own earlier documented finding (see
`ScrollReveal.tsx`'s comment): the real source authors
`data-reveal-delay` on nearly every element, but its own JS never
reads that attribute anywhere — the delay is dead markup on the actual
live site. A past session chose to "restore" it as a real
`transition-delay` (`globals.css`'s `[data-reveal]` rule) since the
values looked concrete and intentional; that restoration is what caused
this component's visible item-by-item stagger to diverge from live.
Fixed by moving `data-reveal` to the single outer content wrapper
instead of five individual children, with no delay — the whole eyebrow
+ heading + divider + description + link block now fades as one unit,
driven by one `IntersectionObserver` trigger.
Initially scoped to `ContactCtaBanner` only, but re-investigating by
reading the real reveal script directly (not just grepping for absence
of a consumer) showed the root cause was sitewide: `data-reveal-delay`
is dead markup everywhere on the real site, not just here. Taken project-
wide the same day — see "Animations" above for the full reversal (every
`data-reveal-delay` attribute removed, `ScrollReveal`/`globals.css`'s
delay mechanism removed) — so this is no longer a special case, just the
first place the divergence was caught.
Verified in a real browser on both pages by triggering the reveal
programmatically and sampling the wrapper's own computed `opacity`
every animation frame: a single smooth 0→1 curve over ~0.45s with no
per-child offset, on both Home and FAQ.

- **No dedicated Section wrapper on FAQ** — `ContactCtaBanner` is
  rendered directly in `app/faq/page.tsx` from `lib/api/faq.ts`'s
  `closingCta` field, not through a `FaqClosingCtaSection` folder. This
  is a deliberate, flagged deviation from this project's otherwise
  consistent "every page section gets its own folder" convention: there
  is no page-specific composition happening around the banner here, just
  a straight prop spread, so a wrapper would be pure pass-through with
  zero added logic or layout. Home's `ClosingCtaSection` still gets its
  own section folder, since it genuinely needs to omit
  `eyebrow`/`description` to reproduce the real hardcoded variant — that
  omission is real, page-specific composition, not pass-through.
- `lib/api/home.ts`'s `ClosingCtaSectionData` and `lib/api/faq.ts`'s
  `FaqClosingCtaData` both declare their own independent types rather
  than importing `ContactCtaBannerProps` — same data-layer-independence
  reasoning as `lib/api/contact.ts`.

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
  returns static data (real copy, not placeholder) instead of calling a
  real backend — but the function is already `async`, already the single
  place that assembles the page's props, and already returns the exact
  shape the components expect. Swapping its body for a Payload Local API
  call should be the only change needed later — `page.tsx` and both
  section components stay untouched.
- **`lib/api/fetcher.ts`'s missing-`API_URL` check moved from import
  time to call time** (found in a later audit, fixed 2026-10-05) — since
  superseded. This fixed a real landmine at the time (the check
  originally threw the moment the file was *imported*, not when
  `apiFetch()` was actually *called*, meaning the whole app would fail to
  start the moment any `lib/api/<page>.ts` imported it before `API_URL`
  was configured). `fetcher.ts` itself was removed entirely 2026-10-06
  once the backend moved to Payload — it was a REST client built for a
  Laravel API that no longer exists, and Payload's Local API removes the
  need for an HTTP client in the common case. Keeping this entry for the
  historical reasoning, not because the file still exists.
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
build, content hardcoded/local). The new backend introduces a CMS for
the first time — no data export/migration from a third-party CMS
needed, but all current content has to be manually extracted from the
Astro source and re-entered once the admin exists.

**Backend platform: Payload instead of the originally-planned Laravel
(decided and approved 2026-10-06).** Backend work hadn't started yet, so
this was pitched to the client before any was built — zero rework cost
either way. Reasoning:
- **Faster to build**: ~1.5-2.5 weeks for Payload vs. ~4-6 weeks for an
  equivalent hand-built Laravel backend, because Payload's collections
  are declarative TypeScript config that auto-generates the admin UI +
  API, rather than each being hand-built (even with Filament
  accelerating Laravel's admin panel).
- **Same stack as the frontend** — TypeScript/Node, not a second
  language (PHP) and a second codebase.
- **Runs embedded in this same Next.js app** — one deployment, not a
  separate backend server to host/maintain.
- **Free and open source** (MIT) — no licensing cost either way;
  infrastructure (Neon + Vercel) realistically runs ~$20-40/month once
  live.
- **Payments stay open either way** if the client wants them later —
  Payload has an official Stripe plugin; Laravel has Cashier. Not a
  deciding factor, just confirmed neither path is a dead end.
- **One real tradeoff**: Laravel has a longer-established ecosystem and
  larger talent pool. Payload is newer but production-proven and a
  common choice for exactly this kind of project.

**Database/storage: Neon**, chosen over a plain self-hosted Postgres
instance for the free tier (1GB storage + 100 compute-hours per project,
100 projects per organization, no credit card) and because its Object
Storage (S3-compatible) covers file/media storage too — one vendor
instead of Neon + a separate blob-storage service. Created under the
**agency's own Neon organization**, not the client's, specifically so
future projects don't each require a new client email/account up front;
Neon's "claimable project" feature (private preview as of this writing,
falls back to standard org-to-org transfer otherwise) lets ownership
move to a client later without changing the connection string or
touching deployed code.

**Real project created 2026-10-06** (`Giada`, `weathered-resonance-26023066`,
`aws-us-east-1` — matches Vercel's default serverless function region,
`iad1`, to minimize DB/storage latency on every request) with a `giada-media`
object storage bucket (private). Managed via Neon's CLI + `neon.ts`
infrastructure-as-code (declares the bucket; `neon deploy` reconciles it
against the linked branch) rather than hand-configuring through the
dashboard alone — `neon link` also pulls real credentials directly into
`.env`. Media's local-disk upload adapter (the `/media` placeholder) has
been replaced with `@payloadcms/storage-s3` pointed at `giada-media`
(`disableLocalStorage: true`, `forcePathStyle: true` — required for Neon's
S3-compatible API) — verified end-to-end via a real upload through
Payload's Local API: the object actually lands in the Neon bucket (not
`/media`), serves correctly through `/api/media/file/...`, and deleting
the doc removes the S3 object too.

The first `neon mcp` install minted an **account-wide** API key (reaches
every org on the account) instead of one scoped to this project — the
CLI itself warned about this. Resolved 2026-10-07: revoked key id
`3403345` from the Neon dashboard, then re-ran `neon mcp --agent
claude-code --project --project-id weathered-resonance-26023066 -y`
after clearing the stale `.mcp.json` entry (the CLI reuses whatever key
is already on file otherwise, even a revoked one) — confirmed via `neon
api-keys list --org-id ...` that only the new, project-scoped key
exists now.

**Full Home page wired to the CMS, 2026-10-06/07.** Every section in
`lib/api/home.ts`'s `HomePageData` (Hero, Collection, Category Grid,
Core Values, Process Strip, Collaborations Slider, Press Feature, Why
Giada, Testimonials, Closing CTA, Image Strip) now comes from Payload's
`home` global (`src/globals/Home.ts`) instead of literals — Hero was
built first as a working test the day before, then every remaining
section followed the identical pattern. The global's fields are
organized under `tabs` purely for `/admin` editing UX (one tab per
section instead of one long scrolling form); the underlying data shape
is unchanged, still `home.<section>.{...}`, matching each section's
existing TS type almost field-for-field. A single `findGlobal` call,
wrapped once in `unstable_cache` (tagged `"home"`), replaces the
per-section cached fetchers Hero's first pass used — one tag for the
whole page is the right granularity since the global's own
`afterChange` hook busts that same tag on every save, regardless of
which section changed.

Upload fields never duplicate width/height in the schema — Payload
auto-measures every upload via sharp, so `CategoryItem.imageWidth` /
`Testimonial.logoWidth` (etc.) are derived from the populated Media
relation at read time instead of being stored a second time.

All real content was re-seeded from scratch into the CMS (same text
confirmed from the Astro source/Figma back when each section was first
built — see git history for that original per-section provenance,
which no longer lives in `lib/api/home.ts` now that the content itself
lives in the CMS, not in this file's literals) via a one-off script,
since extending a Global's schema with new required fields while it
already has an existing row triggers Payload's db-postgres adapter to
ask for an interactive data-loss confirmation (`y/N`) before adding
`NOT NULL` columns — handled by piping `y` into the non-interactive
script run. One real gotcha hit during seeding: Media's `alt` field
rejects empty strings (several real sections, like the decorative image
strip, legitimately have empty per-use alt text, but the *Media doc's
own* alt still needs a real value) — fixed by giving the Media upload a
real description while keeping the section's own per-use `alt` field
empty where that's genuinely correct. A second gotcha: Payload renames
an upload's stored filename to match its *actually detected* format,
not its given extension (confirmed with `testimonial-kelli-richards.webp`,
which is real GIF content — see "Real content confirmed..." note below
— landing in the bucket as `testimonial-kelli-richards-1.gif`); a
filename-based "does this already exist" check written against the
original extension missed it and uploaded a duplicate, cleaned up after
the fact once noticed.

Verified end-to-end: real browser load of `/`, scrolled through fully
so every scroll-triggered reveal fires, confirmed every section's
heading/content text and all images render correctly with zero console
errors, and confirmed `next build` still statically prerenders `/`
(unaffected by the CMS wiring, since the whole fetch is cache-tagged,
not force-dynamic). **Not independently verified**: editing a
non-Hero field in the real `/admin` UI and confirming it reflects live
— that requires a real browser session logged in as an actual admin
user, which this environment doesn't have credentials for. The
mechanism is identical to Hero's (same single hook, same single tag,
no per-section special-casing anywhere in the revalidation path), which
was confirmed working by the user directly, so there's no structural
reason it would behave differently per section — but this is inference
from the code, not a repeated observation, and is worth an actual click
test.

**Admin UI polish, 2026-10-07**:
- Real site logo on `/admin/login` (`components/admin/Logo.tsx`, wired
  via `admin.components.graphics.Logo`), inverted to white only when
  `data-theme="dark"` — keyed off that attribute specifically because
  it's the same one Payload's own CSS uses to pick the actual background
  color, so it can't desync from what's really rendered. A plain
  `prefers-color-scheme` media query was tried first and rejected: real
  testing showed it can report dark while the page background stays
  light (Payload's server-side theme check depends on a
  `Sec-CH-Prefers-Color-Scheme` client hint header, not pure
  `matchMedia`), which would invert the logo to invisible-white-on-white.
- `admin.theme: "dark"` — fixed dark mode for the whole `/admin` panel,
  not just OS-dependent (explicit ask). Confirmed via testing that this
  forces dark even with the browser's own color scheme set to light.
- Media's `upload` config gained a `thumbnail` image size
  (400x400, `adminThumbnail: "thumbnail"`) — `upload: true` (no sizes)
  meant every admin preview/thumbnail requested the full original file
  over the network from Neon Object Storage, some 500KB-1.3MB, which is
  what the user noticed as slow image loading in `/admin`. Backfilled
  the 19 already-existing Media docs by re-processing each through its
  own stored file (Payload only generates image sizes at upload time,
  not retroactively). Two docs legitimately still have no thumbnail —
  `dunagan.png` (170x170) and the FAMDESIGN testimonial logo (330x26) —
  both genuinely smaller than 400x400 in every dimension, and Payload's
  documented default skips generating a size rather than upscale a tiny
  source image; harmless here since both files are already tiny (65KB
  and 3.6KB) regardless.

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
  all ad-hoc JSON with **no schema validation anywhere** — Payload is
  designing these from scratch, as real collections.
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
     shipped. Recommend the backend owns email sending entirely instead
     (Next Server Action → Payload validates + emails + stores via an
     Enquiries collection), rather than reintroducing Resend directly in
     the frontend.
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

## SEO

Status as of 2026-10-05, from an explicit audit ("are we taking care of
SEO things as well?"). Deferred — user said "we will do this later" —
this section is the record of what's already real vs. what's an open
gap, so the later pass starts from facts instead of re-auditing.

**Already real, verified by reading the actual files, not assumed:**

- [robots.ts](../src/app/robots.ts) + [sitemap.ts](../src/app/sitemap.ts)
  exist and use the real production domain (`siteConfig.url`), not a
  placeholder.
- Every page **except Home** exports its own `title`/`description`,
  resolved through the layout's `%s | Giada` template
  (`app/layout.tsx`'s `metadata.title.template`).
- Real `LocalBusiness` JSON-LD per showroom on the Contact page
  (`app/contact/page.tsx`'s `buildLocalBusinessSchemas()`), including
  real geo coordinates — ported from the Astro source's
  `ContactMain.astro`, not fabricated. `FAQPage` JSON-LD on the FAQ page,
  built from the same `items` the visible accordion renders (so the
  schema can't drift out of sync with the page content).
- Security headers in `next.config.ts` (not SEO directly, but a trust/Core
  Web Vitals signal search engines do weight).
- Alt-text discipline already established on every image across every
  section built so far (see per-section notes throughout this doc).

**Gaps — real, not yet addressed:**

1. **No Open Graph / Twitter Card metadata anywhere.** Zero
   `openGraph`/`twitter` fields on any page. For a luxury rug/textile
   brand, link-preview quality (Pinterest, Instagram, WhatsApp, iMessage)
   is a real commercial concern, not a nice-to-have — right now every
   shared link renders a blank/generic card.
2. **No `metadataBase`** set in `app/layout.tsx` — a prerequisite for
   resolving relative OG image paths to absolute URLs, and also silences
   a real Next.js build warning that will appear the moment any image
   path is added to metadata.
3. **No favicon beyond the bare `app/favicon.ico`** — no apple-touch-icon,
   no `manifest.ts`/`icon.tsx` for proper mobile/PWA/bookmark icons.
4. **No sitewide `Organization`/`WebSite` JSON-LD.** `siteConfig.social`
   (`data/site.ts`) already has the real Instagram/LinkedIn URLs sitting
   unused for a `sameAs` field — the data exists, just isn't wired into a
   schema yet.
5. **Home page has no explicit metadata export** — silently falls back to
   the layout default. The default title is fine for Home specifically,
   but the description is generic site copy, not written for the home
   route.
6. **No canonical tags** (follows from the missing `metadataBase`) — low
   priority today, but `CategoryGridSection`'s `/products?category=rugs`
   style hrefs (see "Category grid" above) could become a real
   duplicate-content question once the Products page actually filters by
   that query param instead of ignoring it.

Also tracked in "Status" above ("SEO parity check") and "Astro source
audit" (legacy redirect table, analytics — neither ported/added yet).

## Env vars

See `.env.example`.
- `PAYLOAD_SECRET` — Payload's admin/auth signing secret. Real generated
  value in local `.env` (not committed); generate a different one for
  production.
- `DATABASE_URL` / `DATABASE_URL_UNPOOLED` — real Neon Postgres connection
  strings (project created 2026-10-06, see "CMS" above) — populated
  automatically by `neon link`/`neon deploy`, not hand-edited.
- `NEON_BRANCH` — which Neon branch this `.env` was pulled from (set by
  `neon link`).
- `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` / `AWS_ENDPOINT_URL_S3` /
  `AWS_REGION` — Neon Object Storage (S3-compatible) credentials for the
  `giada-media` bucket, also auto-populated by `neon link`/`neon deploy`.
  AWS-standard names by design (see the `neon-object-storage` skill) —
  picked up by `@payloadcms/storage-s3`'s underlying AWS SDK client.
- `REVALIDATE_SECRET` — shared secret sent as the `x-revalidate-secret`
  header when calling `POST /api/revalidate` to bust the ISR cache for a
  tag. Will be called from Payload's own `afterChange` hooks once those
  are wired up.

## Next steps

1. Resolve open decisions with the client (see "Astro source audit"):
   contact form architecture, FAQ/testimonials CMS-editable or static,
   newsletter real-or-drop, the cream color question, the "Traverse"
   collection, redirect map completeness, analytics.
2. ~~Create the real Neon database and set `DATABASE_URL`~~ — done
   2026-10-06 (see "CMS" above): real project, `giada-media` object
   storage bucket wired into Media via `@payloadcms/storage-s3`, verified
   end-to-end. Remaining: narrow the over-broad MCP API key (see "CMS").
3. ~~Design and build the remaining Payload collections... and update
   `lib/api/<page>.ts` to query them via the Local API~~ — done for
   **Home** 2026-10-07 (see "CMS" above: a `home` global, not a
   collection, since it's a singleton page). Still open for every other
   page: Products, Collaborations, Gallery, Blog, Testimonials (the
   standalone page, distinct from Home's embedded section), Enquiries —
   field lists already known from the Astro audit below.
4. Port the legacy redirect table into `next.config.ts`.
5. Build `components/sections/{page}/*` for each page using the real
   Astro source as reference; extract shared pieces into
   `components/ui/*` once a second real use case shows up (not before).
6. Port `lib/animations.ts`'s GSAP utilities (char reveal, magnetic
   hover, curtain reveal, parallax) and the `[data-reveal]`
   IntersectionObserver system as shared Client Component helpers.
7. Replace placeholder copy in every `app/**/page.tsx` with real content,
   fixing the pre-existing bugs found along the way rather than
   preserving them.
