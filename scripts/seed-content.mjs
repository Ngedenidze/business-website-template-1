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
    town: "Springfield",
  },
  {
    _id: "seed-testimonial-2",
    _type: "testimonial",
    customerName: "A. Patel",
    testimonialText:
      "We needed tables and chairs quickly for a birthday. They arrived on time and the layout was exactly right.",
    eventType: "Birthday",
    town: "Riverview",
  },
  {
    _id: "seed-testimonial-3",
    _type: "testimonial",
    customerName: "L. Johnson",
    testimonialText:
      "Pricing was clear, setup was smooth, and the team helped us pick the right package for our guest count.",
    eventType: "Family Reunion",
    town: "Oak Hill",
  },
];

const serviceAreas = [
  {
    _id: "seed-service-springfield",
    _type: "serviceArea",
    townName: "Springfield",
    slug: { _type: "slug", current: "springfield" },
    shortDescription: "Tent rentals and package setups for weddings and backyard parties in Springfield.",
    seoText:
      "Need tent rentals in Springfield? We provide table and chair rentals, bundled event setups, and practical delivery windows for local venues and homes.",
    serviceAreaSlides: [],
    seo: {
      _type: "seo",
      metaTitle: "Tent Rentals in Springfield",
      metaDescription:
        "Tent rentals, table and chair rentals, and party packages in Springfield for weddings and local events.",
    },
  },
  {
    _id: "seed-service-riverview",
    _type: "serviceArea",
    townName: "Riverview",
    slug: { _type: "slug", current: "riverview" },
    shortDescription: "Party rentals in Riverview with complete tent, table, and chair package options.",
    seoText:
      "Our Riverview service includes setup support, clear package pricing, and dependable tent rentals for private events.",
    serviceAreaSlides: [],
  },
  {
    _id: "seed-service-oakhill",
    _type: "serviceArea",
    townName: "Oak Hill",
    slug: { _type: "slug", current: "oak-hill" },
    shortDescription: "Event rentals in Oak Hill for family celebrations, reunions, and seasonal gatherings.",
    seoText:
      "Looking for event rentals in Oak Hill? We handle tent layout planning and practical table and chair counts for your guest list.",
    serviceAreaSlides: [],
  },
  {
    _id: "seed-service-lakeside",
    _type: "serviceArea",
    townName: "Lakeside",
    slug: { _type: "slug", current: "lakeside" },
    shortDescription: "Tent and table rentals in Lakeside for weddings and outdoor receptions.",
    seoText:
      "Lakeside customers use our bundled packages for cleaner planning and predictable setup day scheduling.",
    serviceAreaSlides: [],
  },
  {
    _id: "seed-service-fairview",
    _type: "serviceArea",
    townName: "Fairview",
    slug: { _type: "slug", current: "fairview" },
    shortDescription: "Chair, table, and tent package rentals in Fairview with local delivery options.",
    seoText:
      "For party rentals in Fairview, we provide practical package guidance based on event size and site access.",
    serviceAreaSlides: [],
  },
  {
    _id: "seed-service-willow-creek",
    _type: "serviceArea",
    townName: "Willow Creek",
    slug: { _type: "slug", current: "willow-creek" },
    shortDescription: "Event rental packages in Willow Creek for birthdays, showers, and receptions.",
    seoText:
      "Willow Creek bookings include tent rentals near you with chair and table combinations that match your floor plan.",
    serviceAreaSlides: [],
  },
  {
    _id: "seed-service-cedar-grove",
    _type: "serviceArea",
    townName: "Cedar Grove",
    slug: { _type: "slug", current: "cedar-grove" },
    shortDescription: "Reliable event setup rentals in Cedar Grove for home and venue events.",
    seoText:
      "Book tent, table, and chair rentals in Cedar Grove with direct support during planning and scheduling.",
    serviceAreaSlides: [],
  },
  {
    _id: "seed-service-meadow-park",
    _type: "serviceArea",
    townName: "Meadow Park",
    slug: { _type: "slug", current: "meadow-park" },
    shortDescription: "Party rental bundles in Meadow Park with fast quote responses.",
    seoText:
      "Meadow Park families and couples use our packages for simple event planning and clean event-day setup.",
    serviceAreaSlides: [],
  },
];

const businessInfo = {
  _id: "businessInfo",
  _type: "businessInfo",
  businessName: "Willow & Canvas Event Rentals",
  phoneNumber: "(555) 318-2247",
  emailAddress: "bookings@willowandcanvas.com",
  addressOrServiceBase: "Serving Springfield and surrounding towns",
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
    reference("seed-service-springfield"),
    reference("seed-service-riverview"),
    reference("seed-service-oakhill"),
    reference("seed-service-lakeside"),
    reference("seed-service-fairview"),
    reference("seed-service-willow-creek"),
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

async function upsertAll() {
  for (const doc of [...packages, ...gallery, ...testimonials, ...serviceAreas]) {
    await client.createOrReplace(doc);
  }

  await client.createOrReplace(businessInfo);
  await client.createOrReplace(homepage);
}

upsertAll()
  .then(() => {
    console.log("Starter content seeded successfully.");
  })
  .catch((error) => {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  });
