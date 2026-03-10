# Event Rental Marketing Site

Next.js App Router website with Sanity CMS and Sanity Studio mounted at `/studio`.

## Features

- Conversion-focused marketing pages for a local event rental business
- CMS-driven home, packages, gallery, testimonials, service areas, and business info
- Booking request form that stores submissions in Sanity (`bookingRequest` documents)
- Local SEO-ready service area pages
- Sanity Studio editing experience with owner-friendly labels

## Routes

- `/`
- `/packages`
- `/gallery`
- `/booking-request`
- `/contact`
- `/service-areas`
- `/service-areas/[townSlug]`
- `/studio`

## Environment Variables

Copy `.env.example` to `.env.local` and update values:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `SANITY_API_WRITE_TOKEN`
- `NEXT_PUBLIC_SITE_URL`

## Run Locally

```bash
npm install
npm run dev
```

## Seed Starter Content

```bash
npm run seed:content
```

This script creates starter packages, gallery items, testimonials, county-grouped service areas (Caldwell 30-mile coverage), homepage, and business information only when they do not already exist.

## Validate

```bash
npm run lint
npm run build
```
