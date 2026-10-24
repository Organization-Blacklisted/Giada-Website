import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "event_popup" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT false,
  	"event_id" integer,
  	"heading" varchar DEFAULT 'You''re Invited',
  	"description" varchar,
  	"cta_label" varchar DEFAULT 'Reserve Your Place',
  	"delay_seconds" numeric DEFAULT 5,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "event_popup" ADD CONSTRAINT "event_popup_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "event_popup_event_idx" ON "event_popup" USING btree ("event_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "event_popup" CASCADE;`)
}
