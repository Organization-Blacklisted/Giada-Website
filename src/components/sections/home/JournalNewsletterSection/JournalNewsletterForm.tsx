"use client";

import { useState } from "react";
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
    setIsSubmitting(true);
    setStatus("idle");
    setErrorMessage("");

    const result = await subscribeToNewsletter(name, email);

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
    return (
      <p className="mx-auto max-w-[587px] text-center text-[14px] text-stone-600" data-reveal>
        Thank you for subscribing — check your inbox for a confirmation.
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-[587px]" data-reveal>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row">
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
            aria-label="Your Name"
            required
            disabled={isSubmitting}
            className="h-12 w-full border border-stone-200 bg-white px-4 text-[16px] text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-900 disabled:opacity-60 sm:flex-1 sm:border-r-0"
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
            className="h-12 w-full border border-stone-200 bg-white px-4 text-[16px] text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-900 disabled:opacity-60 sm:flex-1"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="group flex h-12 w-full shrink-0 items-center justify-center gap-6 whitespace-nowrap bg-stone-900 px-8 text-[12px] font-semibold uppercase tracking-[1.92px] text-white disabled:opacity-60"
        >
          {isSubmitting ? "Subscribing…" : buttonLabel}
          <span aria-hidden="true" className="h-px w-10 bg-white" />
        </button>
      </form>
      {status === "error" && <p className="mt-3 text-center text-[13px] text-red-600">{errorMessage}</p>}
    </div>
  );
}
