import { defineArrayMember, defineField, defineType } from "sanity";

export const serviceAreaType = defineType({
  name: "serviceArea",
  title: "Service Areas",
  type: "document",
  fields: [
    defineField({
      name: "townName",
      title: "Town Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "shortDescription",
      title: "Short Description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "seoText",
      title: "Optional SEO Text",
      type: "text",
      rows: 5,
    }),
    defineField({
      name: "serviceAreaSlides",
      title: "Service Area Slides",
      type: "array",
      description:
        "Slideshow images for this town. Used on the service area card and town detail page.",
      of: [
        defineArrayMember({
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
      ],
      validation: (rule) => rule.max(12),
    }),
    defineField({
      name: "slug",
      title: "Town Page Link",
      type: "slug",
      options: {
        source: "townName",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "seo",
      title: "Town Search Preview",
      type: "seo",
    }),
  ],
  preview: {
    select: {
      title: "townName",
    },
  },
});
