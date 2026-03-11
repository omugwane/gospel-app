# Fellowship

## Overview

Fellowship is the interactive heart of Senga App where believers can move from passive listening to active participation. It combines a card-based hub with three sub-features: Testimony Wall (Ubuhamya), Interactive Prayer (Gusabirana), and Private Counseling (Inama n'Isengesho). The experience is mobile-first, emotionally warm, and clearly separates public community actions from private support requests.

## User Flows

- User opens Fellowship and lands on a card-based hub with quick access to the three sub-features.
- User enters Testimony Wall, scrolls recent stories, and reacts with "Praise God" or shares a testimony.
- User taps "Share a Testimony," writes a story, optionally posts as Anonymous, and can attach one image or a short audio clip.
- User enters Interactive Prayer, browses prayer points by tag/category, and taps "I'm Praying" to increase the prayer counter.
- User submits a prayer point and chooses visibility: Public or Ministry Only.
- User enters Private Counseling, completes intake form (category, preferred method, description), submits securely, and tracks statuses in "My Requests" (Received, In Review, Scheduled).

## Design Decisions

- Mobile-first layout with clear visual hierarchy for primary actions.
- Readable spacing and type scale optimized for low-distraction use.
- Prop-driven interactions to keep UI portable across app architectures.

## Data Shapes

**Entities:** FellowshipPresence, TestimonyReactionCounts, TestimonyMedia, Testimony, PrayerPoint, CounselingRequest, NewTestimonyInput, NewPrayerPointInput, NewCounselingRequestInput

**From global entities:** User, Locale, Account, Device

## Visual Reference

See `screenshot.png` for the target UI design.

## Components Provided

- `FellowshipHub` — Exportable UI component for fellowship interactions
- `TestimonyWall` — Exportable UI component for fellowship interactions
- `InteractivePrayer` — Exportable UI component for fellowship interactions
- `PrivateCounseling` — Exportable UI component for fellowship interactions

## Callback Props

| Callback | Triggered When |
|----------|---------------|
| `onOpenFeature` | Triggered when the related user action occurs |
| `onCreateTestimony` | Triggered when the related user action occurs |
| `onReactToTestimony` | Triggered when the related user action occurs |
| `onSubmitPrayerPoint` | Triggered when the related user action occurs |
| `onCommitPrayer` | Triggered when the related user action occurs |
| `onSubmitCounselingRequest` | Triggered when the related user action occurs |
| `onOpenCounselingRequest` | Triggered when the related user action occurs |
