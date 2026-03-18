import Link from "next/link";
import { Clock, Mail, MapPin, PhoneCall, Send } from "lucide-react";
import { createPageMetadata } from "@/lib/metadata";
import { SITE_URL } from "@/lib/site";
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
  const { businessInfo } = await getContactPageData();

  // Strip redundant "How booking works: " if it exists
  let bookingInstructionsText = businessInfo.bookingInstructions || "";
  if (bookingInstructionsText.toLowerCase().startsWith("how booking works:")) {
    bookingInstructionsText = bookingInstructionsText.replace(
      /^how booking works:\s*/i,
      "",
    );
  }
  const breadcrumbSchemaOrgJSONLD = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${SITE_URL}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Contact",
        item: `${SITE_URL}/contact`,
      },
    ],
  };
  const contactPageSchemaOrgJSONLD = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Spirit Event Rentals",
    url: `${SITE_URL}/contact`,
    about: {
      "@type": "LocalBusiness",
      name: businessInfo.businessName || "Spirit Event Rentals",
      telephone: businessInfo.phoneNumber || undefined,
      email: businessInfo.emailAddress || undefined,
      address: businessInfo.addressOrServiceBase || undefined,
      areaServed: "Caldwell, NJ and surrounding towns",
      url: SITE_URL,
    },
  };
  const localBusinessSchemaOrgJSONLD = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: businessInfo.businessName || "Spirit Event Rentals",
    url: SITE_URL,
    telephone: businessInfo.phoneNumber || undefined,
    email: businessInfo.emailAddress || undefined,
    address: businessInfo.addressOrServiceBase || undefined,
    areaServed: "Caldwell, NJ and surrounding towns",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchemaOrgJSONLD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchemaOrgJSONLD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchemaOrgJSONLD) }}
      />
      <section className="section">
        <div className="page-wrap">
          <div className="section-head left-aligned">
            <div>
              <p className="eyebrow">Contact</p>
              <h1>Contact Our Caldwell, NJ Rental Team</h1>
              <p>
                Reach out for date availability, setup requirements, or package
                pricing in Caldwell and nearby towns.
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
          <section className="cta-band contact-cta-band">
            <h2>Already know what you need?</h2>
            <p>Send your details and we will confirm availability quickly.</p>
            <Link
              className="button button-primary contact-cta-button"
              href="/booking-request"
            >
              <Send size={16} aria-hidden="true" />
              Book your event
            </Link>
            <div className="contact-cta-links">
              <Link className="contact-cta-text-link" href="/packages">
                View Packages
              </Link>
              <Link className="contact-cta-text-link" href="/service-areas">
                Service Areas
              </Link>
              <Link className="contact-cta-text-link" href="/faq">
                Read FAQs
              </Link>
            </div>
          </section>
        </div>
      </section>
    </>
  );
}
