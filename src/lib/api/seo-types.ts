// Shared by lib/api/home-map.ts and lib/api/faq.ts — both globals carry
// the same optional SEO group (metaTitle/metaDescription/ogImage), so
// Home and Faq's page.tsx can read it the same way in generateMetadata.
export type SeoData = {
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
};
