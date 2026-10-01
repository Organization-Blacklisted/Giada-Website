export type Product = {
  id: string;
  slug: string;
  name: string;
  category: "rugs" | "glass";
  description: string;
  images: string[];
  materials?: string[];
};
