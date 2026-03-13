import Link from "next/link";
import { InventoryGrid } from "@/components/inventory-grid";
import { SanityImage } from "@/components/sanity-image";
import { createPageMetadata } from "@/lib/metadata";
import { BOOKING_PATH, SITE_URL, DEFAULT_META_DESCRIPTION } from "@/lib/site";
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
      <section className="section">
        <div className="page-wrap">
          <div className="section-head">
            <span className="eyebrow">Rental Offerings</span>
            <h1>Curated Packages</h1>
            <p>
              Compare our setups for weddings, family events, and backyard
              celebrations. We&apos;ll follow up to confirm availability and
              finalize your booking.
            </p>
          </div>

          <div className="catalogue-list" style={{ marginTop: "4rem" }}>
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
                    <h2>{packageItem.packageName}</h2>
                    <p
                      style={{ fontSize: "1.1rem", color: "var(--text-muted)" }}
                    >
                      {packageItem.shortDescription}
                    </p>
                    <div className="meta-row">
                      <span className="meta-pill">{packageItem.price}</span>
                      <span className="meta-pill">
                        {packageItem.capacityLabel?.trim() ||
                          `Up to ${packageItem.guestCapacity} guests`}
                      </span>
                    </div>

                    <p style={{ lineHeight: "1.7" }}>
                      {packageItem.fullDescription}
                    </p>

                    <div
                      style={{
                        display: "grid",
                        gap: "1.5rem",
                        width: "100%",
                        gridTemplateColumns: "1fr 1fr",
                        marginTop: "1rem",
                      }}
                    >
                      <div>
                        <h3
                          style={{ fontSize: "1.2rem", marginBottom: "0.8rem" }}
                        >
                          Included Items
                        </h3>
                        <ul className="list-clean">
                          {includedItems.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>

                      {optionalAddOns.length > 0 ? (
                        <div>
                          <h3
                            style={{
                              fontSize: "1.2rem",
                              marginBottom: "0.8rem",
                            }}
                          >
                            Optional Add-ons
                          </h3>
                          <ul className="list-clean">
                            {optionalAddOns.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                    </div>

                    <Link
                      className="button button-primary"
                      href={BOOKING_PATH}
                      style={{ marginTop: "1rem" }}
                    >
                      {packageItem.buttonText || "Request This Package"}
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

          {individualPricing.length > 0 ? (
            <section
              className="section-surface policy-pricing-surface"
              style={{ marginTop: "3rem" }}
            >
              <h2>Individual Item Pricing</h2>
              <p>
                Need extras beyond package quantities? Use this pricing list for
                individual rentals.
              </p>

              <InventoryGrid items={individualPricing} />
            </section>
          ) : null}

          {deliveryFees.length > 0 || setupFees.length > 0 ? (
            <section
              className="section-surface policy-pricing-surface"
              style={{ marginTop: "2rem" }}
            >
              <h2>Delivery and Setup Fees</h2>
              <p>
                Reference pricing for delivery distance and tent setup support.
              </p>

              <div className="policy-pricing-grid">
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

              <p className="form-helper">
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
