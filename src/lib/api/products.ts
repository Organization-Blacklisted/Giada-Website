export type ProductCategoryData = {
  title: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  href: string;
};

export type ProductsPageData = {
  hero: {
    eyebrow: string;
    heading: string;
  };
  categories: ProductCategoryData[];
  galleryCta: {
    label: string;
    href: string;
  };
};

// Real content confirmed from the Astro source's
// pages/products/index.astro. hrefs point to `/products?category=rugs`
// /`glass` rather than the real source's separate `/rugs`/`/glass`
// routes — same reasoning as lib/api/home.ts's categoryGrid: this
// project already consolidated those into one `/products` listing with
// a `category` field (types/product.ts), and the real hrefs would just
// 404 here. Full catalog/filtering itself isn't built yet — this page
// is still just the category-picker intro, matching the real source's
// actual (currently minimal) scope for this route.
export async function getProductsPage(): Promise<ProductsPageData> {
  return {
    hero: {
      eyebrow: "The Complete Collection",
      heading: "Products",
    },
    categories: [
      {
        title: "Rugs",
        image: "/images/categories/category-rugs.webp",
        imageWidth: 1536,
        imageHeight: 2730,
        href: "/products?category=rugs",
      },
      {
        title: "Glass",
        image: "/images/categories/category-glass.webp",
        imageWidth: 1122,
        imageHeight: 1402,
        href: "/products?category=glass",
      },
    ],
    galleryCta: {
      label: "View the Gallery",
      href: "/gallery",
    },
  };
}
