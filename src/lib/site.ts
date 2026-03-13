export const SITE_NAME = "Spirit Event Rentals";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://example.com";

export const DEFAULT_META_DESCRIPTION =
  "Tent, table, chair, and package rentals in Caldwell, NJ and nearby towns for weddings, birthdays, and backyard events.";

export const NAV_LINKS = [
  { href: "/packages", label: "Packages" },
  { href: "/gallery", label: "Gallery" },
  { href: "/service-areas", label: "Service Areas" },
  { href: "/faq", label: "FAQ" },
  { href: "/policy", label: "Policy" },
  { href: "/contact", label: "Contact" },
];

export const BOOKING_PATH = "/booking-request";
