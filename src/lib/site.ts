export const SITE_NAME = "Spirit Event Rentals";

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
const normalizedConfiguredSiteUrl =
  configuredSiteUrl &&
  !/^https?:\/\/example\.com$/i.test(configuredSiteUrl)
    ? configuredSiteUrl
    : undefined;
const vercelPreviewUrl = process.env.VERCEL_URL?.replace(/\/$/, "");

export const SITE_URL =
  normalizedConfiguredSiteUrl ||
  (vercelPreviewUrl ? `https://${vercelPreviewUrl}` : undefined) ||
  "http://localhost:3000";

export const DEFAULT_META_DESCRIPTION =
  "Tent, table, chair, and package rentals in Caldwell, NJ and nearby towns for weddings, birthdays, and backyard events.";

export type NavLink = {
  href: string;
  label: string;
};

export const BASE_NAV_LINKS: NavLink[] = [
  { href: "/packages", label: "Packages" },
  { href: "/gallery", label: "Gallery" },
  { href: "/service-areas", label: "Service Areas" },
  { href: "/faq", label: "FAQ" },
  { href: "/policy", label: "Policy" },
  { href: "/contact", label: "Contact" },
];

export const BLOG_NAV_LINK: NavLink = { href: "/blog", label: "Blog" };

export const BOOKING_PATH = "/booking-request";
