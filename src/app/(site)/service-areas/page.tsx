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
      "Find tent rentals, table and chair rentals, and event packages in nearby towns grouped by county.",
    path: "/service-areas",
  });
}

export default async function ServiceAreasPage() {
  const { serviceAreas } = await getServiceAreasPageData();
  const serviceAreasByCounty = serviceAreas.reduce<Record<string, typeof serviceAreas>>(
    (groups, serviceArea) => {
      const county = serviceArea.county || "Other Service Areas";
      if (!groups[county]) {
        groups[county] = [];
      }
      groups[county].push(serviceArea);
      return groups;
    },
    {},
  );
  const countyOrder = Object.keys(serviceAreasByCounty).sort((left, right) => left.localeCompare(right));

  return (
    <section className="section">
      <div className="page-wrap">
        <div className="section-head">
          <div>
            <p className="eyebrow">Service Areas</p>
            <h1>Event Rentals in Nearby Towns</h1>
            <p>
              We provide tent rentals, table and chair rentals, and package setups across county-based
              coverage areas around Caldwell, NJ.
            </p>
          </div>
        </div>

        {countyOrder.map((county) => (
          <section key={county} className="service-county-section">
            <div className="section-head left-aligned service-county-head">
              <h2>{county}</h2>
              <p>{serviceAreasByCounty[county].length} towns and cities in this coverage area.</p>
            </div>

            <div className="service-grid">
              {serviceAreasByCounty[county].map((serviceArea) => (
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
                  <p className="service-area-county">{serviceArea.county}</p>
                  <h3>{serviceArea.townName}</h3>
                  <p>{serviceArea.shortDescription}</p>
                  <Link href={`/service-areas/${serviceArea.slug.current}`}>
                    Party rentals in {serviceArea.townName}
                  </Link>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
