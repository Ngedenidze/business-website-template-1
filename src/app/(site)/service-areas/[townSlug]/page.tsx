import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ImageSlideshow } from "@/components/image-slideshow";
import { createPageMetadata } from "@/lib/metadata";
import { getServiceAreaBySlug, getServiceAreaSlugs } from "@/sanity/data";

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
      serviceArea.seo?.metaTitle || `Tent and Party Rentals in ${serviceArea.townName}`,
    description:
      serviceArea.seo?.metaDescription ||
      `Tent rentals, table and chair rentals, and party packages in ${serviceArea.townName}.`,
    path: `/service-areas/${serviceArea.slug.current}`,
  });
}

export default async function ServiceAreaTownPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { townSlug } = await params;
  const serviceArea = await getServiceAreaBySlug(townSlug);

  if (!serviceArea) {
    notFound();
  }

  return (
    <section className="section">
      <div className="page-wrap">
        <div className="section-head">
          <div>
            <p className="eyebrow">Local Service Area</p>
            <h1>Event Rentals in {serviceArea.townName}</h1>
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
            <Link className="button button-secondary" href="/service-areas">
              Back to Service Areas
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
