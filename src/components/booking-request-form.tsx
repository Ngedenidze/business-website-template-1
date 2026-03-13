"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type PackageOption = {
  _id: string;
  packageName: string;
};

type FieldErrors = Partial<Record<string, string>>;

type BookingRequestFormProps = {
  packages: PackageOption[];
  initialSelectedPackageId?: string;
};

type FormState = {
  fullName: string;
  phoneNumber: string;
  emailAddress: string;
  eventDate: string;
  eventLocation: string;
  numberOfGuests: string;
  selectedPackageId: string;
  additionalDetails: string;
  website: string;
};

function buildInitialState(selectedPackageId = ""): FormState {
  return {
    fullName: "",
    phoneNumber: "",
    emailAddress: "",
    eventDate: "",
    eventLocation: "",
    numberOfGuests: "",
    selectedPackageId,
    additionalDetails: "",
    website: "",
  };
}

export function BookingRequestForm({
  packages,
  initialSelectedPackageId = "",
}: BookingRequestFormProps) {
  const [formState, setFormState] = useState<FormState>(() =>
    buildInitialState(initialSelectedPackageId),
  );
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);

  const minimumDate = useMemo(() => new Date().toISOString().split("T")[0], []);

  function updateField(field: keyof FormState, value: string) {
    setFormState((previous) => ({ ...previous, [field]: value }));
    setFieldErrors((previous) => ({ ...previous, [field]: "" }));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    setSuccessMessage("");

    const response = await fetch("/api/booking-requests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formState),
    });

    const payload = (await response.json().catch(() => null)) as {
      ok: boolean;
      requestId?: string;
      error?: string;
      fieldErrors?: FieldErrors;
    } | null;

    if (!response.ok || !payload?.ok) {
      if (payload?.error === "VALIDATION_ERROR" && payload.fieldErrors) {
        setFieldErrors(payload.fieldErrors);
      } else {
        setSubmitError(
          "We could not submit your request right now. Please call us directly and we will help you reserve your date.",
        );
      }
      setIsSubmitting(false);
      return;
    }

    setSuccessMessage(
      "Thanks, your booking request is in. We will review it and reach out to finalize your booking.",
    );
    setFormState(buildInitialState());
    setFieldErrors({});
    setIsSubmitting(false);
    setAgreedToPolicy(false);
  }

  return (
    <form className="form-shell" onSubmit={onSubmit} noValidate>
      {successMessage ? (
        <p className="form-alert form-alert-success" role="status">
          {successMessage}
        </p>
      ) : null}

      {submitError ? (
        <p className="form-alert form-alert-error" role="alert">
          {submitError}
        </p>
      ) : null}

      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            name="fullName"
            autoComplete="name"
            value={formState.fullName}
            onChange={(event) => updateField("fullName", event.target.value)}
            aria-invalid={Boolean(fieldErrors.fullName)}
            required
          />
          {fieldErrors.fullName ? (
            <span className="form-helper">{fieldErrors.fullName}</span>
          ) : null}
        </div>

        <div className="form-field">
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            id="phoneNumber"
            name="phoneNumber"
            autoComplete="tel"
            value={formState.phoneNumber}
            onChange={(event) => updateField("phoneNumber", event.target.value)}
            aria-invalid={Boolean(fieldErrors.phoneNumber)}
            required
          />
          {fieldErrors.phoneNumber ? (
            <span className="form-helper">{fieldErrors.phoneNumber}</span>
          ) : null}
        </div>

        <div className="form-field">
          <label htmlFor="emailAddress">Email Address</label>
          <input
            id="emailAddress"
            name="emailAddress"
            autoComplete="email"
            type="email"
            value={formState.emailAddress}
            onChange={(event) =>
              updateField("emailAddress", event.target.value)
            }
            aria-invalid={Boolean(fieldErrors.emailAddress)}
            required
          />
          {fieldErrors.emailAddress ? (
            <span className="form-helper">{fieldErrors.emailAddress}</span>
          ) : null}
        </div>

        <div className="form-field">
          <label htmlFor="eventDate">Event Date</label>
          <input
            id="eventDate"
            name="eventDate"
            type="date"
            min={minimumDate}
            value={formState.eventDate}
            onChange={(event) => updateField("eventDate", event.target.value)}
            aria-invalid={Boolean(fieldErrors.eventDate)}
            required
          />
          {fieldErrors.eventDate ? (
            <span className="form-helper">{fieldErrors.eventDate}</span>
          ) : null}
        </div>

        <div className="form-field">
          <label htmlFor="eventLocation">Event Location</label>
          <input
            id="eventLocation"
            name="eventLocation"
            value={formState.eventLocation}
            onChange={(event) =>
              updateField("eventLocation", event.target.value)
            }
            aria-invalid={Boolean(fieldErrors.eventLocation)}
            required
          />
          {fieldErrors.eventLocation ? (
            <span className="form-helper">{fieldErrors.eventLocation}</span>
          ) : null}
        </div>

        <div className="form-field">
          <label htmlFor="numberOfGuests">Number of Guests</label>
          <input
            id="numberOfGuests"
            name="numberOfGuests"
            inputMode="numeric"
            value={formState.numberOfGuests}
            onChange={(event) =>
              updateField("numberOfGuests", event.target.value)
            }
            aria-invalid={Boolean(fieldErrors.numberOfGuests)}
            required
          />
          {fieldErrors.numberOfGuests ? (
            <span className="form-helper">{fieldErrors.numberOfGuests}</span>
          ) : null}
        </div>

        <div className="form-field full">
          <label htmlFor="selectedPackageId">Selected Package</label>
          <select
            id="selectedPackageId"
            name="selectedPackageId"
            value={formState.selectedPackageId}
            onChange={(event) =>
              updateField("selectedPackageId", event.target.value)
            }
          >
            <option value="">Select a package (optional)</option>
            {packages.map((packageItem) => (
              <option key={packageItem._id} value={packageItem._id}>
                {packageItem.packageName}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field full">
          <label htmlFor="additionalDetails">Additional Details</label>
          <textarea
            id="additionalDetails"
            name="additionalDetails"
            value={formState.additionalDetails}
            onChange={(event) =>
              updateField("additionalDetails", event.target.value)
            }
            placeholder="Tell us about your event timeline, setup needs, or any special requests."
          />
        </div>
      </div>

      <div className="form-field full checkbox-field">
        <label className="checkbox-label" htmlFor="agreedToPolicy">
          <input
            id="agreedToPolicy"
            type="checkbox"
            required
            checked={agreedToPolicy}
            onChange={(e) => setAgreedToPolicy(e.target.checked)}
          />
          <span>
            I have read and agree to the{" "}
            <Link href="/policy" target="_blank">
              Rental Policy
            </Link>
            .
          </span>
        </label>
      </div>

      <div className="sr-only" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          value={formState.website}
          onChange={(event) => updateField("website", event.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <button
        className="button button-primary"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Sending request..." : "Submit Booking Request"}
      </button>
    </form>
  );
}
