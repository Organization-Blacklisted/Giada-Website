import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

// Baseline marker, not a real schema change. This project ran entirely on
// Payload's dev-mode schema auto-push against the shared Neon database
// (local dev + Vercel production share one DB — see ARCHITECTURE.md's
// "CMS" section) until 2026-10-21, when the first schema-only change
// (BlogPosts.ts's sidebarCta fields) broke the Vercel build: push only
// happens in dev, production builds require real migrations, and none
// had ever been created. This migration establishes the starting point —
// generated from the collection/global config exactly as it already
// existed in the live database at that point (confirmed: the generated
// CREATE TABLE/TYPE statements matched the live schema table-for-table,
// not assumed) — recorded as applied without executing its SQL, since
// every table/column it describes already exists. Every migration after
// this one is a real, runnable diff against this starting point.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Intentional no-op — see comment above.
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // Intentional no-op — this baseline never created anything to undo.
}
