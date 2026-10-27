"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Link } from "next-view-transitions";
import type { EventPopupProps } from "./EventPopup.types";

// Figma node 935:485 ("You're Invited" — Giada x Casa Giovanni, Miami Art
// Week). A plain native <dialog> (showModal/close), same pattern as
// GalleryWallSection's lightbox — Escape key and backdrop-click dismissal
// come for free from the browser, no modal library needed.
//
// Dismissal records a TIMESTAMP in localStorage under `popup.dismissKey`
// (keyed to the linked event's id — see lib/api/event-popup.ts), not a
// permanent flag: a visitor who closes it sees it again after
// `cooldownDays`, same event or not. Switching which event this popup
// promotes also re-shows it immediately, since that changes the key
// entirely. `cooldownDays: 0` shows it on every visit.
export default function EventPopup({ popup }: EventPopupProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { event } = popup;

  useEffect(() => {
    let withinCooldown = false;
    try {
      const dismissedAt = Number(localStorage.getItem(popup.dismissKey));
      if (dismissedAt) {
        const elapsedMs = Date.now() - dismissedAt;
        withinCooldown = elapsedMs < popup.cooldownDays * 24 * 60 * 60 * 1000;
      }
    } catch {
      // Private browsing / storage disabled — treat as not dismissed.
    }
    if (withinCooldown) return;

    const timer = setTimeout(() => {
      dialogRef.current?.showModal();
    }, popup.delaySeconds * 1000);

    return () => clearTimeout(timer);
  }, [popup.dismissKey, popup.delaySeconds, popup.cooldownDays]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => {
      try {
        localStorage.setItem(popup.dismissKey, String(Date.now()));
      } catch {
        // Nothing to persist to — it'll just show again next visit.
      }
    };
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, [popup.dismissKey]);

  return (
    <dialog
      ref={dialogRef}
      aria-label={popup.heading}
      onClick={(e) => {
        if (e.target === dialogRef.current) dialogRef.current?.close();
      }}
      className="fixed inset-0 m-auto hidden max-h-[90vh] w-[calc(100%-2.5rem)] max-w-[544px] overflow-y-auto border-none bg-white p-0 backdrop:bg-[rgba(28,25,23,0.6)] [&[open]]:block"
    >
      <button
        type="button"
        onClick={() => dialogRef.current?.close()}
        aria-label="Close"
        className="absolute right-4 top-4 cursor-pointer border-none bg-transparent p-2 leading-none text-stone-400 outline-none transition-colors duration-200 hover:text-stone-900 focus-visible:text-stone-900"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="flex flex-col items-center px-8 pb-10 pt-14 text-center sm:px-12">
        <div className="relative h-[72px] w-[80px]">
          <Image src={event.logo} alt="" fill sizes="80px" className="object-contain" />
        </div>

        <div className="mt-8 flex items-center gap-4">
          <span className="h-px w-12 bg-stone-300" aria-hidden="true" />
          <p className="text-[11px] font-semibold uppercase tracking-[3.85px] text-stone-400">{popup.eyebrow}</p>
          <span className="h-px w-12 bg-stone-300" aria-hidden="true" />
        </div>

        <h2 className="mt-8 font-heading text-4xl font-normal text-stone-900 sm:text-5xl">{popup.heading}</h2>

        <p className="mt-6 whitespace-pre-line text-[16px] leading-[1.6] text-stone-600">{popup.description}</p>

        <div className="mt-8 flex w-full flex-col items-center gap-4 border-y border-stone-200 py-4">
          <div className="flex items-center gap-2.5 text-[16px] text-stone-600">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
              {event.eventDateFormatted} &nbsp;|&nbsp; {event.timeLabel}
            </span>
          </div>
          <div className="flex items-center gap-2.5 text-[16px] font-medium capitalize text-stone-600">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
            <span>{event.location}</span>
          </div>
        </div>

        <Link
          href={`/events/${event.slug}`}
          onClick={() => dialogRef.current?.close()}
          className="group mt-8 flex w-full items-center justify-center gap-6 bg-stone-900 px-8 py-3.5 text-[12px] font-semibold uppercase tracking-[3px] text-white transition-colors duration-300 hover:bg-stone-700"
        >
          {popup.ctaLabel}
          <span aria-hidden="true" className="h-px w-10 origin-left bg-white transition-transform duration-300 group-hover:scale-x-125" />
        </Link>
      </div>
    </dialog>
  );
}
