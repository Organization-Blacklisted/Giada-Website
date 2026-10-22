import NotFoundContent from "@/components/sections/not-found/NotFoundContent";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = {
  ...buildPageMetadata({
    title: "Page Not Found — Giada",
    description: "The page you are looking for could not be found.",
    path: "/404",
    noIndex: true,
  }),
  // Absolute — bypasses the root layout's "%s | Giada" template, matching
  // the real source's literal title exactly ("Page Not Found — Giada").
  title: { absolute: "Page Not Found — Giada" },
};

export default function NotFound() {
  return <NotFoundContent />;
}
