import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EventPageClient from "@/components/sections/events/EventPageClient";
import { getAllEventSlugs, getEventBySlug, getEventBySlugRaw } from "@/lib/api/events";
import { buildPageMetadata } from "@/lib/metadata";

export async function generateStaticParams() {
  const slugs = await getAllEventSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return {};
  const { seo } = event;
  return buildPageMetadata({
    title: seo.metaTitle || event.title,
    description: seo.metaDescription || event.description,
    path: `/events/${slug}`,
    image: seo.ogImage || event.logo || undefined,
    noIndex: seo.noIndex,
  });
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const raw = await getEventBySlugRaw(slug);
  if (!raw) notFound();

  return <EventPageClient initialData={raw} />;
}
