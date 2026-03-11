/**
 * Plans section types
 * Inferred from product/sections/plans/data.json
 */

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

export interface PlansTranslations {
  plansTitle?: string
  plansSubtitle?: string
  myPlans?: string
  findPlans?: string
  savedPlans?: string
  completedPlans?: string
  searchPlansPlaceholder?: string
  allCategories?: string
  noActivePlans?: string
  noPlansMatch?: string
  noPlansYet?: string
  noSavedPlans?: string
  noCompletedPlans?: string
  startFromFindPlansHint?: string
  tryDifferentSearchHint?: string
  plansWillAppearHint?: string
  savePlansHint?: string
  completedPlansHint?: string
  day?: string
  days?: string
  start?: string
  continue?: string
  view?: string
  save?: string
  saved?: string
  bible?: string
  devotional?: string
  topical?: string
  audio?: string
  video?: string
  written?: string
  passage?: string
  startPlan?: string
  saveForLater?: string
  sample?: string
  description?: string
  featuredPlans?: string
  related?: string
  open?: string
  dayByDaySubtitle?: string
  missedDays?: string
  onTrack?: string
  items?: string
  startReading?: string
  noDayContent?: string
  back?: string
  close?: string
  markComplete?: string
  scripture?: string
  devotionalReflection?: string
  videoPlayer?: string
  audioPlayer?: string
  mediaSource?: string
  scripturePlaceholder?: string
  reflectionPlaceholder?: string
  planCompletedTitle?: string
  planCompletedMessage?: string
  howWouldYouRate?: string
  optionalFeedback?: string
  noRating?: string
  missedDaysTitle?: string
  missedDaysSubtitle?: string
  missedCount?: string
  caughtUp?: string
  openDay?: string
}

export const DEFAULT_PLANS_TRANSLATIONS: PlansTranslations = {
  plansTitle: 'Plans',
  plansSubtitle: 'Daily plans with video, audio, and scripture. Start one, save for later, or discover something new.',
  myPlans: 'My Plans',
  findPlans: 'Find Plans',
  savedPlans: 'Saved',
  completedPlans: 'Completed',
  searchPlansPlaceholder: 'Search plans by title, description, or author...',
  allCategories: 'All',
  noActivePlans: 'No active plans',
  noPlansMatch: 'No plans match',
  noPlansYet: 'No plans yet',
  noSavedPlans: 'No saved plans',
  noCompletedPlans: 'No completed plans',
  startFromFindPlansHint: 'Start a plan from Find Plans to see it here.',
  tryDifferentSearchHint: 'Try a different search or category.',
  plansWillAppearHint: 'Plans will appear here when available.',
  savePlansHint: 'Save plans from Find Plans to access them later.',
  completedPlansHint: 'Completed plans will appear here.',
  day: 'Day',
  days: 'Days',
  start: 'Start',
  continue: 'Continue',
  view: 'View',
  save: 'Save',
  saved: 'Saved',
  bible: 'Bible',
  devotional: 'Devotional',
  topical: 'Topical',
  audio: 'Audio',
  video: 'Video',
  written: 'Written',
  passage: 'Passage',
  startPlan: 'Start Plan',
  saveForLater: 'Save for Later',
  sample: 'Sample',
  description: 'Description',
  featuredPlans: 'Featured Plans',
  related: 'Related',
  open: 'Open',
  dayByDaySubtitle: 'Day-by-day content with completion tracking',
  missedDays: 'Missed Days',
  onTrack: 'On track',
  items: 'items',
  startReading: 'Start Reading',
  noDayContent: 'No day content is available for this plan yet.',
  back: 'Back',
  close: 'Close',
  markComplete: 'Mark complete',
  scripture: 'Scripture',
  devotionalReflection: 'Devotional Reflection',
  videoPlayer: 'Video Player',
  audioPlayer: 'Audio Player',
  mediaSource: 'Media source',
  scripturePlaceholder: 'Scripture text appears here in the full reading experience. This preview keeps the layout lightweight for low-data usage.',
  reflectionPlaceholder: 'Reflection text appears here. Keep typography calm and readable for longer devotional reading.',
  planCompletedTitle: 'Plan completed!',
  planCompletedMessage: 'Great work finishing this plan. Keep the momentum going with another plan.',
  howWouldYouRate: 'How would you rate this plan?',
  optionalFeedback: 'Optional feedback helps recommend better plans.',
  noRating: 'No rating',
  missedDaysTitle: 'Missed Days',
  missedDaysSubtitle: 'Pick a missed day to continue where you left off.',
  missedCount: 'missed',
  caughtUp: "You're all caught up. No missed days right now.",
  openDay: 'Open day',
}

export interface PlansProps {
  data: PlansData
  /** App-level locale; used for UI formatting and label selection. */
  locale: LanguageCode
  /** Translated UI labels; falls back to DEFAULT_PLANS_TRANSLATIONS when omitted. */
  translations?: Partial<PlansTranslations>
  /** Called when the user changes the filter (My Plans, Find Plans, Saved, Completed) */
  onFilterChange?: (filter: PlanFilter) => void
  /** Called when the user taps a plan to view its detail */
  onOpenPlan?: (plan: Plan) => void
  /** Called when the user taps Start Plan */
  onStartPlan?: (plan: Plan) => void
  /** Called when the user taps Save for Later */
  onSavePlan?: (plan: Plan) => void
  /** Called when the user taps Sample to preview a plan */
  onSamplePlan?: (plan: Plan) => void
  /** Called when the user taps a content item to open full content (passage, written, video, audio) */
  onOpenContent?: (content: DayContent, plan: Plan, dayNumber: number) => void
  /** Called when the user marks a content item as complete */
  onMarkContentComplete?: (contentId: string, planId: string, dayNumber: number) => void
  /** Called when the user marks a day as complete */
  onMarkDayComplete?: (planId: string, dayNumber: number) => void
  /** Called when the user completes a plan (e.g., last day done) */
  onPlanComplete?: (plan: Plan) => void
  /** Called when the user rates a completed plan */
  onRatePlan?: (planId: string, rating: number) => void
  /** Called when the user searches for plans (Find Plans) */
  onSearch?: (query: string) => void
}
