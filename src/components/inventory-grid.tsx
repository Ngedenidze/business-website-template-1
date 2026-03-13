import { SanityImage } from "@/components/sanity-image";
import type { SanityImageWithAlt } from "@/sanity/types";

type InventoryItem = {
  itemName: string;
  price: string;
  itemImage?: SanityImageWithAlt | null;
};

type InventoryGridProps = {
  items: InventoryItem[];
};

export function InventoryGrid({ items }: InventoryGridProps) {
  const categoryHelperText: Record<string, string> = {
    Tents: "Frame and canopy sizes for covered event space.",
    "Seating & Tables": "Essential seating and table pieces for guest comfort.",
    "Linens & Accessories": "Finishing details that complete your event setup.",
    Other: "Additional rental items available by request.",
  };

  const groups: Record<string, InventoryItem[]> = {
    Tents: [],
    "Seating & Tables": [],
    "Linens & Accessories": [],
    Other: [],
  };

  for (const item of items) {
    const name = item.itemName.toLowerCase();
    if (name.includes("tent")) {
      groups["Tents"].push(item);
    } else if (name.includes("linen") || name.includes("accessory")) {
      groups["Linens & Accessories"].push(item);
    } else if (
      name.includes("chair") ||
      name.includes("table") ||
      name.includes("seating")
    ) {
      groups["Seating & Tables"].push(item);
    } else {
      groups["Other"].push(item);
    }
  }

  // Filter out empty groups
  const activeGroups = Object.entries(groups).filter(
    ([, groupItems]) => groupItems.length > 0,
  );

  return (
    <div className="inventory-directory">
      {activeGroups.map(([category, groupItems]) => (
        <div key={category} className="inventory-category">
          <div className="inventory-category-head-wrap">
            <h3 className="inventory-category-head">{category}</h3>
            {categoryHelperText[category] ? (
              <p className="inventory-category-helper">
                {categoryHelperText[category]}
              </p>
            ) : null}
          </div>

          <div className="inventory-grid">
            {groupItems.map((item) => (
              <article key={item.itemName} className="inventory-card">
                <div className="inventory-card-media">
                  {item.itemImage ? (
                    <SanityImage
                      image={item.itemImage}
                      alt={item.itemImage.alt || `${item.itemName} photo`}
                      width={400}
                      height={400}
                      fallbackLabel={item.itemName}
                    />
                  ) : (
                    <span className="placeholder">No Image Available</span>
                  )}
                </div>
                <div className="inventory-card-content">
                  <h3>{item.itemName}</h3>
                  <p>{item.price}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
