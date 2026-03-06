import { defineArrayMember, defineField, defineType } from "sanity";

export const homepageType = defineType({
  name: "homepage",
  title: "Homepage",
  type: "document",
  fields: [
    defineField({
      name: "mainHeadline",
      title: "Main Headline",
      type: "string",
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: "supportingText",
      title: "Supporting Text",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().max(260),
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      description: "Legacy fallback image. Use Hero Slides for the main hero slideshow.",
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
      name: "heroSlides",
      title: "Hero Slides",
      type: "array",
      description: "Hero slideshow images shown at the top of the homepage.",
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
      validation: (rule) => rule.required().min(1).max(8),
    }),
    defineField({
      name: "primaryButtonText",
      title: "Primary Button Text",
      type: "string",
      initialValue: "Request a Booking",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "introSectionText",
      title: "Intro Section Text",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "featuredPackages",
      title: "Featured Packages",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "package" }],
        }),
      ],
      validation: (rule) => rule.max(4),
    }),
    defineField({
      name: "galleryPreview",
      title: "Gallery Preview",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "galleryItem" }],
        }),
      ],
      validation: (rule) => rule.max(8),
    }),
    defineField({
      name: "testimonialsPreview",
      title: "Testimonials Preview",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "testimonial" }],
        }),
      ],
      validation: (rule) => rule.max(4),
    }),
    defineField({
      name: "serviceAreaPreview",
      title: "Service Areas Preview",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "serviceArea" }],
        }),
      ],
      validation: (rule) => rule.max(8),
    }),
    defineField({
      name: "finalCallToActionHeading",
      title: "Final Call to Action Heading",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "finalCallToActionText",
      title: "Final Call to Action Text",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "finalCallToActionButtonText",
      title: "Final Call to Action Button Text",
      type: "string",
      initialValue: "Request a Booking",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "seo",
      title: "Homepage Search Preview",
      type: "seo",
    }),
  ],
  preview: {
    prepare: () => ({
      title: "Homepage",
    }),
  },
});
