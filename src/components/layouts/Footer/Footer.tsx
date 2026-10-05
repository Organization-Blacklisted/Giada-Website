import { Link } from "next-view-transitions";
import { footerCompanyLinks, footerSitemapLinks } from "@/data/nav.config";
import { siteConfig } from "@/data/site";

const linkColumns = [
  { title: "Sitemap", links: footerSitemapLinks },
  { title: "Company", links: footerCompanyLinks },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative flex w-full flex-col border-t border-stone-200 bg-white text-stone-900">
      {/*
        Top grid — the real source jumps straight from 1 column to this
        4-column desktop grid at md (768px), with nothing in between.
        That leaves real problems in the 640-1024px tablet range
        (confirmed by testing, not just theory): a lopsided single
        column with large dead space next to short link lists below
        640px, and cramped columns if all 4 real-source columns try to
        share a row too early. Three tiers added, none in the real
        source:
        - base (mobile, <640px): 2 columns — not the true single-column
          stack the real source has here. User asked to keep Sitemap +
          Company side by side even at phone width (2026-09-30): they're
          just link lists, plenty of room. Description and Contact Us
          each span both columns (full-width rows) — Contact Us still
          needs the room for its nested Montréal/Miami split even on
          mobile, that one does genuinely need to stay full-width.
        - sm (640px+): 3 columns, 1fr/1fr/2fr — not equal thirds.
          Description spans full width; Sitemap, Company, and Contact
          Us share one row. Ratio matches the one already proven at the
          lg tier below (0.55fr/0.55fr/1.1fr — same 1:1:2 relationship):
          Company only has 3 short links and doesn't need equal width
          with Contact Us, which does. (This tier used to start at md/
          768px with an intermediate 2-column tier below it — dropped,
          user asked to keep 3-across all the way down to 640px.)
        - lg (1024px+): the real source's 4-column layout, unchanged.
      */}
      <div
        className="grid grid-cols-2 gap-x-6 gap-y-10 px-8 pb-10 pt-12
        sm:grid-cols-[1fr_1fr_2fr] sm:gap-x-6 sm:gap-y-12 sm:px-10 sm:pb-12 sm:pt-14
        lg:grid-cols-[1.5fr_0.55fr_0.55fr_1.1fr] lg:gap-x-10
        lg:px-16 lg:pb-14 lg:pt-16"
      >
        {/* Description + socials */}
        <div className="col-span-2 w-full sm:col-span-3 lg:col-span-1 lg:max-w-[480px] lg:pr-12">
          <p className="text-[15px] leading-[1.75] text-stone-600">{siteConfig.footerDescription}</p>

          <div className="mt-7 flex gap-4">
            <Link
              href={siteConfig.social.instagram}
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
              className="flex size-6 items-center justify-center text-stone-900 no-underline transition-opacity duration-300 hover:opacity-50"
            >
              <svg className="size-5" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Z"
                />
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8.75 12a3.25 3.25 0 1 0 6.5 0 3.25 3.25 0 0 0-6.5 0Z"
                />
                <path fill="currentColor" d="M17.5 6.7a.8.8 0 1 1-1.6 0 .8.8 0 0 1 1.6 0Z" />
              </svg>
            </Link>

            <Link
              href={siteConfig.social.linkedin}
              aria-label="LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
              className="flex size-6 items-center justify-center text-stone-900 no-underline transition-opacity duration-300 hover:opacity-50"
            >
              <svg className="size-5" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M6.94 8.5H3.56V21h3.38V8.5ZM5.25 3a2.09 2.09 0 1 0 0 4.17A2.09 2.09 0 0 0 5.25 3Zm15.19 10.84c0-3.77-2.01-5.63-4.7-5.63-2.17 0-3.14 1.19-3.68 2.03V8.5H8.68V21h3.38v-6.97c0-1.84.35-3.62 2.63-3.62 2.25 0 2.28 2.1 2.28 3.74V21h3.47v-7.16Z"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* Link columns */}
        {linkColumns.map((column) => (
          <div key={column.title} className="flex flex-col items-start">
            <h3 className="font-heading mb-5 text-[13px] font-semibold uppercase tracking-[0.18em] text-stone-400">
              {column.title}
            </h3>
            <div className="flex flex-col gap-3">
              {column.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[14px] leading-snug text-stone-600 no-underline transition-opacity duration-300 hover:opacity-50"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* Contact us */}
        {/* lg:col-span-1 stated explicitly even though sm:col-span-1
            already covers 1024px+ on paper — that sm: override silently
            failed to compile once before (see ARCHITECTURE.md), so this
            tier states its own value rather than relying on sm: to cascade up. */}
        <div className="col-span-2 flex flex-col items-start sm:col-span-1 lg:col-span-1">
          <h3 className="font-heading mb-5 text-[13px] font-semibold uppercase tracking-[0.18em] text-stone-400">
            Contact Us
          </h3>

          <div className="flex w-full items-start gap-5">
            {siteConfig.locations.map((location, i) => (
              <div
                key={location.city}
                className={`flex flex-1 flex-col gap-1 ${i > 0 ? "border-l border-stone-200 pl-5" : ""}`}
              >
                <p className="mb-1 text-[12px] font-semibold uppercase tracking-[0.14em] text-stone-400">
                  {location.city}
                </p>
                <address className="not-italic">
                  {location.lines.map((line) => (
                    <p key={line} className="text-[13px] leading-snug text-stone-600">
                      {line}
                    </p>
                  ))}
                  <Link
                    href={location.phoneHref}
                    className="mt-1.5 inline-block text-[13px] leading-snug text-stone-600 no-underline transition-opacity duration-300 hover:opacity-50"
                  >
                    {location.phone}
                  </Link>
                </address>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar — no Hash²Code credit (original build agency, removed
          per team decision 2026-09-29; real source had it, we're the new
          agency doing this migration). justify-between/max-md:flex-col
          was leftover from when there were two items (copyright + that
          credit link) — with only the copyright left, centered on all
          screens instead of defaulting to the left. */}
      <div className="flex w-full items-center justify-center border-t border-stone-200 px-8 py-4 md:px-10 lg:px-16">
        <p className="m-0 text-[13px] leading-none tracking-wide text-stone-400">
          &copy; {year} {siteConfig.name}.
        </p>
      </div>
    </footer>
  );
}
