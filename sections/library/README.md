# Library

## Overview

Library is the organized archive of Pastor Senga’s teachings, designed for fast browsing and low-distraction discovery. Users can browse by series and topics, search across the archive, open sermon details, and choose audio-first playback with optional video when available.

## User Flows

- Browse the Library by Series and/or Topics to discover teachings
- Open a Series to view its sermons, then filter/sort within the list
- Search across titles, summaries, scripture references, and transcripts/notes to find a specific teaching
- Open a sermon detail view to play audio, watch video (if available), and view transcript/notes (if available)
- Download a sermon’s audio for offline listening (manual downloads only)
- Save/bookmark a sermon or series for quick access later

## Design Decisions

- Mobile-first layout with clear visual hierarchy for primary actions.
- Readable spacing and type scale optimized for low-distraction use.
- Prop-driven interactions to keep UI portable across app architectures.

## Data Shapes

**Entities:** LanguageOption, Viewer, Topic, Series, MediaAsset, SermonAvailability, Sermon, SavedState, ListeningQueueState, Download

**From global entities:** User, Locale, Account, Device

## Visual Reference

See `screenshot.png` for the target UI design.

## Components Provided

- `LibraryHome` — Exportable UI component for library interactions
- `SeriesBrowse` — Exportable UI component for library interactions
- `SermonList` — Exportable UI component for library interactions
- `SermonDetail` — Exportable UI component for library interactions
- `SearchResults` — Exportable UI component for library interactions
- `SearchEmptyState` — Exportable UI component for library interactions
- `Downloads` — Exportable UI component for library interactions

## Callback Props

| Callback | Triggered When |
|----------|---------------|
| `onOpenSeries` | Triggered when the related user action occurs |
| `onOpenTopic` | Triggered when the related user action occurs |
| `onOpenSermon` | Triggered when the related user action occurs |
| `onPlaySermonAudio` | Triggered when the related user action occurs |
| `onWatchSermonVideo` | Triggered when the related user action occurs |
| `onDownloadSermon` | Triggered when the related user action occurs |
| `onRemoveDownload` | Triggered when the related user action occurs |
| `onShareSermon` | Triggered when the related user action occurs |
