import { createClient } from "@sanity/client";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const showcaseContentPath = path.join(__dirname, "..", "showcase-content.sample.json");

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

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function sanitizePolicySentence(value) {
  return normalizeText(value)
    .replace(/___\s*feet\s*wide/gi, "minimum required width")
    .replace(/\s+/g, " ");
}

function getFaqCategory(sectionTitle) {
  const title = normalizeText(sectionTitle).toLowerCase();

  if (title.includes("weather")) return "Weather";
  if (title.includes("delivery") || title.includes("pickup")) return "Delivery";
  if (title.includes("permit") || title.includes("compliance")) return "Permits";
  if (title.includes("liability") || title.includes("indemn")) return "Liability";
  if (title.includes("site")) return "Site Requirements";
  if (title.includes("linen")) return "Linens";
  if (title.includes("care") || title.includes("damage") || title.includes("loss")) return "Equipment Care";
  return "Policy";
}

function buildSectionAnswer(section) {
  const bullets = Array.isArray(section?.bulletPoints)
    ? section.bulletPoints
        .map(sanitizePolicySentence)
        .filter((entry) => entry.length > 0)
        .slice(0, 3)
    : [];

  if (bullets.length === 0) {
    return normalizeText(section?.note);
  }

  const areShortLabels = bullets.every((entry) => entry.split(/\s+/).length <= 3);
  let answer = areShortLabels
    ? `This policy covers ${bullets.map((entry) => entry.toLowerCase()).join(", ")}.`
    : bullets.join(" ");

  const note = sanitizePolicySentence(section?.note);
  if (note) {
    answer = `${answer} ${note}`;
  }

  return answer.trim();
}

function buildFaqItemsFromShowcaseContent(showcaseContent) {
  const businessInformation = showcaseContent?.businessInformation ?? {};
  const policySections = Array.isArray(businessInformation.rentalPolicyHighlights)
    ? businessInformation.rentalPolicyHighlights
    : [];

  const sectionFaqs = policySections
    .map((section) => {
      const sectionTitle = normalizeText(section?.sectionTitle);
      if (!sectionTitle) return null;

      const answer = buildSectionAnswer(section);
      if (!answer) return null;

      return {
        _type: "faqItem",
        question: `What is your ${sectionTitle}?`,
        answer,
        category: getFaqCategory(sectionTitle),
        featured: false,
      };
    })
    .filter(Boolean);

  const bookingInstructions = normalizeText(businessInformation.bookingInstructions);
  if (bookingInstructions) {
    sectionFaqs.push({
      _type: "faqItem",
      question: "How does the booking process work?",
      answer: bookingInstructions,
      category: "Booking",
      featured: true,
    });
  }

  const deliveryFees = Array.isArray(businessInformation.deliveryFees)
    ? businessInformation.deliveryFees
    : [];
  if (deliveryFees.length > 0) {
    const deliveryAnswer = deliveryFees
      .map((row) => {
        const distance = normalizeText(row?.distance);
        const fee = normalizeText(row?.fee);
        if (!distance || !fee) return "";
        return `${distance}: ${fee}`;
      })
      .filter(Boolean)
      .join("; ");

    if (deliveryAnswer) {
      sectionFaqs.push({
        _type: "faqItem",
        question: "How are delivery fees calculated?",
        answer: `Delivery pricing is distance-based. ${deliveryAnswer}.`,
        category: "Delivery",
        featured: false,
      });
    }
  }

  const setupFees = Array.isArray(businessInformation.setupFees)
    ? businessInformation.setupFees
    : [];
  if (setupFees.length > 0) {
    const setupAnswer = setupFees
      .map((row) => {
        const tent = normalizeText(row?.tent);
        const fee = normalizeText(row?.setupFee);
        if (!tent || !fee) return "";
        return `${tent}: ${fee}`;
      })
      .filter(Boolean)
      .join("; ");

    if (setupAnswer) {
      sectionFaqs.push({
        _type: "faqItem",
        question: "Do tent setup fees apply separately?",
        answer: `Yes. Setup support is priced by tent size. ${setupAnswer}.`,
        category: "Setup",
        featured: false,
      });
    }
  }

  return sectionFaqs.slice(0, 10);
}

function loadShowcaseFaqContent() {
  try {
    const raw = fs.readFileSync(showcaseContentPath, "utf8");
    const parsed = JSON.parse(raw);
    const faqItems = buildFaqItemsFromShowcaseContent(parsed);
    if (faqItems.length > 0) {
      return {
        sourcePath: showcaseContentPath,
        eyebrow: "FAQ",
        title: "Frequently Asked Questions",
        introText:
          "Answers to common questions about booking requests, delivery, setup, and policy requirements.",
        faqItems,
      };
    }
  } catch {
    // fall through to fallback below
  }

  return {
    sourcePath: "seed-content defaults",
    eyebrow: "FAQ",
    title: "Frequently Asked Questions",
    introText:
      "Answers to common questions about booking requests, delivery, setup, and policy requirements.",
    faqItems: [
      {
        _type: "faqItem",
        question: "How does the booking process work?",
        answer:
          "Submit your booking request with the event date, location, and guest count. We manually review availability, send your rental agreement, then share a Stripe payment link.",
        category: "Booking",
        featured: true,
      },
    ],
  };
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

const distanceFromCaldwellMilesByCountyTown = {
  "Essex County": {
    Caldwell: 0.0,
    "West Caldwell": 1.1,
    "North Caldwell": 2.0,
    "Essex Fells": 0.8,
    Roseland: 2.1,
    Livingston: 4.6,
    "West Orange": 3.7,
    Verona: 1.8,
    "Cedar Grove": 2.8,
    Montclair: 3.6,
    Bloomfield: 5.1,
    "Glen Ridge": 4.5,
    Nutley: 6.4,
    Belleville: 6.8,
    "East Orange": 6.2,
    Orange: 5.4,
    Irvington: 8.3,
    Maplewood: 7.3,
    "South Orange": 6.3,
    Millburn: 7.1,
    Newark: 9.6,
    Fairfield: 3.3,
  },
  "Morris County": {
    "East Hanover": 4.8,
    "Florham Park": 7.5,
    Hanover: 8.0,
    "Parsippany-Troy Hills": 7.8,
    Montville: 6.6,
    "Lincoln Park": 6.0,
    Boonton: 8.1,
    "Boonton Township": 10.0,
    Denville: 11.6,
    "Mountain Lakes": 9.3,
    "Rockaway Borough": 13.2,
    "Rockaway Township": 14.2,
    Mendham: 17.5,
    "Mendham Township": 15.5,
    Madison: 9.3,
    "Chatham Borough": 8.8,
    "Chatham Township": 11.6,
    "Harding Township": 13.4,
    "Long Hill Township": 15.6,
    "Chester Borough": 21.9,
    "Chester Township": 21.8,
    "Mount Olive": 24.4,
    Jefferson: 18.2,
    Butler: 11.5,
    Kinnelon: 11.4,
  },
  "Passaic County": {
    "Little Falls": 4.0,
    "Woodland Park": 5.6,
    Totowa: 5.3,
    Wayne: 7.6,
    Clifton: 6.3,
    Passaic: 7.8,
    Paterson: 7.9,
    Haledon: 8.2,
    "Prospect Park": 8.9,
    "North Haledon": 9.8,
    "Pompton Lakes": 11.3,
    Ringwood: 18.3,
    Bloomingdale: 13.9,
    "West Milford": 19.3,
    Hawthorne: 10.2,
    Wanaque: 14.1,
  },
  "Bergen County": {
    Garfield: 9.3,
    Lodi: 10.5,
    "Hasbrouck Heights": 10.7,
    "Wood-Ridge": 10.0,
    Moonachie: 11.5,
    Carlstadt: 11.3,
    Rutherford: 9.0,
    "East Rutherford": 10.2,
    Wallington: 9.0,
    "South Hackensack": 12.1,
    Hackensack: 12.6,
    Teaneck: 14.3,
    Bergenfield: 15.7,
    Englewood: 16.3,
    "Englewood Cliffs": 17.6,
    "Fort Lee": 16.0,
    Leonia: 15.2,
    "Ridgefield Park": 13.5,
    "Palisades Park": 14.6,
    "Cliffside Park": 15.2,
    Edgewater: 15.9,
    "Fair Lawn": 10.7,
    Paramus: 13.1,
    Ridgewood: 13.0,
    "Glen Rock": 11.5,
    "Elmwood Park": 9.4,
    Oradell: 15.1,
    "River Edge": 13.9,
    "New Milford": 15.0,
    Dumont: 16.6,
    Haworth: 16.9,
    Cresskill: 18.0,
    Tenafly: 17.9,
    Alpine: 20.8,
    Hillsdale: 16.8,
    "Park Ridge": 18.2,
    Emerson: 16.2,
  },
  "Hudson County": {
    "Jersey City": 14.2,
    Hoboken: 14.6,
    "Union City": 13.7,
    Weehawken: 14.5,
    "West New York": 14.5,
    "North Bergen": 13.5,
    Guttenberg: 14.6,
    Bayonne: 15.0,
    Secaucus: 11.6,
    Kearny: 10.0,
    Harrison: 9.3,
  },
  "Union County": {
    Union: 10.0,
    Springfield: 10.2,
    Summit: 9.7,
    "New Providence": 11.8,
    "Berkeley Heights": 13.6,
    Mountainside: 11.8,
    Westfield: 13.4,
    "Scotch Plains": 15.1,
    Fanwood: 14.8,
    Plainfield: 17.1,
    Cranford: 12.7,
    Roselle: 13.0,
    "Roselle Park": 12.0,
    Elizabeth: 12.7,
    Kenilworth: 11.1,
    Clark: 15.4,
    Rahway: 16.0,
    Linden: 14.8,
    Hillside: 10.2,
  },
  "Somerset County": {
    "Basking Ridge": 17.3,
    "Bernards Township": 18.9,
    Bernardsville: 18.1,
    "Far Hills": 20.7,
    "Peapack-Gladstone": 21.5,
    Bedminster: 24.3,
    Bridgewater: 24.2,
    "Bound Brook": 23.2,
    Somerville: 25.4,
  },
  "New York (within ~30 miles)": {
    "New York City boroughs": 21.5,
    Yonkers: 22.6,
    "Mount Vernon": 23.9,
    "New Rochelle": 26.6,
    "White Plains": 30.3,
    Tarrytown: 26.5,
    "Sleepy Hollow": 27.8,
    Nyack: 25.8,
  },
};

const packages = [
  {
    _id: "seed-package-garden",
    _type: "package",
    packageName: "Small Backyard Package",
    slug: { _type: "slug", current: "small-backyard-package" },
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
  },
  {
    _id: "seed-package-classic",
    _type: "package",
    packageName: "Backyard Party Package",
    slug: { _type: "slug", current: "backyard-party-package" },
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
  },
  {
    _id: "seed-package-wedding",
    _type: "package",
    packageName: "Large Party Package",
    slug: { _type: "slug", current: "large-party-package" },
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
  },
];

const gallery = [
  {
    _id: "seed-gallery-1",
    _type: "galleryItem",
    title: "10x20 Pop-Up Seating Setup",
    caption: "30-guest table and chair layout under a commercial-grade 10x20 pop-up tent.",
    eventType: "Backyard Party",
  },
  {
    _id: "seed-gallery-2",
    _type: "galleryItem",
    title: "10x20 Buffet Setup",
    caption: "Buffet table and prep layout using the 10x20 pop-up tent package.",
    eventType: "Graduation Party",
  },
  {
    _id: "seed-gallery-3",
    _type: "galleryItem",
    title: "10x20 Cocktail Setup",
    caption: "Cocktail-style arrangement with standing tables and decor-ready spacing.",
    eventType: "Cocktail Reception",
  },
  {
    _id: "seed-gallery-4",
    _type: "galleryItem",
    title: "20x26 Frame Tent Layout",
    caption: "Mid-size frame tent setup for dinner seating and guest circulation.",
    eventType: "Family Celebration",
  },
  {
    _id: "seed-gallery-5",
    _type: "galleryItem",
    title: "20x38.5 Frame Tent Layout",
    caption: "Large frame tent setup for receptions with round tables and floral centerpieces.",
    eventType: "Wedding Reception",
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
const missingTownMileageEntries = [];

const serviceAreas = serviceAreaSeedEntries.map(({ county, townName }) => {
  const baseSlug = toSlug(townName);
  const baseSlugCount = slugCounts.get(baseSlug) || 0;
  slugCounts.set(baseSlug, baseSlugCount + 1);
  const uniqueSlug = baseSlugCount === 0 ? baseSlug : `${baseSlug}-${toSlug(county)}`;
  const distanceFromCaldwellMiles =
    distanceFromCaldwellMilesByCountyTown[county]?.[townName];

  if (typeof distanceFromCaldwellMiles !== "number") {
    missingTownMileageEntries.push(`${townName} (${county})`);
  }

  return {
    _id: `seed-service-${toSlug(county)}-${uniqueSlug}`,
    _type: "serviceArea",
    county,
    townName,
    distanceFromCaldwellMiles,
    slug: { _type: "slug", current: uniqueSlug },
    shortDescription:
      `Tent, table, and chair rentals in ${townName} with delivery coverage across ${county} and nearby towns.`,
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

if (missingTownMileageEntries.length > 0) {
  console.warn(
    `[seed] Missing Caldwell mileage for ${missingTownMileageEntries.length} towns: ${missingTownMileageEntries.join(", ")}`,
  );
}

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
  businessName: "Spirit Event Rentals",
  phoneNumber: "973 632-6516",
  emailAddress: "spiriteventrentals@yahoo.com",
  addressOrServiceBase: "23 Westville Ave. Caldwell, NJ, 07006",
  mapLocation: "https://maps.google.com/?q=23+Westville+Ave,+Caldwell,+NJ+07006",
  hours: "By appointment for delivery and setup windows",
  bookingInstructions:
    "Submit your booking request with event date and location. We review availability, send the rental agreement manually, then send a Stripe payment link for your deposit or final payment.",
  rentalPolicyHighlights: [
    {
      _type: "policySection",
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
      _type: "policySection",
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
      _type: "policySection",
      sectionTitle: "Linen (Tablecloth) Policy",
      bulletPoints: [
        "Linens must be shaken free of food and debris before stacking.",
        "Wax, burns, paint, permanent stains, or mildew will result in replacement charges.",
        "Client must not place damp linens in bags or containers.",
      ],
    },
    {
      _type: "policySection",
      sectionTitle: "Care, Damage & Loss",
      bulletPoints: ["Damage", "Theft", "Loss", "Vandalism", "Excessive cleaning"],
      note:
        "Client assumes full responsibility for equipment from delivery until pickup. Full replacement value will be charged if items are not returned.",
    },
    {
      _type: "policySection",
      sectionTitle: "Delivery & Pickup",
      bulletPoints: [
        "Client or responsible adult must be present.",
        "Equipment must be accessible at scheduled pickup time.",
        "Additional labor fees may apply if equipment is moved or inaccessible.",
        "Same-day teardown times are approximate and may occur late evening.",
      ],
    },
    {
      _type: "policySection",
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
      _type: "policySection",
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
    { _type: "inventoryItem", itemName: "Folding Chairs" },
    { _type: "inventoryItem", itemName: "30\" x 96\" Banquet Table" },
    { _type: "inventoryItem", itemName: "Round Table" },
    { _type: "inventoryItem", itemName: "Cocktail Table" },
    { _type: "inventoryItem", itemName: "10' x 20' Pop-up Tent" },
    { _type: "inventoryItem", itemName: "20' x 26' Frame Tent" },
    { _type: "inventoryItem", itemName: "20' x 40' Frame Tent" },
  ],
  individualRentalPricing: [
    { _type: "individualPricingRow", itemName: "Chair", price: "$2.25" },
    { _type: "individualPricingRow", itemName: "60\" Round Table", price: "$14" },
    { _type: "individualPricingRow", itemName: "72\" Round Table", price: "$16" },
    { _type: "individualPricingRow", itemName: "8' Banquet Table", price: "$12" },
    { _type: "individualPricingRow", itemName: "High-Top Table", price: "$18" },
    { _type: "individualPricingRow", itemName: "Table Linens", price: "$15" },
    { _type: "individualPricingRow", itemName: "10x20 Pop-Up Tent", price: "$125" },
    { _type: "individualPricingRow", itemName: "20x26 Tent", price: "$350" },
    { _type: "individualPricingRow", itemName: "20x40 Tent", price: "$550" },
  ],
  deliveryFees: [
    { _type: "deliveryFeeRow", distance: "0–10 miles", fee: "$50" },
    { _type: "deliveryFeeRow", distance: "10–20 miles", fee: "$100" },
    { _type: "deliveryFeeRow", distance: "20–30 miles", fee: "$150" },
  ],
  setupFees: [
    { _type: "setupFeeRow", tent: "10x20 Pop-Up", setupFee: "$50" },
    { _type: "setupFeeRow", tent: "20x26 Frame", setupFee: "$100" },
    { _type: "setupFeeRow", tent: "20x40 Frame", setupFee: "$150" },
  ],
  instagramUrl: "",
  facebookUrl: "",
  seo: {
    _type: "seo",
    metaTitle: "Spirit Event Rentals | Caldwell, NJ",
    metaDescription:
      "Tent rentals, table and chair rentals, and event packages in Caldwell, NJ and nearby towns.",
  },
};

const homepage = {
  _id: "homepage",
  _type: "homepage",
  mainHeadline: "Tent, Table, and Chair Rentals in Caldwell, NJ",
  supportingText:
    "Spirit Event Rentals provides clean, dependable setups for backyard parties, graduations, baby showers, and small weddings.",
  heroSlides: [],
  primaryButtonText: "Request a Booking",
  introSectionText:
    "Our packages are built for small private events between 20 and 80 guests. We deliver tents, tables, and chairs, then follow up with your rental agreement and Stripe payment link after approval.",
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
  ],
  testimonialsPreview: [
    reference("seed-testimonial-1"),
    reference("seed-testimonial-2"),
    reference("seed-testimonial-3"),
  ],
  serviceAreaPreview: [
    ...homepageServiceAreaPreview,
  ],
  finalCallToActionHeading: "Tell Us Your Event Date and Guest Count",
  finalCallToActionText:
    "We will review your request, confirm availability, and send your contract and payment link manually.",
  finalCallToActionButtonText: "Request a Booking",
  seo: {
    _type: "seo",
    metaTitle: "Spirit Event Rentals | Tent, Table & Chair Rentals",
    metaDescription:
      "Book tent rentals, table and chair rentals, and bundled event packages in Caldwell, NJ and nearby towns.",
  },
};

const faqSeed = loadShowcaseFaqContent();

const faqPage = {
  _id: "faqPage",
  _type: "faqPage",
  eyebrow: faqSeed.eyebrow,
  title: faqSeed.title,
  introText: faqSeed.introText,
  faqItems: faqSeed.faqItems,
};

async function seedIfMissingAll() {
  for (const doc of [...packages, ...gallery, ...testimonials, ...serviceAreas]) {
    await client.createIfNotExists(doc);
  }

  await client.createIfNotExists(businessInfo);
  await client.createIfNotExists(homepage);
  await client.createOrReplace(faqPage);
}

seedIfMissingAll()
  .then(() => {
    console.log("Starter content seeded successfully (existing documents were preserved).");
    console.log(`FAQ entries seeded: ${faqPage.faqItems.length}`);
    console.log(`FAQ source: ${faqSeed.sourcePath}`);
  })
  .catch((error) => {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  });
