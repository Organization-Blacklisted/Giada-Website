import Image from "next/image";
import type { EventHeroSectionProps } from "./EventHeroSection.types";

export default function EventHeroSection({
  eyebrow,
  logo,
  heading,
  description,
  eventDateFormatted,
  timeLabel,
  location,
  className = "",
}: EventHeroSectionProps) {
  return (
    <section className={`px-5 pb-10 pt-24 text-center md:px-10 lg:px-16 lg:pt-32 ${className}`}>
      <div className="mx-auto flex max-w-3xl flex-col items-center">
        <div className="flex items-center gap-4" data-reveal>
          <span className="h-px w-12 bg-stone-300" aria-hidden="true" />
          <p className="text-[11px] font-semibold uppercase tracking-[3.85px] text-stone-400">{eyebrow}</p>
          <span className="h-px w-12 bg-stone-300" aria-hidden="true" />
        </div>

        <div className="relative mt-16 h-[100px] w-[112px]" data-reveal>
          <Image src={logo} alt="" fill sizes="112px" className="object-contain" />
        </div>

        <h1 className="mt-10 font-heading text-4xl font-normal text-stone-900 md:text-5xl" data-reveal>
          {heading}
        </h1>

        <p className="mt-6 whitespace-pre-line text-[16px] leading-[1.85] text-stone-600" data-reveal>
          {description}
        </p>

        <div className="mt-10 flex w-full flex-col items-center gap-4 border-y border-stone-200 py-4 sm:flex-row sm:justify-center sm:gap-16" data-reveal>
          <div className="flex items-center gap-2.5 text-[16px] text-stone-600">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M8 2V5" stroke="#57534D" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 2V5" stroke="#57534D" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
              <path
                d="M5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3Z"
                stroke="#57534D"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M3 9H21" stroke="#57534D" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>
              {eventDateFormatted} &nbsp;|&nbsp; {timeLabel}
            </span>
          </div>
          <div className="flex items-center gap-2.5 text-[16px] font-medium capitalize text-stone-600">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M20 10C20 14.993 14.461 20.193 12.601 21.799C12.4277 21.9293 12.2168 21.9998 12 21.9998C11.7832 21.9998 11.5723 21.9293 11.399 21.799C9.539 20.193 4 14.993 4 10C4 7.87827 4.84285 5.84344 6.34315 4.34315C7.84344 2.84285 9.87827 2 12 2C14.1217 2 16.1566 2.84285 17.6569 4.34315C19.1571 5.84344 20 7.87827 20 10Z"
                stroke="#57534D"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15 10C15 11.6569 13.6569 13 12 13C10.3431 13 9 11.6569 9 10C9 8.34315 10.3431 7 12 7C13.6569 7 15 8.34315 15 10Z"
                stroke="#57534D"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>{location}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
