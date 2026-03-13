import { defineField, defineType } from "sanity";

export const bookingRequestType = defineType({
  name: "bookingRequest",
  title: "Booking Requests",
  type: "document",
  fields: [
    defineField({
      name: "fullName",
      title: "Full Name",
      type: "string",
      validation: (rule) => rule.required(),
      readOnly: true,
    }),
    defineField({
      name: "phoneNumber",
      title: "Phone Number",
      type: "string",
      validation: (rule) => rule.required(),
      readOnly: true,
    }),
    defineField({
      name: "emailAddress",
      title: "Email Address",
      type: "string",
      validation: (rule) => rule.required().email(),
      readOnly: true,
    }),
    defineField({
      name: "eventDate",
      title: "Event Date",
      type: "date",
      validation: (rule) => rule.required(),
      readOnly: true,
    }),
    defineField({
      name: "eventLocation",
      title: "Event Location",
      type: "string",
      validation: (rule) => rule.required(),
      readOnly: true,
    }),
    defineField({
      name: "numberOfGuests",
      title: "Number of Guests",
      type: "number",
      validation: (rule) => rule.required().min(1),
      readOnly: true,
    }),
    defineField({
      name: "selectedPackage",
      title: "Selected Package",
      type: "reference",
      to: [{ type: "package" }],
      readOnly: true,
    }),
    defineField({
      name: "selectedAddOns",
      title: "Selected Add-ons",
      type: "array",
      of: [{ type: "string" }],
      readOnly: true,
    }),
    defineField({
      name: "additionalDetails",
      title: "Additional Details",
      type: "text",
      rows: 4,
      readOnly: true,
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      initialValue: "New",
      options: {
        list: ["New", "Reviewed", "Quoted", "Booked", "Closed"],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "submittedAt",
      title: "Submitted At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: "fullName",
      subtitle: "eventDate",
    },
    prepare: ({ title, subtitle }) => ({
      title,
      subtitle: subtitle ? `Event Date: ${subtitle}` : "Booking Request",
    }),
  },
});
