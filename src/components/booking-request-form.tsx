"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type PackageOption = {
  _id: string;
  packageName: string;
  price?: string;
  includedItems?: string[];
  optionalAddOns?: string[];
};

type DeliveryFeeOption = {
  distance: string;
  fee: string;
};

type SetupFeeOption = {
  tent: string;
  setupFee: string;
};

type IndividualPricingOption = {
  itemName: string;
  price: string;
};

type ServiceAreaOption = {
  county: string;
  townName: string;
  distanceFromCaldwellMiles?: number;
};

type ParsedDeliveryTier = {
  label: string;
  minMiles: number;
  maxMiles: number | null;
  fee: number;
};

type FieldErrors = Partial<Record<string, string>>;

type BookingRequestFormProps = {
  packages: PackageOption[];
  deliveryBaseLabel?: string;
  deliveryFees: DeliveryFeeOption[];
  setupFees: SetupFeeOption[];
  individualPricing: IndividualPricingOption[];
  serviceAreas: ServiceAreaOption[];
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
  selectedAddOns: string[];
  additionalDetails: string;
  website: string;
};

function parsePriceToNumber(value?: string): number | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.replace(/,/g, "").replace(/[^0-9.]/g, "");
  if (!normalized) {
    return null;
  }

  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatUSD(value: number): string {
  const hasCents = Math.abs(value % 1) > 0.001;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(value);
}

function normalizeName(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function extractTentSizeToken(value: string): string | null {
  const normalized = value
    .toLowerCase()
    .replace(/['’`″]/g, "")
    .replace(/\bft\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
  const match = normalized.match(/(\d{1,2})\s*[x×]\s*(\d{1,2})/);
  if (!match) {
    return null;
  }

  return `${match[1]}x${match[2]}`;
}

function resolveSetupTentForPackage(
  packageItem: PackageOption | undefined,
  setupFees: SetupFeeOption[],
): string {
  if (!packageItem || setupFees.length === 0) {
    return "";
  }

  const packageContent = [packageItem.packageName, ...(packageItem.includedItems ?? [])]
    .filter(Boolean)
    .join(" ");

  const packageTentToken = extractTentSizeToken(packageContent);
  if (packageTentToken) {
    const matchingTent = setupFees.find(
      (row) => extractTentSizeToken(row.tent) === packageTentToken,
    );
    if (matchingTent) {
      return matchingTent.tent;
    }
  }

  const normalizedContent = normalizeName(packageContent);
  const fallbackTent = setupFees.find((row) =>
    normalizedContent.includes(normalizeName(row.tent)),
  );

  return fallbackTent?.tent ?? "";
}

function parseDeliveryTier(row: DeliveryFeeOption): ParsedDeliveryTier | null {
  const fee = parsePriceToNumber(row.fee);
  if (fee === null) {
    return null;
  }

  const numericTokens = row.distance.match(/\d+(?:\.\d+)?/g) ?? [];
  if (numericTokens.length === 0) {
    return null;
  }

  const numbers = numericTokens.map((token) => Number.parseFloat(token));
  const hasOpenEndedMax = row.distance.includes("+");

  if (numbers.some((value) => !Number.isFinite(value))) {
    return null;
  }

  if (hasOpenEndedMax) {
    return {
      label: row.distance,
      minMiles: numbers[0],
      maxMiles: null,
      fee,
    };
  }

  if (numbers.length === 1) {
    return {
      label: row.distance,
      minMiles: 0,
      maxMiles: numbers[0],
      fee,
    };
  }

  const minMiles = Math.min(numbers[0], numbers[1]);
  const maxMiles = Math.max(numbers[0], numbers[1]);

  return {
    label: row.distance,
    minMiles,
    maxMiles,
    fee,
  };
}

function resolveDeliveryTierForMiles(
  miles: number,
  deliveryTiers: ParsedDeliveryTier[],
): ParsedDeliveryTier | null {
  const sortedTiers = [...deliveryTiers].sort(
    (left, right) => left.minMiles - right.minMiles,
  );

  for (const tier of sortedTiers) {
    const withinLowerBound = miles >= tier.minMiles;
    const withinUpperBound = tier.maxMiles === null || miles <= tier.maxMiles;
    if (withinLowerBound && withinUpperBound) {
      return tier;
    }
  }

  return null;
}

function matchServiceAreaFromLocation(
  location: string,
  serviceAreas: ServiceAreaOption[],
): ServiceAreaOption | null {
  const normalizedLocation = normalizeName(location);
  if (!normalizedLocation) {
    return null;
  }

  const candidates = serviceAreas
    .map((area) => ({
      ...area,
      normalizedTown: normalizeName(area.townName),
    }))
    .filter((area) => area.normalizedTown.length > 0);

  const exactMatch = candidates.find(
    (area) => area.normalizedTown === normalizedLocation,
  );
  if (exactMatch) {
    return exactMatch;
  }

  const boundaryMatches = candidates.filter((area) => {
    const pattern = new RegExp(
      `(^|\\s)${escapeRegex(area.normalizedTown).replace(/ /g, "\\\\s+")}(\\s|$)`,
    );
    return pattern.test(normalizedLocation);
  });

  if (boundaryMatches.length === 1) {
    return boundaryMatches[0];
  }

  if (boundaryMatches.length > 1) {
    const sortedBySpecificity = [...boundaryMatches].sort(
      (left, right) => right.normalizedTown.length - left.normalizedTown.length,
    );
    if (
      sortedBySpecificity[0].normalizedTown.length !==
      sortedBySpecificity[1].normalizedTown.length
    ) {
      return sortedBySpecificity[0];
    }
  }

  const fallbackMatches = candidates.filter(
    (area) =>
      normalizedLocation.startsWith(area.normalizedTown) ||
      area.normalizedTown.startsWith(normalizedLocation) ||
      normalizedLocation.includes(area.normalizedTown) ||
      area.normalizedTown.includes(normalizedLocation),
  );

  if (fallbackMatches.length === 1) {
    return fallbackMatches[0];
  }

  return null;
}

function buildInitialState(selectedPackageId = ""): FormState {
  return {
    fullName: "",
    phoneNumber: "",
    emailAddress: "",
    eventDate: "",
    eventLocation: "",
    numberOfGuests: "",
    selectedPackageId,
    selectedAddOns: [],
    additionalDetails: "",
    website: "",
  };
}

export function BookingRequestForm({
  packages,
  deliveryBaseLabel = "Caldwell, NJ",
  deliveryFees,
  setupFees,
  individualPricing,
  serviceAreas,
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
  const selectedPackage = useMemo(
    () => packages.find((packageItem) => packageItem._id === formState.selectedPackageId),
    [packages, formState.selectedPackageId],
  );
  const availableAddOns = selectedPackage?.optionalAddOns ?? [];
  const matchedSetupTent = useMemo(
    () => resolveSetupTentForPackage(selectedPackage, setupFees),
    [selectedPackage, setupFees],
  );
  const serviceAreaOptionsByCounty = useMemo(() => {
    const townsByCounty = serviceAreas.reduce<Record<string, Set<string>>>(
      (accumulator, serviceArea) => {
        const county =
          typeof serviceArea.county === "string" && serviceArea.county.trim()
            ? serviceArea.county
            : "Other Service Areas";
        const townName = serviceArea.townName?.trim();

        if (!townName) {
          return accumulator;
        }

        if (!accumulator[county]) {
          accumulator[county] = new Set<string>();
        }
        accumulator[county].add(townName);
        return accumulator;
      },
      {},
    );

    return Object.entries(townsByCounty)
      .map(([county, towns]) => ({
        county,
        towns: [...towns].sort((left, right) => left.localeCompare(right)),
      }))
      .sort((left, right) => left.county.localeCompare(right.county));
  }, [serviceAreas]);
  const packagePrice = useMemo(
    () => parsePriceToNumber(selectedPackage?.price) ?? 0,
    [selectedPackage],
  );
  const parsedDeliveryTiers = useMemo(
    () => deliveryFees.map(parseDeliveryTier).filter((row): row is ParsedDeliveryTier => row !== null),
    [deliveryFees],
  );
  const matchedServiceArea = useMemo(
    () => matchServiceAreaFromLocation(formState.eventLocation, serviceAreas),
    [formState.eventLocation, serviceAreas],
  );
  const matchedTownMiles =
    typeof matchedServiceArea?.distanceFromCaldwellMiles === "number"
      ? matchedServiceArea.distanceFromCaldwellMiles
      : null;
  const matchedDeliveryTier = useMemo(() => {
    if (matchedTownMiles === null) {
      return null;
    }

    return resolveDeliveryTierForMiles(matchedTownMiles, parsedDeliveryTiers);
  }, [matchedTownMiles, parsedDeliveryTiers]);
  const selectedSetupFee = useMemo(() => {
    if (!matchedSetupTent) {
      return 0;
    }

    const matchedTent = setupFees.find((row) => row.tent === matchedSetupTent);
    return parsePriceToNumber(matchedTent?.setupFee) ?? 0;
  }, [matchedSetupTent, setupFees]);
  const addOnPriceLookup = useMemo(() => {
    return individualPricing.reduce<Map<string, number>>((lookup, item) => {
      const parsed = parsePriceToNumber(item.price);
      if (parsed === null) {
        return lookup;
      }

      lookup.set(normalizeName(item.itemName), parsed);
      return lookup;
    }, new Map<string, number>());
  }, [individualPricing]);
  const addOnBreakdown = useMemo(() => {
    const pricedItems: Array<{ name: string; price: number }> = [];
    const unpricedItems: string[] = [];

    for (const addOn of formState.selectedAddOns) {
      const directMatch = addOnPriceLookup.get(normalizeName(addOn));
      if (typeof directMatch === "number") {
        pricedItems.push({ name: addOn, price: directMatch });
        continue;
      }

      const inlineMatch = addOn.match(/\$[\d,.]+(?:\.\d{1,2})?/);
      const inlinePrice = parsePriceToNumber(inlineMatch?.[0]);
      if (inlinePrice !== null) {
        pricedItems.push({ name: addOn, price: inlinePrice });
        continue;
      }

      unpricedItems.push(addOn);
    }

    return { pricedItems, unpricedItems };
  }, [addOnPriceLookup, formState.selectedAddOns]);
  const addOnTotal = useMemo(
    () => addOnBreakdown.pricedItems.reduce((total, item) => total + item.price, 0),
    [addOnBreakdown.pricedItems],
  );

  const hasSetupFeeConfiguration = setupFees.length > 0;
  const hasResolvedSetupFee = !hasSetupFeeConfiguration || Boolean(matchedSetupTent);
  const hasResolvedDeliveryTier = Boolean(matchedDeliveryTier);
  const hasNumericEstimate =
    Boolean(selectedPackage) && hasResolvedSetupFee && hasResolvedDeliveryTier;

  const estimatedDeliveryFee = matchedDeliveryTier?.fee ?? 0;
  const estimatedTotal = packagePrice + estimatedDeliveryFee + selectedSetupFee + addOnTotal;

  const highestConfiguredDeliveryMaxMiles = useMemo(() => {
    const finiteMaxValues = parsedDeliveryTiers
      .map((tier) => tier.maxMiles)
      .filter((value): value is number => typeof value === "number");

    if (finiteMaxValues.length === 0) {
      return null;
    }

    return Math.max(...finiteMaxValues);
  }, [parsedDeliveryTiers]);

  const isOutsideConfiguredDeliveryRange =
    matchedTownMiles !== null &&
    !matchedDeliveryTier &&
    highestConfiguredDeliveryMaxMiles !== null &&
    matchedTownMiles > highestConfiguredDeliveryMaxMiles;

  const estimateStatusMessage = useMemo(() => {
    if (!selectedPackage) {
      return "Select a package to view your estimated price.";
    }

    if (!formState.eventLocation.trim()) {
      return "Select your event town so we can match the nearest service area.";
    }

    if (!matchedServiceArea) {
      return "We could not match a supported town from that location. Please enter a listed service town.";
    }

    if (matchedTownMiles === null) {
      return "This town is missing mileage data and needs a manual quote.";
    }

    if (isOutsideConfiguredDeliveryRange) {
      return "This location is outside the standard delivery radius. We will provide a manual delivery quote.";
    }

    if (!matchedDeliveryTier) {
      return "Delivery tier could not be resolved from current distance rules. A manual quote is required.";
    }

    if (!hasResolvedSetupFee) {
      return "Setup fee could not be matched for this package. We will confirm setup pricing manually.";
    }

    return null;
  }, [
    formState.eventLocation,
    hasResolvedSetupFee,
    isOutsideConfiguredDeliveryRange,
    matchedDeliveryTier,
    matchedServiceArea,
    matchedTownMiles,
    selectedPackage,
  ]);

  function updateField(field: keyof FormState, value: string) {
    setFormState((previous) => ({ ...previous, [field]: value }));
    setFieldErrors((previous) => ({ ...previous, [field]: "" }));
  }

  function updateSelectedPackage(selectedPackageId: string) {
    const matchedPackage = packages.find((packageItem) => packageItem._id === selectedPackageId);
    const matchedAddOns = matchedPackage?.optionalAddOns ?? [];

    setFormState((previous) => ({
      ...previous,
      selectedPackageId,
      selectedAddOns: previous.selectedAddOns.filter((item) =>
        matchedAddOns.includes(item),
      ),
    }));
    setFieldErrors((previous) => ({ ...previous, selectedPackageId: "" }));
  }

  function toggleAddOn(addOn: string) {
    setFormState((previous) => {
      if (previous.selectedAddOns.includes(addOn)) {
        return {
          ...previous,
          selectedAddOns: previous.selectedAddOns.filter((item) => item !== addOn),
        };
      }

      return {
        ...previous,
        selectedAddOns: [...previous.selectedAddOns, addOn],
      };
    });
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    setSuccessMessage("");

    const requestPayload = {
      ...formState,
      selectedDeliveryDistance: matchedDeliveryTier?.label,
      selectedSetupTent: matchedSetupTent || undefined,
      estimatedPackagePrice: packagePrice > 0 ? packagePrice : undefined,
      estimatedAddOnPrice: addOnTotal > 0 ? addOnTotal : undefined,
      estimatedDeliveryFee: estimatedDeliveryFee > 0 ? estimatedDeliveryFee : undefined,
      estimatedSetupFee: selectedSetupFee > 0 ? selectedSetupFee : undefined,
      estimatedTotal: hasNumericEstimate ? estimatedTotal : undefined,
      matchedServiceTown: matchedServiceArea?.townName,
      matchedTownDistanceMiles: matchedTownMiles ?? undefined,
      matchedDeliveryTier: matchedDeliveryTier?.label,
    };

    const response = await fetch("/api/booking-requests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestPayload),
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
            placeholder="Jane Smith"
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
            placeholder="(973) 555-1234"
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
            placeholder="you@example.com"
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
            placeholder="Select your event date"
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
          <select
            id="eventLocation"
            name="eventLocation"
            value={formState.eventLocation}
            onChange={(event) =>
              updateField("eventLocation", event.target.value)
            }
            aria-invalid={Boolean(fieldErrors.eventLocation)}
            required
          >
            <option value="">Select your event town</option>
            {serviceAreaOptionsByCounty.map(({ county, towns }) => (
              <optgroup key={county} label={county}>
                {towns.map((townName) => (
                  <option key={`${county}-${townName}`} value={townName}>
                    {townName}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
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
            placeholder="120"
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
            onChange={(event) => updateSelectedPackage(event.target.value)}
          >
            <option value="">Choose a package (optional)</option>
            {packages.map((packageItem) => (
              <option key={packageItem._id} value={packageItem._id}>
                {packageItem.packageName}
              </option>
            ))}
          </select>
        </div>

        {availableAddOns.length > 0 ? (
          <div className="form-field full">
            <label>Optional Add-ons</label>
            <div className="booking-addon-grid">
              {availableAddOns.map((addOn) => (
                <label key={addOn} className="booking-addon-option">
                  <input
                    type="checkbox"
                    checked={formState.selectedAddOns.includes(addOn)}
                    onChange={() => toggleAddOn(addOn)}
                  />
                  <span>{addOn}</span>
                </label>
              ))}
            </div>
          </div>
        ) : null}

        <div className="form-field full">
          <section className="booking-estimate-card" aria-live="polite">
            <span className="booking-estimate-label">Estimated Price</span>

            <p
              className={`booking-estimate-amount${
                hasNumericEstimate ? "" : " booking-estimate-amount--placeholder"
              }`}
              role="status"
            >
              {hasNumericEstimate ? formatUSD(estimatedTotal) : "Estimate updates here"}
            </p>

            <p className="booking-estimate-support">
              This estimate uses package pricing, {deliveryBaseLabel} distance tiers, and
              setup fees. Final quote is confirmed after review.
            </p>

            {matchedServiceArea && matchedTownMiles !== null ? (
              <p className="booking-estimate-caption">
                {deliveryBaseLabel} → {matchedServiceArea.townName}, {matchedTownMiles.toFixed(1)} miles
                {matchedDeliveryTier ? ` · Delivery tier: ${matchedDeliveryTier.label}` : ""}
              </p>
            ) : null}

            {estimateStatusMessage ? (
              <p className="booking-estimate-caption">{estimateStatusMessage}</p>
            ) : null}

            {addOnBreakdown.unpricedItems.length > 0 ? (
              <p className="booking-estimate-caption">
                Some selected add-ons are not in current price tables and are excluded from this estimate:
                {` ${addOnBreakdown.unpricedItems.join(", ")}.`}
              </p>
            ) : null}
          </section>
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
