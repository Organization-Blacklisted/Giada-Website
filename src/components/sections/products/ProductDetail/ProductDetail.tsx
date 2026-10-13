"use client";

import { useEffect, useRef } from "react";
import { Link } from "next-view-transitions";
import { gsap } from "@/lib/gsap-init";
import ProductGallery from "@/components/sections/products/ProductGallery";
import type { ProductDetailProps } from "./ProductDetail.types";

// Ported from the real source's ProductDetail.astro, including its
// bespoke GSAP stagger-fade on the right panel's direct children — a
// component-scoped scroll-triggered animation, same pattern as
// EnquiryForm.tsx's field stagger (ported "to a scoped effect instead of
// a global scroll-triggered script"), NOT the sitewide `data-reveal`
// fade system. An earlier version of this component substituted
// `data-reveal` here instead, which was wrong: `data-reveal` is reserved
// for the site's shared, confirmed-no-stagger reveal system
// (ScrollReveal.tsx) — this page's animation is its own separate real
// GSAP tween with a real per-child stagger and y-translate, never part
// of that shared system in the first place.
//
// "Origin" was a hardcoded template constant there ("India") — made
// into a real, editable `origin` field on the Products collection
// instead, per explicit request.
export default function ProductDetail({
  title,
  description,
  color,
  weavingStyle,
  composition,
  size,
  origin,
  collection,
  images,
}: ProductDetailProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const tween = gsap.fromTo(
      [...panel.children],
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: reduced ? 0.01 : 0.65,
        stagger: reduced ? 0 : 0.09,
        ease: "expo.out",
        delay: 0.2,
        scrollTrigger: { trigger: panel, start: "top 85%", once: true },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  const specs = [
    { label: "Weaving Style", value: weavingStyle },
    { label: "Colour", value: color },
    { label: "Composition", value: composition },
    { label: "Origin", value: origin },
    { label: "Size", value: size },
  ].filter(({ value }) => value && value !== "none");

  return (
    <>
      <div className="px-5 pb-0 pt-24 md:px-10 lg:px-16 lg:pt-32">
        <nav className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-stone-400" aria-label="Breadcrumb">
          <Link href="/products" className="transition-colors duration-200 hover:text-stone-900">
            Products
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-stone-700">{title}</span>
        </nav>
      </div>

      <section className="px-5 pb-24 pt-10 md:px-10 lg:px-16">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14 lg:pt-4">
          <ProductGallery images={images} title={title} />

          <div ref={panelRef} className="flex flex-col lg:sticky lg:top-28 lg:self-start">
            {collection && (
              <Link href={`/collaborations/${collection}`} className="mb-4 inline-block text-[11px] font-semibold uppercase tracking-[0.3em]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-stone-400 transition-colors duration-200 hover:text-stone-700">
                  {collection.replace(/[_-]/g, " ")}
                </p>
              </Link>
            )}

            <h1 className="font-didot text-4xl font-normal leading-[1.05] tracking-tight text-stone-900 sm:text-5xl">{title}</h1>

            <div className="mt-7 h-px bg-stone-200" />

            <p className="mt-7 text-[15px] leading-[1.85] text-stone-600">{description}</p>

            {specs.length > 0 && (
              <div className="mt-8">
                <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.28em] text-stone-400">Details</p>
                <dl className="flex flex-col divide-y divide-stone-100">
                  {specs.map((spec) => (
                    <div key={spec.label} className="flex items-baseline justify-between gap-6 py-3">
                      <dt className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">{spec.label}</dt>
                      <dd className="text-right text-[13px] text-stone-700">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            <div className="mt-8 h-px bg-stone-200" />

            <p className="mt-5 text-[11px] uppercase tracking-[0.18em] text-stone-400">
              Made to order; enquire for lead time &amp; custom sizing
            </p>

            <Link
              href="/contact"
              className="mt-7 inline-flex items-center justify-center bg-stone-900 px-10 py-4 font-didot text-[15px] font-normal text-white transition-colors duration-300 hover:bg-stone-700"
            >
              Enquire About This Piece
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
