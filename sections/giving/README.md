# Giving

## Overview

Giving is a Generosity Hub that helps users partner with Pastor Senga Emmanuel's ministry in a secure, transparent, and spiritually encouraging way. The experience supports Rwanda-first giving via MTN/Airtel Mobile Money and global giving via cards and wallet options, while keeping trust high with visible security signals and clear impact categories. It includes one-time and recurring giving, post-gift honor moments, and a private giving history view.

## User Flows

- User opens Giving, watches a short "Heart of Giving" video, and chooses an impact category (e.g., Prophetic Mission Fund, Family Connection Media, General Tithe & Offering).
- User completes a three-step giving wizard: select amount (preset or custom), choose category, then choose payment method (MoMo or global card/wallet).
- User chooses one-time or recurring giving and can optionally give anonymously.
- User completes payment through secure gateway options (MTN MoMo, Airtel Money, Visa/Mastercard, Apple Pay, Google Pay) and can choose to save payment method for one-click future giving.
- User lands on a success screen with a thank-you prayer video and receives an automated branded receipt.
- User opens private giving history to review total yearly contributions and individual records.

## Design Decisions

- Mobile-first layout with clear visual hierarchy for primary actions.
- Readable spacing and type scale optimized for low-distraction use.
- Prop-driven interactions to keep UI portable across app architectures.

## Data Shapes

**Entities:** HeartOfGivingVideo, ImpactFund, PaymentMethod, SavedPaymentMethod, GivingWizardState, DonationRecord, YearlyTotal, GivingSummary, ThankYouContent, NewDonationInput

**From global entities:** User, Locale, Account, Device

## Visual Reference

See `screenshot.png` for the target UI design.

## Components Provided

- `GivingHubWizard` — Exportable UI component for giving interactions
- `GivingSuccess` — Exportable UI component for giving interactions
- `GivingHistory` — Exportable UI component for giving interactions

## Callback Props

| Callback | Triggered When |
|----------|---------------|
| `onChangeStep` | Triggered when the related user action occurs |
| `onSelectAmount` | Triggered when the related user action occurs |
| `onSelectCategory` | Triggered when the related user action occurs |
| `onSelectFrequency` | Triggered when the related user action occurs |
| `onSelectPaymentMethod` | Triggered when the related user action occurs |
| `onSubmitDonation` | Triggered when the related user action occurs |
| `onToggleAnonymous` | Triggered when the related user action occurs |
| `onToggleSavePaymentMethod` | Triggered when the related user action occurs |
