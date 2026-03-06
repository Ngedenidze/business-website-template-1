import Link from "next/link";
import { MapPin, PhoneCall } from "lucide-react";
import { createPageMetadata } from "@/lib/metadata";
import { getContactPageData } from "@/sanity/data";

export async function generateMetadata() {
  const { seo } = await getContactPageData();

  return createPageMetadata({
    title: seo?.metaTitle || "Contact",
    description:
      seo?.metaDescription ||
      "Contact our local event rental team for tent, table, and chair package availability.",
    path: "/contact",
  });
}

export default async function ContactPage() {
  const { businessInfo, serviceAreas } = await getContactPageData();

  return (
    <section className="section">
      <div className="page-wrap">
        <div className="section-head">
          <div>
            <p className="eyebrow">Contact</p>
            <h1>Contact Our Rental Team</h1>
            <p>
              Reach out to ask about date availability, setup requirements, or package pricing.
            </p>
          </div>
        </div>

        <div className="card-grid">
          <article className="card">
            <div className="card-body">
              <h2>Phone and Email</h2>
              {businessInfo.phoneNumber ? (
                <a href={`tel:${businessInfo.phoneNumber}`}>Call {businessInfo.phoneNumber}</a>
              ) : null}
              {businessInfo.emailAddress ? (
                <a href={`mailto:${businessInfo.emailAddress}`}>{businessInfo.emailAddress}</a>
              ) : null}
              <Link className="button button-primary" href="/booking-request">
                Request a Booking
              </Link>
            </div>
          </article>

          <article className="card">
            <div className="card-body">
              <h2>Service Base</h2>
              {businessInfo.addressOrServiceBase ? (
                <p>
                  <MapPin size={15} aria-hidden="true" /> {businessInfo.addressOrServiceBase}
                </p>
              ) : (
                <p>Serving nearby towns from our local base.</p>
              )}
              {businessInfo.mapLocation ? (
                <a href={businessInfo.mapLocation} target="_blank" rel="noreferrer">
                  Open map location
                </a>
              ) : null}
              {businessInfo.hours ? <p>{businessInfo.hours}</p> : null}
            </div>
          </article>

          <article className="card">
            <div className="card-body">
              <h2>How Booking Works</h2>
              <p>{businessInfo.bookingInstructions}</p>
              <p>
                <PhoneCall size={15} aria-hidden="true" /> Need a quick answer? Call us during
                business hours.
              </p>
            </div>
          </article>
        </div>

        <section className="section section-tight">
          <div className="section-head">
            <div>
              <h2>Nearby Towns</h2>
              <p>
                We handle party rentals and event setup in each area below. Explore your town page
                for local details.
              </p>
            </div>
            <Link className="button button-secondary" href="/service-areas">
              View All Service Areas
            </Link>
          </div>

          <div className="service-grid">
            {serviceAreas.map((serviceArea) => (
              <article className="service-area-card" key={serviceArea._id}>
                <h3>{serviceArea.townName}</h3>
                <p>{serviceArea.shortDescription}</p>
                <Link href={`/service-areas/${serviceArea.slug.current}`}>
                  Event rentals in {serviceArea.townName}
                </Link>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
