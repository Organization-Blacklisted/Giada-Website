import type { Metadata, Viewport } from "next";
import { GoogleTagManager } from "@next/third-parties/google";
import { ViewTransitions } from "next-view-transitions";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { siteConfig } from "@/data/site";
import { avenir, didot } from "@/fonts";
import "./globals.css";

export const metadata: Metadata = {
  // Resolves every relative URL in any page's metadata (openGraph images,
  // canonical tags once those exist) to an absolute one against the real
  // production domain — same siteConfig.url sitemap.ts/robots.ts already
  // use, so there's one source of truth for it, not two. Also silences
  // the "metadataBase property... not set" build warning seen on every
  // build this whole engagement.
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  // Sitewide Open Graph / Twitter Card fallback — covers any route that
  // doesn't call buildPageMetadata (lib/metadata.ts) itself, e.g.
  // not-found.tsx. Pages that do call it override every field here with
  // their own real title/description/image, since Next replaces a
  // child's `openGraph`/`twitter` object wholesale rather than merging
  // into it field-by-field.
  openGraph: {
    siteName: siteConfig.name,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
};

// Viewport is kept separate from metadata (Next.js 15+ convention).
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

// Sitewide Organization + WebSite JSON-LD — rendered once here rather
// than per-page, since both describe the business/site itself, not any
// one page's content (contrast with Contact's LocalBusiness or FAQ's
// FAQPage schema, which are genuinely per-page). `sameAs` links the real
// Instagram/LinkedIn URLs already in siteConfig.social (used elsewhere
// only for the footer's icons) to this entity, the standard way to tell
// Google these social profiles and this website are the same business.
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  url: siteConfig.url,
  logo: `${siteConfig.url}/images/giada-logo.webp`,
  description: siteConfig.description,
  sameAs: [siteConfig.social.instagram, siteConfig.social.linkedin],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  url: siteConfig.url,
};

// Client's own GTM container (GTM-WCGH9SJW), confirmed 2026-10-21. Gated
// on the env var so a missing/unset value (e.g. a preview deploy without
// it configured) just no-ops instead of firing a broken container.
const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <ViewTransitions>
      <html lang="en" className={`h-full antialiased ${avenir.variable} ${didot.variable}`}>
        <body className="min-h-full flex flex-col">
          {gtmId && <GoogleTagManager gtmId={gtmId} />}
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
          {/* Skip-to-content — invisible until focused, first tab stop for keyboard/screen-reader users */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:rounded-md focus:bg-stone-900 focus:px-4 focus:py-2 focus:text-white"
          >
            Skip to main content
          </a>
          <Header />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
          <ScrollReveal />
        </body>
      </html>
    </ViewTransitions>
  );
}
