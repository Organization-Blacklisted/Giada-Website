"use client";

import { useLivePreview } from "@payloadcms/live-preview-react";
import EventHeroSection from "@/components/sections/events/EventHeroSection";
import EventRegistrationForm from "@/components/sections/events/EventRegistrationForm";
import { mapEvent } from "@/lib/api/events-map";
import type { Event } from "@/payload-types";

// Built with useLivePreview from the start — the Blog and Collaborations
// detail pages were both shipped as plain Server Components first and
// needed a retrofit once that gap was found in a later audit (see
// ARCHITECTURE.md's "Blog detail page" / Live Preview audit section).
// Not repeating that here.
export default function EventPageClient({ initialData }: { initialData: Event }) {
  const { data: raw } = useLivePreview<Event>({
    initialData,
    serverURL: typeof window !== "undefined" ? window.location.origin : "",
    depth: 1,
  });

  const event = mapEvent(raw);

  return (
    <>
      <EventHeroSection
        eyebrow={event.eyebrow}
        logo={event.logo}
        heading={event.heading}
        description={event.description}
        eventDateFormatted={event.eventDateFormatted}
        timeLabel={event.timeLabel}
        location={event.location}
      />
      <EventRegistrationForm
        eventId={event.id}
        formHeading={event.formHeading}
        confirmButtonLabel={event.confirmButtonLabel}
      />
    </>
  );
}
