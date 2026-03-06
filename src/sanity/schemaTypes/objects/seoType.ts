import { defineField, defineType } from "sanity";

export const seoType = defineType({
  name: "seo",
  title: "Search Preview",
  type: "object",
  fields: [
    defineField({
      name: "metaTitle",
      title: "Search Result Title",
      type: "string",
      description: "How this page appears in Google results.",
      validation: (rule) => rule.max(60),
    }),
    defineField({
      name: "metaDescription",
      title: "Search Result Description",
      type: "text",
      rows: 3,
      description: "Short summary for Google results.",
      validation: (rule) => rule.max(160),
    }),
  ],
});
