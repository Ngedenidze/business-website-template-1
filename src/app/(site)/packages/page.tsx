import Link from "next/link";
import { InventoryGrid } from "@/components/inventory-grid";
import { SanityImage } from "@/components/sanity-image";
import { createPageMetadata } from "@/lib/metadata";
import { BOOKING_PATH, SITE_URL } from "@/lib/site";
import { getPackagesPageData } from "@/sanity/data";

export async function generateMetadata() {
  const { seo } = await getPackagesPageData();

  return createPageMetadata({
    title: seo?.metaTitle || "Event Rental Packages",
    description:
      seo?.metaDescription ||
      "Browse tent, table, and chair package pricing with guest capacity and included items.",
    path: "/packages",
  });
}

function splitPackageItemLabel(item: string) {
  const normalized = item.trim();
  const match = normalized.match(/^\s*([0-9][0-9'"xX\s.-]*)\s+(.*)$/);

  if (!match) {
    return { quantity: null as string | null, label: normalized };
  }

  return { quantity: match[1].trim(), label: match[2].trim() };
}

export default async function PackagesPage() {
  const { packages, businessInfo } = await getPackagesPageData();
  const individualPricing = Array.isArray(businessInfo.individualRentalPricing)
    ? businessInfo.individualRentalPricing
    : [];
  const deliveryFees = Array.isArray(businessInfo.deliveryFees)
    ? businessInfo.deliveryFees
    : [];
  const setupFees = Array.isArray(businessInfo.setupFees)
    ? businessInfo.setupFees
    : [];

  const schemaOrgJSONLD = packages.map((packageItem) => ({
    "@context": "https://schema.org",
    "@type": "Product",
    name: packageItem.packageName,
    image: packageItem.packagePhoto?.asset?.url || "",
    description: packageItem.shortDescription,
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/packages`,
      priceCurrency: "USD",
      price: packageItem.price?.replace(/[^0-9.]/g, "") || "0",
      itemCondition: "https://schema.org/UsedCondition",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "LocalBusiness",
        name: "Spirit Event Rentals",
      },
    },
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrgJSONLD) }}
      />
      <section className="section packages-page">
        <div className="page-wrap packages-page-wrap">
          <header className="section-head left-aligned packages-pricing-head packages-hero">
            <span className="eyebrow">Rental Offerings</span>
            <h1>Curated Packages</h1>
            <p className="packages-hero-copy">
              Compare our setups for weddings, family events, and backyard
              celebrations. We&apos;ll follow up to confirm availability and
              finalize your booking.
            </p>
          </header>

          <div className="catalogue-list packages-catalogue-list">
            {packages.map((packageItem) => {
              const includedItems = Array.isArray(packageItem.includedItems)
                ? packageItem.includedItems
                : [];
              const optionalAddOns = Array.isArray(packageItem.optionalAddOns)
                ? packageItem.optionalAddOns
                : [];

              return (
                <article key={packageItem._id} className="catalogue-item">
                  <div className="catalogue-media">
                    <SanityImage
                      image={packageItem.packagePhoto}
                      alt={`${packageItem.packageName} package photo`}
                      width={1000}
                      height={750}
                      fallbackLabel={`${packageItem.packageName} photo placeholder`}
                    />
                  </div>

                  <div className="catalogue-body">
                    <div className="home-featured-package-card">
                      <div className="home-featured-package-header">
                        <h2>{packageItem.packageName}</h2>
                        <div className="meta-row">
                          <span className="meta-pill">{packageItem.price}</span>
                          <span className="meta-pill">
                            {packageItem.capacityLabel?.trim() ||
                              `Up to ${packageItem.guestCapacity} guests`}
                          </span>
                        </div>
                      </div>

                      <div className="home-featured-package-body">
                        <p className="home-featured-description">{packageItem.fullDescription}</p>

                        <div
                          className="home-featured-package-items"
                          style={{
                            gridTemplateColumns: optionalAddOns.length > 0 ? "1fr 1fr" : "1fr",
                          }}
                        >
                          <div>
                            <h2 className="included-items-title">Included Items</h2>
                            <ul
                              className={`list-clean package-line-list ${includedItems.length > 6 ? "package-line-list-columns" : ""}`}
                            >
                              {includedItems.map((item) => {
                                const { quantity, label } = splitPackageItemLabel(item);
                                return (
                                  <li key={item}>
                                    {quantity ? <span className="package-item-qty">{quantity}</span> : null}
                                    <span>{label}</span>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>

                          {optionalAddOns.length > 0 ? (
                            <div>
                              <h4>Optional Add-ons</h4>
                              <ul
                                className={`list-clean package-line-list ${optionalAddOns.length > 6 ? "package-line-list-columns" : ""}`}
                              >
                                {optionalAddOns.map((item) => {
                                  const { quantity, label } = splitPackageItemLabel(item);
                                  return (
                                    <li key={item}>
                                      {quantity ? <span className="package-item-qty">{quantity}</span> : null}
                                      <span>{label}</span>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <div className="home-featured-package-cta">
                        <Link
                          href={`${BOOKING_PATH}?packageId=${encodeURIComponent(packageItem._id)}&package=${encodeURIComponent(packageItem.packageName)}`}
                          className="button button-primary"
                        >
                          {packageItem.buttonText || "Request This Package"}
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {individualPricing.length > 0 ? (
            <section className="packages-pricing-surface packages-pricing-surface--inventory">
              <header className="section-head left-aligned packages-pricing-head">
                <span className="eyebrow">A La Carte</span>
                <h2>Individual Item Pricing</h2>
                <p>
                  Need extras beyond package quantities? Use this pricing list
                  for individual rentals.
                </p>
              </header>

              <InventoryGrid items={individualPricing} />
            </section>
          ) : null}

          {deliveryFees.length > 0 || setupFees.length > 0 ? (
            <section className="packages-pricing-surface packages-pricing-surface--fees">
              <header className="section-head left-aligned packages-pricing-head">
                <span className="eyebrow">Planning Details</span>
                <h2>Delivery &amp; Setup Fees</h2>
                <p>
                  Reference pricing for delivery distance and tent setup
                  support.
                </p>
              </header>

              <div className="policy-pricing-grid packages-fees-grid">
                {deliveryFees.length > 0 ? (
                  <article className="policy-pricing-card">
                    <h3>Delivery Fees</h3>
                    <table className="policy-price-table">
                      <thead>
                        <tr>
                          <th scope="col">Distance</th>
                          <th scope="col">Fee</th>
                        </tr>
                      </thead>
                      <tbody>
                        {deliveryFees.map((row) => (
                          <tr key={`${row.distance}-${row.fee}`}>
                            <td>{row.distance}</td>
                            <td>{row.fee}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </article>
                ) : null}

                {setupFees.length > 0 ? (
                  <article className="policy-pricing-card">
                    <h3>Setup Fees</h3>
                    <table className="policy-price-table">
                      <thead>
                        <tr>
                          <th scope="col">Tent</th>
                          <th scope="col">Setup Fee</th>
                        </tr>
                      </thead>
                      <tbody>
                        {setupFees.map((row) => (
                          <tr key={`${row.tent}-${row.setupFee}`}>
                            <td>{row.tent}</td>
                            <td>{row.setupFee}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </article>
                ) : null}
              </div>

              <p className="form-helper packages-fees-note">
                For full terms and weather/site requirements, review our{" "}
                <Link href="/policy">policy page</Link>.
              </p>
            </section>
          ) : null}
        </div>
      </section>
    </>
  );
}
