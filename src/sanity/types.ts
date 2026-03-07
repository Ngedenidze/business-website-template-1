export type SlugValue = {
  current: string;
};

export type SeoFields = {
  metaTitle?: string;
  metaDescription?: string;
};

export type SanityImageWithAlt = {
  alt?: string;
  asset?: {
    _ref?: string;
    _type?: string;
    url?: string;
  };
};

export type PackageItem = {
  _id: string;
  packageName: string;
  slug?: SlugValue;
  price: string;
  shortDescription: string;
  fullDescription: string;
  packagePhoto?: SanityImageWithAlt | null;
  guestCapacity: number;
  includedItems: string[];
  optionalAddOns: string[];
  featured: boolean;
  buttonText?: string;
};

export type GalleryItem = {
  _id: string;
  title?: string;
  caption?: string;
  eventType?: string;
  eventPhoto?: SanityImageWithAlt | null;
};

export type TestimonialItem = {
  _id: string;
  customerName: string;
  testimonialText: string;
  eventType?: string;
  town?: string;
};

export type ServiceAreaItem = {
  _id: string;
  townName: string;
  slug: SlugValue;
  shortDescription: string;
  seoText?: string;
  serviceAreaSlides: SanityImageWithAlt[];
  seo?: SeoFields;
};

export type BusinessInfo = {
  _id: string;
  businessName: string;
  businessLogo?: SanityImageWithAlt | null;
  bookingPageImage?: SanityImageWithAlt | null;
  phoneNumber: string;
  emailAddress: string;
  addressOrServiceBase?: string;
  mapLocation?: string;
  hours?: string;
  bookingInstructions: string;
  instagramUrl?: string;
  facebookUrl?: string;
  seo?: SeoFields;
};

export type Homepage = {
  _id: string;
  mainHeadline: string;
  supportingText: string;
  heroImage?: SanityImageWithAlt | null;
  heroSlides: SanityImageWithAlt[];
  primaryButtonText: string;
  introSectionText: string;
  featuredPackages?: PackageItem[];
  galleryPreview?: GalleryItem[];
  testimonialsPreview?: TestimonialItem[];
  serviceAreaPreview?: ServiceAreaItem[];
  finalCallToActionHeading: string;
  finalCallToActionText: string;
  finalCallToActionButtonText: string;
  seo?: SeoFields;
};
