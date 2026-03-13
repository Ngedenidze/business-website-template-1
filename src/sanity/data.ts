import { client } from "@/sanity/client";
import {
  businessInfoQuery,
  faqPageQuery,
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
  fallbackFaqPage,
  fallbackGallery,
  fallbackHomepage,
  fallbackPackages,
  fallbackServiceAreas,
  fallbackTestimonials,
} from "@/sanity/fallback-content";
import type {
  BusinessInfo,
  FAQPage,
  GalleryItem,
  Homepage,
  PackageItem,
  ServiceAreaItem,
  TestimonialItem,
} from "@/sanity/types";

const options = { next: { revalidate: 60 } };
const fallbackPackagesBySlug = new Map<string, PackageItem>();
for (const item of fallbackPackages) {
  if (typeof item.slug?.current === "string") {
    fallbackPackagesBySlug.set(item.slug.current, item);
  }
}
const fallbackPackagesByName = new Map(
  fallbackPackages.map(
    (item) => [item.packageName.toLowerCase(), item] as const,
  ),
);
const fallbackGalleryByTitle = new Map<string, GalleryItem>();
for (const item of fallbackGallery) {
  if (typeof item.title === "string") {
    fallbackGalleryByTitle.set(item.title.toLowerCase(), item);
  }
}
const fallbackServiceAreasBySlug = new Map<string, ServiceAreaItem>();
for (const item of fallbackServiceAreas) {
  if (typeof item.slug?.current === "string") {
    fallbackServiceAreasBySlug.set(item.slug.current, item);
  }
}

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
  return Array.isArray(value)
    ? value.filter((entry): entry is string => typeof entry === "string")
    : [];
}

function normalizeIndividualPricingRows(
  value: unknown,
  fallback: NonNullable<BusinessInfo["individualRentalPricing"]> = [],
): NonNullable<BusinessInfo["individualRentalPricing"]> {
  if (!Array.isArray(value)) {
    return fallback;
  }

  return value
    .map((row) => ({
      itemName: typeof row?.itemName === "string" ? row.itemName : "",
      price: typeof row?.price === "string" ? row.price : "",
      itemImage: row?.itemImage ?? null,
    }))
    .filter(
      (row) => row.itemName.trim().length > 0 && row.price.trim().length > 0,
    );
}

function normalizeInventoryItems(
  value: unknown,
  fallback: NonNullable<BusinessInfo["inventoryItems"]> = [],
): NonNullable<BusinessInfo["inventoryItems"]> {
  if (!Array.isArray(value)) {
    return fallback;
  }

  return value
    .map((row) => ({
      itemName: typeof row?.itemName === "string" ? row.itemName : "",
      itemImage: row?.itemImage ?? null,
    }))
    .filter((row) => row.itemName.trim().length > 0);
}

function normalizeDeliveryFeeRows(
  value: unknown,
  fallback: NonNullable<BusinessInfo["deliveryFees"]> = [],
): NonNullable<BusinessInfo["deliveryFees"]> {
  if (!Array.isArray(value)) {
    return fallback;
  }

  return value
    .map((row) => ({
      distance: typeof row?.distance === "string" ? row.distance : "",
      fee: typeof row?.fee === "string" ? row.fee : "",
    }))
    .filter(
      (row) => row.distance.trim().length > 0 && row.fee.trim().length > 0,
    );
}

function normalizeSetupFeeRows(
  value: unknown,
  fallback: NonNullable<BusinessInfo["setupFees"]> = [],
): NonNullable<BusinessInfo["setupFees"]> {
  if (!Array.isArray(value)) {
    return fallback;
  }

  return value
    .map((row) => ({
      tent: typeof row?.tent === "string" ? row.tent : "",
      setupFee: typeof row?.setupFee === "string" ? row.setupFee : "",
    }))
    .filter(
      (row) => row.tent.trim().length > 0 && row.setupFee.trim().length > 0,
    );
}

function normalizeFaqItems(
  value: unknown,
  fallback: FAQPage["faqItems"] = [],
): FAQPage["faqItems"] {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const normalized = value
    .map((item) => ({
      question: typeof item?.question === "string" ? item.question : "",
      answer: typeof item?.answer === "string" ? item.answer : "",
      category: typeof item?.category === "string" ? item.category : undefined,
      featured: Boolean(item?.featured),
    }))
    .filter(
      (item) => item.question.trim().length > 0 && item.answer.trim().length > 0,
    );

  return normalized.length > 0 ? normalized : fallback;
}

function normalizeFaqPage(item: FAQPage | null | undefined): FAQPage {
  const faqItems = normalizeFaqItems(item?.faqItems, fallbackFaqPage.faqItems);

  return {
    _id: item?._id || fallbackFaqPage._id,
    eyebrow:
      typeof item?.eyebrow === "string" && item.eyebrow.trim().length > 0
        ? item.eyebrow
        : fallbackFaqPage.eyebrow,
    title:
      typeof item?.title === "string" && item.title.trim().length > 0
        ? item.title
        : fallbackFaqPage.title,
    introText:
      typeof item?.introText === "string" && item.introText.trim().length > 0
        ? item.introText
        : fallbackFaqPage.introText,
    faqItems,
  };
}

function normalizeBusinessInfo(
  item: BusinessInfo | null | undefined,
): BusinessInfo {
  const rawSections = Array.isArray(item?.rentalPolicyHighlights)
    ? item.rentalPolicyHighlights
    : fallbackBusinessInfo.rentalPolicyHighlights;

  const rentalPolicyHighlights = Array.isArray(rawSections)
    ? rawSections
        .map((section) => ({
          sectionTitle:
            typeof section?.sectionTitle === "string"
              ? section.sectionTitle
              : "",
          bulletPoints: normalizeStringArray(section?.bulletPoints),
          note: typeof section?.note === "string" ? section.note : undefined,
        }))
        .filter(
          (section) =>
            section.sectionTitle.trim().length > 0 &&
            section.bulletPoints.length > 0,
        )
    : [];
  const individualRentalPricing = normalizeIndividualPricingRows(
    item?.individualRentalPricing,
    fallbackBusinessInfo.individualRentalPricing ?? [],
  );
  const inventoryItems = normalizeInventoryItems(
    item?.inventoryItems,
    fallbackBusinessInfo.inventoryItems ?? [],
  );
  const deliveryFees = normalizeDeliveryFeeRows(
    item?.deliveryFees,
    fallbackBusinessInfo.deliveryFees ?? [],
  );
  const setupFees = normalizeSetupFeeRows(
    item?.setupFees,
    fallbackBusinessInfo.setupFees ?? [],
  );

  return {
    ...fallbackBusinessInfo,
    ...item,
    bookingPageImage:
      item?.bookingPageImage ?? fallbackBusinessInfo.bookingPageImage,
    businessLogo: item?.businessLogo ?? fallbackBusinessInfo.businessLogo,
    rentalPolicyHighlights,
    inventoryItems,
    individualRentalPricing,
    deliveryFees,
    setupFees,
  };
}

function findFallbackPackage(item: PackageItem) {
  const slug = item.slug?.current;
  if (typeof slug === "string" && fallbackPackagesBySlug.has(slug)) {
    return fallbackPackagesBySlug.get(slug);
  }

  return fallbackPackagesByName.get(item.packageName.toLowerCase());
}

function normalizePackage(item: PackageItem): PackageItem {
  const fallbackPackage = findFallbackPackage(item);

  return {
    ...item,
    includedItems: normalizeStringArray(item.includedItems),
    optionalAddOns: normalizeStringArray(item.optionalAddOns),
    packagePhoto: item.packagePhoto ?? fallbackPackage?.packagePhoto ?? null,
    buttonText: item.buttonText || fallbackPackage?.buttonText,
  };
}

function normalizeGalleryItem(item: GalleryItem): GalleryItem {
  const fallbackByTitle = item.title
    ? fallbackGalleryByTitle.get(item.title.toLowerCase())
    : null;

  return {
    ...item,
    eventPhoto: item.eventPhoto ?? fallbackByTitle?.eventPhoto ?? null,
  };
}

function normalizeServiceArea(item: ServiceAreaItem): ServiceAreaItem {
  const fallbackServiceArea =
    typeof item.slug?.current === "string"
      ? fallbackServiceAreasBySlug.get(item.slug.current)
      : undefined;

  return {
    ...item,
    county:
      typeof item.county === "string" && item.county.trim()
        ? item.county
        : "Other Service Areas",
    serviceAreaSlides:
      Array.isArray(item.serviceAreaSlides) && item.serviceAreaSlides.length > 0
        ? item.serviceAreaSlides
        : (fallbackServiceArea?.serviceAreaSlides ?? []),
  };
}

function normalizeHomepage(item: Homepage): Homepage {
  const hasHeroSlides =
    Array.isArray(item.heroSlides) && item.heroSlides.length > 0;

  return {
    ...item,
    heroImage: item.heroImage ?? fallbackHomepage.heroImage,
    heroSlides: hasHeroSlides ? item.heroSlides : fallbackHomepage.heroSlides,
  };
}

export async function getSiteShellData() {
  const shellData = await fetchOrNull<{
    businessInfo: BusinessInfo | null;
    serviceAreas: ServiceAreaItem[];
  }>(siteShellQuery);

  return {
    businessInfo: normalizeBusinessInfo(shellData?.businessInfo),
    serviceAreas: isNonEmptyArray(shellData?.serviceAreas)
      ? shellData.serviceAreas.map(normalizeServiceArea)
      : fallbackServiceAreas.map(normalizeServiceArea),
  };
}

export async function getHomePageData() {
  const [homepageDoc, packages, galleryItems, testimonials, serviceAreas] =
    await Promise.all([
      fetchOrNull<Homepage>(homepageQuery),
      fetchOrNull<PackageItem[]>(packagesQuery),
      fetchOrNull<GalleryItem[]>(galleryQuery),
      fetchOrNull<TestimonialItem[]>(testimonialsQuery),
      fetchOrNull<ServiceAreaItem[]>(serviceAreasQuery),
    ]);

  const resolvedPackages = isNonEmptyArray(packages)
    ? packages.map(normalizePackage)
    : fallbackPackages.map(normalizePackage);
  const resolvedGallery = isNonEmptyArray(galleryItems)
    ? galleryItems.map(normalizeGalleryItem)
    : fallbackGallery.map(normalizeGalleryItem);
  const resolvedTestimonials = isNonEmptyArray(testimonials)
    ? testimonials
    : fallbackTestimonials;
  const resolvedServiceAreas = isNonEmptyArray(serviceAreas)
    ? serviceAreas.map(normalizeServiceArea)
    : fallbackServiceAreas.map(normalizeServiceArea);
  const essexServiceAreas = resolvedServiceAreas.filter((item) =>
    item.county.toLowerCase().includes("essex"),
  );
  const homeServiceAreaPreview = (
    essexServiceAreas.length > 0 ? essexServiceAreas : resolvedServiceAreas
  ).slice(0, 6);

  const homepage = normalizeHomepage({
    ...fallbackHomepage,
    ...homepageDoc,
    featuredPackages: isNonEmptyArray(homepageDoc?.featuredPackages)
      ? homepageDoc.featuredPackages.map(normalizePackage)
      : resolvedPackages.filter((item) => item.featured).slice(0, 3),
    galleryPreview: isNonEmptyArray(homepageDoc?.galleryPreview)
      ? homepageDoc.galleryPreview.map(normalizeGalleryItem)
      : resolvedGallery.slice(0, 6),
    testimonialsPreview: isNonEmptyArray(homepageDoc?.testimonialsPreview)
      ? homepageDoc.testimonialsPreview
      : resolvedTestimonials.slice(0, 3),
    serviceAreaPreview: homeServiceAreaPreview,
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
  const [packages, homepageDoc, businessInfo] = await Promise.all([
    fetchOrNull<PackageItem[]>(packagesQuery),
    fetchOrNull<Homepage>(homepageQuery),
    fetchOrNull<BusinessInfo>(businessInfoQuery),
  ]);

  return {
    packages: isNonEmptyArray(packages)
      ? packages.map(normalizePackage)
      : fallbackPackages.map(normalizePackage),
    businessInfo: normalizeBusinessInfo(businessInfo),
    seo: homepageDoc?.seo ?? fallbackHomepage.seo,
  };
}

export async function getGalleryPageData() {
  const [galleryItems, homepageDoc] = await Promise.all([
    fetchOrNull<GalleryItem[]>(galleryQuery),
    fetchOrNull<Homepage>(homepageQuery),
  ]);

  return {
    galleryItems: isNonEmptyArray(galleryItems)
      ? galleryItems.map(normalizeGalleryItem)
      : fallbackGallery.map(normalizeGalleryItem),
    seo: homepageDoc?.seo ?? {
      metaTitle:
        "Event Rental Gallery | Wedding & Party Tent Setups | Spirit Event Rentals",
      metaDescription:
        "View photos of our event rental setups. See how our tents, tables, and chairs look at real weddings, backyard parties, and corporate events in New Jersey.",
    },
  };
}

export async function getBookingPageData() {
  const [packages, businessInfo, homepageDoc] = await Promise.all([
    fetchOrNull<{ _id: string; packageName: string }[]>(packageOptionsQuery),
    fetchOrNull<BusinessInfo>(businessInfoQuery),
    fetchOrNull<Homepage>(homepageQuery),
  ]);

  return {
    packages: isNonEmptyArray(packages)
      ? packages
      : fallbackPackages.map((item) => ({
          _id: item._id,
          packageName: item.packageName,
        })),
    businessInfo: normalizeBusinessInfo(businessInfo),
    seo: businessInfo?.seo ?? fallbackBusinessInfo.seo,
    heroImage:
      businessInfo?.bookingPageImage ??
      homepageDoc?.heroImage ??
      fallbackBusinessInfo.bookingPageImage ??
      fallbackHomepage.heroImage,
  };
}

export async function getContactPageData() {
  const [businessInfo, serviceAreas] = await Promise.all([
    fetchOrNull<BusinessInfo>(businessInfoQuery),
    fetchOrNull<ServiceAreaItem[]>(serviceAreasQuery),
  ]);

  return {
    businessInfo: normalizeBusinessInfo(businessInfo),
    serviceAreas: isNonEmptyArray(serviceAreas)
      ? serviceAreas.map(normalizeServiceArea).slice(0, 6)
      : fallbackServiceAreas.map(normalizeServiceArea).slice(0, 6),
    seo: businessInfo?.seo ?? {
      metaTitle: "Contact Us | Spirit Event Rentals Caldwell",
      metaDescription:
        "Need help planning your event setup? Contact Spirit Event Rentals in Caldwell, NJ via phone or email for questions about tents, tables, and chairs.",
    },
  };
}

export async function getPolicyPageData() {
  const businessInfo = await fetchOrNull<BusinessInfo>(businessInfoQuery);
  const resolvedBusinessInfo = normalizeBusinessInfo(businessInfo);

  return {
    businessInfo: resolvedBusinessInfo,
    seo: resolvedBusinessInfo.seo ?? {
      metaTitle: "Rental Policies & Delivery Fees | Spirit Event Rentals",
      metaDescription:
        "Review our event rental policies, site requirements, weather guidelines, and delivery fees for tents, tables, and chairs.",
    },
  };
}

export async function getFaqPageData() {
  const faqPage = await fetchOrNull<FAQPage>(faqPageQuery);
  const resolvedFaqPage = normalizeFaqPage(faqPage);

  return {
    faqPage: resolvedFaqPage,
    seo: {
      metaTitle: resolvedFaqPage.title || "Frequently Asked Questions",
      metaDescription:
        resolvedFaqPage.introText ||
        "Read answers to common questions about booking, delivery, setup, and event rental policies.",
    },
  };
}

export async function getServiceAreasPageData() {
  const serviceAreas = await fetchOrNull<ServiceAreaItem[]>(serviceAreasQuery);

  return {
    serviceAreas: isNonEmptyArray(serviceAreas)
      ? serviceAreas.map(normalizeServiceArea)
      : fallbackServiceAreas.map(normalizeServiceArea),
    seo: {
      metaTitle: "Local Event Rentals & Service Areas | Spirit Event Rentals",
      metaDescription:
        "We deliver party rentals, tents, tables, and chairs to Caldwell, Riverview, Lakeside, and surrounding New Jersey towns. Check if we serve your area.",
    },
  };
}

export async function getServiceAreaBySlug(slug: string) {
  const serviceArea = await fetchOrNull<ServiceAreaItem>(
    serviceAreaBySlugQuery,
    { slug },
  );

  if (serviceArea) {
    return normalizeServiceArea(serviceArea);
  }

  const fallbackServiceArea = fallbackServiceAreas.find(
    (item) => item.slug.current === slug,
  );
  return fallbackServiceArea ? normalizeServiceArea(fallbackServiceArea) : null;
}

export async function getServiceAreaSlugs() {
  const slugs = await fetchOrNull<{ slug: string }[]>(serviceAreaSlugsQuery);

  if (isNonEmptyArray(slugs)) {
    return slugs.map((entry) => entry.slug);
  }

  return fallbackServiceAreas.map((entry) => entry.slug.current);
}
