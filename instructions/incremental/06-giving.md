# Milestone 6: Giving

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Shell) complete, plus any prior section milestones

---

## About This Handoff

**What you're receiving:**
- Finished UI designs (React components with full styling)
- Product requirements and user flow specifications
- Design system tokens (colors, typography)
- Sample data showing the shape of data components expect
- Test specs focused on user-facing behavior

**Your job:**
- Integrate these components into your application
- Wire up callback props to your routing and business logic
- Replace sample data with real data from your backend
- Implement loading, error, and empty states

The components are props-based — they accept data and fire callbacks. How you architect the backend, data layer, and business logic is up to you.

---


## Goal

Implement the Giving feature — A giving portal that supports Mobile Money (MTN/Airtel) and international payment options for the diaspora.

## Overview

Giving is a Generosity Hub that helps users partner with Pastor Senga Emmanuel's ministry in a secure, transparent, and spiritually encouraging way. The experience supports Rwanda-first giving via MTN/Airtel Mobile Money and global giving via cards and wallet options, while keeping trust high with visible security signals and clear impact categories. It includes one-time and recurring giving, post-gift honor moments, and a private giving history view.

**Key Functionality:**
- User opens Giving, watches a short "Heart of Giving" video, and chooses an impact category (e.g., Prophetic Mission Fund, Family Connection Media, General Tithe & Offering).
- User completes a three-step giving wizard: select amount (preset or custom), choose category, then choose payment method (MoMo or global card/wallet).
- User chooses one-time or recurring giving and can optionally give anonymously.
- User completes payment through secure gateway options (MTN MoMo, Airtel Money, Visa/Mastercard, Apple Pay, Google Pay) and can choose to save payment method for one-click future giving.
- User lands on a success screen with a thank-you prayer video and receives an automated branded receipt.
- User opens private giving history to review total yearly contributions and individual records.

## Components Provided

Copy the section components from `product-plan/sections/giving/components/`:

- `GivingHubWizard` — Giving component
- `GivingSuccess` — Giving component
- `GivingHistory` — Giving component

## Props Reference

The components expect these data shapes (see `types.ts` for full definitions):

**Data props:**

- See `product-plan/sections/giving/types.ts` for full interface definitions

**Callback props:**

| Callback | Triggered When |
|----------|---------------|
| `onChangeStep` | Triggered when user performs the related action |
| `onSelectAmount` | Triggered when user performs the related action |
| `onSelectCategory` | Triggered when user performs the related action |
| `onSelectFrequency` | Triggered when user performs the related action |
| `onSelectPaymentMethod` | Triggered when user performs the related action |
| `onSubmitDonation` | Triggered when user performs the related action |
| `onToggleAnonymous` | Triggered when user performs the related action |
| `onToggleSavePaymentMethod` | Triggered when user performs the related action |
| `onOpenReceipt` | Triggered when user performs the related action |
| `onChangeHistoryYear` | Triggered when user performs the related action |

## Expected User Flows

### Flow 1: User Journey 1

1. User starts from the Giving entry point
2. User performs: User opens Giving, watches a short "Heart of Giving" video, and chooses an impact category (e.g., Prophetic Mission Fund, Family Connection Media, General Tithe & Offering).
3. User confirms the action and continues
4. **Outcome:** UI reflects expected state and next step
### Flow 2: User Journey 2

1. User starts from the Giving entry point
2. User performs: User completes a three-step giving wizard: select amount (preset or custom), choose category, then choose payment method (MoMo or global card/wallet).
3. User confirms the action and continues
4. **Outcome:** UI reflects expected state and next step
### Flow 3: User Journey 3

1. User starts from the Giving entry point
2. User performs: User chooses one-time or recurring giving and can optionally give anonymously.
3. User confirms the action and continues
4. **Outcome:** UI reflects expected state and next step

## Empty States

The components include empty state designs. Make sure to handle:

- **No data yet:** Show empty-state UI when the primary collection is empty
- **No related records:** Handle nested collections with zero child records
- **First-time experience:** Guide users with clear CTAs for first action

## Testing

See `product-plan/sections/giving/tests.md` for UI behavior test specs covering:
- User flow success and failure paths
- Empty state rendering
- Component interactions and edge cases

## Files to Reference

- `product-plan/sections/giving/README.md`
- `product-plan/sections/giving/tests.md`
- `product-plan/sections/giving/components/`
- `product-plan/sections/giving/types.ts`
- `product-plan/sections/giving/sample-data.json`
- `product-plan/sections/giving/screenshot.png`

## Done When

- [ ] Components render with real data
- [ ] Empty states display properly when no records exist
- [ ] All callback props are wired to working functionality
- [ ] User can complete all expected flows end-to-end
- [ ] Matches the visual design (see screenshot)
- [ ] Responsive on mobile
