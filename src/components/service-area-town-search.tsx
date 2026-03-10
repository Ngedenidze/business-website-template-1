"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type TownDirectoryItem = {
  _id: string;
  county: string;
  townName: string;
  slug: {
    current: string;
  };
};

type ServiceAreaTownSearchProps = {
  currentTownSlug: string;
  currentCounty: string;
  towns: TownDirectoryItem[];
};

export function ServiceAreaTownSearch({
  currentTownSlug,
  currentCounty,
  towns,
}: ServiceAreaTownSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const visibleTowns = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const withoutCurrentTown = towns.filter((town) => town.slug.current !== currentTownSlug);

    if (!normalizedSearch) {
      return withoutCurrentTown
        .filter((town) => town.county === currentCounty)
        .sort((left, right) => left.townName.localeCompare(right.townName))
        .slice(0, 24);
    }

    return withoutCurrentTown
      .filter(
        (town) =>
          town.townName.toLowerCase().includes(normalizedSearch) ||
          town.county.toLowerCase().includes(normalizedSearch),
      )
      .sort((left, right) => left.townName.localeCompare(right.townName))
      .slice(0, 30);
  }, [currentCounty, currentTownSlug, searchTerm, towns]);

  return (
    <div className="section-surface town-finder-surface">
      <div className="town-finder-head">
        <h2>Find Another Service Town</h2>
        <p>Search by town or county. Start typing to search all areas, or browse this county by default.</p>
      </div>

      <label className="service-search-control">
        <span className="sr-only">Search service towns</span>
        <input
          type="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search towns or counties"
          className="service-search-input"
        />
      </label>

      <div className="town-finder-list">
        {visibleTowns.map((town) => (
          <Link key={town._id} href={`/service-areas/${town.slug.current}`} className="town-finder-item">
            <span className="service-area-county">{town.county}</span>
            <strong>{town.townName}</strong>
          </Link>
        ))}
      </div>

      {visibleTowns.length === 0 ? (
        <p className="form-helper">No towns matched your search.</p>
      ) : null}
    </div>
  );
}
