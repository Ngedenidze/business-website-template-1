import type { FAQPage } from "@/sanity/types";

type FAQSectionProps = {
  faqPage: FAQPage;
};

export function FAQSection({ faqPage }: FAQSectionProps) {
  if (!Array.isArray(faqPage.faqItems) || faqPage.faqItems.length === 0) {
    return null;
  }

  return (
    <section className="section section-tight faq-section" aria-labelledby="policy-faq-heading">
      <div className="section-head left-aligned">
        {faqPage.eyebrow ? <p className="eyebrow">{faqPage.eyebrow}</p> : null}
        <h2 id="policy-faq-heading">{faqPage.title}</h2>
        {faqPage.introText ? <p>{faqPage.introText}</p> : null}
      </div>

      <div className="faq-grid">
        {faqPage.faqItems.map((item) => (
          <details key={`${item.question}-${item.answer.slice(0, 20)}`} className="faq-item">
            <summary className="faq-question">
              <span>{item.question}</span>
            </summary>
            <div className="faq-answer">
              <p>{item.answer}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
