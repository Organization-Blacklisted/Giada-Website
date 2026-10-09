"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap-init";
import styles from "./FragmentsInspirationSection.module.css";
import type { FragmentsInspirationSectionProps } from "./FragmentsInspirationSection.types";

// Bespoke "The Inspiration" section for the Fragments (Ryan Saghian)
// page — Figma node 233:148. All content (including the 6 cards and
// their images) comes from Payload (Collaborations.customHero.inspiration).
//
// The gallery is an infinite auto-scrolling strip — Figma's own node
// tree had every card duplicated once (clearly a marquee-loop
// prototype, not an accidental copy-paste), so this reuses the
// project's established marquee technique from ImageReelSection
// (tripled array + GSAP xPercent: -33.333, not CSS @keyframes — those
// don't apply under this project's Turbopack build).
export default function FragmentsInspirationSection({
  eyebrow,
  heading,
  paragraph,
  cards,
  quote,
  quoteAttribution,
}: FragmentsInspirationSectionProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const reelCards = [...cards, ...cards, ...cards];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const mobileQuery = window.matchMedia("(max-width: 768px)");
    let tween = gsap.to(track, {
      xPercent: -33.333,
      duration: mobileQuery.matches ? 28 : 40,
      ease: "none",
      repeat: -1,
    });

    const onBreakpointChange = (e: MediaQueryListEvent) => {
      const progress = tween.progress();
      tween.kill();
      tween = gsap.to(track, {
        xPercent: -33.333,
        duration: e.matches ? 28 : 40,
        ease: "none",
        repeat: -1,
      });
      tween.progress(progress);
    };
    mobileQuery.addEventListener("change", onBreakpointChange);

    return () => {
      mobileQuery.removeEventListener("change", onBreakpointChange);
      tween.kill();
    };
  }, []);

  return (
    <section className="border-t border-stone-200 bg-white py-20 md:py-28 lg:py-32">
      <div className="mx-auto w-full max-w-[1408px] px-5 md:px-10 lg:px-16">
        <div className="mx-auto flex max-w-[862px] flex-col items-center text-center">
          <div className="flex items-center justify-center gap-4">
            <span className="h-px w-[62px] bg-stone-300" aria-hidden="true" />
            <p className="text-[14px] font-semibold uppercase tracking-[2.8px] text-stone-400">{eyebrow}</p>
            <span className="h-px w-[62px] bg-stone-300" aria-hidden="true" />
          </div>
          <h2 className="mt-[30px] font-didot text-4xl font-normal leading-normal text-stone-900 md:text-5xl">{heading}</h2>
          <p className="mt-4 text-base leading-[2] text-stone-500">{paragraph}</p>
        </div>
      </div>

      <div className={`mt-[60px] ${styles.wrap}`}>
        <div className={styles.reel}>
          <div ref={trackRef} className={styles.track}>
            {reelCards.map((card, i) => (
              <div key={`${card.title}-${i}`} className={styles.item}>
                <div className="relative aspect-[350/400] w-full bg-stone-100">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    sizes="(max-width: 768px) 78vw, 350px"
                    className="object-cover"
                    loading={i < cards.length ? "eager" : "lazy"}
                  />
                </div>
                <div className="flex h-[96px] flex-col items-center justify-center gap-0 border-x border-b border-stone-200 px-4 text-center">
                  <p className="font-didot text-lg leading-[2] text-stone-900">{card.title}</p>
                  <p className="text-base leading-[2] text-stone-500">{card.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1408px] px-5 md:px-10 lg:px-16">
        <div className="mx-auto mt-[112px] flex max-w-[1047px] flex-col items-center gap-10 text-center">
          <p className="font-didot text-2xl italic leading-snug text-stone-900 md:text-4xl">&ldquo;{quote}&rdquo;</p>
          <div className="flex items-center gap-6">
            <span className="h-px w-10 bg-stone-300" aria-hidden="true" />
            <p className="text-[14px] font-medium uppercase tracking-[2.8px] text-stone-400">{quoteAttribution}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
