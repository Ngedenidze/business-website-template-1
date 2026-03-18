import { defineField, defineType } from "sanity";

export const blogPostType = defineType({
  name: "blogPost",
  title: "Blog Posts",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required().min(8),
    }),
    defineField({
      name: "slug",
      title: "URL Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().min(50).max(220),
    }),
    defineField({
      name: "featuredImage",
      title: "Featured Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Image Description",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: "publishDate",
      title: "Publish Date",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "authorName",
      title: "Author Name",
      type: "string",
    }),
    defineField({
      name: "topic",
      title: "Topic",
      type: "string",
    }),
    defineField({
      name: "readTime",
      title: "Read Time",
      type: "string",
      description: "Example: 4 min read",
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      of: [{ type: "block" }],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "publishDate",
      media: "featuredImage",
    },
    prepare: ({ title, subtitle, media }) => ({
      title: title || "Untitled Blog Post",
      subtitle: subtitle ? new Date(subtitle).toLocaleDateString() : "No publish date",
      media,
    }),
  },
});
