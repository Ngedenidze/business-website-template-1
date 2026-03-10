import type {
  BusinessInfo,
  GalleryItem,
  Homepage,
  PackageItem,
  SanityImageWithAlt,
  ServiceAreaItem,
  TestimonialItem,
} from "@/sanity/types";

function localImage(url: string, alt: string): SanityImageWithAlt {
  return {
    alt,
    asset: {
      _type: "sanity.imageAsset",
      url,
    },
  };
}

const setupImages = {
  popUp30Guests: localImage(
    "/images/gallery/spirit-10x20-30-guests.png",
    "10x20 pop-up tent setup with guest seating",
  ),
  popUpBuffet: localImage(
    "/images/gallery/spirit-10x20-buffet.png",
    "10x20 pop-up tent buffet table layout",
  ),
  popUpCocktail: localImage(
    "/images/gallery/spirit-10x20-cocktail.png",
    "10x20 pop-up tent cocktail setup",
  ),
  frame20x26: localImage(
    "/images/gallery/spirit-20x26-frame.png",
    "20x26 frame tent with tables and chairs",
  ),
  frame20x38: localImage(
    "/images/gallery/spirit-20x38-frame.png",
    "20x38.5 frame tent reception layout",
  ),
};

const inventoryImages = {
  foldingChairs: localImage(
    "/images/inventory/spirit-folding-chair.png",
    "Folding chair rental item",
  ),
  banquetTable: localImage(
    "/images/inventory/spirit-banquet-table-30x96.png",
    "30 by 96 inch banquet table rental item",
  ),
  roundTable: localImage(
    "/images/inventory/spirit-round-table.png",
    "Round table rental item",
  ),
  cocktailTable: localImage(
    "/images/inventory/spirit-cocktail-table.png",
    "Cocktail table rental item",
  ),
  popUpTent10x20: localImage(
    "/images/inventory/spirit-tent-10x20-pop-up.png",
    "10 by 20 pop-up tent rental item",
  ),
  frameTent20x26: localImage(
    "/images/inventory/spirit-tent-20x26-frame.png",
    "20 by 26 frame tent rental item",
  ),
  frameTent20x40: localImage(
    "/images/inventory/spirit-tent-20x40-frame.png",
    "20 by 40 frame tent rental item",
  ),
};

const defaultServiceAreaSlides = [
  setupImages.frame20x38,
  setupImages.frame20x26,
  setupImages.popUpCocktail,
];

export const fallbackPackages: PackageItem[] = [
  {
    _id: "fallback-package-small-backyard",
    packageName: "Small Backyard Package",
    price: "$325",
    shortDescription: "Designed for intimate gatherings and backyard celebrations.",
    fullDescription:
      "Designed for intimate gatherings and backyard celebrations. This package is ideal for small birthday parties, baby showers, or family get-togethers. The 10x20 pop-up tent provides comfortable shade while the tables and chairs allow guests to relax and socialize without worrying about seating arrangements. A simple, affordable setup for smaller events.",
    guestCapacity: 30,
    capacityLabel: "20-30 guests",
    includedItems: ["10' x 20' pop-up tent", "4 tables", "30 chairs"],
    optionalAddOns: [],
    featured: true,
    buttonText: "Request Small Backyard Package",
    slug: { current: "small-backyard-package" },
    packagePhoto: inventoryImages.popUpTent10x20,
  },
  {
    _id: "fallback-package-backyard-party",
    packageName: "Backyard Party Package",
    price: "$575",
    shortDescription:
      "A great option for medium-sized events such as graduation parties, family reunions, or backyard celebrations.",
    fullDescription:
      "A great option for medium-sized events such as graduation parties, family reunions, or backyard celebrations. The larger frame tent creates a spacious covered area while the additional seating accommodates a bigger group of guests. This package balances space and affordability for hosts who want a comfortable event setup without overcomplicating logistics.",
    guestCapacity: 50,
    capacityLabel: "40-50 guests",
    includedItems: ["20' x 26' frame tent", "6 tables", "50 chairs"],
    optionalAddOns: [],
    featured: true,
    buttonText: "Request Backyard Party Package",
    slug: { current: "backyard-party-package" },
    packagePhoto: inventoryImages.frameTent20x26,
  },
  {
    _id: "fallback-package-large-party",
    packageName: "Large Party Package",
    price: "$875",
    shortDescription:
      "Perfect for large gatherings such as backyard weddings, engagement parties, and major celebrations.",
    fullDescription:
      "Perfect for large gatherings such as backyard weddings, engagement parties, and major celebrations. The 20x40 frame tent provides a spacious covered environment suitable for dining, socializing, and event activities. With seating for up to 80 guests, this package gives hosts everything needed for a well-organized outdoor event.",
    guestCapacity: 80,
    capacityLabel: "70-80 guests",
    includedItems: ["20' x 40' frame tent", "10 tables", "80 chairs"],
    optionalAddOns: [],
    featured: true,
    buttonText: "Request Large Party Package",
    slug: { current: "large-party-package" },
    packagePhoto: inventoryImages.frameTent20x40,
  },
];

export const fallbackGallery: GalleryItem[] = [
  {
    _id: "fallback-gallery-1",
    title: "10x20 Pop-Up Seating Setup",
    caption: "30-guest table and chair layout under a commercial-grade 10x20 pop-up tent.",
    eventType: "Backyard Party",
    eventPhoto: setupImages.popUp30Guests,
  },
  {
    _id: "fallback-gallery-2",
    title: "10x20 Buffet Setup",
    caption: "Buffet table and prep layout using the 10x20 pop-up tent package.",
    eventType: "Graduation Party",
    eventPhoto: setupImages.popUpBuffet,
  },
  {
    _id: "fallback-gallery-3",
    title: "10x20 Cocktail Setup",
    caption: "Cocktail-style arrangement with standing tables and decor-ready spacing.",
    eventType: "Cocktail Reception",
    eventPhoto: setupImages.popUpCocktail,
  },
  {
    _id: "fallback-gallery-4",
    title: "20x26 Frame Tent Layout",
    caption: "Mid-size frame tent setup for dinner seating and guest circulation.",
    eventType: "Family Celebration",
    eventPhoto: setupImages.frame20x26,
  },
  {
    _id: "fallback-gallery-5",
    title: "20x38.5 Frame Tent Layout",
    caption: "Large frame tent setup for receptions with round tables and floral centerpieces.",
    eventType: "Wedding Reception",
    eventPhoto: setupImages.frame20x38,
  },
];

export const fallbackTestimonials: TestimonialItem[] = [
  {
    _id: "fallback-testimonial-1",
    customerName: "C. Martinez",
    testimonialText:
      "The setup looked clean and professional, and communication was clear from booking to pickup.",
    eventType: "Wedding",
    town: "Caldwell",
  },
  {
    _id: "fallback-testimonial-2",
    customerName: "A. Patel",
    testimonialText:
      "We needed tables and chairs quickly for a birthday. They arrived on time and the layout was exactly right.",
    eventType: "Birthday",
    town: "Montclair",
  },
  {
    _id: "fallback-testimonial-3",
    customerName: "L. Johnson",
    testimonialText:
      "Pricing was clear, setup was smooth, and the team helped us pick the right package for our guest count.",
    eventType: "Family Reunion",
    town: "Wayne",
  },
];

export const fallbackServiceAreas: ServiceAreaItem[] = [
  {
    _id: "fallback-town-caldwell",
    county: "Essex County",
    townName: "Caldwell",
    slug: { current: "caldwell" },
    shortDescription:
      "Tent, table, and chair rentals in Caldwell with delivery coverage across Essex County.",
    seoText:
      "Need event rentals in Caldwell? We provide tent rentals, table and chair rentals, and bundled packages from our Caldwell, NJ service base.",
    serviceAreaSlides: defaultServiceAreaSlides,
    seo: {
      metaTitle: "Event Rentals in Caldwell, NJ",
      metaDescription:
        "Tent rentals, table and chair rentals, and party packages in Caldwell for weddings and private events.",
    },
  },
  {
    _id: "fallback-town-west-caldwell",
    county: "Essex County",
    townName: "West Caldwell",
    slug: { current: "west-caldwell" },
    shortDescription:
      "Party rentals in West Caldwell with complete tent, table, and chair package options.",
    seoText:
      "Our West Caldwell service includes delivery, setup options, and straightforward pricing for tent rentals and event packages.",
    serviceAreaSlides: defaultServiceAreaSlides,
  },
  {
    _id: "fallback-town-north-caldwell",
    county: "Essex County",
    townName: "North Caldwell",
    slug: { current: "north-caldwell" },
    shortDescription:
      "Event rentals in North Caldwell for family celebrations, reunions, and seasonal gatherings.",
    seoText:
      "Looking for event rentals in North Caldwell? We handle tent layout planning with practical table and chair counts for your guest list.",
    serviceAreaSlides: defaultServiceAreaSlides,
  },
  {
    _id: "fallback-town-essex-fells",
    county: "Essex County",
    townName: "Essex Fells",
    slug: { current: "essex-fells" },
    shortDescription: "Tent and table rentals in Essex Fells for weddings and outdoor receptions.",
    seoText:
      "Essex Fells customers use our bundled packages for simpler planning and predictable setup day scheduling.",
    serviceAreaSlides: defaultServiceAreaSlides,
  },
  {
    _id: "fallback-town-roseland",
    county: "Essex County",
    townName: "Roseland",
    slug: { current: "roseland" },
    shortDescription: "Chair, table, and tent package rentals in Roseland with local delivery options.",
    seoText:
      "For party rentals in Roseland, we provide practical package guidance based on event size and site access.",
    serviceAreaSlides: defaultServiceAreaSlides,
  },
  {
    _id: "fallback-town-livingston",
    county: "Essex County",
    townName: "Livingston",
    slug: { current: "livingston" },
    shortDescription: "Event rental packages in Livingston for birthdays, showers, and receptions.",
    seoText:
      "Livingston bookings include tent rentals near you with chair and table combinations that match your floor plan.",
    serviceAreaSlides: defaultServiceAreaSlides,
  },
  {
    _id: "fallback-town-montclair",
    county: "Essex County",
    townName: "Montclair",
    slug: { current: "montclair" },
    shortDescription: "Reliable event setup rentals in Montclair for home and venue events.",
    seoText:
      "Book tent, table, and chair rentals in Montclair with direct support during planning and scheduling.",
    serviceAreaSlides: defaultServiceAreaSlides,
  },
  {
    _id: "fallback-town-cedar-grove",
    county: "Essex County",
    townName: "Cedar Grove",
    slug: { current: "cedar-grove" },
    shortDescription: "Reliable event setup rentals in Cedar Grove for home and venue events.",
    seoText:
      "Book tent, table, and chair rentals in Cedar Grove with direct support during planning and scheduling.",
    serviceAreaSlides: defaultServiceAreaSlides,
  },
  {
    _id: "fallback-town-east-hanover",
    county: "Morris County",
    townName: "East Hanover",
    slug: { current: "east-hanover" },
    shortDescription: "Party rental bundles in East Hanover with fast quote responses.",
    seoText:
      "East Hanover families and couples use our packages for simple event planning and clean event-day setup.",
    serviceAreaSlides: defaultServiceAreaSlides,
  },
];

export const fallbackBusinessInfo: BusinessInfo = {
  _id: "fallback-business-info",
  businessName: "Spirit Event Rentals",
  businessLogo: null,
  bookingPageImage: setupImages.frame20x38,
  phoneNumber: "973 632-6516",
  emailAddress: "spiriteventrentals@yahoo.com",
  addressOrServiceBase: "23 Westville Ave. Caldwell, NJ, 07006",
  mapLocation: "https://maps.google.com/?q=23+Westville+Ave,+Caldwell,+NJ+07006",
  hours: "By appointment for delivery and setup windows",
  bookingInstructions:
    "Submit your booking request with the event date and location. We review availability, send the rental agreement manually, then send a Stripe payment link for your deposit or final payment.",
  rentalPolicyHighlights: [
    {
      sectionTitle: "Site Requirements (Tents)",
      bulletPoints: [
        "Installation surface must be level and clear.",
        "Underground utilities must be disclosed prior to staking.",
        "Client must call NJ One Call (811) before installation if staking is required.",
        "If staking is not possible, additional weighting fees apply.",
        "Access path must be minimum ___ feet wide.",
      ],
      note: "If site is unsuitable upon arrival, Rental Company may cancel without refund.",
    },
    {
      sectionTitle: "Weather Policy",
      bulletPoints: [
        "Tents are temporary structures and are not designed to withstand severe weather.",
        "Client assumes full responsibility for monitoring weather conditions.",
        "Tents must be evacuated in high winds (typically 35+ mph), lightning, or severe storms.",
        "No refunds due to weather.",
        "Rental Company may refuse installation due to unsafe forecasted conditions.",
      ],
    },
    {
      sectionTitle: "Linen (Tablecloth) Policy",
      bulletPoints: [
        "Linens must be shaken free of food and debris before stacking.",
        "Wax, burns, paint, permanent stains, or mildew will result in replacement charges.",
        "Client must not place damp linens in bags or containers.",
      ],
    },
    {
      sectionTitle: "Care, Damage & Loss",
      bulletPoints: ["Damage", "Theft", "Loss", "Vandalism", "Excessive cleaning"],
      note:
        "Client assumes full responsibility for equipment from delivery until pickup. Full replacement value will be charged if items are not returned.",
    },
    {
      sectionTitle: "Delivery & Pickup",
      bulletPoints: [
        "Client or responsible adult must be present.",
        "Equipment must be accessible at scheduled pickup time.",
        "Additional labor fees may apply if equipment is moved or inaccessible.",
        "Same-day teardown times are approximate and may occur late evening.",
      ],
    },
    {
      sectionTitle: "Permits & Compliance (New Jersey)",
      bulletPoints: [
        "Municipal tent permits (if required)",
        "Fire inspections",
        "Zoning compliance",
        "HOA approvals",
        "Occupancy compliance",
        "Fire extinguisher requirements (if required by township)",
      ],
      note: "Rental Company is not responsible for permit denial.",
    },
    {
      sectionTitle: "Indemnification & Liability",
      bulletPoints: [
        "Weather-related damages",
        "Injury due to misuse",
        "Underground utility damage if not disclosed",
        "Property damage caused by staking when utilities were not identified",
      ],
      note:
        "Client agrees to indemnify and hold harmless Rental Company from all claims, injuries, damages, or losses arising from use of rented equipment. Liability shall not exceed total rental amount paid.",
    },
  ],
  inventoryItems: [
    {
      itemName: "Folding Chairs",
      itemImage: inventoryImages.foldingChairs,
    },
    {
      itemName: "30\" x 96\" Banquet Table",
      itemImage: inventoryImages.banquetTable,
    },
    {
      itemName: "Round Table",
      itemImage: inventoryImages.roundTable,
    },
    {
      itemName: "Cocktail Table",
      itemImage: inventoryImages.cocktailTable,
    },
    {
      itemName: "10' x 20' Pop-up Tent",
      itemImage: inventoryImages.popUpTent10x20,
    },
    {
      itemName: "20' x 26' Frame Tent",
      itemImage: inventoryImages.frameTent20x26,
    },
    {
      itemName: "20' x 40' Frame Tent",
      itemImage: inventoryImages.frameTent20x40,
    },
  ],
  individualRentalPricing: [
    { itemName: "Chair", price: "$2.25" },
    { itemName: "60\" Round Table", price: "$14" },
    { itemName: "72\" Round Table", price: "$16" },
    { itemName: "8' Banquet Table", price: "$12" },
    { itemName: "High-Top Table", price: "$18" },
    { itemName: "Table Linens", price: "$15" },
    { itemName: "10x20 Pop-Up Tent", price: "$125" },
    { itemName: "20x26 Tent", price: "$350" },
    { itemName: "20x40 Tent", price: "$550" },
  ],
  deliveryFees: [
    { distance: "0–10 miles", fee: "$50" },
    { distance: "10–20 miles", fee: "$100" },
    { distance: "20–30 miles", fee: "$150" },
  ],
  setupFees: [
    { tent: "10x20 Pop-Up", setupFee: "$50" },
    { tent: "20x26 Frame", setupFee: "$100" },
    { tent: "20x40 Frame", setupFee: "$150" },
  ],
  instagramUrl: "",
  facebookUrl: "",
  seo: {
    metaTitle: "Spirit Event Rentals | Caldwell, NJ",
    metaDescription:
      "Tent rentals, table and chair rentals, and event packages in Caldwell, NJ and nearby towns.",
  },
};

export const fallbackHomepage: Homepage = {
  _id: "fallback-homepage",
  mainHeadline: "Tent, Table, and Chair Rentals in Caldwell, NJ",
  supportingText:
    "Spirit Event Rentals provides clean, dependable setups for backyard parties, graduations, baby showers, and small weddings.",
  heroImage: setupImages.frame20x38,
  heroSlides: [setupImages.frame20x38, setupImages.frame20x26, setupImages.popUpCocktail],
  primaryButtonText: "Request a Booking",
  introSectionText:
    "Our packages are designed for small private events between 20 and 80 guests. We deliver tents, tables, and chairs, then follow up with a rental agreement and Stripe payment link after your request is approved.",
  featuredPackages: fallbackPackages.filter((item) => item.featured).slice(0, 3),
  galleryPreview: fallbackGallery.slice(0, 5),
  testimonialsPreview: fallbackTestimonials,
  serviceAreaPreview: fallbackServiceAreas.slice(0, 6),
  finalCallToActionHeading: "Tell Us Your Event Date and Guest Count",
  finalCallToActionText:
    "We will review your request, confirm availability, and send your contract and payment link manually.",
  finalCallToActionButtonText: "Request a Booking",
  seo: {
    metaTitle: "Spirit Event Rentals | Tent, Table & Chair Rentals",
    metaDescription:
      "Book tent rentals, table and chair rentals, and bundled event packages in Caldwell, NJ and nearby towns.",
  },
};
