import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@sanity/client";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const envFilePath = path.join(projectRoot, ".env.local");
const inventoryDir = path.join(projectRoot, "public", "images", "inventory");

function loadEnvFromLocalFile() {
  if (!fs.existsSync(envFilePath)) {
    return;
  }

  const raw = fs.readFileSync(envFilePath, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue;
    }

    const splitIndex = trimmed.indexOf("=");
    const key = trimmed.slice(0, splitIndex).trim();
    if (!key || process.env[key]) {
      continue;
    }

    let value = trimmed.slice(splitIndex + 1).trim();
    if (
      (value.startsWith("\"") && value.endsWith("\"")) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  }
}

loadEnvFromLocalFile();

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "uprm88en";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!token) {
  console.error("Missing SANITY_API_WRITE_TOKEN. Set it and retry.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2025-01-01",
  useCdn: false,
});

const packageSeeds = [
  {
    _id: "seed-package-garden",
    packageName: "Small Backyard Package",
    slug: "small-backyard-package",
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
    imageFileName: "spirit-tent-10x20-pop-up.png",
    imageAlt: "10 by 20 pop-up tent for small backyard rental package",
  },
  {
    _id: "seed-package-classic",
    packageName: "Backyard Party Package",
    slug: "backyard-party-package",
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
    imageFileName: "spirit-tent-20x26-frame.png",
    imageAlt: "20 by 26 frame tent for medium backyard party package",
  },
  {
    _id: "seed-package-wedding",
    packageName: "Large Party Package",
    slug: "large-party-package",
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
    imageFileName: "spirit-tent-20x40-frame.png",
    imageAlt: "20 by 40 frame tent for large party rental package",
  },
];

function assertImageFilesExist() {
  const missing = packageSeeds
    .map((item) => item.imageFileName)
    .filter((fileName) => !fs.existsSync(path.join(inventoryDir, fileName)));

  if (missing.length > 0) {
    throw new Error(`Missing required package images: ${missing.join(", ")}`);
  }
}

async function getOrUploadAsset(fileName) {
  const existingAssetId = await client.fetch(
    `*[_type == "sanity.imageAsset" && originalFilename == $fileName][0]._id`,
    { fileName },
  );

  if (existingAssetId) {
    return existingAssetId;
  }

  const asset = await client.assets.upload(
    "image",
    fs.createReadStream(path.join(inventoryDir, fileName)),
    {
      filename: fileName,
      contentType: "image/png",
    },
  );

  return asset._id;
}

async function syncPackages() {
  assertImageFilesExist();

  const createdOrUpdated = [];

  for (const seed of packageSeeds) {
    const assetId = await getOrUploadAsset(seed.imageFileName);

    await client.createOrReplace({
      _id: seed._id,
      _type: "package",
      packageName: seed.packageName,
      slug: { _type: "slug", current: seed.slug },
      price: seed.price,
      shortDescription: seed.shortDescription,
      fullDescription: seed.fullDescription,
      packagePhoto: {
        _type: "image",
        asset: { _type: "reference", _ref: assetId },
        alt: seed.imageAlt,
      },
      guestCapacity: seed.guestCapacity,
      capacityLabel: seed.capacityLabel,
      includedItems: seed.includedItems,
      optionalAddOns: seed.optionalAddOns,
      featured: seed.featured,
      buttonText: seed.buttonText,
    });

    createdOrUpdated.push(seed._id);
  }

  const canonicalIds = new Set(packageSeeds.map((item) => item._id));

  const homepageId = await client.fetch(`*[_type == "homepage"][0]._id`);
  if (homepageId) {
    await client
      .patch(homepageId)
      .set({
        featuredPackages: packageSeeds.map((seed) => ({
          _type: "reference",
          _ref: seed._id,
        })),
      })
      .commit();
  }

  const existingPackageIds = await client.fetch(`*[_type == "package"]._id`);
  const staleIds = existingPackageIds.filter((id) => !canonicalIds.has(id));

  const removedIds = [];
  const skippedIds = [];
  for (const staleId of staleIds) {
    try {
      await client.delete(staleId);
      removedIds.push(staleId);
    } catch {
      skippedIds.push(staleId);
    }
  }

  console.log("Package sync complete.");
  console.log(`Created/updated: ${createdOrUpdated.join(", ")}`);
  if (removedIds.length > 0) {
    console.log(`Removed outdated package docs: ${removedIds.join(", ")}`);
  } else if (staleIds.length > 0) {
    console.log("Outdated package docs were found but could not be removed due to references.");
  } else {
    console.log("No outdated package docs found.");
  }
  if (skippedIds.length > 0) {
    console.log(`Still referenced and kept: ${skippedIds.join(", ")}`);
  }
}

syncPackages().catch((error) => {
  console.error("Package sync failed:", error.message);
  process.exit(1);
});
