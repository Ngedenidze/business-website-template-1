import Link from "next/link";
import { Mail, Phone } from "lucide-react";
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

type BookingRequestPageSearchParams = {
  package?: string;
  packageId?: string;
  selectedPackageId?: string;
};

function normalizePackageName(value: string) {
  return value.trim().toLowerCase();
}

export default async function BookingRequestPage({
  searchParams,
}: {
  searchParams: Promise<BookingRequestPageSearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const { packages, businessInfo, heroImage } = await getBookingPageData();
  const selectedPackageIdQuery = [
    resolvedSearchParams?.selectedPackageId,
    resolvedSearchParams?.packageId,
  ].find((value): value is string => typeof value === "string" && value.trim().length > 0);
  const selectedPackageNameQuery =
    typeof resolvedSearchParams?.package === "string" && resolvedSearchParams.package.trim().length > 0
      ? resolvedSearchParams.package
      : "";
  const initialSelectedPackageId =
    packages.find((packageItem) => packageItem._id === selectedPackageIdQuery)?._id ||
    packages.find(
      (packageItem) =>
        normalizePackageName(packageItem.packageName) === normalizePackageName(selectedPackageNameQuery),
    )?._id ||
    "";

  return (
    <>
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
                Fill out the form below and we will confirm availability. We
                will reach out to finalize your booking after review.
              </p>
            </div>

            <BookingRequestForm
              key={initialSelectedPackageId || "none"}
              packages={packages.map(({ _id, packageName }) => ({
                _id,
                packageName,
              }))}
              initialSelectedPackageId={initialSelectedPackageId}
            />
          </div>
        </div>
      </section>

      {Array.isArray(businessInfo.rentalPolicyHighlights) &&
      businessInfo.rentalPolicyHighlights.length > 0 ? (
        <section className="section section-tight" id="policy">
          <div className="page-wrap">
            <div className="section-surface booking-policy-surface">
              <h2>Rental Policy Highlights</h2>
              <p>Please review these terms before submitting your request.</p>
              <div className="booking-policy-list">
                {businessInfo.rentalPolicyHighlights.map((section) => (
                  <article
                    key={section.sectionTitle}
                    className="booking-policy-item"
                  >
                    <h3>{section.sectionTitle}</h3>
                    <ul className="list-clean">
                      {section.bulletPoints.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                    {section.note ? (
                      <p className="booking-policy-note">{section.note}</p>
                    ) : null}
                  </article>
                ))}
              </div>
              <div className="button-row" style={{ justifyContent: "flex-start" }}>
                <Link className="button button-secondary" href="/policy">
                  View Full Policy Page
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="section section-tight">
        <div className="page-wrap">
          <div className="cta-band">
            <h2>Need help before submitting?</h2>
            <p>
              Call or email and we can guide you to the best package for your
              event size and town.
            </p>
            <div className="button-row">
              {businessInfo.phoneNumber ? (
                <a
                  className="button button-secondary"
                  href={`tel:${businessInfo.phoneNumber}`}
                >
                  <Phone size={16} aria-hidden="true" />
                  Call {businessInfo.phoneNumber}
                </a>
              ) : null}
              {businessInfo.emailAddress ? (
                <a
                  className="button button-secondary"
                  href={`mailto:${businessInfo.emailAddress}`}
                >
                  <Mail size={16} aria-hidden="true" />
                  Email Us
                </a>
              ) : null}
              <Link className="button button-primary" href="/packages">
                Compare Packages
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
