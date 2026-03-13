import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getServiceAreaSlugs } from "@/sanity/data";

const staticPaths = [
  "/",
  "/packages",
  "/gallery",
  "/booking-request",
  "/contact",
  "/service-areas",
  "/policy",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const serviceAreaSlugs = await getServiceAreaSlugs();

  const staticEntries = staticPaths.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
  }));

  const serviceAreaEntries = serviceAreaSlugs.map((slug) => ({
    url: `${SITE_URL}/service-areas/${slug}`,
    lastModified: now,
  }));

  return [...staticEntries, ...serviceAreaEntries];
}
