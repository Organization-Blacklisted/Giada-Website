import Image from "next/image";
import ShareButtons from "@/components/ui/ShareButtons";
import type { BlogDetailHeroSectionProps } from "./BlogDetailHeroSection.types";

export default function BlogDetailHeroSection({
  title,
  excerpt,
  author,
  pubDateFormatted,
  readTime,
  coverImage,
  className = "",
}: BlogDetailHeroSectionProps) {
  return (
    <section className={`px-5 pb-10 pt-24 md:px-10 lg:px-16 lg:pt-32 ${className}`}>
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex w-full max-w-[565px] flex-col gap-6" data-reveal>
            <span className="inline-flex w-fit items-center bg-[#f2f4f7] px-3.5 py-2 text-[16px] text-stone-600">
              Article&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;{readTime} min read
            </span>
            <h1 className="font-heading text-4xl font-normal leading-[1.2] text-stone-900 md:text-5xl">{title}</h1>
            <p className="text-[16px] leading-[1.8] text-stone-600">{excerpt}</p>
          </div>

          <div className="flex w-full flex-col items-start gap-2 lg:w-[220px] lg:items-end" data-reveal>
            <div className="flex flex-col items-start gap-2 whitespace-nowrap text-[16px] leading-[1.8] text-stone-600 lg:items-end lg:text-right">
              <p>Written by - {author}</p>
              <p>Published on - {pubDateFormatted}</p>
            </div>
            <ShareButtons title={title} />
          </div>
        </div>

        <div className="relative mt-10 aspect-[1280/500] w-full overflow-hidden" data-reveal>
          <Image src={coverImage} alt={title} fill priority sizes="100vw" className="object-cover" />
        </div>
      </div>
    </section>
  );
}
