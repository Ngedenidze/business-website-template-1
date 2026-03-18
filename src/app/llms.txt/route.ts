import { SITE_URL } from "@/lib/site";

export async function GET() {
  const body = [
    "Site: Spirit Event Rentals",
    "Primary geography: Caldwell, NJ and nearby towns",
    `Canonical site URL: ${SITE_URL}`,
    "",
    "Key pages:",
    `- Home: ${SITE_URL}/`,
    `- Packages: ${SITE_URL}/packages`,
    `- Gallery: ${SITE_URL}/gallery`,
    `- Booking Request: ${SITE_URL}/booking-request`,
    `- Service Areas: ${SITE_URL}/service-areas`,
    `- FAQ: ${SITE_URL}/faq`,
    `- Policy: ${SITE_URL}/policy`,
    `- Contact: ${SITE_URL}/contact`,
    "",
    "Primary conversion page: /booking-request",
    "Primary trust pages: /policy, /faq, /gallery",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
