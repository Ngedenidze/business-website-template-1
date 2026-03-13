import type { StructureResolver } from "sanity/structure";

export const deskStructure: StructureResolver = (S) =>
  S.list()
    .title("Website Content")
    .items([
      S.listItem()
        .title("Homepage")
        .id("homepage-singleton")
        .child(S.document().schemaType("homepage").documentId("homepage")),
      S.listItem()
        .title("Business Information")
        .id("business-info-singleton")
        .child(S.document().schemaType("businessInfo").documentId("businessInfo")),
      S.listItem()
        .title("Frequently Asked Questions")
        .id("faq-page-singleton")
        .child(S.document().schemaType("faqPage").documentId("faqPage")),
      S.divider(),
      S.listItem().title("Packages").child(S.documentTypeList("package")),
      S.listItem().title("Gallery").child(S.documentTypeList("galleryItem")),
      S.listItem().title("Testimonials").child(S.documentTypeList("testimonial")),
      S.listItem().title("Service Areas").child(S.documentTypeList("serviceArea")),
      S.divider(),
      S.listItem()
        .title("New Booking Requests")
        .child(
          S.documentList()
            .title("New Booking Requests")
            .filter('_type == "bookingRequest" && status == "New"')
            .defaultOrdering([{ field: "submittedAt", direction: "desc" }]),
        ),
      S.listItem()
        .title("All Booking Requests")
        .child(
          S.documentTypeList("bookingRequest").title("All Booking Requests"),
        ),
    ]);
