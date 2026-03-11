# Home

## Overview

Home is the digital foyer of the app: a personalized daily dashboard that helps users answer, "What is God saying to me today?" The experience follows a vertical, modular "Scroll of Grace" that surfaces daily manna first, then progress, live urgency, community pulse, and media continuity. It is peaceful, low-friction, and designed to reinforce daily spiritual habit.

## User Flows

- Open Home and immediately see a contextual greeting plus Daily Manna (Verse of the Day and short Imbuguro audio)
- Share the Verse of the Day to WhatsApp in one tap
- Start the daily Imbuguro directly from the hero section
- Resume plan progress from the Active Journey card and continue today's reading
- See Live & Urgent updates only when a live stream or upcoming prayer is active
- Open Fellowship highlights from Home through a testimony snippet and prayer pulse prompt

## Design Decisions

- Mobile-first layout with clear visual hierarchy for primary actions.
- Readable spacing and type scale optimized for low-distraction use.
- Prop-driven interactions to keep UI portable across app architectures.

## Data Shapes

**Entities:** Viewer, LocalizedDayGreeting, GreetingsByLanguage, VerseTranslation, DailyVerse, DailyImbuguro, DailyManna, ActiveJourney, LiveNow, UpcomingPrayer

**From global entities:** User, Locale, Account, Device

## Visual Reference

See `screenshot.png` for the target UI design.

## Components Provided

- `HomeDashboard` — Exportable UI component for home interactions
- `VerseDetail` — Exportable UI component for home interactions
- `ExhortationDetail` — Exportable UI component for home interactions
- `LivePrayerDetail` — Exportable UI component for home interactions

## Callback Props

| Callback | Triggered When |
|----------|---------------|
| `onShareVerse` | Triggered when the related user action occurs |
| `onPlayDailyImbuguro` | Triggered when the related user action occurs |
| `onContinueJourney` | Triggered when the related user action occurs |
| `onOpenLiveNow` | Triggered when the related user action occurs |
| `onOpenUpcomingPrayer` | Triggered when the related user action occurs |
| `onOpenTestimony` | Triggered when the related user action occurs |
| `onJoinPrayerPulse` | Triggered when the related user action occurs |
| `onResumeMedia` | Triggered when the related user action occurs |
