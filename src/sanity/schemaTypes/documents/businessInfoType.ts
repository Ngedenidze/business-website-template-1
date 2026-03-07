import { defineField, defineType } from "sanity";

export const businessInfoType = defineType({
  name: "businessInfo",
  title: "Business Information",
  type: "document",
  fields: [
    defineField({
      name: "businessName",
      title: "Business Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "businessLogo",
      title: "Business Logo",
      type: "image",
      description: "Shown in the top navigation bar.",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Logo Description",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: "phoneNumber",
      title: "Phone Number",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "emailAddress",
      title: "Email Address",
      type: "string",
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: "addressOrServiceBase",
      title: "Address or Service Base",
      type: "string",
    }),
    defineField({
      name: "mapLocation",
      title: "Map Location",
      type: "url",
      description: "Paste a Google Maps link if you want a quick map button.",
    }),
    defineField({
      name: "hours",
      title: "Hours",
      type: "string",
    }),
    defineField({
      name: "instagramUrl",
      title: "Instagram Link",
      type: "url",
    }),
    defineField({
      name: "facebookUrl",
      title: "Facebook Link",
      type: "url",
    }),
    defineField({
      name: "bookingInstructions",
      title: "Booking Instructions",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "bookingPageImage",
      title: "Booking Page Image",
      type: "image",
      description: "Shown beside the form on the booking request page.",
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
      name: "seo",
      title: "Contact Search Preview",
      type: "seo",
    }),
  ],
  preview: {
    prepare: () => ({
      title: "Business Information",
    }),
  },
});
