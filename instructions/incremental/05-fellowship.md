# Milestone 5: Fellowship

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

Implement the Fellowship feature — An interactive fellowship space with Testimony Wall (Ubuhamya), Private Counseling (Inama n'Isengesho), and Interactive Prayer (Gusabirana).

## Overview

Fellowship is the interactive heart of Senga App where believers can move from passive listening to active participation. It combines a card-based hub with three sub-features: Testimony Wall (Ubuhamya), Interactive Prayer (Gusabirana), and Private Counseling (Inama n'Isengesho). The experience is mobile-first, emotionally warm, and clearly separates public community actions from private support requests.

**Key Functionality:**
- User opens Fellowship and lands on a card-based hub with quick access to the three sub-features.
- User enters Testimony Wall, scrolls recent stories, and reacts with "Praise God" or shares a testimony.
- User taps "Share a Testimony," writes a story, optionally posts as Anonymous, and can attach one image or a short audio clip.
- User enters Interactive Prayer, browses prayer points by tag/category, and taps "I'm Praying" to increase the prayer counter.
- User submits a prayer point and chooses visibility: Public or Ministry Only.
- User enters Private Counseling, completes intake form (category, preferred method, description), submits securely, and tracks statuses in "My Requests" (Received, In Review, Scheduled).

## Components Provided

Copy the section components from `product-plan/sections/fellowship/components/`:

- `FellowshipHub` — Fellowship component
- `TestimonyWall` — Fellowship component
- `InteractivePrayer` — Fellowship component
- `PrivateCounseling` — Fellowship component

## Props Reference

The components expect these data shapes (see `types.ts` for full definitions):

**Data props:**

- See `product-plan/sections/fellowship/types.ts` for full interface definitions

**Callback props:**

| Callback | Triggered When |
|----------|---------------|
| `onOpenFeature` | Triggered when user performs the related action |
| `onCreateTestimony` | Triggered when user performs the related action |
| `onReactToTestimony` | Triggered when user performs the related action |
| `onSubmitPrayerPoint` | Triggered when user performs the related action |
| `onCommitPrayer` | Triggered when user performs the related action |
| `onSubmitCounselingRequest` | Triggered when user performs the related action |
| `onOpenCounselingRequest` | Triggered when user performs the related action |

## Expected User Flows

### Flow 1: User Journey 1

1. User starts from the Fellowship entry point
2. User performs: User opens Fellowship and lands on a card-based hub with quick access to the three sub-features.
3. User confirms the action and continues
4. **Outcome:** UI reflects expected state and next step
### Flow 2: User Journey 2

1. User starts from the Fellowship entry point
2. User performs: User enters Testimony Wall, scrolls recent stories, and reacts with "Praise God" or shares a testimony.
3. User confirms the action and continues
4. **Outcome:** UI reflects expected state and next step
### Flow 3: User Journey 3

1. User starts from the Fellowship entry point
2. User performs: User taps "Share a Testimony," writes a story, optionally posts as Anonymous, and can attach one image or a short audio clip.
3. User confirms the action and continues
4. **Outcome:** UI reflects expected state and next step

## Empty States

The components include empty state designs. Make sure to handle:

- **No data yet:** Show empty-state UI when the primary collection is empty
- **No related records:** Handle nested collections with zero child records
- **First-time experience:** Guide users with clear CTAs for first action

## Testing

See `product-plan/sections/fellowship/tests.md` for UI behavior test specs covering:
- User flow success and failure paths
- Empty state rendering
- Component interactions and edge cases

## Files to Reference

- `product-plan/sections/fellowship/README.md`
- `product-plan/sections/fellowship/tests.md`
- `product-plan/sections/fellowship/components/`
- `product-plan/sections/fellowship/types.ts`
- `product-plan/sections/fellowship/sample-data.json`
- `product-plan/sections/fellowship/screenshot.png`

## Done When

- [ ] Components render with real data
- [ ] Empty states display properly when no records exist
- [ ] All callback props are wired to working functionality
- [ ] User can complete all expected flows end-to-end
- [ ] Matches the visual design (see screenshot)
- [ ] Responsive on mobile
