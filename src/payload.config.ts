import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { s3Storage } from "@payloadcms/storage-s3";
import { buildConfig } from "payload";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Home } from "./globals/Home";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media],
  globals: [Home],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
  }),
  sharp,
  // Neon Object Storage (S3-compatible, see neon.ts's `buckets` declaration
  // and ARCHITECTURE.md's "CMS" section) replaces local-disk uploads here.
  // Bucket name is hardcoded, not read from an env var — it's a fixed
  // identifier tied 1:1 to the `giada-media` bucket declared in neon.ts,
  // not something that should vary per environment the way credentials do.
  plugins: [
    s3Storage({
      collections: {
        media: true,
      },
      bucket: "giada-media",
      config: {
        region: process.env.AWS_REGION,
        endpoint: process.env.AWS_ENDPOINT_URL_S3,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
        },
        // Required: Neon Object Storage only supports path-style addressing,
        // not the virtual-hosted-style the AWS S3 client defaults to —
        // confirmed in the neon-object-storage skill's own setup docs.
        forcePathStyle: true,
      },
      // Explicit, not just relying on the plugin's own default-true value —
      // this is the actual behavior change (stop writing to the gitignored
      // /media folder, which was only ever a dev-mode placeholder).
      disableLocalStorage: true,
    }),
  ],
});
