import type { Metadata } from "next";
import { DEFAULT_META_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

type PageMetadataInput = {
  title: string;
  description?: string;
  path?: string;
};

export function createPageMetadata({
  title,
  description,
  path = "/",
}: PageMetadataInput): Metadata {
  const resolvedDescription = description ?? DEFAULT_META_DESCRIPTION;
  const canonicalPath = path.startsWith("/") ? path : `/${path}`;
  const canonicalUrl = `${SITE_URL}${canonicalPath}`;

  return {
    title,
    description: resolvedDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description: resolvedDescription,
      url: canonicalUrl,
      siteName: SITE_NAME,
      type: "website",
    },
  };
}
