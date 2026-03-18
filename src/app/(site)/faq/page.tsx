import Link from "next/link";
import { FAQSection } from "@/components/faq-section";
import { createPageMetadata } from "@/lib/metadata";
import { getFaqPageData } from "@/sanity/data";

export async function generateMetadata() {
  const { seo } = await getFaqPageData();

  return createPageMetadata({
    title: seo.metaTitle || "Frequently Asked Questions",
    description:
      seo.metaDescription ||
      "Read answers to common questions about booking, delivery, setup, and event rental policies.",
    path: "/faq",
  });
}

export default async function FAQPage() {
  const { faqPage } = await getFaqPageData();
  const hasLocalIntro =
    typeof faqPage.introText === "string" &&
    /caldwell|new jersey|\bnj\b/i.test(faqPage.introText);
  const localizedFaqPage = {
    ...faqPage,
    introText:
      hasLocalIntro
        ? faqPage.introText
        : `${faqPage.introText || "Answers to common questions about booking, delivery, setup, and event rental policies."} This FAQ is tailored for Caldwell, NJ and nearby towns.`,
  };
  const faqSchemaOrgJSONLD = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: localizedFaqPage.faqItems.map((faqItem) => ({
      "@type": "Question",
      name: faqItem.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faqItem.answer,
      },
    })),
  };

  return (
    <>
      {faqPage.faqItems.length > 0 ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchemaOrgJSONLD) }}
        />
      ) : null}

      <section className="section">
        <div className="page-wrap">
          <FAQSection faqPage={localizedFaqPage} />
          <div className="button-row" style={{ justifyContent: "flex-start", marginTop: "2rem" }}>
            <Link className="button button-primary" href="/booking-request">
              Request Your Event Date
            </Link>
            <Link className="button button-secondary" href="/packages">
              Compare Packages
            </Link>
            <Link className="button button-secondary" href="/service-areas">
              View Service Areas
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
