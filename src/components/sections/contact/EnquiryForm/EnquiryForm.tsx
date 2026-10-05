"use client";

import { Link, useTransitionRouter } from "next-view-transitions";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap-init";
import { submitEnquiry } from "@/lib/actions/enquiry";
import type { EnquiryPayload, EnquiryType } from "@/types/enquiry";

// Labels confirmed from the real source; slugified the same way
// (`.toLowerCase().replace(/[\s/]+/g, '-')`) to produce the value —
// happens to match the EnquiryType union already in place.
const enquiryTypes: { value: EnquiryType; label: string }[] = [
  { value: "bespoke-rug-project", label: "Bespoke Rug Project" },
  { value: "textile-in-glass-project", label: "Textile in Glass Project" },
  { value: "designer-architect-partnership", label: "Designer / Architect Partnership" },
  { value: "trade-programme", label: "Trade Programme" },
  { value: "showroom-visit", label: "Showroom Visit" },
  { value: "general-enquiry", label: "General Enquiry" },
];

const fieldLabel = "text-xs font-semibold uppercase tracking-[0.25em] text-stone-500";
const underlineField =
  "border-b border-stone-300 bg-transparent pb-3 pt-1 text-[15px] text-stone-900 outline-none transition-colors duration-200 placeholder:text-stone-400 focus:border-stone-900";

export default function EnquiryForm() {
  // next-view-transitions's router, not next/navigation's — a plain
  // useRouter().push() doesn't trigger startViewTransition(), so this
  // redirect would silently skip the crossfade every other navigation
  // on the site gets (found during a later audit, fixed 2026-10-05).
  const router = useTransitionRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  // Real source GSAP field stagger (contact.astro's inline <script>),
  // ported to a scoped effect instead of a global scroll-triggered script.
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fields = [...form.querySelectorAll<HTMLElement>('input, select, textarea, button[type="submit"]')];

    const tween = gsap.fromTo(
      fields,
      { opacity: 0, x: -20 },
      {
        opacity: 1,
        x: 0,
        duration: reduced ? 0.01 : 0.6,
        stagger: reduced ? 0 : 0.08,
        ease: "expo.out",
        scrollTrigger: { trigger: form, start: "top 80%", once: true },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload: EnquiryPayload = {
      firstName: String(formData.get("firstName") ?? ""),
      lastName: String(formData.get("lastName") ?? ""),
      email: String(formData.get("email") ?? ""),
      type: formData.get("type") as EnquiryType,
      message: String(formData.get("message") ?? ""),
    };

    setIsSubmitting(true);
    setServerError("");
    const result = await submitEnquiry(payload);

    if (result.success) {
      router.push("/contact/success");
      return;
    }

    setIsSubmitting(false);
    setServerError(result.error ?? "Something went wrong. Please try again.");
  }

  return (
    <div>
      <p className="mb-10 text-[11px] font-semibold uppercase tracking-[0.35em] text-stone-400">
        Send an Enquiry
      </p>

      <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="first-name" className={fieldLabel}>
              First Name
            </label>
            <input
              id="first-name"
              name="firstName"
              type="text"
              placeholder="Your first name"
              required
              className={underlineField}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="last-name" className={fieldLabel}>
              Last Name
            </label>
            <input
              id="last-name"
              name="lastName"
              type="text"
              placeholder="Your last name"
              required
              className={underlineField}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="email" className={fieldLabel}>
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            className={underlineField}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="type" className={fieldLabel}>
            Type of Enquiry
          </label>
          <div className="relative">
            <select
              id="type"
              name="type"
              required
              defaultValue=""
              className={`w-full cursor-pointer appearance-none pr-6 ${underlineField}`}
            >
              <option value="" disabled>
                Select an option
              </option>
              {enquiryTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 rotate-90 text-stone-400"
            >
              ›
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="message" className={fieldLabel}>
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={6}
            placeholder="Tell us about your project, your space, and your vision..."
            required
            className="resize-none border border-stone-200 bg-white px-4 py-3 text-[15px] text-stone-900 outline-none transition-colors duration-200 placeholder:text-stone-400 focus:border-stone-600"
          />
        </div>

        {/* TODO: real source gates submission on a Cloudflare Turnstile
            token here — currently non-functional in the live site too
            (empty site key). Anti-spam approach is still an open Phase 0
            decision; not wired up until that's resolved. */}

        {serverError && (
          <p className="rounded bg-red-50 px-4 py-3 text-sm text-red-600">{serverError}</p>
        )}

        <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full border border-stone-900 bg-stone-900 px-9 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-white transition-colors duration-300 hover:border-stone-700 hover:bg-stone-700 disabled:opacity-50 sm:w-auto"
          >
            {isSubmitting ? "Sending…" : "Send Message →"}
          </button>
          <p className="text-xs italic text-stone-400">We respond within one business day.</p>
        </div>
      </form>

      <p className="mt-8 text-sm text-stone-500">
        Have a quick question?{" "}
        <Link
          href="/faq"
          className="text-stone-900 underline decoration-stone-300 underline-offset-2 transition-colors duration-200 hover:decoration-stone-600"
        >
          See our FAQ
        </Link>
      </p>
    </div>
  );
}
