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
  townName,
  slug,
  shortDescription,
  seoText,
  serviceAreaSlides,
  seo
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
  groq`*[_type == "serviceArea"]|order(townName asc)${serviceAreaProjection}`;

export const serviceAreaBySlugQuery =
  groq`*[_type == "serviceArea" && slug.current == $slug][0]${serviceAreaProjection}`;

export const serviceAreaSlugsQuery =
  groq`*[_type == "serviceArea" && defined(slug.current)]{ "slug": slug.current }`;

export const packageOptionsQuery =
  groq`*[_type == "package"]|order(packageName asc){ _id, packageName }`;

export const siteShellQuery = groq`{
  "businessInfo": *[_type == "businessInfo"][0]${businessInfoProjection},
  "serviceAreas": *[_type == "serviceArea"]|order(townName asc)[0...8]{
    _id,
    townName,
    slug,
    shortDescription
  }
}`;
