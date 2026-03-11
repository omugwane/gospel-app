'use client'

import { useMemo, useState } from 'react'
import {
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  ChevronLeft,
  Download,
  Headphones,
  Info,
  ListMusic,
  Play,
  Share2,
  Tag,
  Text,
  Video,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type {
  LanguageCode,
  LibraryProps,
  Sermon,
  Series,
} from '@/product/sections/library/types'

export interface SermonDetailProps extends LibraryProps {
  sermonId?: string
}

function formatDuration(totalSeconds: number) {
  if (!totalSeconds || totalSeconds <= 0) return '—'
  const m = Math.floor(totalSeconds / 60)
  const h = Math.floor(m / 60)
  const mm = m % 60
  if (h > 0) return `${h}h ${mm}m`
  return `${m} min`
}

function formatDate(iso: string) {
  try {
    const d = new Date(iso)
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' })
  } catch {
    return iso
  }
}

function pickLabel(
  base: string,
  translations: { label: string } | undefined,
  locale: LanguageCode
) {
  if (locale === 'rw') return base
  const alt = translations?.label?.trim()
  return alt || base
}

function pickSeriesText(series: Series, locale: LanguageCode) {
  if (locale === 'rw') return { title: series.title, description: series.description }
  const t = series.translations?.[locale]
  return {
    title: t?.title?.trim() || series.title,
    description: t?.description?.trim() || series.description,
  }
}

function pickSermonText(sermon: Sermon, locale: LanguageCode) {
  if (locale === 'rw')
    return { title: sermon.title, summary: sermon.summary, transcript: sermon.notes?.transcript ?? '' }
  const t = sermon.translations?.[locale]
  return {
    title: t?.title?.trim() || sermon.title,
    summary: t?.summary?.trim() || sermon.summary,
    transcript: t?.transcript?.trim() || sermon.notes?.transcript || '',
  }
}

function Badge({
  tone = 'neutral',
  children,
}: {
  tone?: 'neutral' | 'primary' | 'secondary'
  children: React.ReactNode
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold',
        tone === 'primary' &&
          'bg-primary-600/10 text-primary-900 dark:bg-primary-400/10 dark:text-primary-100',
        tone === 'secondary' &&
          'bg-secondary-50 text-secondary-900 dark:bg-secondary-500/10 dark:text-secondary-100',
        tone === 'neutral' && 'bg-neutral-100 text-neutral-700 dark:bg-neutral-900 dark:text-neutral-200'
      )}
    >
      {children}
    </span>
  )
}

function PrimaryButton({
  icon,
  children,
  onClick,
  disabled,
}: {
  icon?: React.ReactNode
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-xs font-semibold text-white hover:bg-primary-700 transition-colors',
        disabled && 'bg-neutral-300 text-neutral-600 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-400'
      )}
    >
      {icon}
      {children}
    </button>
  )
}

function SecondaryButton({
  icon,
  children,
  onClick,
  disabled,
  tone = 'neutral',
}: {
  icon?: React.ReactNode
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  tone?: 'neutral' | 'amber'
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-colors border',
        tone === 'amber'
          ? 'border-secondary-200/80 dark:border-secondary-500/30 bg-secondary-50/80 dark:bg-secondary-500/10 text-secondary-900 dark:text-secondary-100 hover:bg-secondary-100/70 dark:hover:bg-secondary-500/15'
          : 'border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-950/40 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-900',
        disabled && 'opacity-50'
      )}
    >
      {icon}
      {children}
    </button>
  )
}

export function SermonDetail({
  data,
  sermonId,
  locale,
  onBack,
  onOpenSeries,
  onOpenSermon,
  onPlaySermonAudio,
  onWatchSermonVideo,
  onDownloadSermon,
  onShareSermon,
  onToggleSaveSermon,
  onAddToQueue,
  onMarkSermonCompleted,
}: SermonDetailProps) {
  const [showTranscript, setShowTranscript] = useState(true)

  const seriesById = useMemo(() => new Map(data.series.map((s) => [s.id, s])), [data.series])
  const topicById = useMemo(() => new Map(data.topics.map((t) => [t.id, t])), [data.topics])
  const queue = useMemo(() => new Set(data.listeningQueue.queueSermonIds), [data.listeningQueue.queueSermonIds])

  const selectedId =
    sermonId ??
    data.searchState.resultSermonIds[0] ??
    data.listeningQueue.queueSermonIds[0] ??
    data.sermons[0]?.id

  const sermon = data.sermons.find((s) => s.id === selectedId) ?? data.sermons[0]
  const isSaved = sermon ? data.saved.savedSermonIds.includes(sermon.id) : false
  const isInQueue = sermon ? queue.has(sermon.id) : false
  const downloaded = sermon ? sermon.offline.downloadState === 'downloaded' : false

  const series = sermon?.seriesId ? seriesById.get(sermon.seriesId) : null
  const sermonText = sermon ? pickSermonText(sermon, locale) : null
  const seriesText = series ? pickSeriesText(series, locale) : null

  const topicLabels = (sermon?.topicIds ?? [])
    .map((id) => {
      const t = topicById.get(id)
      if (!t) return null
      return pickLabel(t.label, t.translations?.[locale], locale)
    })
    .filter(Boolean) as string[]

  const hasAudio = Boolean(sermon?.availability.hasAudio)
  const hasVideo = Boolean(sermon?.availability.hasVideo)
  const hasNotes = Boolean(sermonText?.transcript?.trim())

  const moreLikeThis = useMemo(() => {
    if (!sermon) return []
    const siblings = sermon.seriesId
      ? data.sermons.filter((s) => s.seriesId === sermon.seriesId && s.id !== sermon.id)
      : data.sermons.filter((s) => s.id !== sermon.id)
    return siblings.slice(0, 4)
  }, [data.sermons, sermon])

  if (!sermon || !sermonText) {
    return (
      <div className="mx-auto max-w-4xl rounded-3xl border border-neutral-200/70 dark:border-neutral-800/70 bg-white/60 dark:bg-neutral-950/40 p-6">
        <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Sermon not found</div>
        <div className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          The sample data did not include a matching sermon.
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="mx-auto max-w-4xl">
        {/* Top bar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">
              <button
                type="button"
                onClick={() => (series?.id ? onOpenSeries?.(series.id) : onBack?.())}
                className="inline-flex items-center gap-1 rounded-full border border-neutral-200/70 dark:border-neutral-800/70 bg-white/60 dark:bg-neutral-950/40 px-3 py-1 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
              >
                <ChevronLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
                Back
              </button>
              <span className="opacity-60">•</span>
              <span className="inline-flex items-center gap-1">
                <Info className="h-3.5 w-3.5" strokeWidth={1.75} />
                {formatDate(sermon.publishedAt)} · {formatDuration(sermon.durationSeconds)}
              </span>
              {downloaded ? (
                <>
                  <span className="opacity-60">•</span>
                  <span className="inline-flex items-center gap-1 text-secondary-900 dark:text-secondary-100">
                    <Download className="h-3.5 w-3.5" strokeWidth={1.75} />
                    Offline
                  </span>
                </>
              ) : null}
            </div>

            <h1 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">
              {sermonText.title}
            </h1>

            {seriesText ? (
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                From <span className="font-semibold text-neutral-800 dark:text-neutral-200">{seriesText.title}</span>
              </p>
            ) : (
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">Sermon detail</p>
            )}
          </div>

        </div>

        {/* Meta badges */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {hasAudio ? (
            <Badge tone="primary">
              <Headphones className="h-3 w-3" strokeWidth={2} />
              Audio
            </Badge>
          ) : (
            <Badge>
              <Headphones className="h-3 w-3 opacity-60" strokeWidth={2} />
              No audio
            </Badge>
          )}
          {hasVideo ? (
            <Badge tone="secondary">
              <Video className="h-3 w-3" strokeWidth={2} />
              Video
            </Badge>
          ) : null}
          {hasNotes ? (
            <Badge>
              <Text className="h-3 w-3" strokeWidth={2} />
              Notes
            </Badge>
          ) : null}
          {isInQueue ? (
            <Badge>
              <ListMusic className="h-3 w-3" strokeWidth={2} />
              In queue
            </Badge>
          ) : null}

          {topicLabels.length ? (
            <div className="flex flex-wrap items-center gap-1.5">
              {topicLabels.slice(0, 4).map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 rounded-full bg-neutral-100 dark:bg-neutral-900 px-2 py-0.5 text-[11px] font-semibold text-neutral-700 dark:text-neutral-200"
                >
                  <Tag className="h-3 w-3 text-neutral-500 dark:text-neutral-400" strokeWidth={2} />
                  {t}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        {/* Summary + player */}
        <section className="mt-5 grid gap-3 md:grid-cols-[1fr_340px]">
          <div className="rounded-3xl border border-neutral-200/70 dark:border-neutral-800/70 bg-white/60 dark:bg-neutral-950/40 p-6">
            <div className="text-xs font-semibold tracking-wide text-neutral-700 dark:text-neutral-300 uppercase">
              Summary
            </div>
            <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
              {sermonText.summary}
            </p>

            {sermon.scriptureReferences?.length ? (
              <div className="mt-4">
                <div className="text-xs font-semibold tracking-wide text-neutral-700 dark:text-neutral-300 uppercase">
                  Scripture
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {sermon.scriptureReferences.map((r) => (
                    <Badge key={r}>{r}</Badge>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <div className="rounded-3xl border border-neutral-200/70 dark:border-neutral-800/70 bg-white/60 dark:bg-neutral-950/40 p-5">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold tracking-wide text-neutral-700 dark:text-neutral-300 uppercase">
                Player
              </div>
              <div className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 tabular-nums">
                {formatDuration(sermon.durationSeconds)}
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-neutral-200/70 dark:border-neutral-800/70 bg-[radial-gradient(circle_at_20%_20%,rgba(139,92,246,0.14),transparent_45%),radial-gradient(circle_at_85%_75%,rgba(245,158,11,0.12),transparent_55%)] p-4">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-primary-600 text-white flex items-center justify-center">
                  <Play className="h-5 w-5 translate-x-[1px]" strokeWidth={1.75} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-neutral-700 dark:text-neutral-200">Audio-first</div>
                  <div className="mt-0.5 text-sm font-semibold text-neutral-950 dark:text-neutral-50 line-clamp-2">
                    {sermonText.title}
                  </div>
                </div>
              </div>

              <div className="mt-4 h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                <div className="h-full w-[34%] rounded-full bg-primary-600 dark:bg-primary-400" />
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 tabular-nums">
                <span>0:34</span>
                <span>{formatDuration(sermon.durationSeconds)}</span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <PrimaryButton
                  icon={<Headphones className="h-4 w-4" strokeWidth={1.75} />}
                  onClick={() => onPlaySermonAudio?.(sermon.id)}
                  disabled={!sermon.actions.canPlayAudio}
                >
                  Play audio
                </PrimaryButton>
                <SecondaryButton
                  icon={<Video className="h-4 w-4" strokeWidth={1.75} />}
                  onClick={() => onWatchSermonVideo?.(sermon.id)}
                  disabled={!sermon.actions.canWatchVideo}
                >
                  Watch video
                </SecondaryButton>
                <SecondaryButton
                  tone="amber"
                  icon={<Download className="h-4 w-4" strokeWidth={1.75} />}
                  onClick={() => onDownloadSermon?.(sermon.id)}
                  disabled={!sermon.actions.canDownload}
                >
                  Download
                </SecondaryButton>
                <SecondaryButton
                  icon={isSaved ? <BookmarkCheck className="h-4 w-4" strokeWidth={1.75} /> : <Bookmark className="h-4 w-4" strokeWidth={1.75} />}
                  onClick={() => onToggleSaveSermon?.(sermon.id, !isSaved)}
                  disabled={!sermon.actions.canSave}
                >
                  {isSaved ? 'Saved' : 'Save'}
                </SecondaryButton>
              </div>

              <div className="mt-2 grid grid-cols-2 gap-2">
                <SecondaryButton
                  icon={<ListMusic className="h-4 w-4" strokeWidth={1.75} />}
                  onClick={() => onAddToQueue?.(sermon.id)}
                  disabled={!sermon.actions.canAddToQueue}
                >
                  Add to queue
                </SecondaryButton>
                <SecondaryButton
                  icon={<CheckCircle2 className="h-4 w-4" strokeWidth={1.75} />}
                  onClick={() => onMarkSermonCompleted?.(sermon.id, true)}
                  disabled={!sermon.actions.canMarkCompleted}
                >
                  Completed
                </SecondaryButton>
              </div>

              <div className="mt-2">
                <SecondaryButton
                  icon={<Share2 className="h-4 w-4" strokeWidth={1.75} />}
                  onClick={() => onShareSermon?.(sermon.id)}
                  disabled={!sermon.actions.canShare}
                >
                  Share
                </SecondaryButton>
              </div>
            </div>
          </div>
        </section>

        {/* Transcript */}
        <section className="mt-4">
          <div className="rounded-3xl border border-neutral-200/70 dark:border-neutral-800/70 bg-white/60 dark:bg-neutral-950/40 overflow-hidden">
            <div className="px-5 py-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Text className="h-4 w-4 text-neutral-500 dark:text-neutral-400" strokeWidth={1.75} />
                <div className="text-sm font-semibold text-neutral-950 dark:text-neutral-50">Transcript / Notes</div>
              </div>
              <button
                type="button"
                onClick={() => setShowTranscript((v) => !v)}
                className="text-xs font-semibold text-primary-700 dark:text-primary-200 hover:underline"
              >
                {showTranscript ? 'Hide' : 'Show'}
              </button>
            </div>

            {showTranscript ? (
              hasNotes ? (
                <div className="px-5 pb-5 text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap">
                  {sermonText.transcript}
                </div>
              ) : (
                <div className="px-5 pb-5 text-sm text-neutral-600 dark:text-neutral-400">
                  Notes are not available for this sermon.
                </div>
              )
            ) : null}
          </div>
        </section>

        {/* More like this */}
        {moreLikeThis.length ? (
          <section className="mt-6 pb-10">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold tracking-wide text-neutral-700 dark:text-neutral-300 uppercase">
                More
              </div>
              {series?.id ? (
                <button
                  type="button"
                  onClick={() => onOpenSeries?.(series.id)}
                  className="text-[11px] font-semibold text-primary-700 dark:text-primary-200 hover:underline"
                >
                  View series
                </button>
              ) : null}
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {moreLikeThis.map((s) => {
                const t = pickSermonText(s, locale)
                const sSeries = s.seriesId ? seriesById.get(s.seriesId) : null
                const sSeriesTitle = sSeries ? pickSeriesText(sSeries, locale).title : undefined
                const isSermonSaved = data.saved.savedSermonIds.includes(s.id)
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => onOpenSermon?.(s.id)}
                    className="text-left rounded-3xl border border-neutral-200/70 dark:border-neutral-800/70 bg-white/60 dark:bg-neutral-950/40 hover:bg-white/80 dark:hover:bg-neutral-950/60 transition-colors p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">
                          {formatDate(s.publishedAt)} · {formatDuration(s.durationSeconds)}
                        </div>
                        <div className="mt-1 text-sm font-semibold text-neutral-950 dark:text-neutral-50 line-clamp-2">
                          {t.title}
                        </div>
                        {sSeriesTitle ? (
                          <div className="mt-1 text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 line-clamp-1">
                            {sSeriesTitle}
                          </div>
                        ) : null}
                      </div>
                      <div
                        className={cn(
                          'h-10 w-10 rounded-2xl border border-neutral-200/70 dark:border-neutral-800/70 flex items-center justify-center',
                          isSermonSaved && 'border-primary-200 dark:border-primary-500/40 bg-primary-600/10 dark:bg-primary-400/10'
                        )}
                        aria-hidden="true"
                      >
                        {isSermonSaved ? (
                          <BookmarkCheck className="h-4 w-4 text-primary-700 dark:text-primary-200" strokeWidth={1.75} />
                        ) : (
                          <Bookmark className="h-4 w-4 text-neutral-600 dark:text-neutral-300" strokeWidth={1.75} />
                        )}
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed line-clamp-2">
                      {t.summary}
                    </p>
                  </button>
                )
              })}
            </div>
          </section>
        ) : (
          <div className="pb-10" />
        )}
      </div>
    </div>
  )
}

