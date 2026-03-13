import { defineArrayMember, defineField, defineType } from "sanity";

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
      name: "rentalPolicyHighlights",
      title: "Rental Policy Highlights",
      type: "array",
      description: "Shown on the booking page to explain important rental terms.",
      of: [
        defineArrayMember({
          type: "object",
          name: "policySection",
          title: "Policy Section",
          fields: [
            defineField({
              name: "sectionTitle",
              title: "Section Title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "bulletPoints",
              title: "Bullet Points",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
              validation: (rule) => rule.required().min(1),
            }),
            defineField({
              name: "note",
              title: "Optional Note",
              type: "text",
              rows: 3,
            }),
          ],
          preview: {
            select: {
              title: "sectionTitle",
            },
          },
        }),
      ],
    }),
    defineField({
      name: "inventoryItems",
      title: "Inventory Items",
      type: "array",
      description: "Simple inventory list with item names and photos.",
      of: [
        defineArrayMember({
          type: "object",
          name: "inventoryItem",
          title: "Inventory Item",
          fields: [
            defineField({
              name: "itemName",
              title: "Item Name",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "itemImage",
              title: "Item Photo",
              type: "image",
              options: { hotspot: true },
              fields: [
                defineField({
                  name: "alt",
                  title: "Image Description",
                  type: "string",
                }),
              ],
            }),
          ],
          preview: {
            select: {
              title: "itemName",
              media: "itemImage",
            },
          },
        }),
      ],
    }),
    defineField({
      name: "individualRentalPricing",
      title: "Individual Rental Pricing",
      type: "array",
      description: "Item-by-item pricing shown on the policy page.",
      of: [
        defineArrayMember({
          type: "object",
          name: "individualPricingRow",
          title: "Pricing Row",
          fields: [
            defineField({
              name: "itemName",
              title: "Item",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "price",
              title: "Price",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "itemImage",
              title: "Item Photo (Optional)",
              type: "image",
              options: { hotspot: true },
              fields: [
                defineField({
                  name: "alt",
                  title: "Image Description",
                  type: "string",
                }),
              ],
            }),
          ],
          preview: {
            select: {
              title: "itemName",
              subtitle: "price",
              media: "itemImage",
            },
          },
        }),
      ],
    }),
    defineField({
      name: "deliveryFees",
      title: "Delivery Fees",
      type: "array",
      description: "Distance-based delivery pricing shown on the policy page.",
      of: [
        defineArrayMember({
          type: "object",
          name: "deliveryFeeRow",
          title: "Delivery Fee Row",
          fields: [
            defineField({
              name: "distance",
              title: "Distance",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "fee",
              title: "Fee",
              type: "string",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {
              title: "distance",
              subtitle: "fee",
            },
          },
        }),
      ],
    }),
    defineField({
      name: "setupFees",
      title: "Setup Fees",
      type: "array",
      description: "Tent setup pricing shown on the policy page.",
      of: [
        defineArrayMember({
          type: "object",
          name: "setupFeeRow",
          title: "Setup Fee Row",
          fields: [
            defineField({
              name: "tent",
              title: "Tent",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "setupFee",
              title: "Setup Fee",
              type: "string",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {
              title: "tent",
              subtitle: "setupFee",
            },
          },
        }),
      ],
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
