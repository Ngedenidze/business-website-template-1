import type {
  BusinessInfo,
  GalleryItem,
  Homepage,
  PackageItem,
  ServiceAreaItem,
  TestimonialItem,
} from "@/sanity/types";

export const fallbackPackages: PackageItem[] = [
  {
    _id: "fallback-package-garden",
    packageName: "Garden Party Package",
    price: "From $595",
    shortDescription: "40 chairs, 6 banquet tables, and a clean white tent for family events.",
    fullDescription:
      "Best for birthdays, bridal showers, and small receptions where you need a polished setup without overbuilding your budget.",
    guestCapacity: 40,
    includedItems: ["20x20 frame tent", "40 white folding chairs", "6 eight-foot banquet tables"],
    optionalAddOns: ["Bistro lighting", "Cake table setup"],
    featured: true,
    buttonText: "Request Garden Package",
    slug: { current: "garden-party-package" },
    packagePhoto: null,
  },
  {
    _id: "fallback-package-classic",
    packageName: "Classic Celebration Package",
    price: "From $895",
    shortDescription: "60 guest setup with upgraded table linens and wider layout options.",
    fullDescription:
      "Designed for graduation parties, engagement events, and weekend celebrations where guest flow and comfort matter.",
    guestCapacity: 60,
    includedItems: [
      "20x30 high-peak tent",
      "60 white resin chairs",
      "8 banquet tables",
      "8 premium table linens",
    ],
    optionalAddOns: ["Cocktail tables", "Dance floor section"],
    featured: true,
    buttonText: "Request Classic Package",
    slug: { current: "classic-celebration-package" },
    packagePhoto: null,
  },
  {
    _id: "fallback-package-wedding",
    packageName: "Wedding Reception Package",
    price: "From $1,450",
    shortDescription: "Elegant tented reception setup for up to 100 guests.",
    fullDescription:
      "A complete reception-ready package for couples who want a warm, refined outdoor setup with seating and dining covered.",
    guestCapacity: 100,
    includedItems: [
      "30x40 tent",
      "100 cross-back chairs",
      "12 round guest tables",
      "Head table setup",
    ],
    optionalAddOns: ["String lighting", "Tent sidewalls", "Lounge furniture"],
    featured: true,
    buttonText: "Request Wedding Package",
    slug: { current: "wedding-reception-package" },
    packagePhoto: null,
  },
  {
    _id: "fallback-package-backyard",
    packageName: "Backyard Basics Package",
    price: "From $395",
    shortDescription: "Practical essentials for simple gatherings with quick setup.",
    fullDescription:
      "A starter package for weekend cookouts and neighborhood gatherings that need shade, seating, and table space.",
    guestCapacity: 25,
    includedItems: ["20x20 pole tent", "25 folding chairs", "4 banquet tables"],
    optionalAddOns: ["Additional chairs", "Additional tables"],
    featured: false,
    buttonText: "Request Basics Package",
    slug: { current: "backyard-basics-package" },
    packagePhoto: null,
  },
];

export const fallbackGallery: GalleryItem[] = [
  {
    _id: "fallback-gallery-1",
    title: "Backyard Reception Layout",
    caption: "Tent, sweetheart table, and guest seating in a private yard.",
    eventType: "Wedding",
    eventPhoto: null,
  },
  {
    _id: "fallback-gallery-2",
    title: "Evening Birthday Setup",
    caption: "String-lit dining arrangement for a 50-person birthday party.",
    eventType: "Birthday",
    eventPhoto: null,
  },
  {
    _id: "fallback-gallery-3",
    title: "Graduation Open House",
    caption: "Open tent flow with buffet and standing cocktail tables.",
    eventType: "Graduation",
    eventPhoto: null,
  },
  {
    _id: "fallback-gallery-4",
    title: "Family Reunion",
    caption: "Large table cluster with weather coverage and lounge zone.",
    eventType: "Family Reunion",
    eventPhoto: null,
  },
  {
    _id: "fallback-gallery-5",
    title: "Bridal Shower Garden",
    caption: "Soft linen palette and compact guest table arrangement.",
    eventType: "Bridal Shower",
    eventPhoto: null,
  },
  {
    _id: "fallback-gallery-6",
    title: "Corporate Picnic",
    caption: "Shade-focused setup with flexible table groupings.",
    eventType: "Corporate Event",
    eventPhoto: null,
  },
  {
    _id: "fallback-gallery-7",
    title: "Tent Ceremony",
    caption: "Ceremony chairs and aisle spacing for an outdoor wedding.",
    eventType: "Wedding",
    eventPhoto: null,
  },
  {
    _id: "fallback-gallery-8",
    title: "Anniversary Dinner",
    caption: "Intimate dinner setup with premium seating and linens.",
    eventType: "Anniversary",
    eventPhoto: null,
  },
  {
    _id: "fallback-gallery-9",
    title: "Neighborhood Block Party",
    caption: "Durable tent setup ready for high guest turnover.",
    eventType: "Community Event",
    eventPhoto: null,
  },
  {
    _id: "fallback-gallery-10",
    title: "Kids Party Setup",
    caption: "Compact layout with family seating and food station tables.",
    eventType: "Kids Party",
    eventPhoto: null,
  },
];

export const fallbackTestimonials: TestimonialItem[] = [
  {
    _id: "fallback-testimonial-1",
    customerName: "C. Martinez",
    testimonialText:
      "The setup looked clean and professional, and communication was clear from booking to pickup.",
    eventType: "Wedding",
    town: "Springfield",
  },
  {
    _id: "fallback-testimonial-2",
    customerName: "A. Patel",
    testimonialText:
      "We needed tables and chairs quickly for a birthday. They arrived on time and the layout was exactly right.",
    eventType: "Birthday",
    town: "Riverview",
  },
  {
    _id: "fallback-testimonial-3",
    customerName: "L. Johnson",
    testimonialText:
      "Pricing was clear, setup was smooth, and the team helped us pick the right package for our guest count.",
    eventType: "Family Reunion",
    town: "Oak Hill",
  },
];

export const fallbackServiceAreas: ServiceAreaItem[] = [
  {
    _id: "fallback-town-springfield",
    townName: "Springfield",
    slug: { current: "springfield" },
    shortDescription: "Tent rentals and package setups for weddings and backyard parties in Springfield.",
    seoText:
      "Need tent rentals in Springfield? We provide table and chair rentals, bundled event setups, and practical delivery windows for local venues and homes.",
    serviceAreaSlides: [],
    seo: {
      metaTitle: "Tent Rentals in Springfield",
      metaDescription:
        "Tent rentals, table and chair rentals, and party packages in Springfield for weddings and local events.",
    },
  },
  {
    _id: "fallback-town-riverview",
    townName: "Riverview",
    slug: { current: "riverview" },
    shortDescription: "Party rentals in Riverview with complete tent, table, and chair package options.",
    seoText:
      "Our Riverview service includes setup support, clear package pricing, and dependable tent rentals for private events.",
    serviceAreaSlides: [],
    seo: {
      metaTitle: "Party Rentals in Riverview",
      metaDescription:
        "Book tent, table, and chair rentals in Riverview with package options for birthdays and wedding receptions.",
    },
  },
  {
    _id: "fallback-town-oakhill",
    townName: "Oak Hill",
    slug: { current: "oak-hill" },
    shortDescription: "Event rentals in Oak Hill for family celebrations, reunions, and seasonal gatherings.",
    seoText:
      "Looking for event rentals in Oak Hill? We handle tent layout planning and practical table and chair counts for your guest list.",
    serviceAreaSlides: [],
  },
  {
    _id: "fallback-town-lakeside",
    townName: "Lakeside",
    slug: { current: "lakeside" },
    shortDescription: "Tent and table rentals in Lakeside for weddings and outdoor receptions.",
    seoText:
      "Lakeside customers use our bundled packages for cleaner planning and predictable setup day scheduling.",
    serviceAreaSlides: [],
  },
  {
    _id: "fallback-town-fairview",
    townName: "Fairview",
    slug: { current: "fairview" },
    shortDescription: "Chair, table, and tent package rentals in Fairview with local delivery options.",
    seoText:
      "For party rentals in Fairview, we provide practical package guidance based on event size and site access.",
    serviceAreaSlides: [],
  },
  {
    _id: "fallback-town-willow-creek",
    townName: "Willow Creek",
    slug: { current: "willow-creek" },
    shortDescription: "Event rental packages in Willow Creek for birthdays, showers, and receptions.",
    seoText:
      "Willow Creek bookings include tent rentals near you with chair and table combinations that match your floor plan.",
    serviceAreaSlides: [],
  },
  {
    _id: "fallback-town-cedar-grove",
    townName: "Cedar Grove",
    slug: { current: "cedar-grove" },
    shortDescription: "Reliable event setup rentals in Cedar Grove for home and venue events.",
    seoText:
      "Book tent, table, and chair rentals in Cedar Grove with direct support during planning and scheduling.",
    serviceAreaSlides: [],
  },
  {
    _id: "fallback-town-meadow-park",
    townName: "Meadow Park",
    slug: { current: "meadow-park" },
    shortDescription: "Party rental bundles in Meadow Park with fast quote responses.",
    seoText:
      "Meadow Park families and couples use our packages for simple event planning and clean event-day setup.",
    serviceAreaSlides: [],
  },
];

export const fallbackBusinessInfo: BusinessInfo = {
  _id: "fallback-business-info",
  businessName: "Willow & Canvas Event Rentals",
  businessLogo: null,
  bookingPageImage: null,
  phoneNumber: "(555) 318-2247",
  emailAddress: "bookings@willowandcanvas.com",
  addressOrServiceBase: "Serving Springfield and surrounding towns",
  mapLocation: "https://maps.google.com",
  hours: "Mon-Sat: 8:00 AM - 6:00 PM",
  bookingInstructions:
    "Submit a booking request with your event date and location. We confirm availability and reach out to finalize your booking.",
  instagramUrl: "",
  facebookUrl: "",
  seo: {
    metaTitle: "Willow & Canvas Event Rentals",
    metaDescription:
      "Local tent rentals, table and chair rentals, and event packages for weddings and private events.",
  },
};

export const fallbackHomepage: Homepage = {
  _id: "fallback-homepage",
  mainHeadline: "Tent, Table, and Chair Rentals for Events That Feel Put Together",
  supportingText:
    "We help local families and couples host clean, comfortable events with practical package options and clear booking steps.",
  heroImage: null,
  heroSlides: [],
  primaryButtonText: "Request a Booking",
  introSectionText:
    "From backyard birthdays to wedding receptions, we rent tents, tables, chairs, and bundled setup packages with straightforward communication and reliable scheduling.",
  featuredPackages: fallbackPackages.filter((item) => item.featured).slice(0, 3),
  galleryPreview: fallbackGallery.slice(0, 6),
  testimonialsPreview: fallbackTestimonials,
  serviceAreaPreview: fallbackServiceAreas.slice(0, 6),
  finalCallToActionHeading: "Tell Us Your Date and Guest Count",
  finalCallToActionText:
    "We will review your request, confirm availability, and reach out to finalize your booking.",
  finalCallToActionButtonText: "Request a Booking",
  seo: {
    metaTitle: "Tent, Table, and Chair Rentals",
    metaDescription:
      "Local event rental packages for tents, tables, and chairs with simple booking request flow.",
  },
};
