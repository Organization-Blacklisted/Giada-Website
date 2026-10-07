import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,

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
