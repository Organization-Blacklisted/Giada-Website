import localFont from "next/font/local";

// Exact weight/style mapping copied from the real Astro source
// (astro.config.mjs `fonts:` block) — not guessed. Note the non-standard
// weight 450 on Roman/Oblique, between Book/400 and Medium/500.
export const avenir = localFont({
  src: [
    { path: "./avenir/AvenirLTStd-Light.otf", weight: "300", style: "normal" },
    { path: "./avenir/AvenirLTStd-LightOblique.otf", weight: "300", style: "italic" },
    { path: "./avenir/AvenirLTStd-Book.otf", weight: "400", style: "normal" },
    { path: "./avenir/AvenirLTStd-BookOblique.otf", weight: "400", style: "italic" },
    { path: "./avenir/AvenirLTStd-Roman.otf", weight: "450", style: "normal" },
    { path: "./avenir/AvenirLTStd-Oblique.otf", weight: "450", style: "italic" },
    { path: "./avenir/AvenirLTStd-Medium.otf", weight: "500", style: "normal" },
    { path: "./avenir/AvenirLTStd-MediumOblique.otf", weight: "500", style: "italic" },
    { path: "./avenir/AvenirLTStd-Heavy.otf", weight: "700", style: "normal" },
    { path: "./avenir/AvenirLTStd-HeavyOblique.otf", weight: "700", style: "italic" },
    { path: "./avenir/AvenirLTStd-Black.otf", weight: "900", style: "normal" },
    { path: "./avenir/AvenirLTStd-BlackOblique.otf", weight: "900", style: "italic" },
  ],
  variable: "--font-avenir",
  display: "swap",
});

export const didot = localFont({
  src: [
    { path: "./didot/Didot.otf", weight: "400", style: "normal" },
    { path: "./didot/Didot Italic.otf", weight: "400", style: "italic" },
    { path: "./didot/Didot Bold.otf", weight: "700", style: "normal" },
    { path: "./didot/Didot Title.otf", weight: "900", style: "normal" },
  ],
  variable: "--font-didot",
  display: "swap",
});
