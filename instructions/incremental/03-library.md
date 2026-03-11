# Milestone 3: Library

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

Implement the Library feature — A sermon archive organized by series and topic, with audio-first playback and fast search.

## Overview

Library is the organized archive of Pastor Senga’s teachings, designed for fast browsing and low-distraction discovery. Users can browse by series and topics, search across the archive, open sermon details, and choose audio-first playback with optional video when available.

**Key Functionality:**
- Browse the Library by Series and/or Topics to discover teachings
- Open a Series to view its sermons, then filter/sort within the list
- Search across titles, summaries, scripture references, and transcripts/notes to find a specific teaching
- Open a sermon detail view to play audio, watch video (if available), and view transcript/notes (if available)
- Download a sermon’s audio for offline listening (manual downloads only)
- Save/bookmark a sermon or series for quick access later

## Components Provided

Copy the section components from `product-plan/sections/library/components/`:

- `LibraryHome` — Library component
- `SeriesBrowse` — Library component
- `SermonList` — Library component
- `SermonDetail` — Library component
- `SearchResults` — Library component
- `SearchEmptyState` — Library component
- `Downloads` — Library component

## Props Reference

The components expect these data shapes (see `types.ts` for full definitions):

**Data props:**

- See `product-plan/sections/library/types.ts` for full interface definitions

**Callback props:**

| Callback | Triggered When |
|----------|---------------|
| `onOpenSeries` | Triggered when user performs the related action |
| `onOpenTopic` | Triggered when user performs the related action |
| `onOpenSermon` | Triggered when user performs the related action |
| `onPlaySermonAudio` | Triggered when user performs the related action |
| `onWatchSermonVideo` | Triggered when user performs the related action |
| `onDownloadSermon` | Triggered when user performs the related action |
| `onRemoveDownload` | Triggered when user performs the related action |
| `onShareSermon` | Triggered when user performs the related action |
| `onToggleSaveSermon` | Triggered when user performs the related action |
| `onToggleSaveSeries` | Triggered when user performs the related action |

## Expected User Flows

### Flow 1: User Journey 1

1. User starts from the Library entry point
2. User performs: Browse the Library by Series and/or Topics to discover teachings
3. User confirms the action and continues
4. **Outcome:** UI reflects expected state and next step
### Flow 2: User Journey 2

1. User starts from the Library entry point
2. User performs: Open a Series to view its sermons, then filter/sort within the list
3. User confirms the action and continues
4. **Outcome:** UI reflects expected state and next step
### Flow 3: User Journey 3

1. User starts from the Library entry point
2. User performs: Search across titles, summaries, scripture references, and transcripts/notes to find a specific teaching
3. User confirms the action and continues
4. **Outcome:** UI reflects expected state and next step

## Empty States

The components include empty state designs. Make sure to handle:

- **No data yet:** Show empty-state UI when the primary collection is empty
- **No related records:** Handle nested collections with zero child records
- **First-time experience:** Guide users with clear CTAs for first action

## Testing

See `product-plan/sections/library/tests.md` for UI behavior test specs covering:
- User flow success and failure paths
- Empty state rendering
- Component interactions and edge cases

## Files to Reference

- `product-plan/sections/library/README.md`
- `product-plan/sections/library/tests.md`
- `product-plan/sections/library/components/`
- `product-plan/sections/library/types.ts`
- `product-plan/sections/library/sample-data.json`
- `product-plan/sections/library/screenshot.png`

## Done When

- [ ] Components render with real data
- [ ] Empty states display properly when no records exist
- [ ] All callback props are wired to working functionality
- [ ] User can complete all expected flows end-to-end
- [ ] Matches the visual design (see screenshot)
- [ ] Responsive on mobile
