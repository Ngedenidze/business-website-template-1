import Link from "next/link";
import { Facebook, Instagram } from "lucide-react";
import { SITE_NAME } from "@/lib/site";
import { urlFor } from "@/sanity/image";
import type { SanityImageWithAlt } from "@/sanity/types";

type FooterServiceArea = {
  _id: string;
  county: string;
};

type SiteFooterProps = {
  businessName?: string;
  businessLogo?: SanityImageWithAlt | null;
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
  const hasSocials = Boolean(instagramUrl || facebookUrl);
  const logoUrl = businessLogo?.asset
    ? urlFor(businessLogo).width(420).height(140).fit("max").auto("format").url()
    : null;
  const counties = Array.from(
    new Set(
      serviceAreas
        .map((serviceArea) => serviceArea.county?.trim())
        .filter((county): county is string => Boolean(county)),
    ),
  ).sort((left, right) => left.localeCompare(right));
  const visibleCounties = counties.slice(0, 4);

  return (
    <footer className="footer">
      <div className={`footer-inner ${hasSocials ? "footer-inner-with-socials" : ""}`}>
        <div className="footer-col" style={{ paddingRight: "2rem" }}>
          <div className="footer-brand">
            <div className="footer-brand-icon">
              {logoUrl ? (
                <img src={logoUrl} alt={`${name} logo`} />
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
          </div>
          <p>
            Premium event setups including tents, tables, and chairs for
            weddings, backyard parties, and local celebrations.
          </p>
          <div className="footer-contact-links">
            {phoneNumber ? (
              <a href={toTelLink(phoneNumber)}>
                {phoneNumber} <span className="footer-arrow" aria-hidden="true">→</span>
              </a>
            ) : null}
            {emailAddress ? (
              <a href={`mailto:${emailAddress}`}>
                {emailAddress} <span className="footer-arrow" aria-hidden="true">→</span>
              </a>
            ) : null}
          </div>
        </div>

        <div className="footer-col">
          <h4>Service Areas</h4>
          <ul className="footer-list">
            {visibleCounties.map((county) => (
              <li key={county}>
                <Link href={`/service-areas?county=${encodeURIComponent(county)}`}>
                  {county}
                </Link>
              </li>
            ))}
          </ul>
          <Link className="footer-view-all-link" href="/service-areas">
            View All Areas <span className="footer-arrow" aria-hidden="true">→</span>
          </Link>
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
              <Link href="/faq">FAQ</Link>
            </li>
            <li>
              <Link href="/contact">Contact Us</Link>
            </li>
          </ul>
        </div>

        {hasSocials ? (
          <div className="footer-col">
            <h4>Social</h4>
            <div className="footer-socials">
              {instagramUrl ? (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                >
                  <Instagram size={20} />
                  Instagram
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
                  Facebook
                </a>
              ) : null}
            </div>
          </div>
        ) : null}
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
