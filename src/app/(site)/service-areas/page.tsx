import Link from "next/link";
import { ImageSlideshow } from "@/components/image-slideshow";
import { createPageMetadata } from "@/lib/metadata";
import { getServiceAreasPageData } from "@/sanity/data";

export async function generateMetadata() {
  const { seo } = await getServiceAreasPageData();

  return createPageMetadata({
    title: seo?.metaTitle || "Service Areas",
    description:
      seo?.metaDescription ||
      "Find tent rentals, table and chair rentals, and event packages in nearby towns.",
    path: "/service-areas",
  });
}

export default async function ServiceAreasPage() {
  const { serviceAreas } = await getServiceAreasPageData();

  return (
    <section className="section">
      <div className="page-wrap">
        <div className="section-head">
          <div>
            <p className="eyebrow">Service Areas</p>
            <h1>Event Rentals in Nearby Towns</h1>
            <p>
              We provide tent rentals, table and chair rentals, and package setups across local
              communities.
            </p>
          </div>
        </div>

        <div className="service-grid">
          {serviceAreas.map((serviceArea) => (
            <article key={serviceArea._id} className="service-area-card">
              <ImageSlideshow
                images={serviceArea.serviceAreaSlides}
                aspectRatio="4 / 3"
                autoplay
                intervalMs={4000}
                showControls
                className="service-area-media"
                fallbackLabel={`${serviceArea.townName} setup photos`}
              />
              <h2>{serviceArea.townName}</h2>
              <p>{serviceArea.shortDescription}</p>
              <Link href={`/service-areas/${serviceArea.slug.current}`}>
                Party rentals in {serviceArea.townName}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
