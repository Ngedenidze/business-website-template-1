import { defineArrayMember, defineField, defineType } from "sanity";

export const packageType = defineType({
  name: "package",
  title: "Packages",
  type: "document",
  fields: [
    defineField({
      name: "packageName",
      title: "Package Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "string",
      description: "Example: From $595",
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
      name: "fullDescription",
      title: "Full Description",
      type: "text",
      rows: 5,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "packagePhoto",
      title: "Package Photo",
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
      name: "guestCapacity",
      title: "Guest Capacity",
      type: "number",
      validation: (rule) => rule.required().min(1).max(5000),
    }),
    defineField({
      name: "includedItems",
      title: "Included Items",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "optionalAddOns",
      title: "Optional Add-ons",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "featured",
      title: "Featured on Homepage",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "buttonText",
      title: "Button Text",
      type: "string",
      initialValue: "Request This Package",
    }),
    defineField({
      name: "slug",
      title: "Package Page Link",
      type: "slug",
      options: {
        source: "packageName",
      },
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "packageName",
      subtitle: "price",
      media: "packagePhoto",
    },
  },
});
