import Link from "next/link";
import { ArrowRight, Facebook, Instagram } from "lucide-react";
import { SITE_NAME } from "@/lib/site";

type FooterServiceArea = {
  _id: string;
  county: string;
};

type SiteFooterProps = {
  businessName?: string;
  businessLogo?: any;
  phoneNumber?: string;
  emailAddress?: string;
  addressOrServiceBase?: string;
  hours?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  serviceAreas: FooterServiceArea[];
};

function toTelLink(phoneNumber: string): string {
  const normalized = phoneNumber.replace(/[^\d+]/g, "");
  return normalized.length > 0 ? `tel:${normalized}` : "#";
}

export function SiteFooter({
  businessName,
  businessLogo,
  phoneNumber,
  emailAddress,
  addressOrServiceBase,
  hours,
  instagramUrl,
  facebookUrl,
  serviceAreas,
}: SiteFooterProps) {
  const name = businessName ?? SITE_NAME;
  const counties = Array.from(
    new Set(
      serviceAreas
        .map((serviceArea) => serviceArea.county?.trim())
        .filter((county): county is string => Boolean(county)),
    ),
  ).sort((left, right) => left.localeCompare(right));

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-col" style={{ paddingRight: "2rem" }}>
          <div className="footer-brand">
            <div className="footer-brand-icon">
              {businessLogo?.asset ? (
                <img src={businessLogo.asset.url} alt={`${name} logo`} />
              ) : (
                <span
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: 700,
                    color: "var(--accent)",
                  }}
                >
                  {name.charAt(0)}
                </span>
              )}
            </div>
            <span className="footer-title">{name}</span>
          </div>
          <p>
            Premium event setups including tents, tables, and chairs for
            weddings, backyard parties, and local celebrations.
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.25rem",
              marginTop: "0.5rem",
            }}
          >
            {phoneNumber ? (
              <a href={toTelLink(phoneNumber)}>
                {phoneNumber} <ArrowRight size={14} />
              </a>
            ) : null}
            {emailAddress ? (
              <a href={`mailto:${emailAddress}`}>
                {emailAddress} <ArrowRight size={14} />
              </a>
            ) : null}
          </div>
        </div>

        <div className="footer-col">
          <h4>Service Areas</h4>
          <ul className="footer-list">
            {counties.map((county) => (
              <li key={county}>
                <Link
                  href={`/service-areas?county=${encodeURIComponent(county)}`}
                >
                  {county}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/service-areas"
                style={{ color: "#fff", fontWeight: 600 }}
              >
                View All Areas <ArrowRight size={14} />
              </Link>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Company</h4>
          <ul className="footer-list">
            <li>
              <Link href="/booking-request">Start a Quote</Link>
            </li>
            <li>
              <Link href="/packages">View Packages</Link>
            </li>
            <li>
              <Link href="/gallery">Event Gallery</Link>
            </li>
            <li>
              <Link href="/policy">Rental Policy</Link>
            </li>
            <li>
              <Link href="/contact">Contact Us</Link>
            </li>
          </ul>

          {(instagramUrl || facebookUrl) && (
            <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
              {instagramUrl ? (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                >
                  <Instagram size={20} />
                </a>
              ) : null}
              {facebookUrl ? (
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                >
                  <Facebook size={20} />
                </a>
              ) : null}
            </div>
          )}
        </div>
      </div>

      <div className="footer-bottom">
        <span className="footer-credits">
          &copy; {new Date().getFullYear()} {name}. All rights reserved.
        </span>
        <span className="footer-credits">
          {addressOrServiceBase} {hours ? `• ${hours}` : ""}
        </span>
      </div>
    </footer>
  );
}
