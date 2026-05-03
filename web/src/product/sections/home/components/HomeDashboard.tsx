'use client'

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
} from '@/product/sections/home/types'

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
  const order: LanguageCode[] = [locale, 'en', 'fr', 'rw']
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
    : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
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
    <div className="w-full bg-neutral-50/90 dark:bg-neutral-950/40">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="space-y-6">
          <section className="rounded-3xl border border-neutral-200/80 bg-white/90 p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-950/70 sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
              {t.homeTitle}
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-3xl">
              {greeting} {data.viewer.displayName}
            </h1>
            <p className="mt-1 inline-flex items-center gap-2 rounded-full bg-primary-500/10 px-3 py-1 text-xs font-medium text-primary-800 dark:bg-primary-400/15 dark:text-primary-100">
              <Sparkles className="h-3.5 w-3.5" />
              {t.heroLabel}
            </p>

            <div className="mt-5 grid gap-4 lg:grid-cols-[1.7fr_1fr]">
              <div className="rounded-2xl border border-primary-200/70 bg-gradient-to-br from-primary-600 to-primary-700 p-5 text-primary-50 shadow-sm dark:border-primary-400/40 dark:from-primary-500 dark:to-primary-700 sm:p-6">
                <button
                  type="button"
                  onClick={() => onOpenDetailView?.(data.detailRoutes.verse)}
                  className="w-full text-left"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-100/80">
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
                    className="inline-flex items-center gap-2 rounded-xl bg-white/90 px-3 py-2 text-xs font-semibold text-primary-800 transition hover:bg-white"
                  >
                    <Share2 className="h-4 w-4" />
                    {t.shareVerse}
                  </button>
                  {verseText.code !== locale ? (
                    <span className="rounded-xl bg-primary-800/40 px-2 py-1 text-[11px] font-semibold text-primary-100">
                      {verseText.code.toUpperCase()} fallback
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="rounded-2xl border border-secondary-200/80 bg-secondary-50/70 p-4 dark:border-secondary-400/30 dark:bg-secondary-500/10 sm:p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-secondary-900/80 dark:text-secondary-100/80">
                  Imbuguro
                </p>
                <h2 className="mt-2 text-base font-semibold text-neutral-900 dark:text-neutral-50">
                  {data.dailyManna.dailyImbuguro.title}
                </h2>
                <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">
                  {data.dailyManna.dailyImbuguro.summary}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                    {formatDuration(data.dailyManna.dailyImbuguro.durationSeconds)}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onPlayDailyImbuguro?.(data.dailyManna.dailyImbuguro.id)
                      onOpenDetailView?.(data.detailRoutes.exhortation)
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-secondary-500 px-3 py-2 text-xs font-semibold text-secondary-950 transition hover:bg-secondary-400"
                  >
                    <Play className="h-4 w-4" />
                    {t.playTodayWord}
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            <article className="rounded-3xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950/70">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
                {t.activeJourney}
              </p>
              <h3 className="mt-2 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                Week {data.activeJourney.week}, Day {data.activeJourney.day}
              </h3>
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                Today's reading: <span className="font-semibold">{data.activeJourney.todayReading}</span>
              </p>
              <div className="mt-4 h-2 rounded-full bg-neutral-200 dark:bg-neutral-800">
                <div
                  className="h-full rounded-full bg-primary-600 dark:bg-primary-400"
                  style={{ width: `${Math.max(0, Math.min(100, data.activeJourney.progressPercent))}%` }}
                />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                  {data.activeJourney.progressPercent.toFixed(1)}% complete
                </span>
                <button
                  type="button"
                  onClick={() => onContinueJourney?.(data.activeJourney.planId)}
                  className="inline-flex items-center gap-2 rounded-xl bg-secondary-500 px-4 py-2 text-sm font-semibold text-secondary-950 transition hover:bg-secondary-400"
                >
                  {t.continueReading}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </article>

            <article className="rounded-3xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950/70">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
                {t.fellowshipPulse}
              </p>
              <button
                type="button"
                onClick={() => onOpenTestimony?.(data.fellowshipHighlights.testimonySnippet.id)}
                className="mt-2 w-full rounded-2xl border border-neutral-200 bg-neutral-50/80 p-4 text-left transition hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800"
              >
                <p className="text-xs font-semibold text-primary-700 dark:text-primary-200">New Testimony</p>
                <p className="mt-1 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  "{data.fellowshipHighlights.testimonySnippet.title}"
                </p>
                <p className="mt-1 line-clamp-2 text-sm text-neutral-600 dark:text-neutral-300">
                  {data.fellowshipHighlights.testimonySnippet.snippet}
                </p>
              </button>
              <button
                type="button"
                onClick={() => onJoinPrayerPulse?.()}
                className="mt-3 flex w-full items-center justify-between rounded-2xl bg-primary-600/10 px-4 py-3 text-left transition hover:bg-primary-600/15 dark:bg-primary-400/10 dark:hover:bg-primary-400/15"
              >
                <span className="text-sm font-medium text-primary-900 dark:text-primary-100">
                  {data.fellowshipHighlights.prayerPulse.prompt}
                </span>
                <HeartHandshake className="h-5 w-5 text-primary-700 dark:text-primary-200" />
              </button>
            </article>
          </section>

          {data.liveUrgent.isVisible ? (
            <section className="rounded-3xl border border-urgency-200 bg-white p-4 dark:border-urgency-500/30 dark:bg-neutral-950/70 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="inline-flex items-center gap-2 text-sm font-semibold text-urgency-700 dark:text-urgency-200">
                    <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-urgency-500" />
                    {t.liveNow}
                  </p>
                  <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">
                    {data.liveUrgent.liveNow.title} on {data.liveUrgent.liveNow.platform}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onOpenLiveNow?.(data.liveUrgent.liveNow.watchUrl)
                    onOpenDetailView?.(data.detailRoutes.live)
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-urgency-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-urgency-500"
                >
                  <Radio className="h-4 w-4" />
                  Open Live
                </button>
              </div>
              <div className="mt-3 flex items-center justify-between rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-700 dark:bg-neutral-900">
                <p className="text-sm text-neutral-700 dark:text-neutral-300">
                  {t.upcomingPrayer}: {data.liveUrgent.upcomingPrayer.title} starts in{' '}
                  <span className="font-semibold">{data.liveUrgent.upcomingPrayer.startsInHours}h</span>
                </p>
                <button
                  type="button"
                  onClick={() => onOpenUpcomingPrayer?.(data.liveUrgent.upcomingPrayer.id)}
                  className="inline-flex items-center gap-2 rounded-lg px-2 py-1 text-xs font-semibold text-primary-700 transition hover:bg-primary-600/10 dark:text-primary-200"
                >
                  Join
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </section>
          ) : null}

          <section className="rounded-3xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950/70">
            <div className="grid gap-4 lg:grid-cols-[1.2fr_2fr]">
              <article className="min-w-0 rounded-2xl border border-neutral-200 bg-neutral-50/80 p-4 dark:border-neutral-700 dark:bg-neutral-900">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
                  {t.continueListening}
                </p>
                <h4 className="mt-2 text-base font-semibold text-neutral-900 dark:text-neutral-100">
                  {data.mediaShortcuts.continueItem.itemTitle}
                </h4>
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
                  {data.mediaShortcuts.continueItem.seriesTitle}
                </p>
                <div className="mt-3 h-2 rounded-full bg-neutral-200 dark:bg-neutral-700">
                  <div
                    className="h-full rounded-full bg-primary-600 dark:bg-primary-400"
                    style={{ width: `${Math.max(0, Math.min(100, data.mediaShortcuts.continueItem.progressPercent))}%` }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onResumeMedia?.(data.mediaShortcuts.continueItem.id)
                    onOpenDetailView?.(data.detailRoutes.media)
                  }}
                  className="mt-3 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-primary-500"
                >
                  <CirclePlay className="h-4 w-4" />
                  Resume ({data.mediaShortcuts.continueItem.remainingMinutes}m left)
                </button>
              </article>

              <article className="min-w-0">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
                    {t.newestSeries}
                  </p>
                  <button
                    type="button"
                    onClick={() => onOpenDetailView?.(data.detailRoutes.media)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary-700 hover:underline dark:text-primary-200"
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
                        'min-w-44 sm:min-w-48 shrink-0 rounded-2xl border border-neutral-200 bg-neutral-50/70 p-3 text-left transition',
                        'hover:border-primary-300 hover:bg-primary-50 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-primary-400/40 dark:hover:bg-primary-400/10'
                      )}
                    >
                      <div className="mb-2 h-20 w-full rounded-xl bg-gradient-to-br from-primary-500/20 via-secondary-400/20 to-neutral-200 dark:from-primary-400/20 dark:via-secondary-300/10 dark:to-neutral-700" />
                      <p className="line-clamp-1 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                        {series.title}
                      </p>
                      <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
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
