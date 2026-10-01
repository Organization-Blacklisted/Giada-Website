export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  company: string;
  logo: string;
  /** Real intrinsic dimensions of `logo` — required by next/image, avoids CLS. */
  logoWidth: number;
  logoHeight: number;
  logoInvert?: boolean;
};
