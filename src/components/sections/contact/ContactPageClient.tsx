"use client";

import { useLivePreview } from "@payloadcms/live-preview-react";
import ContactHeroSection from "@/components/sections/contact/ContactHeroSection";
import ShowroomSection from "@/components/sections/contact/ShowroomSection";
import { mapContactData } from "@/lib/api/contact-map";
import type { ContactPage } from "@/payload-types";

// Unlike FaqPageClient (a 1:1 shape match), the raw "contact-page"
// document is missing `visit.locations` entirely — that's sourced from
// siteConfig, not a CMS field (see Contact.ts's comment for why).
// `mapContactData` injects it on every `useLivePreview` update, same as
// the normal cached SSR path (lib/api/contact.ts) does. Imported from
// contact-map.ts specifically, NOT contact.ts — contact.ts also exports
// getPayload-dependent code that can't be bundled into a Client
// Component (see contact-map.ts's comment).
//
// The wrapping <section> here matches page.tsx's original markup
// exactly — the LocalBusiness JSON-LD schema stays server-rendered from
// the initial fetch there, since it's for crawlers, not something a
// live-preview iframe needs to reflect.
export default function ContactPageClient({ initialData }: { initialData: ContactPage }) {
  const { data: raw } = useLivePreview<ContactPage>({
    initialData,
    serverURL: typeof window !== "undefined" ? window.location.origin : "",
    depth: 2,
  });

  const data = mapContactData(raw);

  return (
    <section className="bg-white px-5 pb-0 pt-24 md:px-10 lg:px-16 lg:pt-32">
      <div className="mx-auto max-w-6xl">
        <ContactHeroSection {...data.hero} />
        <ShowroomSection {...data.visit} />
      </div>
    </section>
  );
}
