# Milestone 12: Giving Payments & Receipts

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestones 7–11 complete

---

## About This Handoff

**What you're receiving:**
- A Giving UI that is already designed and routed
- A launch-safe MVP posture where live payments may still be deferred
- Callback points ready to be replaced with real provider-backed transactions

**Your job:**
- Integrate live payment providers
- Persist donation and payment lifecycle state
- Generate receipts and giving history from real transactions
- Harden the full giving flow for production finance operations

This milestone turns Giving from a deferred or read-only MVP section into a live donation product.

---

## Goal

Implement real giving flows with live payment providers, receipt generation, and trustworthy transaction history.

## Overview

Giving is intentionally separated from the MVP launch gate so the product can ship earlier without financial risk. This milestone is the follow-up release that enables real payments. It should support at least one Rwanda-first path and one international path, while handling transaction states safely and clearly for donors.

**Key Functionality:**
- User can complete a real donation through supported providers
- Donation status and payment status are persisted separately
- User can view real giving history and receipt details
- Duplicate submissions and accidental double charges are prevented
- Webhook/provider callback handling is verified and auditable
- Failed, pending, and succeeded transactions are all communicated clearly

## Implementation Scope

### 1. Provider Integration

- Integrate at least one Rwanda-first provider path
- Integrate at least one international provider path
- Support provider-specific redirect/callback flows where needed
- Store provider references and correlation IDs

### 2. Transaction Model

- Separate:
  - Donation intent
  - Payment attempt
  - Provider transaction state
  - Receipt state
- Track pending, succeeded, failed, canceled, and retryable states

### 3. User Experience

- Update the giving wizard to use live submission logic
- Surface pending and failure states clearly
- Prevent duplicate taps/submits
- Allow safe retry where appropriate

### 4. Receipts & History

- Generate receipt records for successful donations
- Render giving history from real transactions
- Associate donation history with the authenticated user
- Surface receipt numbers and downloadable proof where applicable

### 5. Security & Operations

- Verify provider callbacks/webhooks
- Log transaction IDs and failure reasons
- Protect against replay, tampering, and duplicate processing
- Ensure payment secrets and keys remain server-side

## Expected User Flows

### Flow 1: Successful donation

1. User opens Giving
2. User completes the wizard and confirms payment
3. Provider transaction succeeds
4. **Outcome:** Donation, receipt, and history all reflect the real transaction

### Flow 2: Failed or pending payment

1. User attempts to donate
2. Provider returns failure or pending state
3. App shows the right status and next step
4. **Outcome:** No silent failure and no false success state

### Flow 3: Receipt retrieval

1. User opens giving history
2. App loads real donation records
3. User opens or downloads the receipt
4. **Outcome:** Giving records are transparent and trustworthy

## Empty States

Make sure to handle:

- **No donations yet:** Explain that receipts/history appear after the first successful gift
- **Pending payment:** Clarify that confirmation may take time
- **Provider unavailable:** Offer a retry or temporary fallback path

## Testing

Validate:

- Payment success, failure, cancel, and pending flows
- Webhook/callback verification
- Duplicate-submit and idempotency protections
- Receipt generation and history visibility
- Correct ownership of private giving records

## Files to Reference

- `web/src/lib/giving-callbacks.tsx`
- `web/src/product/sections/giving/`
- `web/src/lib/firebase/`
- Any server/API route handling provider callbacks

## Done When

- [ ] At least one Rwanda-first payment provider is live
- [ ] At least one international payment provider is live
- [ ] Giving wizard performs real transactions
- [ ] Donation and payment states are persisted safely
- [ ] Real receipts and giving history are available
- [ ] Duplicate-submit and callback safety protections are in place
