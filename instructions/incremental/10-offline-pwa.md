# Milestone 10: Offline, PWA & Device Experience

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestones 7–9 complete

---

## About This Handoff

**What you're receiving:**
- A Next.js app intended to be offline-first
- Placeholder PWA integration notes
- UI patterns for downloads, low-data playback, and mobile-first use

**Your job:**
- Ship the app as a real installable PWA
- Add offline caching and persistence strategies
- Support device-specific capabilities required for the MVP
- Ensure degraded connectivity still produces a usable experience

This milestone makes the app behave like the product it claims to be.

---

## Goal

Turn the app into an installable, low-data, offline-capable PWA with resilient media and content behavior on mobile devices.

## Overview

Senga App’s core promise is offline-first spiritual access for Rwanda and diaspora users, many of whom will use inconsistent networks or low-data conditions. This milestone focuses on installability, service worker behavior, offline caching, download persistence, and notification/device registration.

**Key Functionality:**
- App can be installed to home screen as a PWA
- Manifest, icons, theme color, and metadata are production-ready
- Key routes work with offline or flaky connectivity
- Downloaded media remains available without network access
- Firestore offline persistence is enabled where appropriate
- Push notification/device registration is ready for live prayer and content reminders

## Implementation Scope

### 1. PWA Basics

- Add `public/manifest.json`
- Add real app icons and splash-compatible assets
- Enable manifest metadata in app layout
- Configure service worker generation/registration

### 2. Cache Strategy

- Define caching strategy for:
  - App shell and static assets
  - CMS/API responses
  - Images
  - Audio files
  - Downloaded sermon media
- Prefer stale-safe strategies that do not surface broken or outdated critical data silently

### 3. Offline Persistence

- Enable Firestore offline persistence where supported
- Persist download metadata and playback references
- Restore saved/downloaded items after reload

### 4. Device Features

- Device registration for push notifications
- Notification categories for:
  - Live prayer reminders
  - New daily content
  - Plan reminders
- Respect user notification preferences

## Expected User Flows

### Flow 1: Install the app

1. User visits the app on mobile
2. Browser offers install prompt or install path
3. User installs the app to the home screen
4. **Outcome:** App behaves like a mobile-first installed product

### Flow 2: Open content with poor connectivity

1. User opens the app with unstable or no network
2. App serves cached shell/content where possible
3. User can still access previously available items
4. **Outcome:** App remains useful under poor network conditions

### Flow 3: Listen offline

1. User downloads a sermon or other media
2. File and metadata persist locally
3. User plays it later without data
4. **Outcome:** Offline listening works reliably

## Empty States

Make sure to handle:

- **Offline without cached data:** Explain what is unavailable and what can still be used
- **Download missing or corrupted:** Allow retry or re-download
- **Notifications disabled:** Clear, non-blocking UX for opt-in

## Testing

Validate:

- Installability in supported browsers
- Cache behavior after deploy/update
- Offline route behavior
- Media playback from downloaded content
- Notification opt-in and token registration flow

## Files to Reference

- `web/src/lib/pwa.ts`
- `web/src/lib/firebase/services.ts`
- `web/src/app/layout.tsx`
- `web/public/`
- `web/src/product/sections/library/components/Downloads.tsx`

## Done When

- [ ] App is installable as a PWA
- [ ] Manifest and production icons are present
- [ ] Service worker and cache strategy are configured
- [ ] Firestore offline persistence is enabled where supported
- [ ] Downloaded media works offline
- [ ] Notification/device registration works and respects preferences
