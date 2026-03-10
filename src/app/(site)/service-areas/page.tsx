import Link from "next/link";
import { ServiceAreasBrowser } from "@/components/service-areas-browser";
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

type ServiceAreasPageSearchParams = {
  county?: string;
};

export default async function ServiceAreasPage({
  searchParams,
}: {
  searchParams: Promise<ServiceAreasPageSearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const selectedCountyQuery =
    typeof resolvedSearchParams?.county === "string" ? resolvedSearchParams.county : null;
  const { serviceAreas } = await getServiceAreasPageData();
  const directoryItems = serviceAreas.map((serviceArea) => ({
    _id: serviceArea._id,
    county: serviceArea.county,
    townName: serviceArea.townName,
    shortDescription: serviceArea.shortDescription,
    slug: serviceArea.slug,
  }));

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

        <ServiceAreasBrowser serviceAreas={directoryItems} selectedCountyQuery={selectedCountyQuery} />

        <div className="button-row" style={{ marginTop: "2rem" }}>
          <Link className="button button-secondary" href="/booking-request">
            Request a Booking
          </Link>
        </div>
      </div>
    </section>
  );
}
