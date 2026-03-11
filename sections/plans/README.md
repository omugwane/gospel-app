# Plans

## Overview

Plans is a dynamic section that supports different types of daily plans—Bible reading, devotional, topical studies, and more. Each plan has a fixed number of days with mixed content: video/audio, written messages, and scripture passages. Users can discover plans, save them for later, track progress by day, and filter by My Plans, Find Plans, Saved, and Completed.

## User Flows

- Open Plans and see the active filter (My Plans, Find Plans, Saved, Completed) with a list of plans matching that filter
- Browse or search plans in Find Plans; view plan cards with title, duration (e.g., 7 Days), type, and thumbnail
- Open a plan detail to see description, duration, content types, and actions: Start Plan, Save for Later, Sample
- Start a plan and see the daily structure: Day 1, Day 2, etc., each with a list of content items (devotional, passage, video, audio)
- Tap a content item to open the full content in-app (passage text, written message, or play video/audio)
- Mark content items or days as complete; progress is tracked by day

## Design Decisions

- Mobile-first layout with clear visual hierarchy for primary actions.
- Readable spacing and type scale optimized for low-distraction use.
- Prop-driven interactions to keep UI portable across app architectures.

## Data Shapes

**Entities:** Category, DayContent, PlanDay, Plan, PlanProgress, UserProgress, PlansData

**From global entities:** User, Locale, Account, Device

## Visual Reference

See `screenshot.png` for the target UI design.

## Components Provided

- `PlansHome` — Exportable UI component for plans interactions
- `PlanCard` — Exportable UI component for plans interactions
- `PlanDetail` — Exportable UI component for plans interactions
- `PlanDayView` — Exportable UI component for plans interactions
- `PlanContentReader` — Exportable UI component for plans interactions
- `PlanComplete` — Exportable UI component for plans interactions
- `PlanMissedDays` — Exportable UI component for plans interactions

## Callback Props

| Callback | Triggered When |
|----------|---------------|
| `onFilterChange` | Triggered when the related user action occurs |
| `onOpenPlan` | Triggered when the related user action occurs |
| `onStartPlan` | Triggered when the related user action occurs |
| `onSavePlan` | Triggered when the related user action occurs |
| `onSamplePlan` | Triggered when the related user action occurs |
| `onOpenContent` | Triggered when the related user action occurs |
| `onMarkContentComplete` | Triggered when the related user action occurs |
| `onMarkDayComplete` | Triggered when the related user action occurs |
