import CollaborationCard from "@/components/ui/CollaborationCard";
import type { CollaborationsGridSectionProps } from "./CollaborationsGridSection.types";

// Ported from the real source's pages/collaborations/index.astro grid
// section, including its empty state (real, reachable in the CMS if
// every item is ever removed — not a hypothetical).
export default function CollaborationsGridSection({ items, className = "" }: CollaborationsGridSectionProps) {
  return (
    <section className={`px-5 pb-32 md:px-10 lg:px-16 ${className}`}>
      <div className="mx-auto max-w-7xl">
        <h2 className="sr-only">All Collaborations</h2>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-40 text-center">
            <div className="mb-6 h-px w-10 bg-stone-200" />
            <p className="font-didot text-xl text-stone-300">No collaborations available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:gap-7">
            {items.map((item) => (
              <div key={item.id} data-reveal>
                <CollaborationCard
                  name={item.name}
                  slug={item.slug}
                  tagline={item.tagline}
                  active={item.active}
                  heroImage={item.heroImage}
                  productCount={item.productCount}
                  designerName={item.designer.name}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
