import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "uprm88en";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!token) {
  console.error("Missing SANITY_API_WRITE_TOKEN. Add it to your environment and retry.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2025-01-01",
  useCdn: false,
});

function reference(_ref) {
  return { _type: "reference", _ref };
}

function toSlug(value) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const serviceAreaTownsByCounty = {
  "Essex County": [
    "Caldwell",
    "West Caldwell",
    "North Caldwell",
    "Essex Fells",
    "Roseland",
    "Livingston",
    "West Orange",
    "Verona",
    "Cedar Grove",
    "Montclair",
    "Bloomfield",
    "Glen Ridge",
    "Nutley",
    "Belleville",
    "East Orange",
    "Orange",
    "Irvington",
    "Maplewood",
    "South Orange",
    "Millburn",
    "Newark",
    "Fairfield",
  ],
  "Morris County": [
    "East Hanover",
    "Florham Park",
    "Hanover",
    "Parsippany-Troy Hills",
    "Montville",
    "Lincoln Park",
    "Boonton",
    "Boonton Township",
    "Denville",
    "Mountain Lakes",
    "Rockaway Borough",
    "Rockaway Township",
    "Mendham",
    "Mendham Township",
    "Madison",
    "Chatham Borough",
    "Chatham Township",
    "Harding Township",
    "Long Hill Township",
    "Chester Borough",
    "Chester Township",
    "Mount Olive",
    "Jefferson",
    "Butler",
    "Kinnelon",
  ],
  "Passaic County": [
    "Little Falls",
    "Woodland Park",
    "Totowa",
    "Wayne",
    "Clifton",
    "Passaic",
    "Paterson",
    "Haledon",
    "Prospect Park",
    "North Haledon",
    "Pompton Lakes",
    "Ringwood",
    "Bloomingdale",
    "West Milford",
    "Hawthorne",
    "Wanaque",
  ],
  "Bergen County": [
    "Garfield",
    "Lodi",
    "Hasbrouck Heights",
    "Wood-Ridge",
    "Moonachie",
    "Carlstadt",
    "Rutherford",
    "East Rutherford",
    "Wallington",
    "South Hackensack",
    "Hackensack",
    "Teaneck",
    "Bergenfield",
    "Englewood",
    "Englewood Cliffs",
    "Fort Lee",
    "Leonia",
    "Ridgefield Park",
    "Palisades Park",
    "Cliffside Park",
    "Edgewater",
    "Fair Lawn",
    "Paramus",
    "Ridgewood",
    "Glen Rock",
    "Elmwood Park",
    "Oradell",
    "River Edge",
    "New Milford",
    "Dumont",
    "Haworth",
    "Cresskill",
    "Tenafly",
    "Alpine",
    "Hillsdale",
    "Park Ridge",
    "Emerson",
  ],
  "Hudson County": [
    "Jersey City",
    "Hoboken",
    "Union City",
    "Weehawken",
    "West New York",
    "North Bergen",
    "Guttenberg",
    "Bayonne",
    "Secaucus",
    "Kearny",
    "Harrison",
  ],
  "Union County": [
    "Union",
    "Springfield",
    "Summit",
    "New Providence",
    "Berkeley Heights",
    "Mountainside",
    "Westfield",
    "Scotch Plains",
    "Fanwood",
    "Plainfield",
    "Cranford",
    "Roselle",
    "Roselle Park",
    "Elizabeth",
    "Kenilworth",
    "Clark",
    "Rahway",
    "Linden",
    "Hillside",
  ],
  "Somerset County": [
    "Basking Ridge",
    "Bernards Township",
    "Bernardsville",
    "Far Hills",
    "Peapack-Gladstone",
    "Bedminster",
    "Bridgewater",
    "Bound Brook",
    "Somerville",
  ],
  "New York (within ~30 miles)": [
    "New York City boroughs",
    "Yonkers",
    "Mount Vernon",
    "New Rochelle",
    "White Plains",
    "Tarrytown",
    "Sleepy Hollow",
    "Nyack",
  ],
};

const packages = [
  {
    _id: "seed-package-garden",
    _type: "package",
    packageName: "Garden Party Package",
    slug: { _type: "slug", current: "garden-party-package" },
    price: "From $595",
    shortDescription: "40 chairs, 6 banquet tables, and a clean white tent for family events.",
    fullDescription:
      "Best for birthdays, bridal showers, and small receptions where you need a polished setup without overbuilding your budget.",
    guestCapacity: 40,
    includedItems: ["20x20 frame tent", "40 white folding chairs", "6 eight-foot banquet tables"],
    optionalAddOns: ["Bistro lighting", "Cake table setup"],
    featured: true,
    buttonText: "Request Garden Package",
  },
  {
    _id: "seed-package-classic",
    _type: "package",
    packageName: "Classic Celebration Package",
    slug: { _type: "slug", current: "classic-celebration-package" },
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
  },
  {
    _id: "seed-package-wedding",
    _type: "package",
    packageName: "Wedding Reception Package",
    slug: { _type: "slug", current: "wedding-reception-package" },
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
  },
  {
    _id: "seed-package-backyard",
    _type: "package",
    packageName: "Backyard Basics Package",
    slug: { _type: "slug", current: "backyard-basics-package" },
    price: "From $395",
    shortDescription: "Practical essentials for simple gatherings with quick setup.",
    fullDescription:
      "A starter package for weekend cookouts and neighborhood gatherings that need shade, seating, and table space.",
    guestCapacity: 25,
    includedItems: ["20x20 pole tent", "25 folding chairs", "4 banquet tables"],
    optionalAddOns: ["Additional chairs", "Additional tables"],
    featured: false,
    buttonText: "Request Basics Package",
  },
];

const gallery = [
  {
    _id: "seed-gallery-1",
    _type: "galleryItem",
    title: "Backyard Reception Layout",
    caption: "Tent, sweetheart table, and guest seating in a private yard.",
    eventType: "Wedding",
  },
  {
    _id: "seed-gallery-2",
    _type: "galleryItem",
    title: "Evening Birthday Setup",
    caption: "String-lit dining arrangement for a 50-person birthday party.",
    eventType: "Birthday",
  },
  {
    _id: "seed-gallery-3",
    _type: "galleryItem",
    title: "Graduation Open House",
    caption: "Open tent flow with buffet and standing cocktail tables.",
    eventType: "Graduation",
  },
  {
    _id: "seed-gallery-4",
    _type: "galleryItem",
    title: "Family Reunion",
    caption: "Large table cluster with weather coverage and lounge zone.",
    eventType: "Family Reunion",
  },
  {
    _id: "seed-gallery-5",
    _type: "galleryItem",
    title: "Bridal Shower Garden",
    caption: "Soft linen palette and compact guest table arrangement.",
    eventType: "Bridal Shower",
  },
  {
    _id: "seed-gallery-6",
    _type: "galleryItem",
    title: "Corporate Picnic",
    caption: "Shade-focused setup with flexible table groupings.",
    eventType: "Corporate Event",
  },
  {
    _id: "seed-gallery-7",
    _type: "galleryItem",
    title: "Tent Ceremony",
    caption: "Ceremony chairs and aisle spacing for an outdoor wedding.",
    eventType: "Wedding",
  },
  {
    _id: "seed-gallery-8",
    _type: "galleryItem",
    title: "Anniversary Dinner",
    caption: "Intimate dinner setup with premium seating and linens.",
    eventType: "Anniversary",
  },
  {
    _id: "seed-gallery-9",
    _type: "galleryItem",
    title: "Neighborhood Block Party",
    caption: "Durable tent setup ready for high guest turnover.",
    eventType: "Community Event",
  },
  {
    _id: "seed-gallery-10",
    _type: "galleryItem",
    title: "Kids Party Setup",
    caption: "Compact layout with family seating and food station tables.",
    eventType: "Kids Party",
  },
];

const testimonials = [
  {
    _id: "seed-testimonial-1",
    _type: "testimonial",
    customerName: "C. Martinez",
    testimonialText:
      "The setup looked clean and professional, and communication was clear from booking to pickup.",
    eventType: "Wedding",
    town: "Caldwell",
  },
  {
    _id: "seed-testimonial-2",
    _type: "testimonial",
    customerName: "A. Patel",
    testimonialText:
      "We needed tables and chairs quickly for a birthday. They arrived on time and the layout was exactly right.",
    eventType: "Birthday",
    town: "Montclair",
  },
  {
    _id: "seed-testimonial-3",
    _type: "testimonial",
    customerName: "L. Johnson",
    testimonialText:
      "Pricing was clear, setup was smooth, and the team helped us pick the right package for our guest count.",
    eventType: "Family Reunion",
    town: "Wayne",
  },
];

const serviceAreaSeedEntries = Object.entries(serviceAreaTownsByCounty).flatMap(([county, towns]) =>
  towns.map((townName) => ({ county, townName })),
);

const slugCounts = new Map();

const serviceAreas = serviceAreaSeedEntries.map(({ county, townName }) => {
  const baseSlug = toSlug(townName);
  const baseSlugCount = slugCounts.get(baseSlug) || 0;
  slugCounts.set(baseSlug, baseSlugCount + 1);
  const uniqueSlug = baseSlugCount === 0 ? baseSlug : `${baseSlug}-${toSlug(county)}`;

  return {
    _id: `seed-service-${toSlug(county)}-${uniqueSlug}`,
    _type: "serviceArea",
    county,
    townName,
    slug: { _type: "slug", current: uniqueSlug },
    shortDescription:
      `Tent, table, and chair rentals in ${townName} with delivery coverage across ${county}.`,
    seoText:
      `Need event rentals in ${townName}? We provide tent rentals, table and chair rentals, and package setups in ${townName} and nearby communities.`,
    serviceAreaSlides: [],
    seo: {
      _type: "seo",
      metaTitle: `Event Rentals in ${townName}`,
      metaDescription:
        `Tent rentals, table and chair rentals, and package setups in ${townName}.`,
    },
  };
});

const homepageServiceAreaPreviewTownNames = [
  "Caldwell",
  "West Caldwell",
  "North Caldwell",
  "Essex Fells",
  "Roseland",
  "Livingston",
];

const homepageServiceAreaPreview = homepageServiceAreaPreviewTownNames
  .map((townName) => serviceAreas.find((serviceArea) => serviceArea.townName === townName))
  .filter(Boolean)
  .map((serviceArea) => reference(serviceArea._id));

const businessInfo = {
  _id: "businessInfo",
  _type: "businessInfo",
  businessName: "Willow & Canvas Event Rentals",
  phoneNumber: "(555) 318-2247",
  emailAddress: "bookings@willowandcanvas.com",
  addressOrServiceBase: "Serving Caldwell, NJ and nearby counties within 30 miles",
  mapLocation: "https://maps.google.com",
  hours: "Mon-Sat: 8:00 AM - 6:00 PM",
  bookingInstructions:
    "Submit a booking request with your event date and location. We confirm availability, send your rental contract, then send a Stripe payment link.",
  instagramUrl: "",
  facebookUrl: "",
  seo: {
    _type: "seo",
    metaTitle: "Willow & Canvas Event Rentals",
    metaDescription:
      "Local tent rentals, table and chair rentals, and event packages for weddings and private events.",
  },
};

const homepage = {
  _id: "homepage",
  _type: "homepage",
  mainHeadline: "Tent, Table, and Chair Rentals for Events That Feel Put Together",
  supportingText:
    "We help local families and couples host clean, comfortable events with practical package options and clear booking steps.",
  heroSlides: [],
  primaryButtonText: "Request a Booking",
  introSectionText:
    "From backyard birthdays to wedding receptions, we rent tents, tables, chairs, and bundled setup packages with straightforward communication and reliable scheduling.",
  featuredPackages: [
    reference("seed-package-garden"),
    reference("seed-package-classic"),
    reference("seed-package-wedding"),
  ],
  galleryPreview: [
    reference("seed-gallery-1"),
    reference("seed-gallery-2"),
    reference("seed-gallery-3"),
    reference("seed-gallery-4"),
    reference("seed-gallery-5"),
    reference("seed-gallery-6"),
  ],
  testimonialsPreview: [
    reference("seed-testimonial-1"),
    reference("seed-testimonial-2"),
    reference("seed-testimonial-3"),
  ],
  serviceAreaPreview: [
    ...homepageServiceAreaPreview,
  ],
  finalCallToActionHeading: "Tell Us Your Date and Guest Count",
  finalCallToActionText:
    "We will review your request, confirm availability, and send your contract and payment link manually.",
  finalCallToActionButtonText: "Request a Booking",
  seo: {
    _type: "seo",
    metaTitle: "Tent, Table, and Chair Rentals",
    metaDescription:
      "Local event rental packages for tents, tables, and chairs with simple booking request flow.",
  },
};

async function seedIfMissingAll() {
  for (const doc of [...packages, ...gallery, ...testimonials, ...serviceAreas]) {
    await client.createIfNotExists(doc);
  }

  await client.createIfNotExists(businessInfo);
  await client.createIfNotExists(homepage);
}

seedIfMissingAll()
  .then(() => {
    console.log("Starter content seeded successfully (existing documents were preserved).");
  })
  .catch((error) => {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  });
