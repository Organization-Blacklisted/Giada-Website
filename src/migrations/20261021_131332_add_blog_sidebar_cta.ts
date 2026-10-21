import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "posts" ADD COLUMN "sidebar_cta_title" varchar;
  ALTER TABLE "posts" ADD COLUMN "sidebar_cta_description" varchar;
  ALTER TABLE "posts" ADD COLUMN "sidebar_cta_link_text" varchar;
  ALTER TABLE "posts" ADD COLUMN "sidebar_cta_href" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "posts" DROP COLUMN "sidebar_cta_title";
  ALTER TABLE "posts" DROP COLUMN "sidebar_cta_description";
  ALTER TABLE "posts" DROP COLUMN "sidebar_cta_link_text";
  ALTER TABLE "posts" DROP COLUMN "sidebar_cta_href";`)
}
