import Image from "next/image";
import { urlFor } from "@/sanity/image";
import type { SanityImageWithAlt } from "@/sanity/types";

type SanityImageProps = {
  image?: SanityImageWithAlt | null;
  alt?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  fallbackLabel?: string;
  className?: string;
};

export function SanityImage({
  image,
  alt,
  width = 1280,
  height = 860,
  priority = false,
  fallbackLabel = "Event photo placeholder",
  className,
}: SanityImageProps) {
  const imageUrl = image?.asset ? urlFor(image).width(width * 2).height(height * 2).fit("crop").url() : null;
  const imageAlt = image?.alt?.trim() || alt || "Event rental setup";

  if (!imageUrl) {
    return (
      <div className={`media-frame ${className ?? ""}`.trim()}>
        <div className="media-placeholder">{fallbackLabel}</div>
      </div>
    );
  }

  return (
    <div className={`media-frame ${className ?? ""}`.trim()}>
      <Image
        src={imageUrl}
        alt={imageAlt}
        width={width}
        height={height}
        priority={priority}
        sizes="(max-width: 760px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
}
