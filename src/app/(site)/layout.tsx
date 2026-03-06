import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSiteShellData } from "@/sanity/data";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const shellData = await getSiteShellData();

  return (
    <div className="site-shell">
      <SiteHeader
        businessName={shellData.businessInfo?.businessName}
        businessLogo={shellData.businessInfo?.businessLogo}
        phoneNumber={shellData.businessInfo?.phoneNumber}
      />
      <main className="site-main">{children}</main>
      <SiteFooter
        businessName={shellData.businessInfo?.businessName}
        phoneNumber={shellData.businessInfo?.phoneNumber}
        emailAddress={shellData.businessInfo?.emailAddress}
        addressOrServiceBase={shellData.businessInfo?.addressOrServiceBase}
        hours={shellData.businessInfo?.hours}
        instagramUrl={shellData.businessInfo?.instagramUrl}
        facebookUrl={shellData.businessInfo?.facebookUrl}
        serviceAreas={shellData.serviceAreas}
      />
    </div>
  );
}
