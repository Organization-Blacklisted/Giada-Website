import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "fragments_page" ADD COLUMN "hero_unveiling_label" varchar DEFAULT 'Unveiling at' NOT NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "fragments_page" DROP COLUMN "hero_unveiling_label";`)
}
