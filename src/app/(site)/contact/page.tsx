import Link from "next/link";
import { Clock, Mail, MapPin, PhoneCall, Send } from "lucide-react";
import { createPageMetadata } from "@/lib/metadata";
import { getContactPageData } from "@/sanity/data";

import { ContactForm } from "@/components/contact-form";

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

  // Strip redundant "How booking works: " if it exists
  let bookingInstructionsText = businessInfo.bookingInstructions || "";
  if (bookingInstructionsText.toLowerCase().startsWith("how booking works:")) {
    bookingInstructionsText = bookingInstructionsText.replace(
      /^how booking works:\s*/i,
      "",
    );
  }

  return (
    <>
      <section className="section">
        <div className="page-wrap">
          <div className="section-head left-aligned">
            <div>
              <p className="eyebrow">Contact</p>
              <h1>Contact Our Rental Team</h1>
              <p>
                Reach out to ask about date availability, setup requirements, or
                package pricing.
              </p>
            </div>
          </div>

          <div className="contact-layout">
            <div className="contact-sidebar">
              <article className="contact-info-card">
                <div className="contact-info-icon">
                  <PhoneCall size={22} aria-hidden="true" />
                </div>
                <div className="contact-info-content">
                  <h2>Phone & Email</h2>
                  <div className="contact-info-links">
                    {businessInfo.phoneNumber ? (
                      <a
                        href={`tel:${businessInfo.phoneNumber}`}
                        className="contact-link contact-link-phone"
                      >
                        <PhoneCall size={16} aria-hidden="true" />
                        {businessInfo.phoneNumber}
                      </a>
                    ) : null}
                    {businessInfo.emailAddress ? (
                      <a
                        href={`mailto:${businessInfo.emailAddress}`}
                        className="contact-link"
                      >
                        <Mail size={16} aria-hidden="true" />
                        {businessInfo.emailAddress}
                      </a>
                    ) : null}
                  </div>
                </div>
              </article>

              <article className="contact-info-card">
                <div className="contact-info-icon">
                  <MapPin size={22} aria-hidden="true" />
                </div>
                <div className="contact-info-content">
                  <h2>Service Base</h2>
                  {businessInfo.addressOrServiceBase ? (
                    <p className="contact-address">
                      {businessInfo.addressOrServiceBase}
                    </p>
                  ) : (
                    <p className="contact-address">
                      Serving nearby towns from our local base.
                    </p>
                  )}
                  {businessInfo.mapLocation ? (
                    <a
                      href={businessInfo.mapLocation}
                      target="_blank"
                      rel="noreferrer"
                      className="contact-link contact-link-map"
                    >
                      <MapPin size={14} aria-hidden="true" />
                      View on Google Maps
                    </a>
                  ) : null}
                </div>
              </article>

              {businessInfo.hours ? (
                <article className="contact-info-card">
                  <div className="contact-info-icon">
                    <Clock size={22} aria-hidden="true" />
                  </div>
                  <div className="contact-info-content">
                    <h2>Hours</h2>
                    <p className="contact-address">{businessInfo.hours}</p>
                  </div>
                </article>
              ) : null}

              <Link
                className="button button-primary contact-cta-button"
                href="/booking-request"
              >
                <Send size={16} aria-hidden="true" />
                Start Your Quote
              </Link>
            </div>

            <article className="contact-form-card">
              <h2>Send a Message</h2>
              <p className="contact-form-subtitle">
                Have a question? Fill out the form and we will get back to you
                within one business day.
              </p>
              <ContactForm />
            </article>
          </div>
        </div>
      </section>

      {bookingInstructionsText ? (
        <section className="section section-tight" style={{ paddingTop: 0 }}>
          <div className="page-wrap">
            <div className="section-surface policy-surface">
              <div className="how-booking-works">
                <h2>How Booking Works</h2>
                <p>{bookingInstructionsText}</p>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="section section-tight">
        <div className="page-wrap">
          <div className="section-head">
            <div>
              <h3>Nearby Towns</h3>
              <p>
                We handle party rentals and event setup in each area below.
                Explore your town page for local details.
              </p>
            </div>
            <Link className="button button-secondary" href="/service-areas">
              View All Service Areas
            </Link>
          </div>

          <div className="service-grid">
            {serviceAreas.map((serviceArea) => (
              <article className="service-area-card" key={serviceArea._id}>
                <p className="service-area-county">{serviceArea.county}</p>
                <h3>{serviceArea.townName}</h3>
                <p>{serviceArea.shortDescription}</p>
                <Link href={`/service-areas/${serviceArea.slug.current}`}>
                  Event rentals in {serviceArea.townName}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
