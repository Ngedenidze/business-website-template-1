"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";

type PolicySection = {
  sectionTitle: string;
  bulletPoints: string[];
  note?: string;
};

type FeeRow = {
  distance?: string;
  fee?: string;
  tent?: string;
  setupFee?: string;
};

type PolicyBrowserProps = {
  sections: PolicySection[];
  deliveryFees: FeeRow[];
  setupFees: FeeRow[];
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
}

export function PolicyBrowser({
  sections,
  deliveryFees,
  setupFees,
}: PolicyBrowserProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sections;
    const query = searchQuery.toLowerCase();

    return sections.filter((section) => {
      if (section.sectionTitle.toLowerCase().includes(query)) return true;
      if (section.note && section.note.toLowerCase().includes(query))
        return true;
      if (section.bulletPoints.some((bp) => bp.toLowerCase().includes(query)))
        return true;
      return false;
    });
  }, [sections, searchQuery]);

  const showFees = deliveryFees.length > 0 || setupFees.length > 0;
  const feesIncluded =
    !searchQuery.trim() ||
    "delivery fees setup fees".includes(searchQuery.toLowerCase());

  return (
    <div className="policy-split">
      {/* Main Content Area */}
      <div className="policy-main">
        <div className="policy-surface">
          {filteredSections.length > 0 ? (
            <div className="booking-policy-list">
              {filteredSections.map((section) => (
                <article
                  key={section.sectionTitle}
                  id={slugify(section.sectionTitle)}
                  className="booking-policy-item"
                >
                  <div className="policy-card-content">
                    <div className="policy-card-header">
                      <h2>{section.sectionTitle}</h2>
                    </div>
                    <div className="policy-card-body">
                      <ul className="list-clean">
                        {section.bulletPoints.map((point) => (
                          <li key={point}>{point}</li>
                        ))}
                      </ul>
                      {section.note ? (
                        <p className="booking-policy-note">{section.note}</p>
                      ) : null}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="policy-empty-state">
              <p>
                No policy sections match <strong>{searchQuery}</strong>.
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="button button-secondary"
                style={{ marginTop: "1rem" }}
              >
                Clear Search
              </button>
            </div>
          )}
        </div>

        {showFees && feesIncluded ? (
          <div
            id="fees"
            className="policy-pricing-surface"
            style={{ marginTop: "3rem" }}
          >
            <h2>Delivery and Setup Fees</h2>
            <p>
              Reference pricing for delivery distance and tent setup support.
            </p>

            <div className="policy-pricing-grid">
              {deliveryFees.length > 0 ? (
                <article className="policy-pricing-card">
                  <div className="policy-card-content">
                    <div className="policy-card-header">
                      <h3>Delivery Fees</h3>
                    </div>
                    <div className="policy-card-body">
                      <table className="policy-price-table">
                        <thead>
                          <tr>
                            <th scope="col">Distance</th>
                            <th scope="col">Fee</th>
                          </tr>
                        </thead>
                        <tbody>
                          {deliveryFees.map((row) => (
                            <tr key={`${row.distance}-${row.fee}`}>
                              <td>{row.distance}</td>
                              <td>{row.fee}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </article>
              ) : null}

              {setupFees.length > 0 ? (
                <article className="policy-pricing-card">
                  <div className="policy-card-content">
                    <div className="policy-card-header">
                      <h3>Setup Fees</h3>
                    </div>
                    <div className="policy-card-body">
                      <table className="policy-price-table">
                        <thead>
                          <tr>
                            <th scope="col">Tent</th>
                            <th scope="col">Setup Fee</th>
                          </tr>
                        </thead>
                        <tbody>
                          {setupFees.map((row) => (
                            <tr key={`${row.tent}-${row.setupFee}`}>
                              <td>{row.tent}</td>
                              <td>{row.setupFee}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </article>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>

      {/* Sidebar with Search and TOC */}
      <aside className="policy-sidebar">
        <div className="policy-sidebar-sticky">
          <div className="policy-search-container">
            <Search className="policy-search-icon" size={18} />
            <input
              type="search"
              placeholder="Search policies..."
              className="policy-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <nav className="policy-toc">
            <h4 className="policy-toc-title">Quick Links</h4>
            <ul className="policy-toc-list">
              {sections.map((section) => (
                <li key={section.sectionTitle}>
                  <a href={`#${slugify(section.sectionTitle)}`}>
                    {section.sectionTitle}
                  </a>
                </li>
              ))}
              {showFees && (
                <li>
                  <a href="#fees">Delivery and Setup Fees</a>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </aside>
    </div>
  );
}
