# Milestone 2: Home

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

Implement the Home feature — A clean home feed for the daily verse and the latest Impuguro (short exhortations), optimized for low data.

## Overview

Home is the digital foyer of the app: a personalized daily dashboard that helps users answer, "What is God saying to me today?" The experience follows a vertical, modular "Scroll of Grace" that surfaces daily manna first, then progress, live urgency, community pulse, and media continuity. It is peaceful, low-friction, and designed to reinforce daily spiritual habit.

**Key Functionality:**
- Open Home and immediately see a contextual greeting plus Daily Manna (Verse of the Day and short Imbuguro audio)
- Share the Verse of the Day to WhatsApp in one tap
- Start the daily Imbuguro directly from the hero section
- Resume plan progress from the Active Journey card and continue today's reading
- See Live & Urgent updates only when a live stream or upcoming prayer is active
- Open Fellowship highlights from Home through a testimony snippet and prayer pulse prompt

## Components Provided

Copy the section components from `product-plan/sections/home/components/`:

- `HomeDashboard` — Home component
- `VerseDetail` — Home component
- `ExhortationDetail` — Home component
- `LivePrayerDetail` — Home component

## Props Reference

The components expect these data shapes (see `types.ts` for full definitions):

**Data props:**

- See `product-plan/sections/home/types.ts` for full interface definitions

**Callback props:**

| Callback | Triggered When |
|----------|---------------|
| `onShareVerse` | Triggered when user performs the related action |
| `onPlayDailyImbuguro` | Triggered when user performs the related action |
| `onContinueJourney` | Triggered when user performs the related action |
| `onOpenLiveNow` | Triggered when user performs the related action |
| `onOpenUpcomingPrayer` | Triggered when user performs the related action |
| `onOpenTestimony` | Triggered when user performs the related action |
| `onJoinPrayerPulse` | Triggered when user performs the related action |
| `onResumeMedia` | Triggered when user performs the related action |
| `onOpenSeries` | Triggered when user performs the related action |
| `onOpenDetailView` | Triggered when user performs the related action |

## Expected User Flows

### Flow 1: User Journey 1

1. User starts from the Home entry point
2. User performs: Open Home and immediately see a contextual greeting plus Daily Manna (Verse of the Day and short Imbuguro audio)
3. User confirms the action and continues
4. **Outcome:** UI reflects expected state and next step
### Flow 2: User Journey 2

1. User starts from the Home entry point
2. User performs: Share the Verse of the Day to WhatsApp in one tap
3. User confirms the action and continues
4. **Outcome:** UI reflects expected state and next step
### Flow 3: User Journey 3

1. User starts from the Home entry point
2. User performs: Start the daily Imbuguro directly from the hero section
3. User confirms the action and continues
4. **Outcome:** UI reflects expected state and next step

## Empty States

The components include empty state designs. Make sure to handle:

- **No data yet:** Show empty-state UI when the primary collection is empty
- **No related records:** Handle nested collections with zero child records
- **First-time experience:** Guide users with clear CTAs for first action

## Testing

See `product-plan/sections/home/tests.md` for UI behavior test specs covering:
- User flow success and failure paths
- Empty state rendering
- Component interactions and edge cases

## Files to Reference

- `product-plan/sections/home/README.md`
- `product-plan/sections/home/tests.md`
- `product-plan/sections/home/components/`
- `product-plan/sections/home/types.ts`
- `product-plan/sections/home/sample-data.json`
- `product-plan/sections/home/screenshot.png`

## Done When

- [ ] Components render with real data
- [ ] Empty states display properly when no records exist
- [ ] All callback props are wired to working functionality
- [ ] User can complete all expected flows end-to-end
- [ ] Matches the visual design (see screenshot)
- [ ] Responsive on mobile
