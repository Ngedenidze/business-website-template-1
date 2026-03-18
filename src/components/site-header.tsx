import Link from "next/link";
import { Menu } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { urlFor } from "@/sanity/image";
import type { SanityImageWithAlt } from "@/sanity/types";
import { BOOKING_PATH, SITE_NAME, type NavLink } from "@/lib/site";

type SiteHeaderProps = {
  businessName?: string;
  businessLogo?: SanityImageWithAlt | null;
  navLinks: NavLink[];
};

export function SiteHeader({ businessName, businessLogo, navLinks }: SiteHeaderProps) {
  const resolvedBusinessName = businessName?.trim() || SITE_NAME;
  const logoUrl = businessLogo?.asset
    ? urlFor(businessLogo).width(480).height(150).fit("max").auto("format").url()
    : null;
  const logoAlt = businessLogo?.alt?.trim() || `${resolvedBusinessName} logo`;

  return (
    <header className="site-header">
      <div className="site-header-shell">
        <div className="site-header-inner">
          <Link className="brand-mark" href="/" aria-label={`${resolvedBusinessName} home`}>
            <span className="brand-icon" aria-hidden="true">
              <BrandLogo logoUrl={logoUrl} alt={logoAlt} width={100} height={32} />
            </span>
          </Link>

          <nav className="main-nav" aria-label="Main navigation">
            <ul className="nav-list">
              {navLinks.map((link) => (
                <li key={link.href} className="nav-item">
                  <Link className="nav-link" href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="header-actions">
            <Link className="primary-cta button button-primary desktop-only" href={BOOKING_PATH}>
              Request a Booking
            </Link>

            <details className="mobile-nav">
              <summary aria-label="Toggle navigation menu">
                <Menu size={18} />
                <span className="mobile-nav-label">Menu</span>
              </summary>
              <div className="mobile-nav-panel">
                {navLinks.map((link) => (
                  <Link key={link.href} className="mobile-nav-link" href={link.href}>
                    {link.label}
                  </Link>
                ))}
                <hr className="mobile-nav-divider" />
                <Link className="button button-primary" href={BOOKING_PATH}>
                  Request a Booking
                </Link>
              </div>
            </details>
          </div>
        </div>
      </div>
    </header>
  );
}
