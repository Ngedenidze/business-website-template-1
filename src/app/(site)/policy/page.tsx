import Link from "next/link";
import { createPageMetadata } from "@/lib/metadata";
import { getPolicyPageData } from "@/sanity/data";

export async function generateMetadata() {
  const { businessInfo } = await getPolicyPageData();

  return createPageMetadata({
    title: `${businessInfo.businessName} Rental Policy`,
    description:
      businessInfo?.seo?.metaDescription ||
      "Review rental policy details for site requirements, weather, linens, delivery, permits, and liability.",
    path: "/policy",
  });
}

export default async function PolicyPage() {
  const { businessInfo } = await getPolicyPageData();
  const sections = Array.isArray(businessInfo.rentalPolicyHighlights)
    ? businessInfo.rentalPolicyHighlights
    : [];
  const deliveryFees = Array.isArray(businessInfo.deliveryFees) ? businessInfo.deliveryFees : [];
  const setupFees = Array.isArray(businessInfo.setupFees) ? businessInfo.setupFees : [];

  return (
    <section className="section">
      <div className="page-wrap">
        <div className="section-head left-aligned">
          <p className="eyebrow">Rental Policy</p>
          <h1>Rental Terms and Policy Details</h1>
          <p>
            Please review these terms before your event date. These policies cover site requirements,
            weather, linens, care, delivery, and liability responsibilities.
          </p>
        </div>

        <div className="section-surface policy-surface">
          {sections.length > 0 ? (
            <div className="booking-policy-list">
              {sections.map((section) => (
                <article key={section.sectionTitle} className="booking-policy-item">
                  <h2>{section.sectionTitle}</h2>
                  <ul className="list-clean">
                    {section.bulletPoints.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                  {section.note ? <p className="booking-policy-note">{section.note}</p> : null}
                </article>
              ))}
            </div>
          ) : (
            <p>Policy details will be published here soon.</p>
          )}
        </div>

        {deliveryFees.length > 0 || setupFees.length > 0 ? (
          <div className="section-surface policy-pricing-surface">
            <h2>Delivery and Setup Fees</h2>
            <p>Reference pricing for delivery distance and tent setup support.</p>

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
          </div>
        ) : null}

        <section className="section section-tight">
          <div className="cta-band">
            <h2>Need Clarification Before Booking?</h2>
            <p>
              Contact our team if you have questions about setup conditions, permits, or event-day
              responsibilities.
            </p>
            <div className="button-row">
              <Link className="button button-primary" href="/booking-request">
                Request a Booking
              </Link>
              <Link className="button button-secondary" href="/contact">
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
