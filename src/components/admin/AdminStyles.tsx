// Small polish pass on Payload's own admin UI — not this project's
// Tailwind build, which doesn't reach the admin bundle at all (see
// Logo.tsx's own comment on why that component uses a plain inline
// <style> tag instead). Registered as an `admin.components.providers`
// wrapper (payload.config.ts) purely so this CSS loads on every admin
// page, not because it needs to provide any actual React context.
//
// Currently fixes one thing: a tabs field with many nested tabs (e.g.
// Glass Page's Hero/Material/Feature/Applications/Gallery/Process/
// Technical Specs/Closing Cta) overflows horizontally and falls back to
// the browser's default scrollbar — a bulky light-grey bar that clashes
// with this project's fixed dark admin theme. Restyled as a thin,
// theme-matched bar using Payload's own CSS custom properties
// (`--theme-elevation-*`) rather than hardcoded colors, so it stays
// correct if Payload's own palette ever changes.
export function AdminStyles({ children }: { children?: React.ReactNode }) {
  return (
    <>
      <style>{`
        .tabs-field__tabs-wrap {
          scrollbar-width: thin;
          scrollbar-color: var(--theme-elevation-250) transparent;
        }
        .tabs-field__tabs-wrap::-webkit-scrollbar {
          height: 6px;
        }
        .tabs-field__tabs-wrap::-webkit-scrollbar-track {
          background: transparent;
        }
        .tabs-field__tabs-wrap::-webkit-scrollbar-thumb {
          background-color: var(--theme-elevation-250);
          border-radius: 999px;
        }
        .tabs-field__tabs-wrap::-webkit-scrollbar-thumb:hover {
          background-color: var(--theme-elevation-400);
        }
      `}</style>
      {children}
    </>
  );
}
