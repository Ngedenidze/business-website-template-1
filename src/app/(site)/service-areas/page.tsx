import { ServiceAreasBrowser } from "@/components/service-areas-browser";
import { createPageMetadata } from "@/lib/metadata";
import { SITE_URL } from "@/lib/site";
import { getPolicyPageData, getServiceAreasPageData } from "@/sanity/data";

type DeliveryFeeOption = {
  distance: string;
  fee: string;
};

type ParsedDeliveryTier = {
  label: string;
  feeLabel: string;
  minMiles: number;
  maxMiles: number | null;
};

function parseDeliveryTier(row: DeliveryFeeOption): ParsedDeliveryTier | null {
  const numericTokens = row.distance.match(/\d+(?:\.\d+)?/g) ?? [];
  if (numericTokens.length === 0) {
    return null;
  }

  const numbers = numericTokens.map((token) => Number.parseFloat(token));
  if (numbers.some((value) => !Number.isFinite(value))) {
    return null;
  }

  const hasOpenEndedMax = row.distance.includes("+");
  if (hasOpenEndedMax) {
    return {
      label: row.distance,
      feeLabel: row.fee,
      minMiles: numbers[0],
      maxMiles: null,
    };
  }

  if (numbers.length === 1) {
    return {
      label: row.distance,
      feeLabel: row.fee,
      minMiles: 0,
      maxMiles: numbers[0],
    };
  }

  return {
    label: row.distance,
    feeLabel: row.fee,
    minMiles: Math.min(numbers[0], numbers[1]),
    maxMiles: Math.max(numbers[0], numbers[1]),
  };
}

function resolveDeliveryTierForMiles(
  miles: number,
  tiers: ParsedDeliveryTier[],
): ParsedDeliveryTier | null {
  const sortedTiers = [...tiers].sort(
    (left, right) => left.minMiles - right.minMiles,
  );

  for (const tier of sortedTiers) {
    const withinLowerBound = miles >= tier.minMiles;
    const withinUpperBound = tier.maxMiles === null || miles <= tier.maxMiles;
    if (withinLowerBound && withinUpperBound) {
      return tier;
    }
  }

  return null;
}

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
  const [{ serviceAreas }, { businessInfo }] = await Promise.all([
    getServiceAreasPageData(),
    getPolicyPageData(),
  ]);
  const parsedDeliveryTiers = (businessInfo.deliveryFees ?? [])
    .map(parseDeliveryTier)
    .filter((tier): tier is ParsedDeliveryTier => tier !== null);

  const directoryItems = serviceAreas.map((serviceArea) => {
    const matchedTier =
      typeof serviceArea.distanceFromCaldwellMiles === "number"
        ? resolveDeliveryTierForMiles(
            serviceArea.distanceFromCaldwellMiles,
            parsedDeliveryTiers,
          )
        : null;

    return {
      _id: serviceArea._id,
      county: serviceArea.county,
      townName: serviceArea.townName,
      shortDescription: serviceArea.shortDescription,
      slug: serviceArea.slug,
      distanceFromCaldwellMiles: serviceArea.distanceFromCaldwellMiles,
      estimatedDeliveryFee: matchedTier?.feeLabel ?? null,
      matchedDeliveryTier: matchedTier?.label ?? null,
    };
  });

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
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchemaOrgJSONLD) }}
      />

      <section className="section">
        <div className="page-wrap">
          <header className="section-head left-aligned packages-pricing-head">
            <p className="eyebrow">Service Areas</p>
            <h1>Event Rentals in Nearby Towns</h1>
            <p>
              We provide tent rentals, table and chair rentals, and package setups
              across county-based coverage areas around Caldwell, NJ.
            </p>
          </header>

          <ServiceAreasBrowser serviceAreas={directoryItems} selectedCountyQuery={selectedCountyQuery} />
        </div>
      </section>
    </>
  );
}
