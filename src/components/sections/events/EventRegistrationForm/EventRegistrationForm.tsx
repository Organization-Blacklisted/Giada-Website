"use client";

import { useState } from "react";
import { submitEventRegistration } from "@/lib/actions/event-registration";
import type { EventRegistrationFormProps } from "./EventRegistrationForm.types";

// Same label/input visual language as EnquiryForm
// (components/sections/contact/EnquiryForm) — label-above-input,
// underlined, no border box — kept consistent rather than reinventing
// field styling for a second form on the site.
const fieldLabel = "text-xs font-semibold uppercase tracking-[0.25em] text-stone-500";
const underlineField =
  "border-b border-stone-300 bg-transparent pb-3 pt-1 text-[16px] text-stone-900 outline-none transition-colors duration-200 placeholder:text-stone-400 focus:border-stone-900";

export default function EventRegistrationForm({
  eventId,
  formHeading,
  confirmButtonLabel,
  className = "",
}: EventRegistrationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    setIsSubmitting(true);
    setServerError("");
    const result = await submitEventRegistration({
      eventId,
      fullName: String(formData.get("fullName") ?? ""),
      companyName: String(formData.get("companyName") ?? ""),
      email: String(formData.get("email") ?? ""),
      mobileNumber: String(formData.get("mobileNumber") ?? ""),
    });

    setIsSubmitting(false);
    if (result.success) {
      setIsSubmitted(true);
      return;
    }
    setServerError(result.error ?? "Something went wrong. Please try again.");
  }

  return (
    <section className={`px-5 pb-20 md:px-10 lg:px-16 ${className}`}>
      <div className="mx-auto max-w-[744px] text-center">
        <h2 className="mb-10 font-heading text-2xl font-normal text-stone-900" data-reveal>
          {formHeading}
        </h2>

        <div className="border border-stone-900 bg-white p-8 text-left md:p-12" data-reveal>
          {isSubmitted ? (
            <p className="py-8 text-center text-[16px] text-stone-600">
              Thank you — your registration is confirmed. We look forward to welcoming you.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label htmlFor="fullName" className={fieldLabel}>
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Your full name"
                    required
                    className={underlineField}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="companyName" className={fieldLabel}>
                    Company Name
                  </label>
                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    placeholder="Your company name"
                    required
                    className={underlineField}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className={fieldLabel}>
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Your email"
                    required
                    className={underlineField}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="mobileNumber" className={fieldLabel}>
                    Mobile Number
                  </label>
                  <input
                    id="mobileNumber"
                    name="mobileNumber"
                    type="tel"
                    placeholder="Your mobile number"
                    required
                    className={underlineField}
                  />
                </div>
              </div>

              {serverError && (
                <p className="rounded bg-red-50 px-4 py-3 text-sm text-red-600">{serverError}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="group flex items-center justify-center gap-10 bg-stone-900 py-4 text-[12px] font-semibold uppercase tracking-[3px] text-white transition-colors duration-300 hover:bg-stone-700 disabled:opacity-50"
              >
                {isSubmitting ? "Submitting…" : confirmButtonLabel}
                <span
                  aria-hidden="true"
                  className="h-px w-10 origin-left bg-white transition-transform duration-300 group-hover:scale-x-125"
                />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
