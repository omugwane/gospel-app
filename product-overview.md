# Senga App — Product Overview

## Summary

Senga App is an offline-first PWA that brings Pastor Senga’s teachings into one focused, distraction-free home for low-data listeners in Rwanda and the diaspora. It delivers daily scripture + exhortations, a searchable sermon library with audio-first playback, and an interactive fellowship space—without the noise of algorithmic platforms.

## Planned Sections

1. **Home** — A clean home feed for the daily verse and the latest Impuguro (short exhortations), optimized for low data.
2. **Library** — A sermon archive organized by series and topic, with audio-first playback and fast search.
3. **Plans** — Dynamic daily plans supporting different types (Bible reading, devotional, etc.) with video/audio, written messages, and passages. Filter by My Plans, Find Plans, Saved, Completed.
4. **Fellowship** — An interactive fellowship space with Testimony Wall (Ubuhamya), Private Counseling (Inama n'Isengesho), and Interactive Prayer (Gusabirana).
5. **Giving** — A giving portal that supports Mobile Money (MTN/Airtel) and international payment options for the diaspora.

## Product Entities

- **User** — A person who uses the app to read, listen, receive updates, and support the ministry.
- **Locale** — The user’s preferred display language (e.g., Kinyarwanda, English, French). Stored at app level and applied across all sections for both content and UI labels.
- **Account** — The user’s login identity, used to sync progress and personalize the experience across devices.
- **Device** — A phone or tablet registered for notifications and offline downloads.
- **Verse** — A scripture reference and text (e.g., “Daniel 6:10”) used in the daily feed. Supports translations for multiple locales.
- **Exhortation** — A short daily encouragement (“Impuguro”) that can be text and/or a short audio clip. Supports translations for multiple locales.
- **Sermon** — A full teaching message with metadata (title, date, topic) and attached audio/video media. Supports translations for multiple locales.
- **Series** — A collection that groups sermons into a structured set (e.g., “Book of Daniel”, “Marriage & Family”). Supports translations for multiple locales.
- **MediaAsset** — A playable media file for a sermon or exhortation (audio-only or video).
- **Download** — A record of offline content saved to a device for listening without data.
- **Testimony** — A story shared by a user about what God has done, with optional reactions such as likes and shares.
- **CounselingRequest** — A private request from a user asking for guidance, prayer, or a one-on-one session with the ministry team.
- **PrayerPoint** — A prayer need shared in the fellowship space that others can commit to pray for.
- **PrayerCommitment** — A record that a user has clicked "I'm Praying" on a specific prayer point.
- **Donation** — A contribution made by a user, including amount, currency, and status.
- **Payment** — The transaction record for a donation (e.g., Mobile Money, Stripe/PayPal), including provider references and receipts.

## Design System

**Colors:**
- Primary: violet
- Secondary: amber
- Neutral: stone

**Typography:**
- Heading: DM Sans
- Body: DM Sans
- Mono: IBM Plex Mono

## Implementation Sequence

Build this product in milestones:

1. **Shell** — Set up design tokens and application shell
2. **Home** — A clean home feed for the daily verse and the latest Impuguro (short exhortations), optimized for low data.
3. **Library** — A sermon archive organized by series and topic, with audio-first playback and fast search.
4. **Plans** — Dynamic daily plans supporting different types (Bible reading, devotional, etc.) with video/audio, written messages, and passages. Filter by My Plans, Find Plans, Saved, Completed.
5. **Fellowship** — An interactive fellowship space with Testimony Wall (Ubuhamya), Private Counseling (Inama n'Isengesho), and Interactive Prayer (Gusabirana).
6. **Giving** — A giving portal that supports Mobile Money (MTN/Airtel) and international payment options for the diaspora.

Each milestone has a dedicated instruction document in `product-plan/instructions/`.
