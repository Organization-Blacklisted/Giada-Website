import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,

  // Off by default in 16.3.6 (confirmed in config-schema.js) — needed so
  // app/global-not-found.tsx actually renders for a URL that matches no
  // route at all (e.g. /events, which has a [slug] child but no page.tsx
  // of its own). Without this, those genuinely-unmatched paths fell
  // through to Next's bare default 404 instead of the site's own —
  // app/(frontend)/not-found.tsx only ever covered an explicit
  // notFound() call inside a route Next had already matched.
  experimental: {
    globalNotFound: true,
  },

  // 301s from the legacy WordPress/WooCommerce site (giada-studio.com
  // pre-Astro-cutover), ported from the real Astro source's
  // astro.config.mjs (same table, carried through this second
  // migration so old backlinks/search rankings aren't lost again).
  // Cross-checked against this project's actual current data before
  // porting, not copied blind: all 31 "still exists" product slugs and
  // none of the 23 "discontinued" ones are in the current CMS catalog,
  // and the other blog-post target (natural-fibers-a-guide) resolves.
  //
  // One fix applied, not a straight port: the Astro table itself
  // redirects '/the-ultimate-guide-to-choosing-the-right-rug-material'
  // to '/blog/choosing-a-rug-for-your-space' — that post doesn't exist
  // anywhere, not even in the Astro reference site itself (confirmed:
  // no such .mdx file in the handover, only an orphaned image folder
  // for it) — a stale link that was apparently never cleaned up after
  // the post was retired pre-handover. Redirected to '/blog' instead,
  // the same fallback the table's own author already used one line
  // below for a different post with "no equivalent yet."
  async redirects() {
    return [
      // Static / content pages
      { source: "/about-us", destination: "/our-story", permanent: true },
      { source: "/about", destination: "/our-story", permanent: true },
      { source: "/about/our-story", destination: "/our-story", permanent: true },
      { source: "/about/blog", destination: "/blog", permanent: true },
      { source: "/get-a-quote", destination: "/contact", permanent: true },
      { source: "/terms-and-conditions", destination: "/terms", permanent: true },
      { source: "/cart", destination: "/contact", permanent: true },
      { source: "/checkout", destination: "/contact", permanent: true },
      { source: "/my-account", destination: "/contact", permanent: true },
      { source: "/sample-page", destination: "/", permanent: true },
      { source: "/test", destination: "/", permanent: true },

      // WooCommerce shop/collection hubs — closest live equivalent is the rug catalog
      { source: "/shop", destination: "/rugs", permanent: true },
      { source: "/shop-collection", destination: "/rugs", permanent: true },
      { source: "/shop-collection-test", destination: "/rugs", permanent: true },
      { source: "/collection", destination: "/rugs", permanent: true },
      { source: "/collection/design-rug", destination: "/rugs", permanent: true },
      { source: "/product-category/rugs", destination: "/rugs", permanent: true },
      { source: "/aspen-luxury", destination: "/rugs", permanent: true },

      // Inspiration / project showcase pages — no per-project equivalent exists, all fold to Gallery
      { source: "/collection/custom-project", destination: "/contact", permanent: true },
      { source: "/collection/inspiration", destination: "/gallery", permanent: true },
      { source: "/design-inspiration", destination: "/gallery", permanent: true },
      { source: "/projects", destination: "/gallery", permanent: true },
      { source: "/projects/project-philippe-harvey-design", destination: "/gallery", permanent: true },
      { source: "/projects/project-patty-xenos-design", destination: "/gallery", permanent: true },
      { source: "/projects/project-sophia", destination: "/gallery", permanent: true },
      { source: "/projects/project-naomi-amram-design", destination: "/gallery", permanent: true },
      { source: "/projects/project-bbj-studio", destination: "/gallery", permanent: true },
      { source: "/projects/project-philip-hazan-design", destination: "/gallery", permanent: true },
      { source: "/projects/project-alain-carle-architect", destination: "/gallery", permanent: true },

      // Blog taxonomy archives — no category pages on the new blog, fold to the index
      { source: "/category/design-tips", destination: "/blog", permanent: true },
      { source: "/category/rug-care", destination: "/blog", permanent: true },
      { source: "/category/material-guide", destination: "/blog", permanent: true },

      // WooCommerce attribute archives (composition/origin/weaving-style) — closest live
      // equivalent is the filterable rug catalog, which exposes the same attributes as filters
      { source: "/composition/silk", destination: "/rugs", permanent: true },
      { source: "/composition/wool", destination: "/rugs", permanent: true },
      { source: "/composition/nz-wool", destination: "/rugs", permanent: true },
      { source: "/composition/nylon", destination: "/rugs", permanent: true },
      { source: "/composition/mohair", destination: "/rugs", permanent: true },
      { source: "/composition/merino", destination: "/rugs", permanent: true },
      { source: "/composition/none", destination: "/rugs", permanent: true },
      { source: "/composition/custom", destination: "/rugs", permanent: true },
      { source: "/origin/india", destination: "/rugs", permanent: true },
      { source: "/weaving-style/hand-tufted", destination: "/rugs", permanent: true },
      { source: "/weaving-style/flatweave", destination: "/rugs", permanent: true },
      { source: "/weaving-style/hand-woven", destination: "/rugs", permanent: true },
      { source: "/weaving-style/stitched-leather-shearling", destination: "/rugs", permanent: true },
      { source: "/weaving-style/custom", destination: "/rugs", permanent: true },

      // Blog posts — matched by topic to the closest existing article. The first one's
      // original Astro-table target (/blog/choosing-a-rug-for-your-space) doesn't exist
      // anywhere, including in the Astro reference itself — folded to the blog index
      // instead, same fallback already used for the "care tips" post below.
      { source: "/the-ultimate-guide-to-choosing-the-right-rug-material", destination: "/blog", permanent: true },
      { source: "/the-complete-guide-to-rug-sizing-and-placement", destination: "/blog/natural-fibers-a-guide", permanent: true },
      { source: "/5-essential-tips-for-caring-for-your-handcrafted-rug", destination: "/blog", permanent: true },

      // Products that still exist today — same slug, new path. Cross-checked against the
      // live Products collection: all 31 of these are real current products.
      ...[
        "thar-dusk", "stepwell", "morse", "jali", "taupe-dash", "rain-thread", "windward",
        "sutra", "herringbone", "brushstroke", "ripple", "dhurrie", "varanasi", "morning-mist",
        "lattice", "tweed", "sunbeam", "cobblestone", "greige", "pebble", "beaded", "woodgrain",
        "spice-line", "mercury", "borderline", "leopard", "dune", "cloud-knot", "arrow-band",
        "tuft", "corduroy", "handspun",
      ].map((slug) => ({ source: `/product/${slug}`, destination: `/products/${slug}`, permanent: true })),

      // Discontinued products — no current equivalent, fold to the rug catalog.
      // Cross-checked: none of these 23 slugs exist in the live Products collection.
      ...[
        "bubble", "tahoe", "tahoe-2", "aspen", "val-disere", "grivola", "philippe", "lichen",
        "tresse", "alveole", "deer-valley", "terrazzo", "palme", "dusk", "matisse",
        "ht24-nzw-080", "maharaja", "monsoon-stripe", "virgin-wool", "silver-braid", "brume-2",
        "fuji3", "rivag", "cumulu",
      ].map((slug) => ({ source: `/product/${slug}`, destination: "/rugs", permanent: true })),
    ];
  },

  // `localPatterns` is an allowlist, not an addition to Next's default
  // "any local path is fine" behavior — adding it without listing the
  // existing /images/** paths broke every current next/image usage site-
  // wide (confirmed: every image 400'd after adding just the Payload
  // pattern below, fixed by listing both explicitly).
  // Payload's Media collection uploads are served from this same app at
  // /api/media/file/* — once Neon Object Storage is wired in as the
  // upload adapter, uploaded files still resolve through that same path
  // (Payload proxies them), so no remotePatterns entry is needed here.
  images: {
    localPatterns: [
      {
        pathname: "/images/**",
      },
      {
        pathname: "/api/media/file/**",
      },
    ],
  },

  // HTTP response headers applied to every route
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Stops browsers from guessing the content-type (prevents MIME-sniffing attacks)
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Blocks the site from being embedded in an iframe on another
          // domain (clickjacking protection) while still allowing
          // same-origin framing — Payload's admin Live Preview embeds
          // frontend routes (e.g. /faq) in an iframe within /admin,
          // which is the same Next.js app/origin, so a blanket `DENY`
          // broke that entirely (confirmed: Vercel showed "refused to
          // connect", the exact browser response to this header
          // rejecting the frame). `SAMEORIGIN` keeps the actual
          // protection — no third-party site can still frame this one.
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // Controls how much referrer info is sent when clicking outbound links
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Tells browsers to only connect via HTTPS for the next year (once live on HTTPS)
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
          // Disables browser features not needed by this site
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        // Static assets (SVGs, images in /public) — cache for 1 week, revalidate
        source: "/:path*\\.(svg|ico|png|jpg|jpeg|webp|avif|woff2)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" },
        ],
      },
    ];
  },
};

export default withPayload(nextConfig);
