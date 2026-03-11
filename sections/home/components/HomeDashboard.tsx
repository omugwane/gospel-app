import { useMemo } from 'react'
import {
  ArrowRight,
  BookHeart,
  CirclePlay,
  HeartHandshake,
  Play,
  Radio,
  Share2,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type {
  HomeProps,
  HomeTranslations,
  LanguageCode,
} from '@/../product/sections/home/types'

const DEFAULT_HOME_TRANSLATIONS: HomeTranslations = {
  homeTitle: 'Home',
  heroLabel: 'Daily Manna',
  shareVerse: 'Share to WhatsApp',
  playTodayWord: "Play today's word",
  activeJourney: 'Active Journey',
  continueReading: 'Continue Reading',
  liveNow: 'Live Now',
  upcomingPrayer: 'Upcoming Prayer',
  fellowshipPulse: 'Fellowship Highlights',
  continueListening: 'Continue Listening',
  newestSeries: 'Newest Series',
}

function pickVerseText(translations: Record<LanguageCode, { text: string }>, locale: LanguageCode) {
  const order: LanguageCode[] = [locale, 'rw', 'en', 'fr']
  for (const code of order) {
    const text = translations[code]?.text?.trim()
    if (text) {
      return { code, text }
    }
  }
  return { code: locale, text: '' }
}

function greetingFor(
  locale: LanguageCode,
  dayPart: 'morning' | 'afternoon' | 'evening',
  greetings: Record<LanguageCode, { morning: string; afternoon: string; evening: string }>
) {
  return greetings[locale]?.[dayPart] ?? greetings.rw[dayPart]
}

function formatDuration(seconds: number) {
  if (seconds <= 0) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

function formatUpdatedAt(dateIso: string) {
  const date = new Date(dateIso)
  return Number.isNaN(date.getTime())
    ? ''
    : date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export function HomeDashboard({
  data,
  locale,
  translations,
  onShareVerse,
  onPlayDailyImbuguro,
  onContinueJourney,
  onOpenLiveNow,
  onOpenUpcomingPrayer,
  onOpenTestimony,
  onJoinPrayerPulse,
  onResumeMedia,
  onOpenSeries,
  onOpenDetailView,
}: HomeProps) {
  const t = useMemo(() => ({ ...DEFAULT_HOME_TRANSLATIONS, ...translations }), [translations])
  const verse = data.dailyManna.verse
  const verseText = pickVerseText(verse.translations, locale)
  const greeting = greetingFor(locale, data.viewer.dayPart, data.greetings)

  return (
    <div className="w-full bg-stone-50/90 dark:bg-stone-950/40">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="space-y-6">
          <section className="rounded-3xl border border-stone-200/80 bg-white/90 p-5 shadow-sm dark:border-stone-800 dark:bg-stone-950/70 sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500 dark:text-stone-400">
              {t.homeTitle}
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-50 sm:text-3xl">
              {greeting} {data.viewer.displayName}
            </h1>
            <p className="mt-1 inline-flex items-center gap-2 rounded-full bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-800 dark:bg-violet-400/15 dark:text-violet-100">
              <Sparkles className="h-3.5 w-3.5" />
              {t.heroLabel}
            </p>

            <div className="mt-5 grid gap-4 lg:grid-cols-[1.7fr_1fr]">
              <div className="rounded-2xl border border-violet-200/70 bg-gradient-to-br from-violet-600 to-violet-700 p-5 text-violet-50 shadow-sm dark:border-violet-400/40 dark:from-violet-500 dark:to-violet-700 sm:p-6">
                <button
                  type="button"
                  onClick={() => onOpenDetailView?.(data.detailRoutes.verse)}
                  className="w-full text-left"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-100/80">
                    {verse.reference}
                  </p>
                  <p className="mt-3 text-base leading-relaxed sm:text-lg">
                    {verseText.text}
                  </p>
                </button>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onShareVerse?.(verse.id, verse.share.target)}
                    className="inline-flex items-center gap-2 rounded-xl bg-white/90 px-3 py-2 text-xs font-semibold text-violet-800 transition hover:bg-white"
                  >
                    <Share2 className="h-4 w-4" />
                    {t.shareVerse}
                  </button>
                  {verseText.code !== locale ? (
                    <span className="rounded-xl bg-violet-800/40 px-2 py-1 text-[11px] font-semibold text-violet-100">
                      {verseText.code.toUpperCase()} fallback
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="rounded-2xl border border-amber-200/80 bg-amber-50/70 p-4 dark:border-amber-400/30 dark:bg-amber-500/10 sm:p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-amber-900/80 dark:text-amber-100/80">
                  Imbuguro
                </p>
                <h2 className="mt-2 text-base font-semibold text-stone-900 dark:text-stone-50">
                  {data.dailyManna.dailyImbuguro.title}
                </h2>
                <p className="mt-1 text-sm text-stone-700 dark:text-stone-300">
                  {data.dailyManna.dailyImbuguro.summary}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                    {formatDuration(data.dailyManna.dailyImbuguro.durationSeconds)}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onPlayDailyImbuguro?.(data.dailyManna.dailyImbuguro.id)
                      onOpenDetailView?.(data.detailRoutes.exhortation)
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-3 py-2 text-xs font-semibold text-amber-950 transition hover:bg-amber-400"
                  >
                    <Play className="h-4 w-4" />
                    {t.playTodayWord}
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            <article className="rounded-3xl border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-950/70">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500 dark:text-stone-400">
                {t.activeJourney}
              </p>
              <h3 className="mt-2 text-xl font-semibold text-stone-900 dark:text-stone-100">
                Week {data.activeJourney.week}, Day {data.activeJourney.day}
              </h3>
              <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
                Today's reading: <span className="font-semibold">{data.activeJourney.todayReading}</span>
              </p>
              <div className="mt-4 h-2 rounded-full bg-stone-200 dark:bg-stone-800">
                <div
                  className="h-full rounded-full bg-violet-600 dark:bg-violet-400"
                  style={{ width: `${Math.max(0, Math.min(100, data.activeJourney.progressPercent))}%` }}
                />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                  {data.activeJourney.progressPercent.toFixed(1)}% complete
                </span>
                <button
                  type="button"
                  onClick={() => onContinueJourney?.(data.activeJourney.planId)}
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-amber-950 transition hover:bg-amber-400"
                >
                  {t.continueReading}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </article>

            <article className="rounded-3xl border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-950/70">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500 dark:text-stone-400">
                {t.fellowshipPulse}
              </p>
              <button
                type="button"
                onClick={() => onOpenTestimony?.(data.fellowshipHighlights.testimonySnippet.id)}
                className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50/80 p-4 text-left transition hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-900 dark:hover:bg-stone-800"
              >
                <p className="text-xs font-semibold text-violet-700 dark:text-violet-200">New Testimony</p>
                <p className="mt-1 text-sm font-medium text-stone-900 dark:text-stone-100">
                  "{data.fellowshipHighlights.testimonySnippet.title}"
                </p>
                <p className="mt-1 line-clamp-2 text-sm text-stone-600 dark:text-stone-300">
                  {data.fellowshipHighlights.testimonySnippet.snippet}
                </p>
              </button>
              <button
                type="button"
                onClick={() => onJoinPrayerPulse?.()}
                className="mt-3 flex w-full items-center justify-between rounded-2xl bg-violet-600/10 px-4 py-3 text-left transition hover:bg-violet-600/15 dark:bg-violet-400/10 dark:hover:bg-violet-400/15"
              >
                <span className="text-sm font-medium text-violet-900 dark:text-violet-100">
                  {data.fellowshipHighlights.prayerPulse.prompt}
                </span>
                <HeartHandshake className="h-5 w-5 text-violet-700 dark:text-violet-200" />
              </button>
            </article>
          </section>

          {data.liveUrgent.isVisible ? (
            <section className="rounded-3xl border border-red-200 bg-white p-4 dark:border-red-500/30 dark:bg-stone-950/70 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="inline-flex items-center gap-2 text-sm font-semibold text-red-700 dark:text-red-200">
                    <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-500" />
                    {t.liveNow}
                  </p>
                  <p className="mt-1 text-sm text-stone-700 dark:text-stone-300">
                    {data.liveUrgent.liveNow.title} on {data.liveUrgent.liveNow.platform}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onOpenLiveNow?.(data.liveUrgent.liveNow.watchUrl)
                    onOpenDetailView?.(data.detailRoutes.live)
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-500"
                >
                  <Radio className="h-4 w-4" />
                  Open Live
                </button>
              </div>
              <div className="mt-3 flex items-center justify-between rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 dark:border-stone-700 dark:bg-stone-900">
                <p className="text-sm text-stone-700 dark:text-stone-300">
                  {t.upcomingPrayer}: {data.liveUrgent.upcomingPrayer.title} starts in{' '}
                  <span className="font-semibold">{data.liveUrgent.upcomingPrayer.startsInHours}h</span>
                </p>
                <button
                  type="button"
                  onClick={() => onOpenUpcomingPrayer?.(data.liveUrgent.upcomingPrayer.id)}
                  className="inline-flex items-center gap-2 rounded-lg px-2 py-1 text-xs font-semibold text-violet-700 transition hover:bg-violet-600/10 dark:text-violet-200"
                >
                  Join
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </section>
          ) : null}

          <section className="rounded-3xl border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-950/70">
            <div className="grid gap-4 lg:grid-cols-[1.2fr_2fr]">
              <article className="min-w-0 rounded-2xl border border-stone-200 bg-stone-50/80 p-4 dark:border-stone-700 dark:bg-stone-900">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500 dark:text-stone-400">
                  {t.continueListening}
                </p>
                <h4 className="mt-2 text-base font-semibold text-stone-900 dark:text-stone-100">
                  {data.mediaShortcuts.continueItem.itemTitle}
                </h4>
                <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">
                  {data.mediaShortcuts.continueItem.seriesTitle}
                </p>
                <div className="mt-3 h-2 rounded-full bg-stone-200 dark:bg-stone-700">
                  <div
                    className="h-full rounded-full bg-violet-600 dark:bg-violet-400"
                    style={{ width: `${Math.max(0, Math.min(100, data.mediaShortcuts.continueItem.progressPercent))}%` }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onResumeMedia?.(data.mediaShortcuts.continueItem.id)
                    onOpenDetailView?.(data.detailRoutes.media)
                  }}
                  className="mt-3 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-violet-500"
                >
                  <CirclePlay className="h-4 w-4" />
                  Resume ({data.mediaShortcuts.continueItem.remainingMinutes}m left)
                </button>
              </article>

              <article className="min-w-0">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500 dark:text-stone-400">
                    {t.newestSeries}
                  </p>
                  <button
                    type="button"
                    onClick={() => onOpenDetailView?.(data.detailRoutes.media)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-violet-700 hover:underline dark:text-violet-200"
                  >
                    <BookHeart className="h-4 w-4" />
                    Library
                  </button>
                </div>
                <div className="flex w-full gap-3 overflow-x-auto pb-2">
                  {data.mediaShortcuts.newestSeries.map((series) => (
                    <button
                      key={series.id}
                      type="button"
                      onClick={() => onOpenSeries?.(series.id)}
                      className={cn(
                        'min-w-44 sm:min-w-48 shrink-0 rounded-2xl border border-stone-200 bg-stone-50/70 p-3 text-left transition',
                        'hover:border-violet-300 hover:bg-violet-50 dark:border-stone-700 dark:bg-stone-900 dark:hover:border-violet-400/40 dark:hover:bg-violet-400/10'
                      )}
                    >
                      <div className="mb-2 h-20 w-full rounded-xl bg-gradient-to-br from-violet-500/20 via-amber-400/20 to-stone-200 dark:from-violet-400/20 dark:via-amber-300/10 dark:to-stone-700" />
                      <p className="line-clamp-1 text-sm font-semibold text-stone-900 dark:text-stone-100">
                        {series.title}
                      </p>
                      <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                        {series.itemCount} items • {formatUpdatedAt(series.updatedAt)}
                      </p>
                    </button>
                  ))}
                </div>
              </article>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
