import { SanityImage } from "@/components/sanity-image";

type InventoryItem = {
  itemName: string;
  price: string;
  itemImage?: any;
};

type InventoryGridProps = {
  items: InventoryItem[];
};

export function InventoryGrid({ items }: InventoryGridProps) {
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
    ([_, groupItems]) => groupItems.length > 0,
  );

  return (
    <div className="inventory-directory">
      {activeGroups.map(([category, groupItems]) => (
        <div key={category} className="inventory-category">
          <h3 className="inventory-category-head">{category}</h3>
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
