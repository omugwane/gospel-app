'use client'

import { useMemo, useState, type FormEvent } from 'react'
import {
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  BookOpen,
  Download,
  Headphones,
  ListMusic,
  Search,
  Sparkles,
  Tag,
  Text,
  Video,
} from 'lucide-react'
import { buildSeriesProgressMap } from '@/lib/library-series-progress'
import type { SeriesProgress } from '@/lib/library-series-progress'
import { cn } from '@/lib/utils'
import type {
  LibraryProps,
  LibraryTranslations,
  Series,
  Sermon,
  Topic,
} from '@/product/sections/library/types'
import { DEFAULT_LIBRARY_TRANSLATIONS } from '@/product/sections/library/types'
import { SeriesProgressStrip } from '@/product/sections/library/components/SeriesProgressStrip'

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
  locale: string
) {
  if (locale === 'rw') return base
  const alt = translations?.label?.trim()
  return alt || base
}

function pickSeriesText(series: Series, locale: string) {
  if (locale === 'rw') return { title: series.title, description: series.description }
  const t = series.translations?.[locale as 'en' | 'fr']
  return {
    title: t?.title?.trim() || series.title,
    description: t?.description?.trim() || series.description,
  }
}

function pickSermonText(sermon: Sermon, locale: string) {
  if (locale === 'rw') return { title: sermon.title, summary: sermon.summary }
  const t = sermon.translations?.[locale as 'en' | 'fr']
  return {
    title: t?.title?.trim() || sermon.title,
    summary: t?.summary?.trim() || sermon.summary,
  }
}

function SeriesThumbnail({
  src,
  title,
  className,
}: {
  src?: string
  title: string
  className?: string
}) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-100 via-neutral-100 to-secondary-50 dark:from-primary-950/50 dark:via-neutral-900 dark:to-secondary-950/30',
        className
      )}
    >
      {src ? (
        <img src={src} alt="" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <ListMusic className="h-10 w-10 text-neutral-300 dark:text-neutral-600" strokeWidth={1.4} />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
      <div className="absolute bottom-3 left-3 right-3">
        <div className="line-clamp-2 text-sm font-semibold text-white drop-shadow-sm">{title}</div>
      </div>
    </div>
  )
}

function SermonThumbnail({
  src,
  title,
  className,
}: {
  src?: string
  title: string
  className?: string
}) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl bg-gradient-to-br from-secondary-50 via-neutral-100 to-primary-50 dark:from-secondary-950/40 dark:via-neutral-900 dark:to-primary-950/40',
        className
      )}
    >
      {src ? (
        <img src={src} alt="" className="h-full w-full object-cover" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <Headphones className="h-9 w-9 text-neutral-300 dark:text-neutral-600" strokeWidth={1.4} />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
      <div className="absolute bottom-2 right-2 rounded-full bg-white/85 px-2 py-1 text-[10px] font-semibold text-neutral-700 shadow-sm dark:bg-neutral-950/80 dark:text-neutral-200">
        Sermon
      </div>
      <span className="sr-only">{title}</span>
    </div>
  )
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
        tone === 'neutral' &&
          'bg-neutral-100 text-neutral-700 dark:bg-neutral-900 dark:text-neutral-200'
      )}
    >
      {children}
    </span>
  )
}

function AvailabilityBadges({ sermon, t }: { sermon: Sermon; t: LibraryTranslations }) {
  const a = sermon.availability
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {a.hasAudio ? (
        <Badge tone="primary">
          <Headphones className="h-3 w-3" strokeWidth={2} />
          {t.audio ?? 'Audio'}
        </Badge>
      ) : a.hasTranscript ? (
        <Badge>
          <Text className="h-3 w-3" strokeWidth={2} />
          Transcript only
        </Badge>
      ) : null}
      {a.hasVideo ? (
        <Badge tone="secondary">
          <Video className="h-3 w-3" strokeWidth={2} />
          {t.video ?? 'Video'}
        </Badge>
      ) : null}
      {a.hasTranscript ? (
        <Badge>
          <BookOpen className="h-3 w-3" strokeWidth={2} />
          {t.notes ?? 'Notes'}
        </Badge>
      ) : null}
    </div>
  )
}

function PillButton({
  active,
  children,
  onClick,
}: {
  active?: boolean
  children: React.ReactNode
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full px-3 py-1.5 text-xs font-semibold transition-colors',
        active
          ? 'bg-primary-600 text-white'
          : 'bg-white/60 dark:bg-neutral-950/40 border border-neutral-200/70 dark:border-neutral-800/70 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-900'
      )}
    >
      {children}
    </button>
  )
}

function SeriesCard({
  series,
  topics,
  isSaved,
  locale,
  t,
  progress,
  onOpen,
  onToggleSave,
}: {
  series: Series
  topics: Topic[]
  isSaved: boolean
  locale: string
  t: LibraryTranslations
  progress: SeriesProgress
  onOpen?: () => void
  onToggleSave?: (nextSaved: boolean) => void
}) {
  const seriesText = pickSeriesText(series, locale)
  const sermonCountShown = progress.totalCount > 0 ? progress.totalCount : series.sermonCount
  const topicLabels = series.topicIds
    .map((id) => {
      const topic = topics.find((x) => x.id === id)
      if (!topic) return null
      return pickLabel(topic.label, topic.translations?.[locale as 'en' | 'fr'], locale)
    })
    .filter(Boolean) as string[]

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-neutral-200/70 dark:border-neutral-800/70 bg-white/60 dark:bg-neutral-950/40 hover:bg-white/80 dark:hover:bg-neutral-950/60 transition-colors flex flex-col">
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(circle_at_20%_10%,rgba(139,92,246,0.12),transparent_45%),radial-gradient(circle_at_90%_80%,rgba(245,158,11,0.10),transparent_50%)]" />
      <div className="relative p-5 sm:p-6 flex flex-col flex-1 min-h-0">
        <SeriesThumbnail
          src={series.thumbnailUrl}
          title={seriesText.title}
          className="mb-5 aspect-[16/9]"
        />
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="primary">
                  <Sparkles className="h-3 w-3" strokeWidth={2} />
                  {t.series ?? 'Series'}
                </Badge>
                <Badge>
                  <ListMusic className="h-3 w-3" strokeWidth={2} />
                  {sermonCountShown} sermons
                </Badge>
              </div>
              <h3 className="mt-3 text-lg font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">
                {seriesText.title}
              </h3>
              <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed line-clamp-3">
                {seriesText.description}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onToggleSave?.(!isSaved)}
              className={cn(
                'h-10 w-10 rounded-2xl border border-neutral-200/70 dark:border-neutral-800/70 bg-white/60 dark:bg-neutral-950/40 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center justify-center',
                isSaved && 'border-primary-200 dark:border-primary-500/40 bg-primary-600/10 dark:bg-primary-400/10'
              )}
              aria-label={isSaved ? (t.unsaveSeries ?? 'Unsave series') : (t.saveSeries ?? 'Save series')}
            >
              {isSaved ? (
                <BookmarkCheck className="h-4 w-4 text-primary-700 dark:text-primary-200" strokeWidth={1.75} />
              ) : (
                <Bookmark className="h-4 w-4 text-neutral-600 dark:text-neutral-300" strokeWidth={1.75} />
              )}
            </button>
          </div>

          {progress.totalCount > 0 ? (
            <SeriesProgressStrip progress={progress} t={t} className="mt-3" />
          ) : null}

          <div className={cn('mt-4 flex flex-wrap gap-1.5 min-h-[26px]', topicLabels.length === 0 && 'invisible')}>
            {topicLabels.slice(0, 3).map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1 rounded-full bg-neutral-100 dark:bg-neutral-900 px-2 py-0.5 text-[11px] font-semibold text-neutral-700 dark:text-neutral-200"
              >
                <Tag className="h-3 w-3 text-neutral-500 dark:text-neutral-400" strokeWidth={2} />
                {t}
              </span>
            ))}
            {topicLabels.length > 3 ? (
              <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 px-1 py-0.5">
                +{topicLabels.length - 3}
              </span>
            ) : null}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpen}
            className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-xs font-semibold text-white hover:bg-primary-700 transition-colors"
          >
            Browse sermons
            <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
          </button>
          <div className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">
            Low‑distraction archive
          </div>
        </div>
      </div>
    </div>
  )
}

function SermonRow({
  sermon,
  seriesTitle,
  topicLabels,
  isSaved,
  isInQueue,
  locale,
  t,
  onOpen,
  onPlay,
  onWatch,
  onDownload,
  onToggleSave,
  onAddToQueue,
  onMarkCompleted,
}: {
  sermon: Sermon
  seriesTitle?: string
  topicLabels: string[]
  isSaved: boolean
  isInQueue: boolean
  locale: string
  t: LibraryTranslations
  onOpen?: () => void
  onPlay?: () => void
  onWatch?: () => void
  onDownload?: () => void
  onToggleSave?: (nextSaved: boolean) => void
  onAddToQueue?: () => void
  onMarkCompleted?: (completed: boolean) => void
}) {
  const downloaded = sermon.offline.downloadState === 'downloaded'
  const recommended = Boolean(sermon.offline.isRecommendedForDownload)
  const sermonText = pickSermonText(sermon, locale)
  return (
    <div className="rounded-3xl border border-neutral-200/70 dark:border-neutral-800/70 bg-white/60 dark:bg-neutral-950/40 hover:bg-white/80 dark:hover:bg-neutral-950/60 transition-colors p-4 sm:p-5">
      <div className="flex items-start gap-4">
        <button type="button" onClick={onOpen} className="shrink-0">
          <SermonThumbnail
            src={sermon.thumbnailUrl}
            title={sermonText.title}
            className="h-24 w-24 sm:h-28 sm:w-28"
          />
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <button type="button" onClick={onOpen} className="min-w-0 text-left">
              <div className="flex flex-wrap items-center gap-2">
                {recommended ? (
                  <Badge tone="secondary">
                    <Sparkles className="h-3 w-3" strokeWidth={2} />
                    {t.suggested ?? 'Suggested'}
                  </Badge>
                ) : null}
                {downloaded ? (
                  <Badge tone="secondary">
                    <Download className="h-3 w-3" strokeWidth={2} />
                    {t.offline ?? 'Offline'}
                  </Badge>
                ) : null}
                {isInQueue ? (
                  <Badge>
                    <ListMusic className="h-3 w-3" strokeWidth={2} />
                    {t.inQueue ?? 'In queue'}
                  </Badge>
                ) : null}
              </div>
              <h4 className="mt-2 text-sm sm:text-base font-semibold text-neutral-950 dark:text-neutral-50 line-clamp-2">
                {sermonText.title}
              </h4>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">
                <span>{formatDate(sermon.publishedAt)}</span>
                <span className="opacity-50">•</span>
                <span>{formatDuration(sermon.durationSeconds)}</span>
                {seriesTitle ? (
                  <>
                    <span className="opacity-50">•</span>
                    <span className="text-neutral-700 dark:text-neutral-300">{seriesTitle}</span>
                  </>
                ) : null}
              </div>
              <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed line-clamp-2">
                {sermonText.summary}
              </p>
            </button>

            <div className="shrink-0 flex items-center gap-2">
              <button
                type="button"
                onClick={() => onToggleSave?.(!isSaved)}
                className={cn(
                  'h-10 w-10 rounded-2xl border border-neutral-200/70 dark:border-neutral-800/70 bg-white/60 dark:bg-neutral-950/40 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center justify-center',
                  isSaved && 'border-primary-200 dark:border-primary-500/40 bg-primary-600/10 dark:bg-primary-400/10'
                )}
                aria-label={isSaved ? (t.unsaveSermon ?? 'Unsave sermon') : (t.saveSermon ?? 'Save sermon')}
              >
                {isSaved ? (
                  <BookmarkCheck className="h-4 w-4 text-primary-700 dark:text-primary-200" strokeWidth={1.75} />
                ) : (
                  <Bookmark className="h-4 w-4 text-neutral-600 dark:text-neutral-300" strokeWidth={1.75} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <AvailabilityBadges sermon={sermon} t={t} />
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onPlay}
            disabled={!sermon.actions.canPlayAudio}
            className={cn(
              'rounded-xl px-3 py-2 text-xs font-semibold transition-colors',
              sermon.actions.canPlayAudio
                ? 'bg-primary-600/10 text-primary-900 dark:bg-primary-400/10 dark:text-primary-100 hover:bg-primary-600/15 dark:hover:bg-primary-400/15'
                : 'bg-neutral-100 text-neutral-400 dark:bg-neutral-900 dark:text-neutral-500'
            )}
          >
            {t.play ?? 'Play'}
          </button>
          <button
            type="button"
            onClick={onWatch}
            disabled={!sermon.actions.canWatchVideo}
            className={cn(
              'rounded-xl px-3 py-2 text-xs font-semibold transition-colors border border-neutral-200 dark:border-neutral-800',
              sermon.actions.canWatchVideo
                ? 'bg-white/60 dark:bg-neutral-950/40 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-900'
                : 'bg-white/30 dark:bg-neutral-950/20 text-neutral-400 dark:text-neutral-500 border-neutral-200/40 dark:border-neutral-800/40'
            )}
          >
            Video
          </button>
          <button
            type="button"
            onClick={onDownload}
            disabled={!sermon.actions.canDownload}
            className={cn(
              'rounded-xl px-3 py-2 text-xs font-semibold transition-colors border border-neutral-200 dark:border-neutral-800',
              sermon.actions.canDownload
                ? 'bg-secondary-50 text-secondary-900 dark:bg-secondary-500/10 dark:text-secondary-100 hover:bg-secondary-100/70 dark:hover:bg-secondary-500/15'
                : 'bg-white/30 dark:bg-neutral-950/20 text-neutral-400 dark:text-neutral-500 border-neutral-200/40 dark:border-neutral-800/40'
            )}
          >
            {t.download ?? 'Download'}
          </button>
          <button
            type="button"
            onClick={onAddToQueue}
            disabled={!sermon.actions.canAddToQueue}
            className={cn(
              'rounded-xl px-3 py-2 text-xs font-semibold transition-colors border border-neutral-200 dark:border-neutral-800',
              sermon.actions.canAddToQueue
                ? 'bg-white/60 dark:bg-neutral-950/40 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-900'
                : 'bg-white/30 dark:bg-neutral-950/20 text-neutral-400 dark:text-neutral-500 border-neutral-200/40 dark:border-neutral-800/40'
            )}
          >
            Queue
          </button>
          <button
            type="button"
            onClick={() => onMarkCompleted?.(true)}
            disabled={!sermon.actions.canMarkCompleted}
            className={cn(
              'rounded-xl px-3 py-2 text-xs font-semibold transition-colors border border-neutral-200 dark:border-neutral-800',
              sermon.actions.canMarkCompleted
                ? 'bg-white/60 dark:bg-neutral-950/40 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-900'
                : 'bg-white/30 dark:bg-neutral-950/20 text-neutral-400 dark:text-neutral-500 border-neutral-200/40 dark:border-neutral-800/40'
            )}
          >
            Completed
          </button>
        </div>
      </div>

      {topicLabels.length ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {topicLabels.slice(0, 4).map((label) => (
            <span
              key={label}
              className="inline-flex items-center gap-1 rounded-full bg-neutral-100 dark:bg-neutral-900 px-2 py-0.5 text-[11px] font-semibold text-neutral-700 dark:text-neutral-200"
            >
              <Tag className="h-3 w-3 text-neutral-500 dark:text-neutral-400" strokeWidth={2} />
              {label}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export function LibraryHome({
  data,
  locale,
  translations: translationsProp,
  onOpenSeries,
  onBrowseAllSeries,
  onOpenTopic,
  onOpenSermon,
  onToggleSaveSeries,
  onSearch,
  onOpenDownloads,
  onOpenSavedSermons,
}: LibraryProps) {
  const [query, setQuery] = useState('')

  const t = useMemo(
    () => ({ ...DEFAULT_LIBRARY_TRANSLATIONS, ...translationsProp }),
    [translationsProp]
  )

  const savedSeries = useMemo(() => new Set(data.saved.savedSeriesIds), [data.saved.savedSeriesIds])
  const savedSermonCount = data.saved.savedSermonIds.length
  const previewSeries = data.series.slice(0, 2)

  const progressBySeries = useMemo(
    () => buildSeriesProgressMap(data.sermons, data.completedSermonIds),
    [data.sermons, data.completedSermonIds]
  )

  const emptyProgress: SeriesProgress = {
    totalCount: 0,
    completedCount: 0,
    percent: 0,
    isComplete: false,
  }

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSearch?.(query.trim())
  }

  return (
    <div className="w-full">
      <div className="mx-auto max-w-5xl">
        {/* Title + search entrypoint */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">
              {t.title ?? 'Library'}
            </h1>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
              {t.subtitle ?? "Browse calmly. Search precisely. Save what you'll need offline."}
              {data.downloads?.length ? (
                <>
                  {' · '}
                  <button
                    type="button"
                    onClick={() => onOpenDownloads?.()}
                    className="font-semibold text-primary-700 dark:text-primary-200 hover:underline"
                  >
                    {data.downloads.length} offline
                  </button>
                </>
              ) : onOpenDownloads ? (
                <>
                  {' · '}
                  <button
                    type="button"
                    onClick={() => onOpenDownloads()}
                    className="font-semibold text-primary-700 dark:text-primary-200 hover:underline"
                  >
                    Offline downloads
                  </button>
                </>
              ) : null}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => onOpenSavedSermons?.()}
                className="inline-flex items-center gap-2 rounded-full border border-primary-200/70 bg-primary-600/10 px-3 py-1.5 text-xs font-semibold text-primary-900 transition-colors hover:bg-primary-600/15 dark:border-primary-500/30 dark:bg-primary-400/10 dark:text-primary-100 dark:hover:bg-primary-400/15"
              >
                <BookmarkCheck className="h-3.5 w-3.5" strokeWidth={1.75} />
                Saved sermons
                <span className="rounded-full bg-white/70 px-1.5 py-0.5 text-[10px] text-primary-900 dark:bg-neutral-950/40 dark:text-primary-100">
                  {savedSermonCount}
                </span>
              </button>
              {data.listeningQueue.queueSermonIds.length ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-white/60 px-3 py-1.5 text-xs font-semibold text-neutral-600 dark:bg-neutral-950/40 dark:text-neutral-300">
                  <ListMusic className="h-3.5 w-3.5" strokeWidth={1.75} />
                  {data.listeningQueue.queueSermonIds.length} queued
                </span>
              ) : null}
            </div>
          </div>

          <div className="w-full md:max-w-md">
            <form onSubmit={handleSearchSubmit} className="rounded-2xl border border-neutral-200/70 dark:border-neutral-800/70 bg-white/70 dark:bg-neutral-950/40 px-3 py-2 flex items-center gap-2">
              <Search className="h-4 w-4 text-neutral-500 dark:text-neutral-400" strokeWidth={1.75} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.searchPlaceholder ?? 'Search: title, summary, scripture, notes…'}
                className="w-full bg-transparent outline-none text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400"
              />
              <button
                type="submit"
                className="rounded-xl bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-700 transition-colors"
              >
                {t.search ?? 'Search'}
              </button>
            </form>

            {data.searchState.recentQueries?.length ? (
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">
                  Recent:
                </span>
                {data.searchState.recentQueries.slice(0, 4).map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => onSearch?.(q)}
                    className="text-[11px] font-semibold text-primary-700 dark:text-primary-200 hover:underline"
                  >
                    {q}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        {/* Series preview + Topics */}
        <section className="mt-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold tracking-wide text-neutral-700 dark:text-neutral-300 uppercase">
                Featured series
              </div>
              <div className="mt-1 text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">
                Previewing {previewSeries.length} of {data.series.length} series
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                if (onBrowseAllSeries) {
                  onBrowseAllSeries()
                  return
                }
                onOpenSeries?.(data.series[0]?.id ?? '')
              }}
              className="text-[11px] font-semibold text-primary-700 dark:text-primary-200 hover:underline inline-flex items-center gap-1"
            >
              View all series
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
            </button>
          </div>

          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {previewSeries.map((s) => (
              <SeriesCard
                key={s.id}
                series={s}
                topics={data.topics}
                isSaved={savedSeries.has(s.id)}
                locale={locale}
                progress={progressBySeries.get(s.id) ?? emptyProgress}
                t={t}
                onOpen={() => onOpenSeries?.(s.id)}
                onToggleSave={(next) => onToggleSaveSeries?.(s.id, next)}
              />
            ))}
          </div>

          <div className="mt-6 rounded-3xl border border-neutral-200/70 dark:border-neutral-800/70 bg-white/60 dark:bg-neutral-950/40 p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-neutral-950 dark:text-neutral-50">Topics</div>
              <div className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">
                Tap to search by topic
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {data.topics.map((tp) => (
                <PillButton
                  key={tp.id}
                  onClick={() => onOpenTopic?.(tp.id)}
                >
                  <span className="inline-flex items-center gap-1.5">
                    <Tag className="h-4 w-4" strokeWidth={1.75} />
                    {pickLabel(tp.label, tp.translations?.[locale as 'en' | 'fr'], locale)}
                  </span>
                </PillButton>
              ))}
            </div>
          </div>
        </section>

        {/* Recent sermons preview */}
        <section className="mt-8 pb-10">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold tracking-wide text-neutral-700 dark:text-neutral-300 uppercase">
              Recent teachings
            </div>
            <button
              type="button"
              onClick={() => onSearch?.('')}
              className="text-[11px] font-semibold text-primary-700 dark:text-primary-200 hover:underline inline-flex items-center gap-1"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
            </button>
          </div>

          <div className="mt-3 grid gap-3">
            {data.sermons.slice(0, 3).map((s) => {
              const series = s.seriesId ? data.series.find((sr) => sr.id === s.seriesId) : null
              const seriesTitle = series ? pickSeriesText(series, locale).title : undefined
              const topicLabels = s.topicIds
                .map((id) => {
                  const tp = data.topics.find((x) => x.id === id)
                  if (!tp) return null
                  return pickLabel(tp.label, tp.translations?.[locale as 'en' | 'fr'], locale)
                })
                .filter(Boolean) as string[]

              return (
                <SermonRow
                  key={s.id}
                  sermon={s}
                  seriesTitle={seriesTitle}
                  topicLabels={topicLabels}
                  isSaved={data.saved.savedSermonIds.includes(s.id)}
                  isInQueue={data.listeningQueue.queueSermonIds.includes(s.id)}
                  locale={locale}
                  t={t}
                  onOpen={() => onOpenSermon?.(s.id)}
                />
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}

