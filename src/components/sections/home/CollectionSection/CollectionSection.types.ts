export interface CollectionSectionProps {
  image: string;
  alt: string;
  heading: string;
  subheading?: string;
  description: string;
  buttonText?: string;
  buttonLink?: string;
  /** Flips the image/text columns. Real prop from the source
   * (`Collection.astro`), never actually exercised there — only one
   * real usage site exists, and it never sets this to true. */
  reverse?: boolean;
  className?: string;
}
