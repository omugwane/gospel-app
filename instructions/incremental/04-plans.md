# Milestone 4: Plans

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

Implement the Plans feature — Dynamic daily plans supporting different types (Bible reading, devotional, etc.) with video/audio, written messages, and passages. Filter by My Plans, Find Plans, Saved, Completed.

## Overview

Plans is a dynamic section that supports different types of daily plans—Bible reading, devotional, topical studies, and more. Each plan has a fixed number of days with mixed content: video/audio, written messages, and scripture passages. Users can discover plans, save them for later, track progress by day, and filter by My Plans, Find Plans, Saved, and Completed.

**Key Functionality:**
- Open Plans and see the active filter (My Plans, Find Plans, Saved, Completed) with a list of plans matching that filter
- Browse or search plans in Find Plans; view plan cards with title, duration (e.g., 7 Days), type, and thumbnail
- Open a plan detail to see description, duration, content types, and actions: Start Plan, Save for Later, Sample
- Start a plan and see the daily structure: Day 1, Day 2, etc., each with a list of content items (devotional, passage, video, audio)
- Tap a content item to open the full content in-app (passage text, written message, or play video/audio)
- Mark content items or days as complete; progress is tracked by day

## Components Provided

Copy the section components from `product-plan/sections/plans/components/`:

- `PlansHome` — Plans component
- `PlanCard` — Plans component
- `PlanDetail` — Plans component
- `PlanDayView` — Plans component
- `PlanContentReader` — Plans component
- `PlanComplete` — Plans component
- `PlanMissedDays` — Plans component

## Props Reference

The components expect these data shapes (see `types.ts` for full definitions):

**Data props:**

- See `product-plan/sections/plans/types.ts` for full interface definitions

**Callback props:**

| Callback | Triggered When |
|----------|---------------|
| `onFilterChange` | Triggered when user performs the related action |
| `onOpenPlan` | Triggered when user performs the related action |
| `onStartPlan` | Triggered when user performs the related action |
| `onSavePlan` | Triggered when user performs the related action |
| `onSamplePlan` | Triggered when user performs the related action |
| `onOpenContent` | Triggered when user performs the related action |
| `onMarkContentComplete` | Triggered when user performs the related action |
| `onMarkDayComplete` | Triggered when user performs the related action |
| `onPlanComplete` | Triggered when user performs the related action |
| `onRatePlan` | Triggered when user performs the related action |

## Expected User Flows

### Flow 1: User Journey 1

1. User starts from the Plans entry point
2. User performs: Open Plans and see the active filter (My Plans, Find Plans, Saved, Completed) with a list of plans matching that filter
3. User confirms the action and continues
4. **Outcome:** UI reflects expected state and next step
### Flow 2: User Journey 2

1. User starts from the Plans entry point
2. User performs: Browse or search plans in Find Plans; view plan cards with title, duration (e.g., 7 Days), type, and thumbnail
3. User confirms the action and continues
4. **Outcome:** UI reflects expected state and next step
### Flow 3: User Journey 3

1. User starts from the Plans entry point
2. User performs: Open a plan detail to see description, duration, content types, and actions: Start Plan, Save for Later, Sample
3. User confirms the action and continues
4. **Outcome:** UI reflects expected state and next step

## Empty States

The components include empty state designs. Make sure to handle:

- **No data yet:** Show empty-state UI when the primary collection is empty
- **No related records:** Handle nested collections with zero child records
- **First-time experience:** Guide users with clear CTAs for first action

## Testing

See `product-plan/sections/plans/tests.md` for UI behavior test specs covering:
- User flow success and failure paths
- Empty state rendering
- Component interactions and edge cases

## Files to Reference

- `product-plan/sections/plans/README.md`
- `product-plan/sections/plans/tests.md`
- `product-plan/sections/plans/components/`
- `product-plan/sections/plans/types.ts`
- `product-plan/sections/plans/sample-data.json`
- `product-plan/sections/plans/screenshot.png`

## Done When

- [ ] Components render with real data
- [ ] Empty states display properly when no records exist
- [ ] All callback props are wired to working functionality
- [ ] User can complete all expected flows end-to-end
- [ ] Matches the visual design (see screenshot)
- [ ] Responsive on mobile
