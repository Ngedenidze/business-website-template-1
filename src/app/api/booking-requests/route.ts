import { NextResponse } from "next/server";
import {
  bookingRequestSchema,
  flattenZodErrors,
} from "@/lib/booking-request-schema";
import { getWriteClient } from "@/sanity/server-client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = bookingRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "VALIDATION_ERROR",
          fieldErrors: flattenZodErrors(parsed.error.flatten().fieldErrors),
        },
        { status: 400 },
      );
    }

    const payload = parsed.data;

    if (payload.website) {
      return NextResponse.json({ ok: true, requestId: "filtered" }, { status: 200 });
    }

    const writeClient = getWriteClient();

    const created = await writeClient.create({
      _type: "bookingRequest",
      fullName: payload.fullName,
      phoneNumber: payload.phoneNumber,
      emailAddress: payload.emailAddress,
      eventDate: payload.eventDate,
      eventLocation: payload.eventLocation,
      numberOfGuests: payload.numberOfGuests,
      selectedPackage: payload.selectedPackageId
        ? {
            _type: "reference",
            _ref: payload.selectedPackageId,
          }
        : undefined,
      additionalDetails: payload.additionalDetails,
      status: "New",
      submittedAt: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true, requestId: created._id }, { status: 201 });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "SERVER_ERROR",
      },
      { status: 500 },
    );
  }
}
