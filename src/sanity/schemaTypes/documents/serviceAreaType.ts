import { defineArrayMember, defineField, defineType } from "sanity";

export const serviceAreaType = defineType({
  name: "serviceArea",
  title: "Service Areas",
  type: "document",
  fields: [
    defineField({
      name: "county",
      title: "County / Region",
      type: "string",
      description: "Used to group service areas on the website.",
      options: {
        list: [
          { title: "Essex County", value: "Essex County" },
          { title: "Morris County", value: "Morris County" },
          { title: "Passaic County", value: "Passaic County" },
          { title: "Bergen County", value: "Bergen County" },
          { title: "Hudson County", value: "Hudson County" },
          { title: "Union County", value: "Union County" },
          { title: "Somerset County", value: "Somerset County" },
          { title: "New York (within ~30 miles)", value: "New York (within ~30 miles)" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "townName",
      title: "Town Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "distanceFromCaldwellMiles",
      title: "Distance From Caldwell (Miles)",
      type: "number",
      validation: (rule) => rule.required().min(0),
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
      subtitle: "county",
    },
  },
});
