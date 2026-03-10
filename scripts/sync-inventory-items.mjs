import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@sanity/client";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const inventoryDir = path.join(projectRoot, "public", "images", "inventory");

const inventoryItems = [
  {
    itemName: "Folding Chairs",
    fileName: "spirit-folding-chair.png",
    alt: "Folding chair rental item",
  },
  {
    itemName: "30\" x 96\" Banquet Table",
    fileName: "spirit-banquet-table-30x96.png",
    alt: "30 by 96 inch banquet table rental item",
  },
  {
    itemName: "Round Table",
    fileName: "spirit-round-table.png",
    alt: "Round table rental item",
  },
  {
    itemName: "Cocktail Table",
    fileName: "spirit-cocktail-table.png",
    alt: "Cocktail table rental item",
  },
  {
    itemName: "10' x 20' Pop-up Tent",
    fileName: "spirit-tent-10x20-pop-up.png",
    alt: "10 by 20 pop-up tent rental item",
  },
  {
    itemName: "20' x 26' Frame Tent",
    fileName: "spirit-tent-20x26-frame.png",
    alt: "20 by 26 frame tent rental item",
  },
  {
    itemName: "20' x 40' Frame Tent",
    fileName: "spirit-tent-20x40-frame.png",
    alt: "20 by 40 frame tent rental item",
  },
];

const applyMode = process.argv.includes("--apply");

function toStableKey(value, index) {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${slug || "inventory-item"}-${index + 1}`;
}

function assertLocalFilesExist() {
  const missing = inventoryItems.filter((item) => !fs.existsSync(path.join(inventoryDir, item.fileName)));
  if (missing.length > 0) {
    const joined = missing.map((item) => item.fileName).join(", ");
    throw new Error(`Missing inventory images in public/images/inventory: ${joined}`);
  }
}

function createSanityClient() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "uprm88en";
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  const token = process.env.SANITY_API_WRITE_TOKEN;

  if (!token) {
    throw new Error("Missing SANITY_API_WRITE_TOKEN. Set it before running --apply.");
  }

  return createClient({
    projectId,
    dataset,
    token,
    apiVersion: "2025-01-01",
    useCdn: false,
  });
}

async function runDryMode() {
  assertLocalFilesExist();

  console.log("Inventory sync is configured and ready.");
  console.log("No Sanity changes were made (dry-run mode).");
  console.log("");
  console.log("Planned inventory sync list:");

  for (const [index, item] of inventoryItems.entries()) {
    console.log(`${index + 1}. ${item.itemName} -> /images/inventory/${item.fileName}`);
  }

  console.log("");
  console.log("When ready, run:");
  console.log("npm run sync:inventory");
}

async function runApplyMode() {
  assertLocalFilesExist();

  const client = createSanityClient();
  const businessInfoDoc = await client.fetch(`*[_type == "businessInfo"][0]{_id, businessName}`);

  if (!businessInfoDoc?._id) {
    throw new Error("No businessInfo document found. Seed content first, then retry.");
  }

  console.log(`Uploading ${inventoryItems.length} inventory images to Sanity...`);

  const syncedItems = [];
  for (const [index, item] of inventoryItems.entries()) {
    const filePath = path.join(inventoryDir, item.fileName);
    const asset = await client.assets.upload("image", fs.createReadStream(filePath), {
      filename: item.fileName,
      contentType: "image/png",
    });

    syncedItems.push({
      _type: "inventoryItem",
      _key: toStableKey(item.itemName, index),
      itemName: item.itemName,
      itemImage: {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: asset._id,
        },
        alt: item.alt,
      },
    });
  }

  await client.patch(businessInfoDoc._id).set({ inventoryItems: syncedItems }).commit();

  console.log(`Inventory sync complete for "${businessInfoDoc.businessName || "Business Information"}".`);
}

if (applyMode) {
  runApplyMode().catch((error) => {
    console.error("Inventory sync failed:", error.message);
    process.exit(1);
  });
} else {
  runDryMode().catch((error) => {
    console.error("Inventory dry-run failed:", error.message);
    process.exit(1);
  });
}
