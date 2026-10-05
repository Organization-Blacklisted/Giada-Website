import { Link } from "next-view-transitions";

export const metadata = {
  title: "Message Sent",
  description: "Thank you for your enquiry. Our team will respond within one business day.",
  robots: { index: false, follow: false },
};

export default function ContactSuccessPage() {
  return (
    <section className="flex min-h-[calc(100vh-5rem)] items-center bg-white px-5 py-24 md:px-10 lg:px-16">
      <div className="mx-auto w-full max-w-2xl text-center">
        {/* Eyebrow */}
        <div data-reveal className="mb-8 flex items-center justify-center gap-4">
          <span className="h-px w-10 bg-stone-300" />
          <p className="text-[11px] font-medium uppercase tracking-[0.45em] text-stone-500">Message Sent</p>
          <span className="h-px w-10 bg-stone-300" />
        </div>

        {/* Heading */}
        <h1
          data-reveal
          className="mb-6 font-didot text-4xl font-normal leading-tight tracking-tight text-stone-900 sm:text-5xl"
        >
          Thank You. Your Enquiry Is on Its Way.
        </h1>

        {/* Supporting copy */}
        <p data-reveal className="mx-auto mb-4 max-w-xl text-[14px] leading-[1.85] text-stone-500">
          Every enquiry is handled personally by one of our founders. We will review your message and
          respond within one business day.
        </p>

        <p data-reveal className="text-xs italic text-stone-400">
          A member of our team will be in touch shortly.
        </p>

        {/* Divider */}
        <div data-reveal className="mx-auto my-12 h-px w-16 bg-stone-200" />

        {/* Actions */}
        <div data-reveal className="flex flex-col items-center justify-center gap-6 sm:flex-row">
          <Link
            href="/"
            className="w-full border border-stone-900 bg-stone-900 px-9 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-white transition-colors duration-300 hover:border-stone-700 hover:bg-stone-700 sm:w-auto"
          >
            Return to Homepage →
          </Link>

          {/* Real source links to /rugs — this project's product listing
              route is /products (established convention, see nav.config.ts) */}
          <Link
            href="/products"
            className="inline-flex items-center text-[10px] font-semibold uppercase tracking-[0.28em] text-stone-500 transition-colors hover:text-stone-900"
          >
            Explore the Collection
            <span className="ml-3">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
