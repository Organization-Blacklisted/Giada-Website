import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FragmentsPageClient from "@/components/sections/collaborations/FragmentsPageClient";
import OfEarthAndLightPageClient from "@/components/sections/collaborations/OfEarthAndLightPageClient";
import { getAllCollaborationSlugs, getCollaborationBySlug, getCollaborationBySlugRaw } from "@/lib/api/collaborations";
import { getFragmentsPage, getFragmentsPageRaw } from "@/lib/api/fragments-page";
import { getOfEarthAndLightPage, getOfEarthAndLightPageRaw } from "@/lib/api/of-earth-and-light-page";
import { getProductsByCollectionSlug } from "@/lib/api/products-catalog";
import { buildPageMetadata } from "@/lib/metadata";

// Every collaboration gets a real page regardless of `active` — matches
// the real source's own getStaticPaths() (one page per JSON file, no
// active filtering at the routing level; only the listing page cares
// about `active`).
export async function generateStaticParams() {
  const slugs = await getAllCollaborationSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Every collaboration's detail-page content lives in its own dedicated
// Global, keyed by its fixed, real route — the same category as
// /our-story or /privacy, not a dynamic flag derived from document data.
// The `collaborations` COLLECTION document only drives the listing
// page's card (name/slug/tagline/active/heroImage/productCount/
// designerName) and this route's lookup/breadcrumb — see
// collections/Collaborations.ts and each Global for why. There's
// intentionally no generic fallback for an unrecognized slug: a
// collaboration isn't live until its own page Global exists.
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const collaboration = await getCollaborationBySlug(slug);
  if (!collaboration) return {};

  if (slug === "fragments") {
    const fragments = await getFragmentsPage();
    return buildPageMetadata({
      title: fragments.seo.metaTitle || collaboration.name,
      description: fragments.seo.metaDescription || fragments.hero.paragraph,
      path: `/collaborations/${slug}`,
      image: fragments.seo.ogImage || collaboration.heroImage || undefined,
      noIndex: fragments.seo.noIndex,
    });
  }

  if (slug === "of-earth-and-light") {
    const page = await getOfEarthAndLightPage();
    return buildPageMetadata({
      title: page.seo.metaTitle || collaboration.name,
      description: page.seo.metaDescription || collaboration.tagline,
      path: `/collaborations/${slug}`,
      image: page.seo.ogImage || collaboration.heroImage || undefined,
      noIndex: page.seo.noIndex,
    });
  }

  return {};
}

export default async function CollaborationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const collaboration = await getCollaborationBySlug(slug);
  if (!collaboration) notFound();

  if (slug === "fragments") {
    const fragmentsRaw = await getFragmentsPageRaw();
    return <FragmentsPageClient initialData={fragmentsRaw} collaborationName={collaboration.name} />;
  }

  if (slug === "of-earth-and-light") {
    const [pageRaw, collaborationRaw, products] = await Promise.all([
      getOfEarthAndLightPageRaw(),
      getCollaborationBySlugRaw(slug),
      getProductsByCollectionSlug(slug),
    ]);
    if (!collaborationRaw) notFound();
    return <OfEarthAndLightPageClient initialCollaboration={collaborationRaw} initialPage={pageRaw} products={products} />;
  }

  notFound();
}
