import Link from "next/link";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { legalConverters } from "./LegalDocumentSection.converters";
import type { LegalDocumentSectionProps } from "./LegalDocumentSection.types";

// Ported from the real Astro source's shared components/legal/
// LegalDocument.astro — one component behind all three legal pages
// there, same reasoning here: Privacy/Terms/Shipping render this same
// component with different content instead of three near-identical
// copies.
const legalPages: { label: string; href: "/privacy" | "/terms" | "/shipping" }[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Shipping Policy", href: "/shipping" },
];

export default function LegalDocumentSection({
  title,
  intro,
  sections,
  questionLabel,
  pdfUrl,
  currentPath,
  className = "",
}: LegalDocumentSectionProps) {
  const otherLegalPages = legalPages.filter((page) => page.href !== currentPath);

  return (
    <div className={`bg-white text-stone-900 ${className}`}>
      <div className="border-b border-stone-100 px-5 pb-14 pt-24 md:px-10 lg:px-16 lg:pt-32">
        <div className="mx-auto max-w-3xl">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-stone-400">Legal</p>
          <h1 className="mb-5 font-didot text-4xl font-normal leading-tight tracking-tight text-stone-900 sm:text-5xl">
            {title}
          </h1>
          <p className="text-sm leading-7 text-stone-500">{intro}</p>
        </div>
      </div>

      <div className="px-5 pb-24 pt-14 md:px-10 lg:px-16">
        <div className="mx-auto max-w-3xl">
          <div className="divide-y divide-stone-100">
            {sections.map((section, index) => (
              <div key={section.id} className="py-10 first:pt-0">
                <div className="flex gap-6 md:gap-10">
                  <span className="mt-0.5 shrink-0 font-didot text-sm italic text-stone-300 md:w-6 md:text-right">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="mb-4 font-didot text-xl font-normal text-stone-900">{section.title}</h2>

                    {section.content && <RichText data={section.content} converters={legalConverters} />}

                    {section.note && <p className="mt-4 text-sm leading-7 text-stone-500">{section.note}</p>}

                    {section.isContactSection && (
                      <div className="mt-4 space-y-1 text-sm leading-7 text-stone-600">
                        <p>Giada Inc.</p>
                        <p>
                          Email:{" "}
                          <a
                            href="mailto:office@giada-studio.com"
                            className="text-stone-900 underline decoration-stone-300 underline-offset-2 transition-colors duration-200 hover:decoration-stone-600"
                          >
                            office@giada-studio.com
                          </a>
                        </p>
                        <p>
                          Website:{" "}
                          <Link
                            href="/"
                            className="text-stone-900 underline decoration-stone-300 underline-offset-2 transition-colors duration-200 hover:decoration-stone-600"
                          >
                            giada-studio.com
                          </Link>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-16 border-t border-stone-200 pt-8 text-sm leading-6 text-stone-500">
            Also see:{" "}
            {otherLegalPages.map((page, i) => (
              <span key={page.href}>
                <Link
                  href={page.href}
                  className="text-stone-900 underline decoration-stone-300 underline-offset-2 transition-colors duration-200 hover:decoration-stone-600"
                >
                  {page.label}
                </Link>
                {i < otherLegalPages.length - 1 && <span aria-hidden="true"> · </span>}
              </span>
            ))}
          </p>

          <div className="mt-16 flex flex-col gap-6 border-t border-stone-200 pt-12 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.25em] text-stone-400">{questionLabel}</p>
              <p className="text-sm leading-6 text-stone-500">
                Contact us at{" "}
                <a
                  href="mailto:office@giada-studio.com"
                  className="text-stone-900 underline decoration-stone-300 underline-offset-2 transition-colors duration-200 hover:decoration-stone-600"
                >
                  office@giada-studio.com
                </a>
              </p>
            </div>
            {/* Only rendered once a real PDF is attached in /admin — the
                real source's PDF links were all broken (the referenced
                files don't exist anywhere, confirmed against both the
                source and the live site), so this isn't carried forward
                as a dead link by default. */}
            {pdfUrl && (
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 border border-stone-200 px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-stone-600 transition-colors duration-200 hover:border-stone-400 hover:text-stone-900"
              >
                <svg
                  className="size-4 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 15V3m0 12-4-4m4 4 4-4M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17" />
                </svg>
                Download PDF
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
