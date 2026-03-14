import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ServiceAreaTownSearch } from "@/components/service-area-town-search";
import { ImageSlideshow } from "@/components/image-slideshow";
import { createPageMetadata } from "@/lib/metadata";
import { SITE_URL } from "@/lib/site";
import {
  getServiceAreaBySlug,
  getServiceAreaSlugs,
  getServiceAreasPageData,
} from "@/sanity/data";

type PageParams = {
  townSlug: string;
};

export async function generateStaticParams() {
  const slugs = await getServiceAreaSlugs();

  return slugs.map((slug) => ({ townSlug: slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { townSlug } = await params;
  const serviceArea = await getServiceAreaBySlug(townSlug);

  if (!serviceArea) {
    return createPageMetadata({
      title: "Service Area",
      description: "Local event rental coverage details.",
      path: `/service-areas/${townSlug}`,
    });
  }

  return createPageMetadata({
    title:
      serviceArea.seo?.metaTitle || `Tent, Table & Chair Rentals in ${serviceArea.townName}, NJ`,
    description:
      serviceArea.seo?.metaDescription ||
      `Local event rentals in ${serviceArea.townName}, ${serviceArea.county}. View packages, delivery availability, and booking options.`,
    path: `/service-areas/${serviceArea.slug.current}`,
  });
}

export default async function ServiceAreaTownPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { townSlug } = await params;
  const [serviceArea, serviceAreaDirectory] = await Promise.all([
    getServiceAreaBySlug(townSlug),
    getServiceAreasPageData(),
  ]);

  if (!serviceArea) {
    notFound();
  }

  const towns = serviceAreaDirectory.serviceAreas.map((town) => ({
    _id: town._id,
    county: town.county,
    townName: town.townName,
    slug: town.slug,
  }));
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
        name: "Service Areas",
        item: `${SITE_URL}/service-areas`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: serviceArea.townName,
        item: `${SITE_URL}/service-areas/${serviceArea.slug.current}`,
      },
    ],
  };
  const serviceSchemaOrgJSONLD = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Event Rentals in ${serviceArea.townName}, NJ`,
    description:
      serviceArea.seoText ||
      `Tent, table, and chair rentals for events in ${serviceArea.townName}, ${serviceArea.county}.`,
    serviceType: "Tent, table, and chair rental service",
    areaServed: {
      "@type": "City",
      name: serviceArea.townName,
      containedInPlace: {
        "@type": "AdministrativeArea",
        name: serviceArea.county,
      },
    },
    provider: {
      "@type": "LocalBusiness",
      name: "Spirit Event Rentals",
      url: SITE_URL,
    },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/booking-request`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchemaOrgJSONLD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchemaOrgJSONLD) }}
      />
      <section className="section">
        <div className="page-wrap">
          <div className="section-head">
            <div>
              <p className="eyebrow">Local Service Area</p>
              <h1>Event Rentals in {serviceArea.townName}</h1>
              <p className="service-area-county">{serviceArea.county}</p>
              <p>
                Tent rentals in {serviceArea.townName}, table and chair rentals in
                {` ${serviceArea.townName}`}, and event rental packages in {serviceArea.townName}.
              </p>
            </div>
          </div>

          <div className="section-surface service-area-detail-surface">
            <ImageSlideshow
              images={serviceArea.serviceAreaSlides}
              aspectRatio="16 / 9"
              autoplay
              intervalMs={4000}
              showControls
              className="service-area-detail-media"
              fallbackLabel={`${serviceArea.townName} event setup photos`}
            />
            <p>{serviceArea.shortDescription}</p>
            {serviceArea.seoText ? <p>{serviceArea.seoText}</p> : null}
            <div className="button-row" style={{ marginTop: "1rem" }}>
              <Link className="button button-primary" href="/booking-request">
                Ask About Your Event Date
              </Link>
              <Link className="button button-secondary" href="/packages">
                View Packages
              </Link>
              <Link className="button button-secondary" href="/policy">
                Review Rental Policy
              </Link>
              <Link className="button button-secondary" href="/faq">
                Read FAQs
              </Link>
              <Link className="button button-secondary" href="/service-areas">
                Back to Service Areas
              </Link>
            </div>
          </div>

          <div style={{ marginTop: "1.5rem" }}>
            <ServiceAreaTownSearch
              currentTownSlug={serviceArea.slug.current}
              currentCounty={serviceArea.county}
              towns={towns}
            />
          </div>
        </div>
      </section>
    </>
  );
}
