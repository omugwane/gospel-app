# Milestone 7: Content & Data Integration

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestones 1–6 complete

---

## About This Handoff

**What you're receiving:**
- A complete UI implementation for the core product sections
- Stubbed Sanity/Firebase entry points and mapper layers
- Sample data showing the expected frontend contracts
- Route structure already in place

**Your job:**
- Replace sample data with production data sources
- Define the CMS/content model and data mapping strategy
- Ensure locale-aware content loads correctly across all sections
- Add route-safe loading, error, and empty states

This milestone turns the app from a design prototype into a real content application.

---

## Goal

Connect the app to real content sources so Home, Library, Plans, Fellowship, and Giving render production data instead of local sample files.

## Overview

The current app shell and feature routes are present, but the data layer is still mock-driven. This milestone establishes the content platform: Sanity schemas, GROQ queries, mapping logic, and production-safe loading patterns. It also sets the contract between editorial content, personalized user state, and the frontend components that are already built.

**Key Functionality:**
- Configure Sanity project settings, dataset, API version, and environment variables
- Define and implement content schemas for verses, exhortations, sermons, series, plans, giving content, and live/upcoming items
- Replace all `sample-data.json` imports in mapper files with real fetch/query logic
- Map backend shapes into the existing frontend view models without breaking current component contracts
- Support localized content and sensible fallbacks for Kinyarwanda, English, and French
- Add loading, error, and empty-state handling for all data-backed routes

## Implementation Scope

### 1. Sanity Setup

- Configure `lib/sanity/client.ts` with real project values
- Replace placeholder GROQ in `lib/sanity/queries.ts` with production queries
- Define schemas for:
  - Daily verse
  - Daily exhortation / Impuguro
  - Sermon
  - Series
  - Topic
  - Plan
  - Plan content item
  - Giving editorial content / impact fund
  - Live prayer / urgent update

### 2. Frontend Data Layer

- Replace sample-data imports in:
  - `lib/mappers/home.ts`
  - `lib/mappers/library.ts`
  - `lib/mappers/plans.ts`
  - `lib/mappers/fellowship.ts`
  - `lib/mappers/giving.ts`
- Keep mapper outputs aligned with existing component types
- Normalize missing/null backend values to safe UI defaults

### 3. Route Resilience

- Add `loading.tsx`, `error.tsx`, and route-level empty states where appropriate
- Handle missing slugs/IDs and unavailable records gracefully
- Avoid blank screens when content is unpublished or temporarily unavailable

## Expected User Flows

### Flow 1: Daily content loads from CMS

1. User opens Home
2. App fetches real verse, exhortation, and live-update content from Sanity
3. Content renders in the existing dashboard
4. **Outcome:** Home reflects the actual day’s published content

### Flow 2: Browse archive content

1. User opens Library or Plans
2. App fetches real series, sermons, plans, and detail records
3. User opens nested routes and detail pages
4. **Outcome:** Archive routes are fully backed by real content

### Flow 3: Missing content is handled safely

1. User opens a route for missing/unpublished content
2. App detects empty or invalid data
3. User sees a designed fallback state
4. **Outcome:** No crashes, no undefined data rendering

## Empty States

Make sure to handle:

- **No published content yet:** Home/Library/Plans/Giving should show designed fallbacks
- **Missing detail record:** Invalid sermon/plan/live item routes should fail gracefully
- **Locale gap:** If a translation is unavailable, fall back to the default locale

## Testing

Validate:

- Real query results map correctly into frontend types
- Invalid or partial CMS documents do not crash routes
- Loading, empty, and error states render correctly
- Locale fallback behavior is deterministic

## Files to Reference

- `web/src/lib/sanity/client.ts`
- `web/src/lib/sanity/queries.ts`
- `web/src/lib/mappers/`
- `web/src/app/`
- `web/src/product/sections/*/types.ts`

## Done When

- [ ] No section depends on local `sample-data.json` in production paths
- [ ] Sanity is configured with real schemas and queries
- [ ] All core routes render real content
- [ ] Invalid/missing content is handled gracefully
- [ ] Loading, empty, and error states exist for critical routes
- [ ] Locale-aware content loading works consistently
