"use client";

import { useState } from "react";
import type { AccordionItem, AccordionProps } from "./Accordion.types";

/**
 * Single-open-at-a-time accordion — confirmed real behavior from the
 * Astro source's FAQ page (opening one item closes any other open item).
 *
 * One deliberate improvement over a straight port: the real source
 * animates height via a hardcoded `max-height: 500px` cap, which clips
 * any content longer than that. Since this component is meant to be
 * reused (legal sections, product specs, not just FAQ — some of which
 * may run longer), it uses the CSS grid-rows trick instead
 * (`grid-template-rows: 0fr -> 1fr`) — same visual result, no arbitrary
 * length ceiling, no JS height measurement needed either.
 */
export default function Accordion({ items, defaultOpenIndex = 0, className = "" }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState(defaultOpenIndex);

  return (
    <div className={`w-full ${className}`}>
      {items.map((item, index) => (
        <Row
          key={item.id ?? item.title}
          item={item}
          isOpen={openIndex === index}
          onToggle={() => setOpenIndex((prev) => (prev === index ? -1 : index))}
        />
      ))}
    </div>
  );
}

function Row({ item, isOpen, onToggle }: { item: AccordionItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-stone-200">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-start justify-between gap-6 py-7 text-left"
      >
        <span className="font-heading text-lg font-normal text-stone-900 sm:text-xl">{item.title}</span>
        <svg
          className={`mt-1 h-4 w-4 shrink-0 text-stone-400 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p className="pb-7 text-[15px] leading-[1.85] text-stone-600">{item.content}</p>
        </div>
      </div>
    </div>
  );
}
