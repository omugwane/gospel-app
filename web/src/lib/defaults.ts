/**
 * Default placeholder data for user-specific state.
 * Used when Sanity/Firebase return empty or before auth is connected.
 */

import type { LanguageCode } from '@/product/sections/home/types'

export const defaultViewer = {
  userId: 'usr_001',
  displayName: 'Guest',
  locale: 'rw' as LanguageCode,
  dayPart: 'morning' as const,
}

export const defaultGreetings = {
  rw: { morning: 'Mwaramutse', afternoon: 'Mwiriwe', evening: 'Mwiriwe neza' },
  en: { morning: 'Good morning', afternoon: 'Good afternoon', evening: 'Good evening' },
  fr: { morning: 'Bonjour', afternoon: 'Bon après-midi', evening: 'Bonsoir' },
}

export const defaultActiveJourney = {
  planId: '',
  planTitle: '',
  week: 0,
  day: 0,
  todayReading: '',
  progressPercent: 0,
  ctaLabel: 'Continue Reading',
}

export const defaultLiveUrgent = {
  isVisible: false,
  liveNow: {
    status: 'idle' as const,
    title: '',
    platform: 'YouTube' as const,
    startedAt: '',
    watchUrl: '',
  },
  upcomingPrayer: {
    id: '',
    title: '',
    startsInHours: 0,
    startsAt: '',
    participantPreview: [] as string[],
  },
}

export const defaultFellowshipHighlights = {
  testimonySnippet: {
    id: '',
    author: '',
    title: '',
    snippet: '',
    postedAt: '',
  },
  prayerPulse: {
    activeCount: 0,
    prompt: '',
  },
}

export const defaultMediaShortcuts = {
  continueItem: {
    id: '',
    seriesId: '',
    seriesTitle: '',
    itemTitle: '',
    progressPercent: 0,
    remainingMinutes: 0,
    kind: 'audio' as const,
  },
  newestSeries: [] as { id: string; title: string; thumbnailUrl: string; itemCount: number; updatedAt: string }[],
}

export const defaultLibraryViewer = {
  userId: 'usr_001',
  displayName: 'Guest',
  preferredLanguage: 'rw' as LanguageCode,
}

export const defaultLibrarySaved = { savedSermonIds: [] as string[], savedSeriesIds: [] as string[] }
export const defaultListeningQueue = { queueSermonIds: [] as string[] }
export const defaultDownloads = [] as { id: string; mediaAssetId: string; createdAt: string; byteSize: number; state: string }[]
export const defaultSearchState = {
  query: '',
  filters: {
    seriesId: null as string | null,
    topicId: null as string | null,
    hasAudio: null as boolean | null,
    hasVideo: null as boolean | null,
    hasTranscript: null as boolean | null,
  },
  recentQueries: [] as string[],
  resultSermonIds: [] as string[],
}

export const defaultPlansCategories = [
  { id: 'cat-1', label: 'New to Faith' },
  { id: 'cat-2', label: 'Lent & Easter' },
  { id: 'cat-3', label: 'Listen & Watch' },
  { id: 'cat-4', label: 'Bible' },
]
export const defaultPlansUserProgress = {
  myPlanIds: [] as string[],
  savedPlanIds: [] as string[],
  completedPlanIds: [] as string[],
  planProgress: {} as Record<string, { status: 'active' | 'saved' | 'completed'; currentDayNumber: number; completedDayIds: number[]; completedContentIds: string[] }>,
}

export const defaultGivingState = {
  gatewayProvider: 'Flutterwave',
  securityBadgeText: 'Secured by Flutterwave • HTTPS Encrypted',
  paymentMethods: [] as { id: string; label: string; type: string; region: string; isEnabled: boolean }[],
  currencyOptions: ['RWF', 'USD', 'EUR', 'CAD'] as const,
  presetAmountsByCurrency: {
    RWF: [5000, 20000, 50000, 100000],
    USD: [5, 20, 50, 100],
    EUR: [5, 20, 50],
    CAD: [10, 25, 50],
  } as Record<string, number[]>,
  givingWizardState: {
    step: 'amount' as const,
    currency: 'RWF' as const,
    amount: 20000,
    categoryId: '',
    frequency: 'one_time' as const,
    isAnonymous: false,
    selectedPaymentMethodId: '',
    savePaymentMethod: false,
  },
  savedPaymentMethods: [] as { id: string; label: string; methodType: string; provider: string; isDefault: boolean }[],
  availableRecurringIntervals: ['monthly'] as const,
  donationHistory: [] as { id: string; date: string; fundId: string; fundTitle: string; amount: number; currency: string; frequency: string; paymentMethodLabel: string; status: string; isAnonymous: boolean; receiptNumber: string }[],
  givingSummary: {
    selectedYear: new Date().getFullYear(),
    yearlyTotal: { currency: 'RWF' as const, amount: 0 },
    successfulDonationsCount: 0,
    recurringDonationsCount: 0,
  },
  recentReceiptDownloads: [] as string[],
}

export function defaultDetailRoutes(
  verseId: string,
  exhortationId: string,
  seriesId: string,
  _liveId = 'live',
  _testimonyId = 'testimony'
) {
  return {
    verse: `/home/verse/${verseId || 'verse'}`,
    exhortation: `/home/exhortation/${exhortationId || 'exhortation'}`,
    live: `/home/live/${_liveId}`,
    testimony: `/fellowship/testimony/${_testimonyId}`,
    media: `/library/series/${seriesId || 'series'}`,
  }
}
