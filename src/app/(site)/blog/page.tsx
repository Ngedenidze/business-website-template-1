import Link from "next/link";
import { createPageMetadata } from "@/lib/metadata";
import { BOOKING_PATH, SITE_URL } from "@/lib/site";
import { resolveImageUrl } from "@/lib/resolve-image-url";
import { getBlogIndexData } from "@/sanity/data";

export async function generateMetadata() {
  const { seo } = await getBlogIndexData();

  return createPageMetadata({
    title: seo.metaTitle || "Event Rental Blog in Caldwell, NJ | Planning Tips",
    description: seo.metaDescription,
    path: "/blog",
  });
}

function formatPublishDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function BlogPage() {
  const { blogPosts } = await getBlogIndexData();
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
        name: "Blog",
        item: `${SITE_URL}/blog`,
      },
    ],
  };
  const collectionSchemaOrgJSONLD = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Event Rental Blog in Caldwell, NJ",
    url: `${SITE_URL}/blog`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchemaOrgJSONLD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchemaOrgJSONLD) }}
      />
      <section className="section">
        <div className="page-wrap">
          <header className="section-head left-aligned packages-pricing-head">
            <p className="eyebrow">Blog</p>
            <h1>Event Rental Tips &amp; Planning Blog</h1>
            <p>
              Practical planning tips for tents, tables, chairs, weather prep,
              and smoother event-day setup in Caldwell, NJ and nearby towns.
            </p>
          </header>

          <div className="button-row" style={{ justifyContent: "flex-start", marginTop: "-1rem" }}>
            <Link className="button button-primary" href={BOOKING_PATH}>
              Request Your Event Date
            </Link>
            <Link className="button button-secondary" href="/packages">
              Compare Packages
            </Link>
            <Link className="button button-secondary" href="/service-areas">
              View Service Areas
            </Link>
          </div>

          {blogPosts.length > 0 ? (
            <div className="card-grid" style={{ marginTop: "2rem" }}>
              {blogPosts.map((post) => {
                const imageUrl = resolveImageUrl(post.featuredImage, {
                  width: 1200,
                  height: 800,
                });
                return (
                  <article key={post._id} className="card">
                    {imageUrl ? (
                      <div className="card-media">
                        <img
                          src={imageUrl}
                          alt={post.featuredImage?.alt?.trim() || post.title}
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    ) : null}
                    <div className="card-body">
                      <p className="service-area-county">
                        {formatPublishDate(post.publishDate)}
                        {post.topic ? ` · ${post.topic}` : ""}
                        {post.readTime ? ` · ${post.readTime}` : ""}
                      </p>
                      <h2>{post.title}</h2>
                      <p>{post.excerpt}</p>
                      <Link href={`/blog/${post.slug.current}`}>Read Article</Link>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="section-surface" style={{ textAlign: "left" }}>
              <h2 style={{ marginBottom: "0.8rem" }}>Blog Articles Coming Soon</h2>
              <p>
                We&apos;re preparing local event-planning guides for Caldwell, NJ.
                In the meantime, you can compare packages and request your date.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
