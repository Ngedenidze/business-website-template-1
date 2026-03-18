import Link from "next/link";
import { createPageMetadata } from "@/lib/metadata";
import { resolveImageUrl } from "@/lib/resolve-image-url";
import { SITE_URL } from "@/lib/site";
import { urlFor } from "@/sanity/image";
import { getGalleryPageData } from "@/sanity/data";

export async function generateMetadata() {
  const { seo } = await getGalleryPageData();

  return createPageMetadata({
    title: seo?.metaTitle || "Event Setup Gallery",
    description:
      seo?.metaDescription ||
      "View event setup photos for tents, tables, chairs, and bundled party rental layouts.",
    path: "/gallery",
  });
}

export default async function GalleryPage() {
  const { galleryItems } = await getGalleryPageData();
  const breadcrumbSchemaOrgJSONLD = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${SITE_URL}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Gallery",
        item: `${SITE_URL}/gallery`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchemaOrgJSONLD) }}
      />
      <section className="section">
        <div className="page-wrap">
          <div className="section-head left-aligned packages-pricing-head">
            <span className="eyebrow">Portfolio</span>
            <h1>Caldwell, NJ Event Rental Gallery</h1>
            <p>
              See real tent, table, and chair rental setups for backyard parties, birthdays, and
              receptions in Caldwell and nearby towns.
            </p>
          </div>
          <div className="gallery-grid gallery-grid-page">
            {galleryItems.map((galleryItem) => {
              const imageUrl = resolveImageUrl(galleryItem.eventPhoto, {
                width: 1920,
                height: 1440,
              });
              const imageAlt = galleryItem.eventPhoto?.alt?.trim()
                || galleryItem.title
                || "Event rental setup in Caldwell, NJ";
              const imageRef = galleryItem.eventPhoto?.asset?._ref;
              const srcSet = imageRef
                ? [480, 768, 1200, 1600]
                  .map((width) => {
                    const sizedUrl = urlFor(galleryItem.eventPhoto)
                      .width(width)
                      .height(Math.round((width * 3) / 4))
                      .fit("crop")
                      .auto("format")
                      .url();
                    return `${sizedUrl} ${width}w`;
                  })
                  .join(", ")
                : undefined;

              return (
                <figure key={galleryItem._id} className="gallery-item">
                  <div className="gallery-media">
                    {imageUrl ? (
                      <div className="media-frame">
                        <img
                          src={imageUrl}
                          srcSet={srcSet}
                          sizes="(max-width: 560px) 100vw, (max-width: 768px) 50vw, 33vw"
                          alt={imageAlt}
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    ) : (
                      <div className="media-frame">
                        <div className="media-placeholder">Gallery image placeholder</div>
                      </div>
                    )}
                  </div>
                  <figcaption className="gallery-caption">
                    {galleryItem.title ? <strong>{galleryItem.title}</strong> : null}
                    {galleryItem.caption ? <span>{galleryItem.caption}</span> : null}
                    {galleryItem.eventType ? <span className="gallery-event-tag">{galleryItem.eventType}</span> : null}
                  </figcaption>
                </figure>
              );
            })}
          </div>

          <div className="button-row" style={{ justifyContent: "flex-start", marginTop: "2rem" }}>
            <Link className="button button-primary" href="/booking-request">
              Request Your Event Date
            </Link>
            <Link className="button button-secondary" href="/contact">
              Contact Us
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
