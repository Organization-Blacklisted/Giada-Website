import type { FragmentsHeroSectionProps } from "./FragmentsHeroSection.types";

// Bespoke, one-off hero built from a Figma design for the Fragments
// (Ryan Saghian) collaboration — NOT the shared template every other
// collaboration's hero uses (CollaborationHeroSection).
//
// Current structure (after many iterations — see git history for the
// full back-and-forth on the background approach):
// - hero-backdrop.png (a plain textured wall photo, no subject) is a
//   CSS background-image on the outer <section>, behind everything —
//   anchored bg-left on mobile/narrow screens, bg-center from lg up.
// - hero-right-panel.png (Ryan + the tile mosaic, transparent elsewhere)
//   is a separate plain <img>, not part of that background: centered
//   above the text on mobile, anchored bottom-right on desktop via
//   w-[56.35vw] (1082/1920, the image's real width over the Figma
//   reference width) so it scales with viewport width instead of only
//   ever changing with height.
// - Both breakpoints use plain <img> (not next/image) — explicit
//   request, no srcset/optimization pipeline for this image.
// - Desktop container height is a fixed `85vh` (explicit request) via
//   inline style, not a Tailwind h-[85vh] class — Tailwind's JIT
//   intermittently failed to compile that specific arbitrary value
//   under this project's dev server, silently collapsing the section
//   to zero height since every child inside is absolutely positioned.
// - Every desktop text/panel measurement that was a hardcoded px value
//   (text-[72px], w-[512px], h-[134px], max-w-[627px]...) is now
//   clamp(min, vw-scaled, Figma-px-value) so the composition scales
//   across the whole `lg`-and-up range instead of only looking right at
//   exactly 1920px wide. The vw portion of each clamp is the Figma px
//   value divided by 1920 (the real Figma frame width), so at 1920px
//   the rendered size still matches Figma exactly.
// - left-[16.67%]/top-[20.38%] are percentages of the container, so
//   they're already responsive.
// - The info panel is in normal flow after the paragraph (mt-[clamp]
//   standing in for the 158px Figma gap), not its own absolute
//   top-[68.23%] — that was independent of the text block's actual
//   height, so it overlapped the paragraph whenever text wrapped to
//   more lines than the 1920px reference width does.
// - The real headline node has `whitespace-nowrap` — it's meant to
//   render on one line, not wrap to two.
export default function FragmentsHeroSection({
  eyebrow,
  headline,
  paragraph,
  unveilingLines,
  backdropImage,
  cutoutImage,
  className = "",
}: FragmentsHeroSectionProps) {
  const logoMaskStyle = {
    maskImage: "url(/images/collaborations/fragments/giada-ryan-logo.png)",
    maskSize: "contain",
    maskRepeat: "no-repeat",
    maskPosition: "center",
    WebkitMaskImage: "url(/images/collaborations/fragments/giada-ryan-logo.png)",
    WebkitMaskSize: "contain",
    WebkitMaskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
    aspectRatio: "349 / 225",
  } as const;

  return (
    <section
      className={`relative overflow-hidden bg-stone-950 bg-cover bg-left lg:bg-center lg:pl-6 lg:pr-6 lg:pt-[104px] xl:pl-0 xl:pr-0 xl:pt-20 ${className}`}
      style={{ backgroundImage: `url(${backdropImage})` }}
    >
      {/* Mobile/tablet — no Figma reference, simplified stack. pt-24 clears the fixed navbar. Cutout centered above the text (explicit request) instead of the desktop's right-anchored placement — there's no room to sit it beside the text at these widths. No horizontal padding on this wrapper (explicit request) so the image is genuinely full-bleed; px-5/md:px-10 is applied per text element below instead. */}
      <div className="flex flex-col gap-8 pb-10 pt-24 lg:hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cutoutImage}
          alt="Ryan Saghian seated, surrounded by a mosaic of textures and references for the Fragments collaboration"
          width={1082}
          height={834}
          className="h-auto w-full"
        />

        <p className="px-5 text-[11px] font-semibold uppercase tracking-[0.28em] text-white md:px-10">{eyebrow}</p>
        <div className="px-5 md:px-10">
          <h1 className="font-didot text-4xl font-normal leading-[1.15] text-white sm:text-5xl">{headline}</h1>
          <p className="mt-6 text-base leading-[1.8] text-stone-300">{paragraph}</p>
        </div>
        <div className="mx-5 flex items-stretch gap-5 border border-[#d2b686] bg-[#d2b686]/5 px-5 py-5 md:mx-10">
          <div aria-label="GIADA & Ryan Saghian — Interior Design Studio" role="img" className="w-[110px] shrink-0 self-center bg-[#d2b686]" style={logoMaskStyle} />
          <div className="w-px shrink-0 bg-white/30" aria-hidden="true" />
          <div className="flex flex-col justify-center gap-1.5">
            <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#f3deb8]">Unveiling at</p>
            {unveilingLines.map((line) => (
              <p key={line} className="text-sm text-[#fffbf5]">
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop — right-aligned cutout (man + tile mosaic only, transparent elsewhere) instead of a full-bleed photo. Section's own bg-stone-950 shows on the left where the text sits, so there's no tile-behind-text collision. Fixed h-[85vh] (explicit request) on the container; the cutout itself is sized by VIEWPORT WIDTH (56.35vw = 1082/1920, the image's real width over the Figma reference width) instead of h-full, so it actually shrinks on narrower desktop/laptop widths rather than only ever changing with viewport height. Stuck to bottom-0 right-0 either way — a seated figure, so anchoring to the bottom keeps his feet/chair grounded at the section's base. */}
      <div className="relative hidden w-full lg:block" style={{ height: "85vh" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cutoutImage}
          alt="Ryan Saghian seated, surrounded by a mosaic of textures and references for the Fragments collaboration"
          width={1082}
          height={834}
          className="absolute bottom-0 right-0 h-auto w-[56.35vw] max-w-[1082px]"
        />

        <div className="absolute left-[16.67%] top-[20.38%]">
          <div className="flex items-center gap-[clamp(0.75rem,1.25vw,1.5rem)]">
            <p className="whitespace-nowrap text-[clamp(0.75rem,0.73vw,0.875rem)] font-semibold uppercase tracking-[2.8px] text-white">
              {eyebrow}
            </p>
            <span className="h-px w-[clamp(2.5rem,3.23vw,3.875rem)] bg-white/60" aria-hidden="true" />
          </div>

          <div className="mt-[clamp(1rem,1.56vw,1.875rem)]">
            <h1 className="whitespace-nowrap font-didot text-[clamp(2.25rem,3.75vw,4.5rem)] font-normal leading-[1.2] text-white">
              {headline}
            </h1>
            <p className="mt-5 max-w-[clamp(20rem,32.66vw,39.2rem)] text-[clamp(1rem,1.04vw,1.25rem)] leading-[1.7] text-stone-200">
              {paragraph}
            </p>
          </div>

          {/* In normal flow after the paragraph (mt-[clamp] standing in for the 158px Figma gap) instead of its own absolute top-[68.23%] — that was independent of the text block's actual height, so it overlapped the paragraph whenever text wrapped to more lines than the 1920px reference width does. */}
          <div className="mt-[clamp(2rem,8.23vw,9.875rem)] flex w-[clamp(21rem,26.67vw,32rem)] items-stretch gap-[clamp(1rem,1.25vw,1.5rem)] border border-[#d2b686] bg-[#d2b686]/5 px-[clamp(1rem,1.46vw,1.75rem)] py-5">
            <div
              aria-label="GIADA & Ryan Saghian — Interior Design Studio"
              role="img"
              className="w-[clamp(6rem,7.81vw,9.375rem)] shrink-0 self-center bg-[#d2b686]"
              style={logoMaskStyle}
            />
            <div className="w-px shrink-0 bg-white/30" aria-hidden="true" />
            <div className="flex flex-col justify-center gap-2">
              <p className="text-[clamp(0.75rem,0.73vw,0.875rem)] font-medium uppercase tracking-[1.4px] text-[#f3deb8]">
                Unveiling at
              </p>
              {unveilingLines.map((line) => (
                <p key={line} className="text-[clamp(0.9375rem,0.94vw,1.125rem)] text-[#fffbf5]">
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
