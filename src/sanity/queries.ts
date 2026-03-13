import { groq } from "next-sanity";

const packageProjection = groq`{
  _id,
  packageName,
  slug,
  price,
  shortDescription,
  fullDescription,
  packagePhoto,
  guestCapacity,
  capacityLabel,
  includedItems,
  optionalAddOns,
  featured,
  buttonText
}`;

const galleryProjection = groq`{
  _id,
  title,
  caption,
  eventType,
  eventPhoto
}`;

const testimonialProjection = groq`{
  _id,
  customerName,
  testimonialText,
  eventType,
  town
}`;

const serviceAreaProjection = groq`{
  _id,
  county,
  townName,
  slug,
  shortDescription,
  seoText,
  serviceAreaSlides,
  seo
}`;

const faqPageProjection = groq`{
  _id,
  eyebrow,
  title,
  introText,
  faqItems[]{
    question,
    answer,
    category,
    featured
  }
}`;

const businessInfoProjection = groq`{
  _id,
  businessName,
  businessLogo,
  bookingPageImage,
  phoneNumber,
  emailAddress,
  addressOrServiceBase,
  mapLocation,
  hours,
  bookingInstructions,
  rentalPolicyHighlights[]{
    sectionTitle,
    bulletPoints,
    note
  },
  inventoryItems[]{
    itemName,
    itemImage
  },
  individualRentalPricing[]{
    itemName,
    price,
    itemImage
  },
  deliveryFees[]{
    distance,
    fee
  },
  setupFees[]{
    tent,
    setupFee
  },
  instagramUrl,
  facebookUrl,
  seo
}`;

export const homepageQuery = groq`*[_type == "homepage"][0]{
  _id,
  mainHeadline,
  supportingText,
  heroImage,
  heroSlides,
  primaryButtonText,
  introSectionText,
  finalCallToActionHeading,
  finalCallToActionText,
  finalCallToActionButtonText,
  seo,
  featuredPackages[]->${packageProjection},
  galleryPreview[]->${galleryProjection},
  testimonialsPreview[]->${testimonialProjection},
  serviceAreaPreview[]->${serviceAreaProjection}
}`;

export const packagesQuery = groq`*[_type == "package"]|order(featured desc, packageName asc)${packageProjection}`;

export const galleryQuery = groq`*[_type == "galleryItem"]|order(_createdAt desc)${galleryProjection}`;

export const testimonialsQuery = groq`*[_type == "testimonial"]|order(_createdAt desc)${testimonialProjection}`;

export const businessInfoQuery =
  groq`*[_type == "businessInfo"][0]${businessInfoProjection}`;

export const serviceAreasQuery =
  groq`*[_type == "serviceArea" && defined(county)]|order(county asc, townName asc)${serviceAreaProjection}`;

export const serviceAreaBySlugQuery =
  groq`*[_type == "serviceArea" && slug.current == $slug][0]${serviceAreaProjection}`;

export const serviceAreaSlugsQuery =
  groq`*[_type == "serviceArea" && defined(county) && defined(slug.current)]{ "slug": slug.current }`;

export const packageOptionsQuery =
  groq`*[_type == "package"]|order(packageName asc){ _id, packageName, optionalAddOns }`;

export const faqPageQuery = groq`*[_type == "faqPage"][0]${faqPageProjection}`;

export const siteShellQuery = groq`{
  "businessInfo": *[_type == "businessInfo"][0]${businessInfoProjection},
  "serviceAreas": *[_type == "serviceArea" && defined(county)]|order(county asc, townName asc){
    _id,
    county,
    townName,
    slug,
    shortDescription
  }
}`;
