import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home" ADD COLUMN "journal_newsletter_eyebrow" varchar;
  ALTER TABLE "home" ADD COLUMN "journal_newsletter_heading" varchar;
  ALTER TABLE "home" ADD COLUMN "journal_newsletter_description" varchar;
  ALTER TABLE "home" ADD COLUMN "journal_newsletter_email_placeholder" varchar DEFAULT 'Your Email Address';
  ALTER TABLE "home" ADD COLUMN "journal_newsletter_button_label" varchar DEFAULT 'Subscribe';
  ALTER TABLE "_home_v" ADD COLUMN "version_journal_newsletter_eyebrow" varchar;
  ALTER TABLE "_home_v" ADD COLUMN "version_journal_newsletter_heading" varchar;
  ALTER TABLE "_home_v" ADD COLUMN "version_journal_newsletter_description" varchar;
  ALTER TABLE "_home_v" ADD COLUMN "version_journal_newsletter_email_placeholder" varchar DEFAULT 'Your Email Address';
  ALTER TABLE "_home_v" ADD COLUMN "version_journal_newsletter_button_label" varchar DEFAULT 'Subscribe';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home" DROP COLUMN "journal_newsletter_eyebrow";
  ALTER TABLE "home" DROP COLUMN "journal_newsletter_heading";
  ALTER TABLE "home" DROP COLUMN "journal_newsletter_description";
  ALTER TABLE "home" DROP COLUMN "journal_newsletter_email_placeholder";
  ALTER TABLE "home" DROP COLUMN "journal_newsletter_button_label";
  ALTER TABLE "_home_v" DROP COLUMN "version_journal_newsletter_eyebrow";
  ALTER TABLE "_home_v" DROP COLUMN "version_journal_newsletter_heading";
  ALTER TABLE "_home_v" DROP COLUMN "version_journal_newsletter_description";
  ALTER TABLE "_home_v" DROP COLUMN "version_journal_newsletter_email_placeholder";
  ALTER TABLE "_home_v" DROP COLUMN "version_journal_newsletter_button_label";`)
}
