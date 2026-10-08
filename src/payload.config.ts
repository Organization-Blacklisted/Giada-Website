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
import { Faq } from "./globals/Faq";
import { Gallery } from "./globals/Gallery";
import { Contact } from "./globals/Contact";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    // Fixed dark mode, not OS-dependent — default is 'all' (follows OS
    // preference, user-togglable). Setting a fixed value here short-
    // circuits both the server-side initial-render theme check
    // (getRequestTheme, which otherwise falls back to the
    // Sec-CH-Prefers-Color-Scheme client-hint header or a cookie) and
    // the client-side ThemeProvider's own OS-detection effect — both
    // confirmed by reading @payloadcms/next's and @payloadcms/ui's
    // source directly while debugging the admin logo's light/dark
    // handling, not assumed from docs alone.
    theme: "dark",
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      graphics: {
        // Real site logo on the /admin login screen instead of Payload's
        // own wordmark — see components/admin/Logo.tsx for why it needs
        // inverting (source file is black-on-transparent, login page is
        // dark). Not touching `Icon` (the in-dashboard nav graphic) —
        // only the login screen was asked for.
        Logo: "@/components/admin/Logo#Logo",
      },
    },
  },
  collections: [Users, Media],
  globals: [Home, Faq, Gallery, Contact],
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
