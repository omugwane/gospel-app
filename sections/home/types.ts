export type LanguageCode = 'rw' | 'en' | 'fr'
export type DayPart = 'morning' | 'afternoon' | 'evening'

export interface Viewer {
  userId: string
  displayName: string
  locale: LanguageCode
  dayPart: DayPart
}

export interface LocalizedDayGreeting {
  morning: string
  afternoon: string
  evening: string
}

export interface GreetingsByLanguage {
  rw: LocalizedDayGreeting
  en: LocalizedDayGreeting
  fr: LocalizedDayGreeting
}

export interface VerseTranslation {
  text: string
}

export interface DailyVerse {
  id: string
  reference: string
  translations: Record<LanguageCode, VerseTranslation>
  share: {
    enabled: boolean
    target: 'whatsapp' | 'system'
  }
}

export interface DailyImbuguro {
  id: string
  title: string
  durationSeconds: number
  audioUrl: string
  summary: string
  transcript: string
}

export interface DailyManna {
  date: string
  verse: DailyVerse
  dailyImbuguro: DailyImbuguro
}

export interface ActiveJourney {
  planId: string
  planTitle: string
  week: number
  day: number
  todayReading: string
  progressPercent: number
  ctaLabel: string
}

export type LiveStatus = 'live' | 'upcoming' | 'idle'

export interface LiveNow {
  status: LiveStatus
  title: string
  platform: 'YouTube' | 'Radio' | 'Other'
  startedAt: string
  watchUrl: string
}

export interface UpcomingPrayer {
  id: string
  title: string
  startsInHours: number
  startsAt: string
  participantPreview: string[]
}

export interface LiveUrgent {
  isVisible: boolean
  liveNow: LiveNow
  upcomingPrayer: UpcomingPrayer
}

export interface TestimonySnippet {
  id: string
  author: string
  title: string
  snippet: string
  postedAt: string
}

export interface PrayerPulse {
  activeCount: number
  prompt: string
}

export interface FellowshipHighlights {
  testimonySnippet: TestimonySnippet
  prayerPulse: PrayerPulse
}

export type MediaKind = 'audio' | 'video'

export interface ContinueItem {
  id: string
  seriesId: string
  seriesTitle: string
  itemTitle: string
  progressPercent: number
  remainingMinutes: number
  kind: MediaKind
}

export interface SeriesCard {
  id: string
  title: string
  thumbnailUrl: string
  itemCount: number
  updatedAt: string
}

export interface MediaShortcuts {
  continueItem: ContinueItem
  newestSeries: SeriesCard[]
}

export interface DetailRoutes {
  verse: string
  exhortation: string
  live: string
  testimony: string
  media: string
}

export interface HomeData {
  viewer: Viewer
  greetings: GreetingsByLanguage
  dailyManna: DailyManna
  activeJourney: ActiveJourney
  liveUrgent: LiveUrgent
  fellowshipHighlights: FellowshipHighlights
  mediaShortcuts: MediaShortcuts
  detailRoutes: DetailRoutes
}

export interface HomeTranslations {
  homeTitle?: string
  heroLabel?: string
  shareVerse?: string
  playTodayWord?: string
  activeJourney?: string
  continueReading?: string
  liveNow?: string
  upcomingPrayer?: string
  fellowshipPulse?: string
  continueListening?: string
  newestSeries?: string
}

export interface HomeProps {
  data: HomeData
  locale: LanguageCode
  translations?: Partial<HomeTranslations>
  /**
   * Fired when the user shares the daily verse.
   */
  onShareVerse?: (verseId: string, target: 'whatsapp' | 'system') => void
  /**
   * Fired when the user starts the daily Imbuguro audio.
   */
  onPlayDailyImbuguro?: (imbuguroId: string) => void
  /**
   * Fired when the user opens today's active journey reading.
   */
  onContinueJourney?: (planId: string) => void
  /**
   * Fired when the user opens the live session details.
   */
  onOpenLiveNow?: (watchUrl: string) => void
  /**
   * Fired when the user joins or opens upcoming prayer details.
   */
  onOpenUpcomingPrayer?: (prayerId: string) => void
  /**
   * Fired when the user opens the highlighted testimony.
   */
  onOpenTestimony?: (testimonyId: string) => void
  /**
   * Fired when the user joins the active prayer pulse.
   */
  onJoinPrayerPulse?: () => void
  /**
   * Fired when the user resumes in-progress media.
   */
  onResumeMedia?: (mediaId: string) => void
  /**
   * Fired when the user opens a series card from shortcuts.
   */
  onOpenSeries?: (seriesId: string) => void
  /**
   * Fired when the user opens one of the dedicated home detail views.
   */
  onOpenDetailView?: (route: string) => void
}
