import { z } from "zod";

const todayDate = new Date();
todayDate.setHours(0, 0, 0, 0);

export const bookingRequestSchema = z
  .object({
    fullName: z.string().trim().min(2, "Please provide your full name."),
    phoneNumber: z.string().trim().min(7, "Please provide a valid phone number."),
    emailAddress: z.string().trim().email("Please provide a valid email address."),
    eventDate: z
      .string()
      .trim()
      .min(1, "Please provide your event date.")
      .refine((value) => {
        const parsed = new Date(value);
        if (Number.isNaN(parsed.getTime())) {
          return false;
        }
        parsed.setHours(0, 0, 0, 0);
        return parsed >= todayDate;
      }, "Please choose today or a future date."),
    eventLocation: z.string().trim().min(2, "Please provide your event location."),
    numberOfGuests: z.coerce
      .number()
      .int("Guest count must be a whole number.")
      .min(1, "Guest count must be at least 1.")
      .max(5000, "Guest count looks too high."),
    selectedPackageId: z.string().trim().optional().or(z.literal("")),
    additionalDetails: z.string().trim().max(2000).optional().or(z.literal("")),
    website: z.string().max(0).optional().or(z.literal("")),
  })
  .transform((payload) => ({
    ...payload,
    selectedPackageId: payload.selectedPackageId || undefined,
    additionalDetails: payload.additionalDetails || undefined,
    website: payload.website || "",
  }));

export type BookingRequestPayload = z.infer<typeof bookingRequestSchema>;

export function flattenZodErrors(fieldErrors: Record<string, string[] | undefined>) {
  const flatErrors: Record<string, string> = {};

  for (const [field, errors] of Object.entries(fieldErrors)) {
    if (errors && errors.length > 0) {
      flatErrors[field] = errors[0];
    }
  }

  return flatErrors;
}
