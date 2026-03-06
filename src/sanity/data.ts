import { client } from "@/sanity/client";
import {
  businessInfoQuery,
  galleryQuery,
  homepageQuery,
  packageOptionsQuery,
  packagesQuery,
  serviceAreaBySlugQuery,
  serviceAreaSlugsQuery,
  serviceAreasQuery,
  siteShellQuery,
  testimonialsQuery,
} from "@/sanity/queries";
import {
  fallbackBusinessInfo,
  fallbackGallery,
  fallbackHomepage,
  fallbackPackages,
  fallbackServiceAreas,
  fallbackTestimonials,
} from "@/sanity/fallback-content";
import type {
  BusinessInfo,
  GalleryItem,
  Homepage,
  PackageItem,
  ServiceAreaItem,
  TestimonialItem,
} from "@/sanity/types";

const options = { next: { revalidate: 60 } };

async function fetchOrNull<T>(query: string, params?: Record<string, string>) {
  try {
    return await client.fetch<T>(query, params ?? {}, options);
  } catch {
    return null;
  }
}

function isNonEmptyArray<T>(value: T[] | null | undefined): value is T[] {
  return Array.isArray(value) && value.length > 0;
}

function normalizeStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((entry): entry is string => typeof entry === "string") : [];
}

function normalizePackage(item: PackageItem): PackageItem {
  return {
    ...item,
    includedItems: normalizeStringArray(item.includedItems),
    optionalAddOns: normalizeStringArray(item.optionalAddOns),
  };
}

function normalizeServiceArea(item: ServiceAreaItem): ServiceAreaItem {
  return {
    ...item,
    serviceAreaSlides: Array.isArray(item.serviceAreaSlides) ? item.serviceAreaSlides : [],
  };
}

function normalizeHomepage(item: Homepage): Homepage {
  return {
    ...item,
    heroSlides: Array.isArray(item.heroSlides) ? item.heroSlides : [],
  };
}

export async function getSiteShellData() {
  const shellData = await fetchOrNull<{
    businessInfo: BusinessInfo | null;
    serviceAreas: ServiceAreaItem[];
  }>(siteShellQuery);

  return {
    businessInfo: shellData?.businessInfo ?? fallbackBusinessInfo,
    serviceAreas: isNonEmptyArray(shellData?.serviceAreas)
      ? shellData.serviceAreas.map(normalizeServiceArea)
      : fallbackServiceAreas.slice(0, 8).map(normalizeServiceArea),
  };
}

export async function getHomePageData() {
  const [homepageDoc, packages, galleryItems, testimonials, serviceAreas] = await Promise.all([
    fetchOrNull<Homepage>(homepageQuery),
    fetchOrNull<PackageItem[]>(packagesQuery),
    fetchOrNull<GalleryItem[]>(galleryQuery),
    fetchOrNull<TestimonialItem[]>(testimonialsQuery),
    fetchOrNull<ServiceAreaItem[]>(serviceAreasQuery),
  ]);

  const resolvedPackages = isNonEmptyArray(packages) ? packages.map(normalizePackage) : fallbackPackages.map(normalizePackage);
  const resolvedGallery = isNonEmptyArray(galleryItems) ? galleryItems : fallbackGallery;
  const resolvedTestimonials = isNonEmptyArray(testimonials) ? testimonials : fallbackTestimonials;
  const resolvedServiceAreas = isNonEmptyArray(serviceAreas)
    ? serviceAreas.map(normalizeServiceArea)
    : fallbackServiceAreas.map(normalizeServiceArea);

  const homepage = normalizeHomepage({
    ...fallbackHomepage,
    ...homepageDoc,
    featuredPackages: isNonEmptyArray(homepageDoc?.featuredPackages)
      ? homepageDoc.featuredPackages.map(normalizePackage)
      : resolvedPackages.filter((item) => item.featured).slice(0, 3),
    galleryPreview: isNonEmptyArray(homepageDoc?.galleryPreview)
      ? homepageDoc.galleryPreview
      : resolvedGallery.slice(0, 6),
    testimonialsPreview: isNonEmptyArray(homepageDoc?.testimonialsPreview)
      ? homepageDoc.testimonialsPreview
      : resolvedTestimonials.slice(0, 3),
    serviceAreaPreview: isNonEmptyArray(homepageDoc?.serviceAreaPreview)
      ? homepageDoc.serviceAreaPreview.map(normalizeServiceArea)
      : resolvedServiceAreas.slice(0, 6),
  });

  return {
    homepage,
    featuredPackages: homepage.featuredPackages ?? [],
    galleryItems: homepage.galleryPreview ?? [],
    testimonials: homepage.testimonialsPreview ?? [],
    serviceAreas: homepage.serviceAreaPreview ?? [],
  };
}

export async function getPackagesPageData() {
  const [packages, homepageDoc] = await Promise.all([
    fetchOrNull<PackageItem[]>(packagesQuery),
    fetchOrNull<Homepage>(homepageQuery),
  ]);

  return {
    packages: isNonEmptyArray(packages) ? packages.map(normalizePackage) : fallbackPackages.map(normalizePackage),
    seo: homepageDoc?.seo ?? fallbackHomepage.seo,
  };
}

export async function getGalleryPageData() {
  const [galleryItems, homepageDoc] = await Promise.all([
    fetchOrNull<GalleryItem[]>(galleryQuery),
    fetchOrNull<Homepage>(homepageQuery),
  ]);

  return {
    galleryItems: isNonEmptyArray(galleryItems) ? galleryItems : fallbackGallery,
    seo: homepageDoc?.seo ?? fallbackHomepage.seo,
  };
}

export async function getBookingPageData() {
  const [packages, businessInfo] = await Promise.all([
    fetchOrNull<{ _id: string; packageName: string }[]>(packageOptionsQuery),
    fetchOrNull<BusinessInfo>(businessInfoQuery),
  ]);

  return {
    packages: isNonEmptyArray(packages)
      ? packages
      : fallbackPackages.map((item) => ({ _id: item._id, packageName: item.packageName })),
    businessInfo: businessInfo ?? fallbackBusinessInfo,
    seo: businessInfo?.seo ?? fallbackBusinessInfo.seo,
  };
}

export async function getContactPageData() {
  const [businessInfo, serviceAreas] = await Promise.all([
    fetchOrNull<BusinessInfo>(businessInfoQuery),
    fetchOrNull<ServiceAreaItem[]>(serviceAreasQuery),
  ]);

  return {
    businessInfo: businessInfo ?? fallbackBusinessInfo,
    serviceAreas: isNonEmptyArray(serviceAreas)
      ? serviceAreas.map(normalizeServiceArea).slice(0, 6)
      : fallbackServiceAreas.map(normalizeServiceArea).slice(0, 6),
    seo: businessInfo?.seo ?? fallbackBusinessInfo.seo,
  };
}

export async function getServiceAreasPageData() {
  const serviceAreas = await fetchOrNull<ServiceAreaItem[]>(serviceAreasQuery);

  return {
    serviceAreas: isNonEmptyArray(serviceAreas)
      ? serviceAreas.map(normalizeServiceArea)
      : fallbackServiceAreas.map(normalizeServiceArea),
    seo: {
      metaTitle: "Service Areas for Event Rentals",
      metaDescription:
        "Find tent rentals, table and chair rentals, and party packages in nearby towns we serve.",
    },
  };
}

export async function getServiceAreaBySlug(slug: string) {
  const serviceArea = await fetchOrNull<ServiceAreaItem>(serviceAreaBySlugQuery, { slug });

  if (serviceArea) {
    return normalizeServiceArea(serviceArea);
  }

  const fallbackServiceArea = fallbackServiceAreas.find((item) => item.slug.current === slug);
  return fallbackServiceArea ? normalizeServiceArea(fallbackServiceArea) : null;
}

export async function getServiceAreaSlugs() {
  const slugs = await fetchOrNull<{ slug: string }[]>(serviceAreaSlugsQuery);

  if (isNonEmptyArray(slugs)) {
    return slugs.map((entry) => entry.slug);
  }

  return fallbackServiceAreas.map((entry) => entry.slug.current);
}
