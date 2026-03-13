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
  const faqSchemaOrgJSONLD = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqPage.faqItems.map((faqItem) => ({
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
          <FAQSection faqPage={faqPage} />
        </div>
      </section>
    </>
  );
}
