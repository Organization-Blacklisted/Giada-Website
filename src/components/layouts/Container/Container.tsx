import { ContainerProps } from "./Container.types";

// Only two widths confirmed useful so far — extend if a real page needs
// another. Width lives in this lookup (never passed via className) so it
// can never collide with a conflicting max-w-* utility from the caller.
const sizes = {
  default: "max-w-6xl",
  narrow: "max-w-3xl",
};

// Horizontal gutter matches the real Astro source's `.site-section`
// class exactly: 20px mobile -> 40px at 768px -> 64px at 1024px
// (Tailwind's stock spacing.5/.10/.16 — not custom values).
const gutter = "px-5 md:px-10 lg:px-16";

export default function Container({ children, className = "", size = "default" }: ContainerProps) {
  return <div className={`mx-auto w-full ${gutter} ${sizes[size]} ${className}`}>{children}</div>;
}
