import { defineArrayMember, defineField, defineType } from "sanity";

export const faqPageType = defineType({
  name: "faqPage",
  title: "Frequently Asked Questions",
  type: "document",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Section Label",
      type: "string",
      initialValue: "FAQ",
    }),
    defineField({
      name: "title",
      title: "Section Title",
      type: "string",
      initialValue: "Frequently Asked Questions",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "introText",
      title: "Intro Text",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "faqItems",
      title: "Questions and Answers",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "faqItem",
          title: "FAQ Item",
          fields: [
            defineField({
              name: "question",
              title: "Question",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "answer",
              title: "Answer",
              type: "text",
              rows: 4,
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "category",
              title: "Category",
              type: "string",
            }),
            defineField({
              name: "featured",
              title: "Feature This Question",
              type: "boolean",
              initialValue: false,
            }),
          ],
          preview: {
            select: {
              title: "question",
              subtitle: "category",
            },
          },
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    prepare: () => ({
      title: "Frequently Asked Questions",
    }),
  },
});
