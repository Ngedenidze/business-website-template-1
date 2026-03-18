"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowRight, ChevronLeft, Search } from "lucide-react";

type ServiceAreaDirectoryItem = {
  _id: string;
  county: string;
  townName: string;
  shortDescription: string;
  distanceFromCaldwellMiles?: number;
  estimatedDeliveryFee?: string | null;
  matchedDeliveryTier?: string | null;
  slug: {
    current: string;
  };
};

type ServiceAreasBrowserProps = {
  serviceAreas: ServiceAreaDirectoryItem[];
  selectedCountyQuery?: string | null;
  selectedSortQuery?: string | null;
};

type SortOption = "default" | "alphabetical" | "distance";

function normalizeSortOption(value: string | null | undefined): SortOption {
  if (value === "alphabetical" || value === "distance") {
    return value;
  }

  return "default";
}

function buildServiceAreasHref(county: string | null, sort: SortOption) {
  const params = new URLSearchParams();
  if (county) {
    params.set("county", county);
  }
  if (sort !== "default") {
    params.set("sort", sort);
  }

  const queryString = params.toString();
  return queryString.length > 0 ? `/service-areas?${queryString}` : "/service-areas";
}

export function ServiceAreasBrowser({
  serviceAreas,
  selectedCountyQuery,
  selectedSortQuery,
}: ServiceAreasBrowserProps) {
  const router = useRouter();
  const [countySearch, setCountySearch] = useState("");
  const [townSearchByCounty, setTownSearchByCounty] = useState<Record<string, string>>({});
  const selectedSort = normalizeSortOption(selectedSortQuery);

  const serviceAreasByCounty = useMemo(() => {
    return serviceAreas.reduce<Record<string, ServiceAreaDirectoryItem[]>>((groups, serviceArea) => {
      const county = serviceArea.county || "Other Service Areas";
      if (!groups[county]) {
        groups[county] = [];
      }
      groups[county].push(serviceArea);
      return groups;
    }, {});
  }, [serviceAreas]);

  const countyEntries = useMemo(() => {
    return Object.entries(serviceAreasByCounty)
      .map(([county, towns]) => ({
        county,
        towns: [...towns].sort((left, right) => left.townName.localeCompare(right.townName)),
      }))
      .sort((left, right) => left.county.localeCompare(right.county));
  }, [serviceAreasByCounty]);

  const visibleCounties = useMemo(() => {
    const normalizedSearch = countySearch.trim().toLowerCase();
    if (!normalizedSearch) {
      return countyEntries;
    }

    return countyEntries.filter(({ county, towns }) => {
      if (county.toLowerCase().includes(normalizedSearch)) {
        return true;
      }

      return towns.some((town) => town.townName.toLowerCase().includes(normalizedSearch));
    });
  }, [countyEntries, countySearch]);

  const selectedCounty = useMemo(() => {
    if (!selectedCountyQuery) {
      return null;
    }

    const matchedCounty = countyEntries.find((entry) => entry.county === selectedCountyQuery);
    return matchedCounty ? matchedCounty.county : null;
  }, [countyEntries, selectedCountyQuery]);
  const townSearch = selectedCounty ? townSearchByCounty[selectedCounty] ?? "" : "";

  const selectedCountyTowns = useMemo(() => {
    if (!selectedCounty) {
      return [];
    }

    const towns = serviceAreasByCounty[selectedCounty] ?? [];
    const normalizedSearch = townSearch.trim().toLowerCase();

    const filtered = towns.filter((town) => {
      if (!normalizedSearch) {
        return true;
      }

      return (
        town.townName.toLowerCase().includes(normalizedSearch) ||
        town.shortDescription.toLowerCase().includes(normalizedSearch) ||
        town.county.toLowerCase().includes(normalizedSearch)
      );
    });

    if (selectedSort === "alphabetical") {
      return [...filtered].sort((left, right) => left.townName.localeCompare(right.townName));
    }

    if (selectedSort === "distance") {
      return [...filtered].sort((left, right) => {
        const leftMiles = left.distanceFromCaldwellMiles;
        const rightMiles = right.distanceFromCaldwellMiles;
        const leftHasMiles = typeof leftMiles === "number";
        const rightHasMiles = typeof rightMiles === "number";

        if (leftHasMiles && rightHasMiles) {
          if (leftMiles !== rightMiles) {
            return leftMiles - rightMiles;
          }
          return left.townName.localeCompare(right.townName);
        }

        if (leftHasMiles) return -1;
        if (rightHasMiles) return 1;
        return left.townName.localeCompare(right.townName);
      });
    }

    return filtered;
  }, [selectedCounty, selectedSort, serviceAreasByCounty, townSearch]);

  if (!selectedCounty) {
    return (
      <div className="service-directory-shell service-directory-shell-county">
        <div className="service-directory-tools service-directory-tools-county">
          <h2>Select a County</h2>
          <p>Choose a county first, then browse towns we serve in that area.</p>
          <label className="service-search-control">
            <span className="sr-only">Search counties</span>
            <Search className="service-search-icon" size={16} aria-hidden="true" />
            <input
              type="search"
              value={countySearch}
              onChange={(event) => setCountySearch(event.target.value)}
              placeholder="Search counties or towns"
              className="service-search-input"
            />
          </label>
        </div>

        <div className="service-county-grid">
          {visibleCounties.map(({ county, towns }) => (
            <Link
              key={county}
              className="service-county-card"
              href={buildServiceAreasHref(county, selectedSort)}
            >
              <h3 className="service-county-title">{county}</h3>
              <span className="service-county-count">{towns.length} towns</span>
              <span className="service-county-preview">
                Includes {towns.slice(0, 3).map((town) => town.townName).join(", ")}
              </span>
              <span className="service-county-linkcue">
                Browse towns
                <ArrowRight size={14} aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>

        {visibleCounties.length === 0 ? (
          <p className="form-helper">No counties matched that search. Try a different term.</p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="service-directory-shell service-directory-shell-town">
      <div className="service-directory-tools">
        <Link
          href={buildServiceAreasHref(null, selectedSort)}
          className="button button-secondary service-back-button"
        >
          <ChevronLeft size={16} aria-hidden="true" />
          Back to Counties
        </Link>
        <h2>{selectedCounty}</h2>
        <p>{selectedCountyTowns.length} towns match your current search.</p>
        <div className="service-directory-filters">
          <label className="service-search-control">
            <span className="sr-only">Search towns</span>
            <Search className="service-search-icon" size={16} aria-hidden="true" />
            <input
              type="search"
              value={townSearch}
              onChange={(event) => {
                if (!selectedCounty) {
                  return;
                }

                setTownSearchByCounty((previous) => ({
                  ...previous,
                  [selectedCounty]: event.target.value,
                }));
              }}
              placeholder={`Search towns in ${selectedCounty}`}
              className="service-search-input"
            />
          </label>

          <label className="service-directory-sort">
            <span>Sort towns</span>
            <select
              value={selectedSort}
              onChange={(event) => {
                const nextSort = normalizeSortOption(event.target.value);
                const nextHref = buildServiceAreasHref(selectedCounty, nextSort);
                router.push(nextHref);
              }}
              className="service-sort-select"
            >
              <option value="default">Default</option>
              <option value="alphabetical">Alphabetical (A-Z)</option>
              <option value="distance">Distance from Caldwell</option>
            </select>
          </label>
        </div>
      </div>

      <div className="service-grid">
        {selectedCountyTowns.map((serviceArea) => (
          <article key={serviceArea._id} className="service-area-card">
            <p className="service-area-county">{serviceArea.county}</p>
            <h3>{serviceArea.townName}</h3>
            <p>{serviceArea.shortDescription}</p>
            <p className="service-area-delivery-fee">
              Estimated delivery fee:{" "}
              {serviceArea.estimatedDeliveryFee ?? "We will confirm with your quote"}
            </p>
            {typeof serviceArea.distanceFromCaldwellMiles === "number" ? (
              <p className="service-area-delivery-note">
                Caldwell distance: {serviceArea.distanceFromCaldwellMiles.toFixed(1)} miles
                {serviceArea.matchedDeliveryTier
                  ? ` · Tier ${serviceArea.matchedDeliveryTier}`
                  : ""}
              </p>
            ) : null}
            <Link href={`/service-areas/${serviceArea.slug.current}`}>
              View service area
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </article>
        ))}
      </div>

      {selectedCountyTowns.length === 0 ? (
        <p className="form-helper">No towns matched your search in this county.</p>
      ) : null}
    </div>
  );
}
