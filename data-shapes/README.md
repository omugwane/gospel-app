# UI Data Shapes

These types define the shape of data that the UI components expect to receive as props. They represent the **frontend contract** — what the components need to render correctly.

How you model, store, and fetch this data on the backend is an implementation decision. You may combine, split, or extend these types to fit your architecture.

## Entities

- **ActiveJourney** — UI entity/interface (used in: home)
- **Category** — UI entity/interface (used in: plans)
- **ContinueItem** — UI entity/interface (used in: home)
- **CounselingRequest** — UI entity/interface (used in: fellowship)
- **DailyImbuguro** — UI entity/interface (used in: home)
- **DailyManna** — UI entity/interface (used in: home)
- **DailyVerse** — UI entity/interface (used in: home)
- **DayContent** — UI entity/interface (used in: plans)
- **DetailRoutes** — UI entity/interface (used in: home)
- **DonationRecord** — UI entity/interface (used in: giving)
- **Download** — UI entity/interface (used in: library)
- **FellowshipHighlights** — UI entity/interface (used in: home)
- **FellowshipPresence** — UI entity/interface (used in: fellowship)
- **GivingData** — UI entity/interface (used in: giving)
- **GivingSummary** — UI entity/interface (used in: giving)
- **GivingWizardState** — UI entity/interface (used in: giving)
- **GreetingsByLanguage** — UI entity/interface (used in: home)
- **HeartOfGivingVideo** — UI entity/interface (used in: giving)
- **HomeData** — UI entity/interface (used in: home)
- **ImpactFund** — UI entity/interface (used in: giving)
- **LanguageOption** — UI entity/interface (used in: library)
- **LibraryData** — UI entity/interface (used in: library)
- **ListeningQueueState** — UI entity/interface (used in: library)
- **LiveNow** — UI entity/interface (used in: home)
- **LiveUrgent** — UI entity/interface (used in: home)
- **LocalizedDayGreeting** — UI entity/interface (used in: home)
- **MediaAsset** — UI entity/interface (used in: library)
- **MediaShortcuts** — UI entity/interface (used in: home)
- **NewCounselingRequestInput** — UI entity/interface (used in: fellowship)
- **NewDonationInput** — UI entity/interface (used in: giving)
- **NewPrayerPointInput** — UI entity/interface (used in: fellowship)
- **NewTestimonyInput** — UI entity/interface (used in: fellowship)
- **PaymentMethod** — UI entity/interface (used in: giving)
- **Plan** — UI entity/interface (used in: plans)
- **PlanDay** — UI entity/interface (used in: plans)
- **PlanProgress** — UI entity/interface (used in: plans)
- **PlansData** — UI entity/interface (used in: plans)
- **PrayerPoint** — UI entity/interface (used in: fellowship)
- **PrayerPulse** — UI entity/interface (used in: home)
- **SavedPaymentMethod** — UI entity/interface (used in: giving)
- **SavedState** — UI entity/interface (used in: library)
- **SearchFilters** — UI entity/interface (used in: library)
- **SearchState** — UI entity/interface (used in: library)
- **Series** — UI entity/interface (used in: library)
- **SeriesCard** — UI entity/interface (used in: home)
- **Sermon** — UI entity/interface (used in: library)
- **SermonAvailability** — UI entity/interface (used in: library)
- **Testimony** — UI entity/interface (used in: fellowship)
- **TestimonyMedia** — UI entity/interface (used in: fellowship)
- **TestimonyReactionCounts** — UI entity/interface (used in: fellowship)
- **TestimonySnippet** — UI entity/interface (used in: home)
- **ThankYouContent** — UI entity/interface (used in: giving)
- **Topic** — UI entity/interface (used in: library)
- **UpcomingPrayer** — UI entity/interface (used in: home)
- **UserProgress** — UI entity/interface (used in: plans)
- **VerseTranslation** — UI entity/interface (used in: home)
- **Viewer** — UI entity/interface (used in: home, library)
- **YearlyTotal** — UI entity/interface (used in: giving)

## Per-Section Types

Each section includes its own `types.ts` with the full interface definitions:

- `sections/home/types.ts`
- `sections/library/types.ts`
- `sections/plans/types.ts`
- `sections/fellowship/types.ts`
- `sections/giving/types.ts`

## Combined Reference

See `overview.ts` for all entity types aggregated in one file.
