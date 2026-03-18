import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BlogRichText } from "@/components/blog-rich-text";
import { createPageMetadata } from "@/lib/metadata";
import { BOOKING_PATH, SITE_URL } from "@/lib/site";
import { resolveImageUrl } from "@/lib/resolve-image-url";
import { getBlogPostBySlug, getBlogPostSlugs } from "@/sanity/data";

type BlogPostPageParams = {
  slug: string;
};

export async function generateStaticParams() {
  const slugs = await getBlogPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<BlogPostPageParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const blogPost = await getBlogPostBySlug(slug);

  if (!blogPost) {
    return createPageMetadata({
      title: "Blog Post",
      description: "Event rental planning insights for Caldwell, NJ.",
      path: `/blog/${slug}`,
    });
  }

  return createPageMetadata({
    title: blogPost.seo?.metaTitle || blogPost.title,
    description: blogPost.seo?.metaDescription || blogPost.excerpt,
    path: `/blog/${blogPost.slug.current}`,
  });
}

function formatPublishDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<BlogPostPageParams>;
}) {
  const { slug } = await params;
  const blogPost = await getBlogPostBySlug(slug);

  if (!blogPost) {
    notFound();
  }

  const imageUrl = resolveImageUrl(blogPost.featuredImage, {
    width: 1800,
    height: 1200,
  });
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
      {
        "@type": "ListItem",
        position: 3,
        name: blogPost.title,
        item: `${SITE_URL}/blog/${blogPost.slug.current}`,
      },
    ],
  };
  const articleSchemaOrgJSONLD = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: blogPost.title,
    description: blogPost.excerpt,
    datePublished: blogPost.publishDate,
    author: blogPost.authorName
      ? {
          "@type": "Person",
          name: blogPost.authorName,
        }
      : undefined,
    image: imageUrl || undefined,
    mainEntityOfPage: `${SITE_URL}/blog/${blogPost.slug.current}`,
    publisher: {
      "@type": "Organization",
      name: "Spirit Event Rentals",
      url: SITE_URL,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchemaOrgJSONLD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchemaOrgJSONLD) }}
      />
      <section className="section">
        <div className="page-wrap">
          <header className="section-head left-aligned packages-pricing-head">
            <p className="eyebrow">Blog</p>
            <h1>{blogPost.title}</h1>
            <p>
              {formatPublishDate(blogPost.publishDate)}
              {blogPost.topic ? ` · ${blogPost.topic}` : ""}
              {blogPost.readTime ? ` · ${blogPost.readTime}` : ""}
            </p>
          </header>

          {imageUrl ? (
            <div className="media-frame" style={{ marginBottom: "1.5rem", borderRadius: "var(--radius-card)" }}>
              <img
                src={imageUrl}
                alt={blogPost.featuredImage?.alt?.trim() || blogPost.title}
                loading="eager"
                decoding="async"
              />
            </div>
          ) : null}

          <BlogRichText blocks={blogPost.content} />

          <div className="button-row" style={{ justifyContent: "flex-start", marginTop: "2rem" }}>
            <Link className="button button-primary" href={BOOKING_PATH}>
              Request Your Event Date
            </Link>
            <Link className="button button-secondary" href="/packages">
              Compare Packages
            </Link>
            <Link className="button button-secondary" href="/service-areas">
              View Service Areas
            </Link>
            <Link className="button button-secondary" href="/blog">
              Back to Blog
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
