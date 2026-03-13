import Link from "next/link";
import { PolicyBrowser } from "@/components/policy-browser";
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
  const deliveryFees = Array.isArray(businessInfo.deliveryFees)
    ? businessInfo.deliveryFees
    : [];
  const setupFees = Array.isArray(businessInfo.setupFees)
    ? businessInfo.setupFees
    : [];

  return (
    <section className="section">
      <div className="page-wrap">
        <div className="section-head left-aligned">
          <p className="eyebrow">Rental Policy</p>
          <h1>Rental Terms and Policy Details</h1>
          <p>
            Please review these terms before your event date. These policies
            cover site requirements, weather, linens, care, delivery, and
            liability responsibilities.
          </p>
        </div>

        <PolicyBrowser
          sections={sections}
          deliveryFees={deliveryFees}
          setupFees={setupFees}
        />

        <section className="section section-tight">
          <div className="cta-band">
            <h2>Need Clarification Before Booking?</h2>
            <p>
              Contact our team if you have questions about setup conditions,
              permits, or event-day responsibilities.
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
