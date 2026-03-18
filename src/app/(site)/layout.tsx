import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { BASE_NAV_LINKS, BLOG_NAV_LINK, type NavLink } from "@/lib/site";
import { getSiteShellData } from "@/sanity/data";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const shellData = await getSiteShellData();
  const navLinks: NavLink[] = shellData.hasPublishedBlogPosts
    ? [BASE_NAV_LINKS[0], BASE_NAV_LINKS[1], BLOG_NAV_LINK, ...BASE_NAV_LINKS.slice(2)]
    : BASE_NAV_LINKS;

  return (
    <div className="site-shell">
      <SiteHeader
        businessName={shellData.businessInfo?.businessName}
        businessLogo={shellData.businessInfo?.businessLogo}
        navLinks={navLinks}
      />
      <main className="site-main">{children}</main>
      <SiteFooter
        businessName={shellData.businessInfo?.businessName}
        businessLogo={shellData.businessInfo?.businessLogo}
        phoneNumber={shellData.businessInfo?.phoneNumber}
        emailAddress={shellData.businessInfo?.emailAddress}
        addressOrServiceBase={shellData.businessInfo?.addressOrServiceBase}
        hours={shellData.businessInfo?.hours}
        instagramUrl={shellData.businessInfo?.instagramUrl}
        facebookUrl={shellData.businessInfo?.facebookUrl}
        serviceAreas={shellData.serviceAreas}
        navLinks={navLinks}
      />
    </div>
  );
}
