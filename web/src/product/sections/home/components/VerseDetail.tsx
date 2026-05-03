'use client'

import { useMemo } from 'react'
import { ArrowLeft, Bookmark, CalendarDays, Languages, Play, Share2 } from 'lucide-react'
import type { HomeProps, LanguageCode } from '@/product/sections/home/types'

type VerseDetailProps = Pick<
  HomeProps,
  'data' | 'locale' | 'onShareVerse' | 'onPlayDailyImbuguro' | 'onOpenDetailView'
>

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

function formatDate(dateIso: string) {
  const date = new Date(dateIso)
  if (Number.isNaN(date.getTime())) return dateIso
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export function VerseDetail({
  data,
  locale,
  onShareVerse,
  onPlayDailyImbuguro,
  onOpenDetailView,
}: VerseDetailProps) {
  const verse = data.dailyManna.verse
  const imbuguro = data.dailyManna.dailyImbuguro
  const verseText = useMemo(() => pickVerseText(verse.translations, locale), [locale, verse.translations])

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="rounded-3xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950/70">
        <div className="border-b border-neutral-200 p-5 dark:border-neutral-800 sm:p-6">
          <button
            type="button"
            onClick={() => onOpenDetailView?.('/home')}
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 px-3 py-2 text-xs font-semibold text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </button>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-500/10 px-3 py-1 text-xs font-semibold text-primary-800 dark:bg-primary-400/15 dark:text-primary-200">
              <CalendarDays className="h-3.5 w-3.5" />
              Verse of the Day
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-secondary-500/10 px-3 py-1 text-xs font-semibold text-secondary-900 dark:bg-secondary-300/10 dark:text-secondary-100">
              <Languages className="h-3.5 w-3.5" />
              {verseText.code.toUpperCase()}
            </span>
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
            {verse.reference}
          </h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            {formatDate(data.dailyManna.date)}
          </p>
        </div>

        <div className="space-y-6 p-5 sm:p-6">
          <article className="rounded-2xl border border-primary-200/70 bg-gradient-to-b from-primary-600 to-primary-700 p-5 text-primary-50 dark:border-primary-400/40">
            <p className="text-lg leading-relaxed sm:text-xl">{verseText.text}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onShareVerse?.(verse.id, verse.share.target)}
                className="inline-flex items-center gap-2 rounded-xl bg-white/90 px-3 py-2 text-xs font-semibold text-primary-800 transition hover:bg-white"
              >
                <Share2 className="h-4 w-4" />
                Share to WhatsApp
              </button>
              <button
                type="button"
                onClick={() => onOpenDetailView?.(data.detailRoutes.exhortation)}
                className="inline-flex items-center gap-2 rounded-xl border border-primary-200/70 bg-primary-700/50 px-3 py-2 text-xs font-semibold text-primary-50 transition hover:bg-primary-700/70 dark:border-primary-300/30"
              >
                <Bookmark className="h-4 w-4" />
                Save Reflection
              </button>
            </div>
          </article>

          <article className="rounded-2xl border border-neutral-200 bg-neutral-50/70 p-4 dark:border-neutral-700 dark:bg-neutral-900">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
              Daily Imbuguro
            </p>
            <h2 className="mt-2 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              {imbuguro.title}
            </h2>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">{imbuguro.summary}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                {formatDuration(imbuguro.durationSeconds)}
              </span>
              <button
                type="button"
                onClick={() => {
                  onPlayDailyImbuguro?.(imbuguro.id)
                  onOpenDetailView?.(data.detailRoutes.exhortation)
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-secondary-500 px-3 py-2 text-xs font-semibold text-secondary-950 transition hover:bg-secondary-400"
              >
                <Play className="h-4 w-4" />
                Play message
              </button>
            </div>
          </article>
        </div>
      </div>
    </div>
  )
}
