import { useMemo } from 'react'
import { ArrowLeft, Bookmark, CalendarDays, Languages, Play, Share2 } from 'lucide-react'
import type { HomeProps, LanguageCode } from '@/../product/sections/home/types'

type VerseDetailProps = Pick<
  HomeProps,
  'data' | 'locale' | 'onShareVerse' | 'onPlayDailyImbuguro' | 'onOpenDetailView'
>

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

function formatDate(dateIso: string) {
  const date = new Date(dateIso)
  if (Number.isNaN(date.getTime())) return dateIso
  return date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })
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
      <div className="rounded-3xl border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-950/70">
        <div className="border-b border-stone-200 p-5 dark:border-stone-800 sm:p-6">
          <button
            type="button"
            onClick={() => onOpenDetailView?.('/home')}
            className="inline-flex items-center gap-2 rounded-xl border border-stone-200 px-3 py-2 text-xs font-semibold text-stone-700 transition hover:bg-stone-50 dark:border-stone-700 dark:text-stone-200 dark:hover:bg-stone-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </button>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-800 dark:bg-violet-400/15 dark:text-violet-200">
              <CalendarDays className="h-3.5 w-3.5" />
              Verse of the Day
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-900 dark:bg-amber-300/10 dark:text-amber-100">
              <Languages className="h-3.5 w-3.5" />
              {verseText.code.toUpperCase()}
            </span>
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-stone-900 dark:text-stone-50">
            {verse.reference}
          </h1>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
            {formatDate(data.dailyManna.date)}
          </p>
        </div>

        <div className="space-y-6 p-5 sm:p-6">
          <article className="rounded-2xl border border-violet-200/70 bg-gradient-to-b from-violet-600 to-violet-700 p-5 text-violet-50 dark:border-violet-400/40">
            <p className="text-lg leading-relaxed sm:text-xl">{verseText.text}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onShareVerse?.(verse.id, verse.share.target)}
                className="inline-flex items-center gap-2 rounded-xl bg-white/90 px-3 py-2 text-xs font-semibold text-violet-800 transition hover:bg-white"
              >
                <Share2 className="h-4 w-4" />
                Share to WhatsApp
              </button>
              <button
                type="button"
                onClick={() => onOpenDetailView?.(data.detailRoutes.exhortation)}
                className="inline-flex items-center gap-2 rounded-xl border border-violet-200/70 bg-violet-700/50 px-3 py-2 text-xs font-semibold text-violet-50 transition hover:bg-violet-700/70 dark:border-violet-300/30"
              >
                <Bookmark className="h-4 w-4" />
                Save Reflection
              </button>
            </div>
          </article>

          <article className="rounded-2xl border border-stone-200 bg-stone-50/70 p-4 dark:border-stone-700 dark:bg-stone-900">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500 dark:text-stone-400">
              Daily Imbuguro
            </p>
            <h2 className="mt-2 text-lg font-semibold text-stone-900 dark:text-stone-100">
              {imbuguro.title}
            </h2>
            <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">{imbuguro.summary}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                {formatDuration(imbuguro.durationSeconds)}
              </span>
              <button
                type="button"
                onClick={() => {
                  onPlayDailyImbuguro?.(imbuguro.id)
                  onOpenDetailView?.(data.detailRoutes.exhortation)
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-3 py-2 text-xs font-semibold text-amber-950 transition hover:bg-amber-400"
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
