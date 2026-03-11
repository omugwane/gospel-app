# Milestone 9: Community Writes & Safe Giving Deferral

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestones 7–8 complete

---

## About This Handoff

**What you're receiving:**
- Fully designed flows for Fellowship and Giving
- Callback-based components already wired to route transitions
- Placeholder callback hooks where user actions are currently logged only

**Your job:**
- Replace mock callbacks with real writes for Fellowship and other non-payment interactions
- Implement secure create/update flows for community and private data
- Add validation, moderation, and failure handling
- Make Giving safe for MVP if live payments are not launching yet

This milestone turns the community and ministry-support parts of the product into real workflows while keeping Giving safe to ship before payments go live.

---

## Goal

Make all non-payment user actions real for MVP, and ensure Giving is safely deferred until live payment integrations are ready.

## Overview

The app currently renders complete flows, but most important actions still stop at UI state or `console.log`. This milestone wires the product to real backend writes for Fellowship and private ministry interactions. It also defines the MVP posture for Giving so the app can launch without misleading users into thinking payments are already live.

**Key Functionality:**
- User can post a testimony, react to testimony content, submit prayer points, commit to prayer, and send private counseling requests
- Moderation and abuse controls exist for public community content
- All real write actions show success, failure, retry, and pending states
- Sensitive actions are authenticated, validated, and auditable
- Giving is either hidden, read-only, or clearly marked `Coming Soon` until live payments are ready

## Implementation Scope

### 1. Fellowship Writes

- Replace placeholder callbacks in fellowship flows with real Firestore/API writes
- Support:
  - Create testimony
  - React to testimony
  - Submit prayer point
  - Commit prayer
  - Submit counseling request
- Add timestamps, ownership, and status fields

### 2. Public Content Safety

- Add basic moderation strategy for MVP:
  - Profanity/spam filtering
  - Admin review flags
  - Anonymous-post rules
  - Rate limits or write throttling

### 3. Giving MVP Deferral

- Decide the launch behavior for Giving:
  - Hidden
  - Read-only
  - `Coming Soon`
- Prevent users from triggering fake or incomplete payment flows
- Replace any misleading success/history states with safe MVP messaging
- Provide fallback contact/support info if the ministry still wants to collect interest manually

### 4. Operational Reliability

- Prevent double-posts and duplicate submissions
- Validate all write inputs on client and server/API side

## Expected User Flows

### Flow 1: Community participation

1. User submits a testimony or prayer point
2. App validates and persists the write
3. UI updates to reflect the new item or success state
4. **Outcome:** Community features are truly interactive

### Flow 2: Private support request

1. User submits a counseling request
2. Request is stored privately with status metadata
3. User can later view the request history safely
4. **Outcome:** Private ministry support flow is real and secure

### Flow 3: Giving is safely deferred

1. User opens Giving during MVP
2. App clearly communicates that live payments are not yet available, or keeps the flow read-only
3. User is not led into a broken or fake transaction path
4. **Outcome:** MVP can launch without payment risk or user confusion

## Empty States

Make sure to handle:

- **No testimonies or prayer points yet:** Encourage the first action
- **Giving not live yet:** Show clear `Coming Soon` or read-only messaging
- **No testimonies or commitments yet:** Encourage first action without implying missing data is an error

## Testing

Validate:

- Successful and failed write flows
- Duplicate-submit prevention
- Authorization boundaries for private records
- Moderation/rate-limit behavior for public posting
- Safe Giving behavior when payments are not yet enabled

## Files to Reference

- `web/src/lib/fellowship-callbacks.tsx`
- `web/src/lib/giving-callbacks.tsx`
- `web/src/product/sections/fellowship/`
- `web/src/product/sections/giving/`
- `web/src/lib/firebase/`

## Done When

- [ ] Fellowship callbacks perform real writes
- [ ] Counseling requests are stored privately and securely
- [ ] Public community content has basic moderation safeguards
- [ ] Giving has a safe MVP posture that does not imply live payments
- [ ] All critical writes handle success, failure, and retry paths
