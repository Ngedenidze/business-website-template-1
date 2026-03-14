import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin, PackageCheck } from "lucide-react";
import { ImageSlideshow } from "@/components/image-slideshow";
import { SanityImage } from "@/components/sanity-image";
import { BOOKING_PATH, SITE_URL, DEFAULT_META_DESCRIPTION } from "@/lib/site";
import { createPageMetadata } from "@/lib/metadata";
import { getHomePageData } from "@/sanity/data";

export async function generateMetadata() {
  const { homepage } = await getHomePageData();

  return createPageMetadata({
    title: homepage?.seo?.metaTitle || "Tent, Table, and Chair Rentals for Local Events",
    description:
      homepage?.seo?.metaDescription ||
      "Browse event rental packages, view setup photos, and request your date for tents, tables, and chairs.",
    path: "/",
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

export default async function HomePage() {
  const { homepage, featuredPackages, testimonials, serviceAreas } =
    await getHomePageData();
  const essexFeaturedTowns = serviceAreas
    .filter((serviceArea) => serviceArea.county.toLowerCase().includes("essex"))
    .slice(0, 6);
  const featuredTownCards = essexFeaturedTowns.length > 0 ? essexFeaturedTowns : serviceAreas.slice(0, 6);

  // Generate LocalBusiness Schema
  const schemaOrgJSONLD = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Spirit Event Rentals",
    image: homepage.heroImage?.asset?.url || "",
    telephone: "973-632-6516", // Format based on known fallback
    email: "spiriteventrentals@yahoo.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "23 Westville Ave",
      addressLocality: "Caldwell",
      addressRegion: "NJ",
      postalCode: "07006",
      addressCountry: "US",
    },
    url: SITE_URL,
    description: homepage?.seo?.metaDescription || DEFAULT_META_DESCRIPTION,
    areaServed: serviceAreas.map((area) => ({
      "@type": "City",
      name: area.townName,
      containedInPlace: {
        "@type": "AdministrativeArea",
        name: area.county,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrgJSONLD) }}
      />
      <section className="section section-hero">
        <div className="hero-immersive">
          <ImageSlideshow
            images={homepage.heroSlides}
            fallbackImage={homepage.heroImage}
            aspectRatio="16 / 9"
            autoplay
            intervalMs={4000}
            showControls
            sizes="100vw"
            className="hero-backdrop"
            priority
            fallbackLabel="Event setup photography"
          />
          <div className="hero-global-overlay" aria-hidden="true" />
          <div className="hero-focus-vignette" aria-hidden="true" />

          <div className="hero-editorial-copy">
            <span className="eyebrow">Local Event Rentals</span>
            <h1>{homepage.mainHeadline}</h1>
            <p>{homepage.supportingText}</p>
            <div className="button-row">
              <Link className="button button-primary" href={BOOKING_PATH}>
                {homepage.primaryButtonText || "Request a Booking"}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link className="button button-secondary" href="/packages">
                View Packages
              </Link>
            </div>
          </div>
        </div>

        <div className="feature-strip">
          <div className="feature-card">
            <PackageCheck className="feature-icon" size={24} aria-hidden="true" />
            <span className="feature-label">Tents, tables, chairs, bundles</span>
          </div>
          <div className="feature-card">
            <CalendarDays className="feature-icon" size={24} aria-hidden="true" />
            <span className="feature-label">Simple online booking requests</span>
          </div>
          <div className="feature-card">
            <MapPin className="feature-icon" size={24} aria-hidden="true" />
            <span className="feature-label">Serving nearby towns</span>
          </div>
        </div>
      </section>



      <section className="section">
        <div className="page-wrap">
          <div className="section-head left-aligned packages-pricing-head">
            <span className="eyebrow">Featured</span>
            <h2>Featured Packages</h2>
            <p>
              Elegant, practical solutions for weddings, backyard celebrations, and family gatherings.
            </p>
          </div>

          <div className="catalogue-list">
            {featuredPackages.map((packageItem) => {
              const includedItems = Array.isArray(packageItem.includedItems) ? packageItem.includedItems : [];
              const optionalAddOns = Array.isArray(packageItem.optionalAddOns)
                ? packageItem.optionalAddOns
                : [];

              return (
                <article key={packageItem._id} className="catalogue-item">
                  <div className="catalogue-media">
                    <SanityImage
                      image={packageItem.packagePhoto}
                      alt={`${packageItem.packageName} package photo`}
                      width={900}
                      height={675}
                      fallbackLabel={`${packageItem.packageName} photo placeholder`}
                    />
                  </div>
                  <div className="catalogue-body">
                    <div className="home-featured-package-card">
                      <div className="home-featured-package-header">
                        <h3>{packageItem.packageName}</h3>
                        <div className="meta-row">
                          <span className="meta-pill">{packageItem.price}</span>
                          <span className="meta-pill">
                            {packageItem.capacityLabel?.trim() || `Up to ${packageItem.guestCapacity} guests`}
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
                            <ul className={`list-clean package-line-list ${includedItems.length > 6 ? "package-line-list-columns" : ""}`}>
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
                              <ul className={`list-clean package-line-list ${optionalAddOns.length > 6 ? "package-line-list-columns" : ""}`}>
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
                          Request This Package
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="button-row" style={{ marginTop: "4rem" }}>
            <Link className="button button-secondary" href="/packages">
              Explore All Packages
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="page-wrap">
          <div className="section-head left-aligned packages-pricing-head">
            <span className="eyebrow">Testimonials</span>
            <h2>Client Experiences</h2>
            <p>Feedback from the families and planners we serve across the area.</p>
          </div>

          <div className="testimonial-grid">
            {testimonials.map((testimonial) => (
              <article key={testimonial._id} className="testimonial-editorial">
                <p>&ldquo;{testimonial.testimonialText}&rdquo;</p>
                <footer>
                  <strong>{testimonial.customerName}</strong>
                  {testimonial.town ? <span>{testimonial.town}</span> : null}
                </footer>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="page-wrap">
          <div className="section-head left-aligned packages-pricing-head">
            <span className="eyebrow">Service Areas</span>
            <h2>Towns We Serve</h2>
            <p>
              We provide premium rental setups for homes and venues in these local communities.
            </p>
          </div>

          <div className="service-grid">
            {featuredTownCards.map((serviceArea) => (
              <article className="service-area-card" key={serviceArea._id}>
                <p className="service-area-county">{serviceArea.county}</p>
                <h3>{serviceArea.townName}</h3>
                <p>{serviceArea.shortDescription}</p>
                <Link href={`/service-areas/${serviceArea.slug.current}`}>View Service Area</Link>
              </article>
            ))}
          </div>

          <div className="button-row" style={{ marginTop: "2rem" }}>
            <Link className="button button-secondary" href="/service-areas">
              See All Towns
            </Link>
          </div>
        </div>
      </section>

      <section className="section section-tight">
        <div className="page-wrap">
          <div className="cta-band">
            <h2>{homepage.finalCallToActionHeading}</h2>
            <p>{homepage.finalCallToActionText}</p>
            <Link className="button button-primary" href={BOOKING_PATH}>
              {homepage.finalCallToActionButtonText}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
