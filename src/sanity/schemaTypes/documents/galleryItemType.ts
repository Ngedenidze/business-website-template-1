import { defineField, defineType } from "sanity";

export const galleryItemType = defineType({
  name: "galleryItem",
  title: "Gallery",
  type: "document",
  fields: [
    defineField({
      name: "eventPhoto",
      title: "Event Photo",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
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
      name: "title",
      title: "Optional Title",
      type: "string",
    }),
    defineField({
      name: "caption",
      title: "Optional Caption",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "eventType",
      title: "Event Type or Package Type",
      type: "string",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "eventType",
      media: "eventPhoto",
    },
    prepare: ({ title, subtitle, media }) => ({
      title: title || "Gallery Photo",
      subtitle,
      media,
    }),
  },
});
