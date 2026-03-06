export const SITE_NAME = "Willow & Canvas Event Rentals";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://example.com";

export const DEFAULT_META_DESCRIPTION =
  "Tent, table, chair, and package rentals for weddings, birthdays, and backyard events across nearby towns.";

export const NAV_LINKS = [
  { href: "/packages", label: "Packages" },
  { href: "/gallery", label: "Gallery" },
  { href: "/service-areas", label: "Service Areas" },
  { href: "/contact", label: "Contact" },
];

export const BOOKING_PATH = "/booking-request";
