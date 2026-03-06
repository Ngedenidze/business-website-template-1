import Link from "next/link";
import { SanityImage } from "@/components/sanity-image";
import { createPageMetadata } from "@/lib/metadata";
import { BOOKING_PATH } from "@/lib/site";
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
  const { packages } = await getPackagesPageData();

  return (
    <section className="section">
      <div className="page-wrap">
        <div className="section-head">
          <span className="eyebrow">Rental Offerings</span>
          <h1>Curated Packages</h1>
          <p>
            Compare our setups for weddings, family events, and backyard celebrations. We&apos;ll follow up
            to confirm availability and finalize your booking.
          </p>
        </div>

        <div className="catalogue-list" style={{ marginTop: "4rem" }}>
          {packages.map((packageItem) => {
            const includedItems = Array.isArray(packageItem.includedItems) ? packageItem.includedItems : [];
            const optionalAddOns = Array.isArray(packageItem.optionalAddOns) ? packageItem.optionalAddOns : [];

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
                <p style={{ fontSize: "1.1rem", color: "var(--text-muted)" }}>{packageItem.shortDescription}</p>
                <div className="meta-row">
                  <span className="meta-pill">{packageItem.price}</span>
                  <span className="meta-pill">Up to {packageItem.guestCapacity} guests</span>
                </div>

                <p style={{ lineHeight: "1.7" }}>{packageItem.fullDescription}</p>

                <div style={{ display: "grid", gap: "1.5rem", width: "100%", gridTemplateColumns: "1fr 1fr", marginTop: "1rem" }}>
                  <div>
                    <h3 style={{ fontSize: "1.2rem", marginBottom: "0.8rem" }}>Included Items</h3>
                    <ul className="list-clean">
                      {includedItems.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  {optionalAddOns.length > 0 ? (
                    <div>
                      <h3 style={{ fontSize: "1.2rem", marginBottom: "0.8rem" }}>Optional Add-ons</h3>
                      <ul className="list-clean">
                        {optionalAddOns.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>

                <Link className="button button-primary" href={BOOKING_PATH} style={{ marginTop: "1rem" }}>
                  {packageItem.buttonText || "Request This Package"}
                </Link>
              </div>
            </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
