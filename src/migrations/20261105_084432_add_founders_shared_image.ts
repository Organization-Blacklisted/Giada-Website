import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "our_story_page_founders_people" DROP CONSTRAINT "our_story_page_founders_people_image_id_media_id_fk";
  
  DROP INDEX "our_story_page_founders_people_image_idx";
  ALTER TABLE "our_story_page" ADD COLUMN "founders_shared_image_id" integer;
  ALTER TABLE "our_story_page" ADD COLUMN "founders_shared_image_alt" varchar DEFAULT 'Julien Hakoun and Nitin Garg, co-founders of Giada' NOT NULL;
  ALTER TABLE "our_story_page" ADD CONSTRAINT "our_story_page_founders_shared_image_id_media_id_fk" FOREIGN KEY ("founders_shared_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "our_story_page_founders_founders_shared_image_idx" ON "our_story_page" USING btree ("founders_shared_image_id");
  ALTER TABLE "our_story_page_founders_people" DROP COLUMN "image_id";
  ALTER TABLE "our_story_page_founders_people" DROP COLUMN "alt";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "our_story_page" DROP CONSTRAINT "our_story_page_founders_shared_image_id_media_id_fk";
  
  DROP INDEX "our_story_page_founders_founders_shared_image_idx";
  ALTER TABLE "our_story_page_founders_people" ADD COLUMN "image_id" integer NOT NULL;
  ALTER TABLE "our_story_page_founders_people" ADD COLUMN "alt" varchar NOT NULL;
  ALTER TABLE "our_story_page_founders_people" ADD CONSTRAINT "our_story_page_founders_people_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "our_story_page_founders_people_image_idx" ON "our_story_page_founders_people" USING btree ("image_id");
  ALTER TABLE "our_story_page" DROP COLUMN "founders_shared_image_id";
  ALTER TABLE "our_story_page" DROP COLUMN "founders_shared_image_alt";`)
}
