"use client";

import { useEffect } from "react";
import Script from "next/script";
import { installGoogleTranslateDomGuard } from "@/lib/google-translate-dom-guard";

const GOOGLE_TRANSLATE_ELEMENT_ID = "google_translate_element";

// Quick interim EN/FR solution (2026-10-29) — client-side translation
// widget, not real crawlable French pages. Explicitly chosen over the
// full Payload-localization approach for now; see project notes if this
// needs replacing later. `autoDisplay: false` stops it force-translating
// on load for visitors whose browser reports French as a preference —
// it should only act when someone deliberately picks French from the
// dropdown.
export default function GoogleTranslateWidget() {
  // Installed here (not e.g. the root layout) since this component is
  // the one thing on every page actually responsible for Google Translate
  // being active at all — see google-translate-dom-guard.ts for why this
  // exists. Runs once; Header (this component's only parent) persists
  // across client-side navigation, so there's no remount to double-patch
  // in normal use — the module-level guard flag covers dev Fast Refresh.
  useEffect(() => {
    installGoogleTranslateDomGuard();
  }, []);

  return (
    <>
      <div id={GOOGLE_TRANSLATE_ELEMENT_ID} className="google-translate-widget" translate="no" />
      <Script
        id="google-translate-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            function googleTranslateElementInit() {
              new google.translate.TranslateElement(
                {
                  pageLanguage: 'en',
                  includedLanguages: 'fr',
                  layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                  autoDisplay: false
                },
                '${GOOGLE_TRANSLATE_ELEMENT_ID}'
              );
            }
          `,
        }}
      />
      <Script src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" strategy="afterInteractive" />
    </>
  );
}
