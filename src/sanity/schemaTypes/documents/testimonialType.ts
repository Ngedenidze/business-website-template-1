import { defineField, defineType } from "sanity";

export const testimonialType = defineType({
  name: "testimonial",
  title: "Testimonials",
  type: "document",
  fields: [
    defineField({
      name: "customerName",
      title: "Customer Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "testimonialText",
      title: "Testimonial Text",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "eventType",
      title: "Optional Event Type",
      type: "string",
    }),
    defineField({
      name: "town",
      title: "Optional Town",
      type: "string",
    }),
  ],
  preview: {
    select: {
      title: "customerName",
      subtitle: "town",
    },
  },
});
