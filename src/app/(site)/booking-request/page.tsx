import Link from "next/link";
import { BookingRequestForm } from "@/components/booking-request-form";
import { SanityImage } from "@/components/sanity-image";
import { createPageMetadata } from "@/lib/metadata";
import { getBookingPageData } from "@/sanity/data";

export async function generateMetadata() {
  const { seo } = await getBookingPageData();

  return createPageMetadata({
    title: seo?.metaTitle || "Request a Booking",
    description:
      seo?.metaDescription ||
      "Send your event date, location, and guest count to request tent, table, and chair rental availability.",
    path: "/booking-request",
  });
}

export default async function BookingRequestPage() {
  const { packages, businessInfo, heroImage } = await getBookingPageData();

  return (
    <section className="section">
      <div className="page-wrap booking-split">
        <div className="booking-image-panel">
          <SanityImage
            image={heroImage}
            alt="Event setup preview"
            priority
            className="booking-sticky-media"
          />
        </div>

        <div className="booking-form-panel">
          <div className="section-head left-aligned">
            <p className="eyebrow">Booking Request</p>
            <h1>Request Your Event Date</h1>
            <p>
              Fill out the form below and we will confirm availability. We will reach out to finalize
              your booking after review.
            </p>
          </div>

          <BookingRequestForm packages={packages.map(({ _id, packageName }) => ({ _id, packageName }))} />
        </div>

        <section className="section section-tight">
          <div className="cta-band">
            <h2>Need help before submitting?</h2>
            <p>
              Call or email and we can guide you to the best package for your event size and town.
            </p>
            <div className="button-row">
              {businessInfo.phoneNumber ? (
                <a className="button button-secondary" href={`tel:${businessInfo.phoneNumber}`}>
                  Call {businessInfo.phoneNumber}
                </a>
              ) : null}
              {businessInfo.emailAddress ? (
                <a className="button button-secondary" href={`mailto:${businessInfo.emailAddress}`}>
                  Email Us
                </a>
              ) : null}
              <Link className="button button-primary" href="/packages">
                Compare Packages
              </Link>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
