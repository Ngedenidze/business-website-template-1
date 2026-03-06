import { SanityImage } from "@/components/sanity-image";
import { createPageMetadata } from "@/lib/metadata";
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

  return (
    <section className="section">
      <div className="page-wrap">
        <div className="section-head">
          <span className="eyebrow">Portfolio</span>
          <h1>Event Setup Gallery</h1>
          <p>
            Browse photo examples from real weddings, birthdays, and celebrations to picture
            your layout.
          </p>
        </div>

        <div className="gallery-grid gallery-grid-page">
          {galleryItems.map((galleryItem) => (
            <figure key={galleryItem._id} className="gallery-item">
              <div className="gallery-media">
                <SanityImage
                  image={galleryItem.eventPhoto}
                  alt={galleryItem.title || "Event rental setup photo"}
                  width={960}
                  height={720}
                  fallbackLabel="Gallery image placeholder"
                />
              </div>
              <figcaption className="gallery-caption">
                {galleryItem.title ? <strong>{galleryItem.title}</strong> : null}
                {galleryItem.caption ? <span>{galleryItem.caption}</span> : null}
                {galleryItem.eventType ? <span className="gallery-event-tag">{galleryItem.eventType}</span> : null}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
