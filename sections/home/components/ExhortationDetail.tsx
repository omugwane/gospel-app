import { useState } from 'react'
import { ArrowLeft, CalendarDays, Clock3, Play, Share2, TextQuote } from 'lucide-react'
import type { HomeProps } from '@/../product/sections/home/types'

type ExhortationDetailProps = Pick<
  HomeProps,
  'data' | 'onPlayDailyImbuguro' | 'onShareVerse' | 'onOpenDetailView'
>

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

export function ExhortationDetail({
  data,
  onPlayDailyImbuguro,
  onShareVerse,
  onOpenDetailView,
}: ExhortationDetailProps) {
  const [showFullTranscript, setShowFullTranscript] = useState(false)
  const imbuguro = data.dailyManna.dailyImbuguro
  const verse = data.dailyManna.verse
  const rwVerse = verse.translations.rw?.text?.trim() || verse.translations.en?.text || ''

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
            <span className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-900 dark:bg-amber-300/10 dark:text-amber-100">
              <Play className="h-3.5 w-3.5" />
              Daily Imbuguro
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-800 dark:bg-violet-400/15 dark:text-violet-200">
              <CalendarDays className="h-3.5 w-3.5" />
              {formatDate(data.dailyManna.date)}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700 dark:bg-stone-800 dark:text-stone-200">
              <Clock3 className="h-3.5 w-3.5" />
              {formatDuration(imbuguro.durationSeconds)}
            </span>
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-stone-900 dark:text-stone-50">
            {imbuguro.title}
          </h1>
          <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">{imbuguro.summary}</p>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          <article className="rounded-2xl border border-amber-200/70 bg-gradient-to-b from-amber-50 to-white p-5 dark:border-amber-300/20 dark:from-amber-400/10 dark:to-stone-950/30">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-amber-900 dark:text-amber-100">
                <Play className="h-4 w-4" />
                Audio Exhortation
              </p>
              <button
                type="button"
                onClick={() => onPlayDailyImbuguro?.(imbuguro.id)}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-3 py-2 text-xs font-semibold text-amber-950 transition hover:bg-amber-400"
              >
                <Play className="h-4 w-4" />
                Play now
              </button>
            </div>
            <p className="mt-4 text-sm text-stone-600 dark:text-stone-300">
              Audio URL: <span className="font-mono text-xs">{imbuguro.audioUrl}</span>
            </p>
          </article>

          <article className="rounded-2xl border border-violet-200/70 bg-violet-50/70 p-5 dark:border-violet-300/25 dark:bg-violet-400/10">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-violet-900 dark:text-violet-100">
              <TextQuote className="h-4 w-4" />
              Transcript
            </p>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-stone-700 dark:text-stone-200">
              {showFullTranscript ? imbuguro.transcript : `${imbuguro.transcript.slice(0, 280)}...`}
            </p>
            <button
              type="button"
              onClick={() => setShowFullTranscript((v) => !v)}
              className="mt-3 text-xs font-semibold text-violet-700 hover:underline dark:text-violet-200"
            >
              {showFullTranscript ? 'Show less' : 'Read full transcript'}
            </button>
          </article>

          <article className="rounded-2xl border border-stone-200 bg-stone-50/70 p-4 dark:border-stone-700 dark:bg-stone-900">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500 dark:text-stone-400">
              Verse Anchor
            </p>
            <p className="mt-2 text-sm font-semibold text-stone-900 dark:text-stone-100">{verse.reference}</p>
            <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">{rwVerse}</p>
            <button
              type="button"
              onClick={() => onShareVerse?.(verse.id, verse.share.target)}
              className="mt-3 inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-semibold text-stone-700 transition hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-200 dark:hover:bg-stone-800"
            >
              <Share2 className="h-4 w-4" />
              Share verse
            </button>
          </article>
        </div>
      </div>
    </div>
  )
}
