import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

type FooterServiceArea = {
  _id: string;
  townName: string;
  slug: { current: string };
};

type SiteFooterProps = {
  businessName?: string;
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
  phoneNumber,
  emailAddress,
  addressOrServiceBase,
  hours,
  instagramUrl,
  facebookUrl,
  serviceAreas,
}: SiteFooterProps) {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-col">
          <h4>{businessName ?? SITE_NAME}</h4>
          <p>
            Tents, tables, chairs, and bundled event setups for weddings, parties, and family
            gatherings.
          </p>
          {phoneNumber ? <a href={toTelLink(phoneNumber)}>{phoneNumber}</a> : null}
          {emailAddress ? <a href={`mailto:${emailAddress}`}>{emailAddress}</a> : null}
          {addressOrServiceBase ? <p>{addressOrServiceBase}</p> : null}
          {hours ? <p>{hours}</p> : null}
        </div>

        <div className="footer-col">
          <h4>Service Areas</h4>
          <ul className="footer-list">
            {serviceAreas.slice(0, 8).map((serviceArea) => (
              <li key={serviceArea._id}>
                <Link href={`/service-areas/${serviceArea.slug.current}`}>
                  Event rentals in {serviceArea.townName}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-col">
          <h4>Follow Along</h4>
          <p>Social links can be updated in your studio when your pages are ready.</p>
          {instagramUrl ? (
            <a href={instagramUrl} target="_blank" rel="noreferrer">
              Instagram
            </a>
          ) : null}
          {facebookUrl ? (
            <a href={facebookUrl} target="_blank" rel="noreferrer">
              Facebook
            </a>
          ) : null}
          <Link href="/booking-request">Request a Booking</Link>
        </div>
      </div>
    </footer>
  );
}
