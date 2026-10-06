import { Link } from "next-view-transitions";
import Glitchy404 from "@/components/sections/not-found/Glitchy404";

export const metadata = {
  // Absolute — bypasses the root layout's "%s | Giada" template, matching
  // the real source's literal title exactly ("Page Not Found — Giada").
  title: { absolute: "Page Not Found — Giada" },
  description: "The page you are looking for could not be found.",
};

export default function NotFound() {
  return (
    // min-h-[calc(100vh-5rem)] (5rem = the fixed navbar's h-20) instead of
    // the pt-24/pt-32 pattern other pages use — confirmed from the real
    // source, not guessed. Works here since it's one centered block, not
    // a tall list (see Header's mobile-menu overlap bug for why that
    // technique isn't always safe).
    <section className="flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center px-5 py-24 text-center">
      <div className="mx-auto w-full max-w-3xl" data-reveal="scale">
        <Glitchy404 width={860} height={232} color="#1c1917" />
      </div>

      <div className="mx-auto mt-10 max-w-md" data-reveal>
        <p className="font-heading text-xl leading-relaxed text-stone-700">
          The page you&apos;re looking for has wandered off.
        </p>
        <p className="mt-3 text-sm tracking-wide text-stone-400">
          It may have been moved, renamed, or simply never existed.
        </p>
      </div>

      <div className="mt-10" data-reveal>
        <Link
          href="/"
          className="font-heading inline-block border-b border-stone-300 pb-0.5 text-sm tracking-[0.1em] text-stone-600 transition-colors duration-200 hover:border-stone-900 hover:text-stone-900"
        >
          Return Home
        </Link>
      </div>
    </section>
  );
}
