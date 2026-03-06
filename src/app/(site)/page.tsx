import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin, PackageCheck } from "lucide-react";
import { ImageSlideshow } from "@/components/image-slideshow";
import { SanityImage } from "@/components/sanity-image";
import { BOOKING_PATH } from "@/lib/site";
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

export default async function HomePage() {
  const { homepage, featuredPackages, galleryItems, testimonials, serviceAreas } =
    await getHomePageData();

  return (
    <>
      <section className="section section-hero">
        <div className="page-wrap">
          <div className="hero-immersive">
            <ImageSlideshow
              images={homepage.heroSlides}
              fallbackImage={homepage.heroImage}
              aspectRatio="16 / 9"
              autoplay
              intervalMs={4000}
              showControls
              sizes="(max-width: 1280px) 100vw, 1280px"
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
        </div>
      </section>

      <section className="section section-tight">
        <div className="page-wrap">
          <div className="section-surface">
            <p>{homepage.introSectionText}</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="page-wrap">
          <div className="section-head">
            <h2>Featured Packages</h2>
            <p>
              Elegant, practical solutions for weddings, backyard celebrations, and family gatherings.
            </p>
          </div>

          <div className="catalogue-list">
            {featuredPackages.map((packageItem) => (
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
                  <h3>{packageItem.packageName}</h3>
                  <p>{packageItem.shortDescription}</p>
                  <div className="meta-row">
                    <span className="meta-pill">{packageItem.price}</span>
                    <span className="meta-pill">Up to {packageItem.guestCapacity} guests</span>
                  </div>
                  <Link href={BOOKING_PATH} className="button button-primary">
                    Request This Package
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="button-row" style={{ marginTop: "4rem" }}>
            <Link className="button button-secondary" href="/packages">
              Explore All Packages
            </Link>
          </div>
        </div>
      </section>

      <section className="section section-tight">
        <div className="page-wrap">
          <div className="section-head">
            <h2>Recent Celebrations</h2>
            <p>See how our premium rentals elevate real events in our community.</p>
          </div>

          <div className="gallery-grid">
            {galleryItems.map((galleryItem) => (
              <figure key={galleryItem._id} className="gallery-item">
                <div className="gallery-media">
                  <SanityImage
                    image={galleryItem.eventPhoto}
                    alt={galleryItem.title || "Event setup photo"}
                    width={960}
                    height={720}
                    fallbackLabel="Gallery image placeholder"
                  />
                </div>
                <figcaption>
                  {galleryItem.title ? <strong>{galleryItem.title}</strong> : null}
                  {galleryItem.caption ? <span>{galleryItem.caption}</span> : null}
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="button-row" style={{ marginTop: "2rem" }}>
            <Link className="button button-secondary" href="/gallery">
              View Full Gallery
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="page-wrap">
          <div className="section-head">
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
          <div className="section-head left-aligned">
            <h2>Towns We Serve</h2>
            <p>
              We provide premium rental setups for homes and venues in these local communities.
            </p>
          </div>

          <div className="service-grid">
            {serviceAreas.map((serviceArea) => (
              <article className="service-area-card" key={serviceArea._id}>
                <h3>{serviceArea.townName}</h3>
                <p>{serviceArea.shortDescription}</p>
                <Link href={`/service-areas/${serviceArea.slug.current}`}>View Service Area</Link>
              </article>
            ))}
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
