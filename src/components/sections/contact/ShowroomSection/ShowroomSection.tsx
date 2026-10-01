import type { ShowroomLocation, ShowroomSectionProps } from "./ShowroomSection.types";

function ShowroomCard({ location }: { location: ShowroomLocation }) {
  return (
    <article className="group relative overflow-hidden border border-stone-200 bg-white px-6 py-8 transition-all duration-300 hover:border-stone-300 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
      <div className="mb-9 flex items-center justify-between gap-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.38em] text-stone-400">{location.type}</p>

        <span className="h-px flex-1 bg-stone-200" />

        <a
          href={location.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${location.city} showroom in Google Maps`}
          className="shrink-0 text-stone-400 transition-colors duration-200 hover:text-stone-900"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
            />
          </svg>
        </a>
      </div>

      <h3 className="mb-6 font-didot text-4xl font-normal italic leading-none tracking-tight text-stone-900 sm:text-5xl">
        {location.city}
      </h3>

      <address className="mb-8 space-y-1 not-italic">
        {location.lines.map((line) => (
          <p key={line} className="text-[14px] leading-[1.8] text-stone-500">
            {line}
          </p>
        ))}
        <a href={location.phoneHref} className="inline-block text-[14px] font-medium text-stone-800 transition-colors hover:text-stone-500">
          {location.phone}
        </a>
      </address>

      <div className="mb-8 aspect-[16/10] w-full overflow-hidden border border-stone-100">
        <iframe
          src={`https://www.google.com/maps?q=${location.geo.lat},${location.geo.lng}&z=15&output=embed`}
          title={`Map showing the ${location.city} showroom location`}
          className="h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <div className="flex flex-col gap-4 border-t border-stone-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <a
          href={`mailto:office@giada-studio.com?subject=${location.city} Showroom Visit Enquiry`}
          className="inline-flex items-center text-[10px] font-semibold uppercase tracking-[0.28em] text-stone-500 transition-colors hover:text-stone-900"
        >
          Book Showroom Visit
          <span className="ml-3 transition-transform duration-300 group-hover:translate-x-1">→</span>
        </a>
      </div>
    </article>
  );
}

// "Visit & Enquiries" — intro, general contact row, showroom cards.
// Matches the real source's second <section> inside ContactMain.astro.
export default function ShowroomSection({
  eyebrow,
  heading,
  description,
  generalContact,
  locations,
  className = "",
}: ShowroomSectionProps) {
  return (
    <section data-reveal className={`border-t border-stone-200 py-16 md:py-20 lg:py-24 ${className}`}>
      {/* Section intro */}
      <div className="mb-12 grid gap-8 md:mb-16 lg:grid-cols-[0.42fr_1fr] lg:gap-16">
        <div>
          <div className="mb-7 flex items-center gap-4">
            <span className="h-px w-10 bg-stone-300" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-stone-400">{eyebrow}</p>
          </div>

          <h2 className="font-didot text-3xl font-normal leading-tight tracking-tight text-stone-900 sm:text-4xl">
            {heading}
          </h2>
        </div>

        <p className="max-w-2xl text-[14px] leading-[1.9] text-stone-500 lg:pt-12">{description}</p>
      </div>

      {/* General contact row */}
      <div className="mb-10 border-y border-stone-200 py-7 md:mb-12">
        <div className="grid gap-8 md:grid-cols-3 md:gap-10">
          <div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-stone-400">
              {generalContact.email.label}
            </p>
            <a href={generalContact.email.href} className="text-[14px] text-stone-800 transition-colors hover:text-stone-500">
              {generalContact.email.value}
            </a>
          </div>

          <div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-stone-400">
              {generalContact.studioHours.label}
            </p>
            <p className="text-[14px] leading-[1.75] text-stone-600">
              {generalContact.studioHours.days}
              <br className="sm:hidden" />
              <span className="hidden sm:inline"> · </span>
              {generalContact.studioHours.hours}
            </p>
          </div>

          <div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-stone-400">
              {generalContact.responseTime.label}
            </p>
            <p className="text-[14px] leading-[1.75] text-stone-600">{generalContact.responseTime.value}</p>
          </div>
        </div>
      </div>

      {/* Showroom cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
        {locations.map((location) => (
          <ShowroomCard key={location.city} location={location} />
        ))}
      </div>
    </section>
  );
}
