"use client";

import { useState } from "react";
import Script from "next/script";
import { subscribeToNewsletter } from "@/lib/actions/newsletter";

// Extracted from JournalNewsletterSection (which stays a server
// component for SectionHeading/static content) — this is the only part
// that needs client-side state, same split EnquiryForm uses for the
// same reason. Wired up 2026-10-23; previously just a decorative
// input/button with no handler at all. Name field added 2026-10-23 per
// explicit mockup — content/copy for the resulting emails still pending
// separate discussion, this is just the form + data plumbing.
export default function JournalNewsletterForm({
  emailPlaceholder,
  buttonLabel,
}: {
  emailPlaceholder: string;
  buttonLabel: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const turnstileToken = String(formData.get("cf-turnstile-response") ?? "");

    setIsSubmitting(true);
    setStatus("idle");
    setErrorMessage("");

    const result = await subscribeToNewsletter(name, email, turnstileToken);

    setIsSubmitting(false);
    if (result.success) {
      setStatus("success");
      setName("");
      setEmail("");
      return;
    }
    setStatus("error");
    setErrorMessage(result.error ?? "Something went wrong. Please try again.");
  }

  if (status === "success") {
    // No data-reveal here — this element only exists after a real submit
    // (replacing the form), well after ScrollReveal's one-time scan for
    // [data-reveal] elements on mount already ran. It was never
    // discovered/observed, so it never got .is-visible added and sat
    // permanently at opacity:0 — looking like the section just vanished
    // on success. Found 2026-10-30, during real end-to-end form testing.
    return (
      <p className="mx-auto max-w-[587px] text-center text-[14px] text-stone-600">
        Thank you for subscribing — you&apos;ll receive a confirmation email shortly. Welcome to the Giada
        community.
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-[587px]" data-reveal>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:gap-0">
          {/* `lg:contents` dissolves this wrapper at the one-line
              breakpoint so the two inputs become direct flex items
              alongside the button below, sharing a single row instead of
              a row-then-row stack. Below `lg` it stays a real flex box
              (stacked on mobile, side-by-side from `sm`) — the layout
              this section shipped with, untouched. Turnstile's widget
              (below) is a sibling of this row now, not a child of it —
              it previously would have landed as a third flex item in the
              one-line row itself, breaking that layout. */}
          <div className="flex flex-col sm:flex-row lg:contents">
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              aria-label="Your Name"
              required
              disabled={isSubmitting}
              className="relative h-12 w-full border border-stone-200 bg-white px-4 text-[16px] text-stone-900 placeholder:text-stone-400 focus:z-10 focus:outline-none focus:ring-1 focus:ring-stone-900 disabled:opacity-60 sm:flex-1 sm:border-r-0"
            />
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={emailPlaceholder}
              aria-label={emailPlaceholder}
              required
              disabled={isSubmitting}
              className="relative h-12 w-full border border-stone-200 bg-white px-4 text-[16px] text-stone-900 placeholder:text-stone-400 focus:z-10 focus:outline-none focus:ring-1 focus:ring-stone-900 disabled:opacity-60 sm:flex-1 lg:border-r-0"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="group flex h-12 w-full shrink-0 cursor-pointer items-center justify-center gap-6 whitespace-nowrap bg-stone-900 px-8 text-[12px] font-semibold uppercase tracking-[1.92px] text-white transition-colors duration-300 hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-60 lg:w-auto"
          >
            {isSubmitting ? "Subscribing…" : buttonLabel}
            <span aria-hidden="true" className="h-px w-10 origin-left bg-white transition-transform duration-300 group-hover:scale-x-125" />
          </button>
        </div>

        {/* Same implicit-rendering pattern as EnquiryForm/
            EventRegistrationForm — added 2026-10-29 pre-launch audit
            (this form had no bot protection, despite emailing a real
            subscriber and adding them to the live Brevo list). A
            separate row below the input/button row rather than a flex
            item within it — see comment above. */}
        <div className="cf-turnstile" data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} />
        <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
      </form>
      {status === "error" && <p className="mt-3 text-center text-[13px] text-red-600">{errorMessage}</p>}
    </div>
  );
}
