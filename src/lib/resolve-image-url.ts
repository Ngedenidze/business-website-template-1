import { urlFor } from "@/sanity/image";
import type { SanityImageWithAlt } from "@/sanity/types";

const SANITY_CDN_PREFIX = "https://cdn.sanity.io/";

type ResolveImageUrlOptions = {
  width: number;
  height: number;
};

export function resolveImageUrl(
  image: SanityImageWithAlt | null | undefined,
  { width, height }: ResolveImageUrlOptions,
) {
  const directUrl = image?.asset?.url?.trim();

  if (image?.asset?._ref) {
    return urlFor(image)
      .width(width)
      .height(height)
      .fit("crop")
      .auto("format")
      .url();
  }

  return directUrl || null;
}

export function isSanityCdnUrl(url: string) {
  return url.startsWith(SANITY_CDN_PREFIX);
}
