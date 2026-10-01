"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { TestimonialBookProps } from "./TestimonialBook.types";
import styles from "./TestimonialBook.module.css";

// Matches the 0.96s CSS transition on .pageRight above — the JS lock
// duration has to track the CSS duration or the "busy" guard releases
// mid-animation and rapid clicks can overlap flips.
const FLIP_MS = 980;
const SWIPE_THRESHOLD = 44;

type Turning = { index: number; direction: "next" | "prev" };

export default function TestimonialBook({
  testimonials,
  autoplayMs = 6000,
  ariaLabel = "Testimonials",
  className = "",
}: TestimonialBookProps) {
  const count = testimonials.length;

  const [current, setCurrent] = useState(0);
  const [turning, setTurning] = useState<Turning | null>(null);
  const [turningFlipped, setTurningFlipped] = useState(false);

  // Refs, not state: read synchronously inside timeouts/intervals/touch
  // handlers without re-subscribing effects on every flip (see goNext/
  // goPrev — keeping them stable is what lets the autoplay interval run
  // as one persistent 6s-cadence timer instead of restarting after each
  // flip, matching the real source's plain setInterval behavior).
  const currentRef = useRef(0);
  const busyRef = useRef(false);
  const autoDirRef = useRef<1 | -1>(1);
  const autoTimerRef = useRef<number | undefined>(undefined);
  const wrapRef = useRef<HTMLDivElement>(null);

  const goNext = useCallback(() => {
    if (busyRef.current || currentRef.current >= count - 1) return;
    busyRef.current = true;
    const index = currentRef.current;

    setTurning({ index, direction: "next" });
    setTurningFlipped(false);
    requestAnimationFrame(() => requestAnimationFrame(() => setTurningFlipped(true)));

    window.setTimeout(() => {
      currentRef.current += 1;
      setCurrent(currentRef.current);
      setTurning(null);
      busyRef.current = false;
    }, FLIP_MS);
  }, [count]);

  const goPrev = useCallback(() => {
    if (busyRef.current || currentRef.current <= 0) return;
    busyRef.current = true;
    const index = currentRef.current - 1;

    setTurning({ index, direction: "prev" });
    setTurningFlipped(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setTurningFlipped(false)));

    window.setTimeout(() => {
      currentRef.current -= 1;
      setCurrent(currentRef.current);
      setTurning(null);
      busyRef.current = false;
    }, FLIP_MS);
  }, []);

  const stopAutoplay = useCallback(() => {
    if (autoTimerRef.current !== undefined) {
      window.clearInterval(autoTimerRef.current);
      autoTimerRef.current = undefined;
    }
  }, []);

  // Autoplay ping-pongs end to end (0 -> last -> 0), it does not loop
  // back to the start — matches the real source exactly.
  useEffect(() => {
    if (autoplayMs <= 0 || count <= 1) return;

    autoTimerRef.current = window.setInterval(() => {
      if (autoDirRef.current === 1) {
        if (currentRef.current >= count - 1) {
          autoDirRef.current = -1;
          goPrev();
        } else {
          goNext();
        }
      } else if (currentRef.current <= 0) {
        autoDirRef.current = 1;
        goNext();
      } else {
        goPrev();
      }
    }, autoplayMs);

    return stopAutoplay;
  }, [autoplayMs, count, goNext, goPrev, stopAutoplay]);

  // Touch swipe: left -> next, right -> prev.
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    let touchX = 0;
    let touchY = 0;

    const onTouchStart = (e: TouchEvent) => {
      touchX = e.touches[0].clientX;
      touchY = e.touches[0].clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - touchX;
      const dy = e.changedTouches[0].clientY - touchY;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > SWIPE_THRESHOLD) {
        stopAutoplay();
        if (dx < 0) goNext();
        else goPrev();
      }
    };

    wrap.addEventListener("touchstart", onTouchStart, { passive: true });
    wrap.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      wrap.removeEventListener("touchstart", onTouchStart);
      wrap.removeEventListener("touchend", onTouchEnd);
    };
  }, [goNext, goPrev, stopAutoplay]);

  if (count === 0) return null;

  const isPageFlipped = (i: number) => (turning && i === turning.index ? turningFlipped : i < current);

  const getZIndex = (i: number) => {
    if (turning && i === turning.index) return 500;
    if (i < current) return i + 1;
    return count * 4 + count - i;
  };

  return (
    <div className={`${styles.wrap} ${className}`} ref={wrapRef}>
      <div className={styles.book} aria-roledescription="carousel" aria-label={ariaLabel}>
        {/*
          Static left page: shows the first logo only at the start
          (before any flip). Once pages start flipping, their back
          faces cover this at z-index > 0. z-index: 0 keeps it
          permanently behind all flipped pages.
        */}
        <div className={`${styles.page} ${styles.pageLeft}`} aria-hidden="true">
          <div className={styles.faceCover}>
            <div className={styles.coverSpine} />
            <div className={styles.backContent}>
              <Image
                src={testimonials[0].logo}
                alt={testimonials[0].company}
                width={testimonials[0].logoWidth}
                height={testimonials[0].logoHeight}
                className={`${styles.logoImg} ${testimonials[0].logoInvert ? styles.logoImgInvert : ""}`}
                sizes="20vw"
              />
              <p className={styles.logoName}>{testimonials[0].company}</p>
            </div>
          </div>
        </div>

        {/* Right pages: stacked, flip right -> left */}
        {testimonials.map((t, i) => {
          const flipped = isPageFlipped(i);
          const next = testimonials[i + 1];

          return (
            <div
              key={t.id}
              className={`${styles.page} ${styles.pageRight} ${flipped ? styles.isFlipped : ""} ${
                turning?.index === i ? styles.isTurning : ""
              }`}
              style={{ zIndex: getZIndex(i) }}
              aria-roledescription="slide"
              aria-label={`Testimonial ${i + 1} of ${count}`}
              aria-hidden={i !== current}
            >
              {/* Front face: testimonial content */}
              <div className={`${styles.face} ${styles.faceFront}`}>
                <div className={styles.frontSpine} />
                <div className={styles.dogEar} aria-hidden="true" />

                <div className={styles.monogram} aria-hidden="true">
                  {t.name.charAt(0)}
                </div>

                <blockquote className={styles.quote}>
                  <p>&ldquo;{t.quote}&rdquo;</p>
                </blockquote>

                <footer className={styles.attribution}>
                  <cite className={styles.attrName}>{t.name}</cite>
                  <p className={styles.attrCompany}>{t.company}</p>
                </footer>

                <p className={styles.pagenum} aria-hidden="true">
                  {String(i + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
                </p>
              </div>

              {/*
                Back face: company logo for the NEXT testimonial. As the
                page physically turns, this face sweeps into the left
                position — the logo reveals naturally with the flip. Net
                rotation when the parent is at -180deg = 0, so content is
                not mirrored (rotateY(180) on child + rotateY(-180) on
                parent = 0).
              */}
              {next && (
                <div className={`${styles.face} ${styles.faceBack}`} aria-hidden="true">
                  <div className={styles.backSpine} />
                  <div className={styles.backContent}>
                    <Image
                      src={next.logo}
                      alt={next.company}
                      width={next.logoWidth}
                      height={next.logoHeight}
                      className={`${styles.logoImg} ${next.logoInvert ? styles.logoImgInvert : ""}`}
                      sizes="20vw"
                    />
                    <p className={styles.logoName}>{next.company}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation */}
      <nav className={styles.controls} aria-label="Navigate testimonials">
        <button
          type="button"
          className={styles.btn}
          aria-label="Previous testimonial"
          disabled={current === 0}
          onClick={() => {
            stopAutoplay();
            goPrev();
          }}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
            <path
              d="M8.5 2L4 6.5L8.5 11"
              stroke="currentColor"
              strokeWidth={1.25}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Prev</span>
        </button>

        <div className={styles.dots} role="tablist" aria-label="Testimonials">
          {testimonials.map((t, i) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              className={`${styles.dot} ${i === current ? styles.dotActive : ""}`}
              aria-label={`Testimonial ${i + 1}`}
              aria-selected={i === current}
              onClick={() => {
                stopAutoplay();
                // Real source behavior: a dot click only steps one flip
                // toward the target, it doesn't jump straight there —
                // kept faithful to the live site, not "fixed".
                if (i > current) goNext();
                else if (i < current) goPrev();
              }}
            />
          ))}
        </div>

        <button
          type="button"
          className={styles.btn}
          aria-label="Next testimonial"
          disabled={current === count - 1}
          onClick={() => {
            stopAutoplay();
            goNext();
          }}
        >
          <span>Next</span>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
            <path
              d="M4.5 2L9 6.5L4.5 11"
              stroke="currentColor"
              strokeWidth={1.25}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </nav>
    </div>
  );
}
