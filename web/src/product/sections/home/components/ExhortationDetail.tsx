'use client'

import { useState } from 'react'
import { ArrowLeft, CalendarDays, Clock3, Play, Share2, TextQuote } from 'lucide-react'
import type { HomeProps } from '@/product/sections/home/types'

type ExhortationDetailProps = Pick<
  HomeProps,
  'data' | 'onPlayDailyImbuguro' | 'onShareVerse' | 'onOpenDetailView'
>

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
            <span className="inline-flex items-center gap-2 rounded-full bg-secondary-500/10 px-3 py-1 text-xs font-semibold text-secondary-900 dark:bg-secondary-300/10 dark:text-secondary-100">
              <Play className="h-3.5 w-3.5" />
              Daily Imbuguro
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-500/10 px-3 py-1 text-xs font-semibold text-primary-800 dark:bg-primary-400/15 dark:text-primary-200">
              <CalendarDays className="h-3.5 w-3.5" />
              {formatDate(data.dailyManna.date)}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
              <Clock3 className="h-3.5 w-3.5" />
              {formatDuration(imbuguro.durationSeconds)}
            </span>
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
            {imbuguro.title}
          </h1>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">{imbuguro.summary}</p>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          <article className="rounded-2xl border border-secondary-200/70 bg-gradient-to-b from-secondary-50 to-white p-5 dark:border-secondary-300/20 dark:from-secondary-400/10 dark:to-neutral-950/30">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-secondary-900 dark:text-secondary-100">
                <Play className="h-4 w-4" />
                Audio Exhortation
              </p>
              <button
                type="button"
                onClick={() => onPlayDailyImbuguro?.(imbuguro.id)}
                className="inline-flex items-center gap-2 rounded-xl bg-secondary-500 px-3 py-2 text-xs font-semibold text-secondary-950 transition hover:bg-secondary-400"
              >
                <Play className="h-4 w-4" />
                Play now
              </button>
            </div>
            <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-300">
              Audio URL: <span className="font-mono text-xs">{imbuguro.audioUrl}</span>
            </p>
          </article>

          <article className="rounded-2xl border border-primary-200/70 bg-primary-50/70 p-5 dark:border-primary-300/25 dark:bg-primary-400/10">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-primary-900 dark:text-primary-100">
              <TextQuote className="h-4 w-4" />
              Transcript
            </p>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-neutral-700 dark:text-neutral-200">
              {showFullTranscript ? imbuguro.transcript : `${imbuguro.transcript.slice(0, 280)}...`}
            </p>
            <button
              type="button"
              onClick={() => setShowFullTranscript((v) => !v)}
              className="mt-3 text-xs font-semibold text-primary-700 hover:underline dark:text-primary-200"
            >
              {showFullTranscript ? 'Show less' : 'Read full transcript'}
            </button>
          </article>

          <article className="rounded-2xl border border-neutral-200 bg-neutral-50/70 p-4 dark:border-neutral-700 dark:bg-neutral-900">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
              Verse Anchor
            </p>
            <p className="mt-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">{verse.reference}</p>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">{rwVerse}</p>
            <button
              type="button"
              onClick={() => onShareVerse?.(verse.id, verse.share.target)}
              className="mt-3 inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-200 dark:hover:bg-neutral-800"
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
