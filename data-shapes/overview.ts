// =============================================================================
// UI Data Shapes — Combined Reference
//
// These types define the data that UI components expect to receive as props.
// They are a frontend contract, not a database schema. How you model, store,
// and fetch this data is an implementation decision.
// =============================================================================

// -----------------------------------------------------------------------------
// From: sections/home
// -----------------------------------------------------------------------------

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

// -----------------------------------------------------------------------------
// From: sections/library
// -----------------------------------------------------------------------------

export type LanguageCode = 'rw' | 'en' | 'fr'


export interface LanguageOption {
  code: LanguageCode
  label: string
}

export interface Viewer {
  userId: string
  displayName: string
  preferredLanguage: LanguageCode
}

export interface Topic {
  id: string
  label: string
  translations?: Partial<Record<LanguageCode, { label: string }>>
}

export interface Series {
  id: string
  title: string
  description: string
  sermonCount: number
  topicIds: string[]
  translations?: Partial<Record<LanguageCode, { title: string; description: string }>>
}

export type MediaKind = 'audio' | 'video'


export interface MediaAsset {
  id: string
  kind: MediaKind
  url: string
  mimeType: string
  byteSize: number
}

export interface SermonAvailability {
  hasAudio: boolean
  hasVideo: boolean
  hasTranscript: boolean
}

export type DownloadState =
  | 'notDownloaded'
  | 'downloading'
  | 'downloaded'
  | 'failed'
  | 'notApplicable'


export interface Sermon {
  id: string
  title: string
  publishedAt: string
  durationSeconds: number
  scriptureReferences: string[]
  summary: string
  seriesId: string | null
  topicIds: string[]
  availability: SermonAvailability
  mediaAssets: MediaAsset[]
  notes: {
    transcript: string
  }
  translations?: Partial<
    Record<
      LanguageCode,
      {
        title: string
        summary: string
        transcript: string
      }
    >
  >
  actions: {
    canPlayAudio: boolean
    canWatchVideo: boolean
    canDownload: boolean
    canShare: boolean
    canSave: boolean
    canAddToQueue: boolean
    canMarkCompleted: boolean
  }
  offline: {
    downloadState: DownloadState
    downloadId?: string
    isRecommendedForDownload?: boolean
  }
}

export interface SavedState {
  savedSermonIds: string[]
  savedSeriesIds: string[]
}

export interface ListeningQueueState {
  queueSermonIds: string[]
}

export interface Download {
  id: string
  mediaAssetId: string
  createdAt: string
  byteSize: number
  state: Exclude<DownloadState, 'notDownloaded' | 'notApplicable'>
}

export interface SearchFilters {
  seriesId: string | null
  topicId: string | null
  hasAudio: boolean | null
  hasVideo: boolean | null
  hasTranscript: boolean | null
}

export interface SearchState {
  query: string
  filters: SearchFilters
  recentQueries: string[]
  resultSermonIds: string[]
}

export interface LibraryData {
  languageOptions?: LanguageOption[]
  viewer: Viewer
  topics: Topic[]
  series: Series[]
  sermons: Sermon[]
  saved: SavedState
  listeningQueue: ListeningQueueState
  downloads: Download[]
  searchState: SearchState
}

// -----------------------------------------------------------------------------
// From: sections/plans
// -----------------------------------------------------------------------------

export type PlanFilter = 'my' | 'find' | 'saved' | 'completed'


export type LanguageCode = 'rw' | 'en' | 'fr'


export type PlanType = 'bible' | 'devotional' | 'topical'


export type DayContentType = 'video' | 'audio' | 'written' | 'passage'


export interface Category {
  id: string
  label: string
}

export interface DayContent {
  id: string
  type: DayContentType
  title: string
  textPreview?: string
  refs?: string
  durationSeconds?: number
  url?: string
}

export interface PlanDay {
  dayNumber: number
  content: DayContent[]
}

export interface Plan {
  id: string
  title: string
  description: string
  durationDays: number
  type: PlanType
  thumbnailUrl?: string
  categoryIds: string[]
  author?: string
  hasAudio: boolean
  hasVideo: boolean
  hasPassages: boolean
  hasWritten: boolean
}

export interface PlanProgress {
  status: 'active' | 'saved' | 'completed'
  currentDayNumber: number
  completedDayIds: number[]
  completedContentIds: string[]
}

export interface UserProgress {
  myPlanIds: string[]
  savedPlanIds: string[]
  completedPlanIds: string[]
  planProgress: Record<string, PlanProgress>
}

export interface PlansData {
  activeFilter: PlanFilter
  categories: Category[]
  plans: Plan[]
  planDays: Record<string, PlanDay[]>
  userProgress: UserProgress
}

// -----------------------------------------------------------------------------
// From: sections/fellowship
// -----------------------------------------------------------------------------

export type PrayerTag = 'Health' | 'Family' | 'Finances' | 'Repentance' | 'Spiritual Growth' | 'Youth'


export type PrayerVisibility = 'Public' | 'Ministry Only'


export type PrayerCategory = 'Health' | 'Family' | 'Finances' | 'Repentance' | 'Spiritual Growth' | 'Youth'


export type TestimonyMediaType = 'image' | 'audio'


export type CounselingCategory = 'Marriage/Family' | 'Business' | 'Spiritual Growth' | 'Youth' | 'Crisis'


export type PreferredCounselingMethod = 'WhatsApp Call' | 'In-person at church' | 'Email'


export type CounselingRequestStatus = 'Received' | 'In Review' | 'Scheduled'


export interface FellowshipPresence {
  onlineBelievers: number
  lastUpdatedAt: string
  headline: string
}

export interface TestimonyReactionCounts {
  praiseGodCount: number
  shareCount: number
  viewerPraised: boolean
}

export interface TestimonyMedia {
  type: TestimonyMediaType
  url: string
  durationSeconds?: number
}

export interface Testimony {
  id: string
  displayName: string
  isAnonymous: boolean
  location: string
  content: string
  createdAt: string
  reactions: TestimonyReactionCounts
  media: TestimonyMedia[]
}

export interface PrayerPoint {
  id: string
  title: string
  details: string
  category: PrayerCategory
  visibility: PrayerVisibility
  submittedBy: string
  createdAt: string
  prayedCount: number
  viewerHasPrayed: boolean
  tags: PrayerTag[]
}

export interface CounselingRequest {
  id: string
  category: CounselingCategory
  preferredMethod: PreferredCounselingMethod
  description: string
  status: CounselingRequestStatus
  submittedAt: string
  nextStep: string
  isConfidential: boolean
}

export interface NewTestimonyInput {
  content: string
  isAnonymous: boolean
  location?: string
  media?: TestimonyMedia
}

export interface NewPrayerPointInput {
  title: string
  details: string
  category: PrayerCategory
  visibility: PrayerVisibility
  tags: PrayerTag[]
}

export interface NewCounselingRequestInput {
  category: CounselingCategory
  preferredMethod: PreferredCounselingMethod
  description: string
}

// -----------------------------------------------------------------------------
// From: sections/giving
// -----------------------------------------------------------------------------

export type CurrencyCode = 'RWF' | 'USD' | 'EUR' | 'CAD'


export type GivingStep = 'amount' | 'category' | 'payment' | 'review' | 'success'


export type GivingFrequency = 'one_time' | 'monthly'


export type PaymentMethodType = 'mobile_money' | 'card' | 'wallet'


export type DonationStatus = 'succeeded' | 'processing' | 'failed'


export type RecurringInterval = 'monthly'


export interface HeartOfGivingVideo {
  title: string
  durationSeconds: number
  thumbnailUrl: string
  videoUrl: string
  message: string
}

export interface ImpactFund {
  id: string
  title: string
  description: string
  goalAmount: number
  raisedAmount: number
  currency: CurrencyCode
}

export interface PaymentMethod {
  id: string
  label: string
  type: PaymentMethodType
  region: string
  isEnabled: boolean
}

export interface SavedPaymentMethod {
  id: string
  label: string
  methodType: PaymentMethodType
  provider: string
  isDefault: boolean
}

export interface GivingWizardState {
  step: GivingStep
  currency: CurrencyCode
  amount: number
  categoryId: string
  frequency: GivingFrequency
  isAnonymous: boolean
  selectedPaymentMethodId: string
  savePaymentMethod: boolean
}

export interface DonationRecord {
  id: string
  date: string
  fundId: string
  fundTitle: string
  amount: number
  currency: CurrencyCode
  frequency: GivingFrequency
  paymentMethodLabel: string
  status: DonationStatus
  isAnonymous: boolean
  receiptNumber: string
}

export interface YearlyTotal {
  currency: CurrencyCode
  amount: number
}

export interface GivingSummary {
  selectedYear: number
  yearlyTotal: YearlyTotal
  successfulDonationsCount: number
  recurringDonationsCount: number
}

export interface ThankYouContent {
  title: string
  message: string
  videoUrl: string
  durationSeconds: number
}

export interface NewDonationInput {
  amount: number
  currency: CurrencyCode
  categoryId: string
  paymentMethodId: string
  frequency: GivingFrequency
  isAnonymous: boolean
  savePaymentMethod: boolean
}

export interface GivingData {
  gatewayProvider: string
  securityBadgeText: string
  heartOfGivingVideo: HeartOfGivingVideo
  impactFunds: ImpactFund[]
  paymentMethods: PaymentMethod[]
  currencyOptions: CurrencyCode[]
  presetAmountsByCurrency: Record<CurrencyCode, number[]>
  givingWizardState: GivingWizardState
  savedPaymentMethods: SavedPaymentMethod[]
  availableRecurringIntervals: RecurringInterval[]
  donationHistory: DonationRecord[]
  givingSummary: GivingSummary
  thankYouContent: ThankYouContent
  recentReceiptDownloads: string[]
}
