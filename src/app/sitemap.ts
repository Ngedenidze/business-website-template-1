import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getBlogPostSlugs, getServiceAreaSlugs } from "@/sanity/data";

const staticPaths = [
  "/",
  "/packages",
  "/blog",
  "/gallery",
  "/booking-request",
  "/contact",
  "/service-areas",
  "/faq",
  "/policy",
  "/llms.txt",
  "/llms-full.txt",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const [serviceAreaSlugs, blogPostSlugs] = await Promise.all([
    getServiceAreaSlugs(),
    getBlogPostSlugs(),
  ]);

  const staticEntries = staticPaths.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
  }));

  const serviceAreaEntries = serviceAreaSlugs.map((slug) => ({
    url: `${SITE_URL}/service-areas/${slug}`,
    lastModified: now,
  }));

  const blogPostEntries = blogPostSlugs.map((slug) => ({
    url: `${SITE_URL}/blog/${slug}`,
    lastModified: now,
  }));

  return [...staticEntries, ...serviceAreaEntries, ...blogPostEntries];
}
