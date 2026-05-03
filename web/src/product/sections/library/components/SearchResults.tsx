'use client'

import { useMemo, useState } from 'react'
import {
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  ChevronLeft,
  Download,
  Filter,
  Headphones,
  ListMusic,
  Play,
  Search,
  Tag,
  Text,
  Video,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type {
  LanguageCode,
  LibraryProps,
  SearchFilters,
  Sermon,
  Series,
} from '@/product/sections/library/types'

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
  if (locale === 'rw') return { title: sermon.title, summary: sermon.summary }
  const t = sermon.translations?.[locale]
  return {
    title: t?.title?.trim() || sermon.title,
    summary: t?.summary?.trim() || sermon.summary,
  }
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

function Chip({
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

function Pill({
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
        'rounded-full px-3 py-1.5 text-xs font-semibold transition-colors border',
        active
          ? 'bg-primary-600 text-white border-primary-600'
          : 'bg-white/60 dark:bg-neutral-950/40 border-neutral-200/70 dark:border-neutral-800/70 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-900'
      )}
    >
      {children}
    </button>
  )
}

function SermonResultRow({
  sermon,
  seriesTitle,
  topicLabels,
  locale,
  isSaved,
  isInQueue,
  isCompleted,
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
  locale: LanguageCode
  isSaved: boolean
  isInQueue: boolean
  isCompleted: boolean
  onOpen?: () => void
  onPlay?: () => void
  onWatch?: () => void
  onDownload?: () => void
  onToggleSave?: (nextSaved: boolean) => void
  onAddToQueue?: () => void
  onMarkCompleted?: (completed: boolean) => void
}) {
  const text = pickSermonText(sermon, locale)
  const downloaded = sermon.offline.downloadState === 'downloaded'

  return (
    <article className="rounded-3xl border border-neutral-200/70 dark:border-neutral-800/70 bg-white/60 dark:bg-neutral-950/40 hover:bg-white/80 dark:hover:bg-neutral-950/60 transition-colors p-5">
      <div className="flex items-start gap-4">
        <button type="button" onClick={onOpen} className="shrink-0">
          <SermonThumbnail src={sermon.thumbnailUrl} title={text.title} className="h-24 w-24 sm:h-28 sm:w-28" />
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <button type="button" onClick={onOpen} className="min-w-0 text-left">
              <div className="flex flex-wrap items-center gap-2">
                {downloaded ? (
                  <Chip tone="secondary">
                    <Download className="h-3 w-3" strokeWidth={2} />
                    Offline
                  </Chip>
                ) : null}
                {isInQueue ? (
                  <Chip>
                    <ListMusic className="h-3 w-3" strokeWidth={2} />
                    In queue
                  </Chip>
                ) : null}
                {sermon.availability.hasAudio ? (
                  <Chip tone="primary">
                    <Headphones className="h-3 w-3" strokeWidth={2} />
                    Audio
                  </Chip>
                ) : null}
                {sermon.availability.hasVideo ? (
                  <Chip tone="secondary">
                    <Video className="h-3 w-3" strokeWidth={2} />
                    Video
                  </Chip>
                ) : null}
                {sermon.availability.hasTranscript ? (
                  <Chip>
                    <Text className="h-3 w-3" strokeWidth={2} />
                    Notes
                  </Chip>
                ) : null}
              </div>

              <h3 className="mt-2 text-sm sm:text-base font-semibold text-neutral-950 dark:text-neutral-50 line-clamp-2">
                {text.title}
              </h3>

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
                {text.summary}
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
                aria-label={isSaved ? 'Unsave sermon' : 'Save sermon'}
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

      {topicLabels.length ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
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

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onPlay}
          disabled={!sermon.actions.canPlayAudio}
          className={cn(
            'inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-colors',
            sermon.actions.canPlayAudio
              ? 'bg-primary-600/10 text-primary-900 dark:bg-primary-400/10 dark:text-primary-100 hover:bg-primary-600/15 dark:hover:bg-primary-400/15'
              : 'bg-neutral-100 text-neutral-400 dark:bg-neutral-900 dark:text-neutral-500'
          )}
        >
          <Play className="h-4 w-4" strokeWidth={1.75} />
          Play
        </button>
        <button
          type="button"
          onClick={onWatch}
          disabled={!sermon.actions.canWatchVideo}
          className={cn(
            'inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-colors border border-neutral-200 dark:border-neutral-800',
            sermon.actions.canWatchVideo
              ? 'bg-white/60 dark:bg-neutral-950/40 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-900'
              : 'bg-white/30 dark:bg-neutral-950/20 text-neutral-400 dark:text-neutral-500 border-neutral-200/40 dark:border-neutral-800/40'
          )}
        >
          <Video className="h-4 w-4" strokeWidth={1.75} />
          Video
        </button>
        <button
          type="button"
          onClick={onDownload}
          disabled={!sermon.actions.canDownload}
          className={cn(
            'inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-colors border border-neutral-200 dark:border-neutral-800',
            sermon.actions.canDownload
              ? 'bg-secondary-50 text-secondary-900 dark:bg-secondary-500/10 dark:text-secondary-100 hover:bg-secondary-100/70 dark:hover:bg-secondary-500/15'
              : 'bg-white/30 dark:bg-neutral-950/20 text-neutral-400 dark:text-neutral-500 border-neutral-200/40 dark:border-neutral-800/40'
          )}
        >
          <Download className="h-4 w-4" strokeWidth={1.75} />
          Download
        </button>
        <button
          type="button"
          onClick={onAddToQueue}
          disabled={!sermon.actions.canAddToQueue}
          className={cn(
            'inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-colors border border-neutral-200 dark:border-neutral-800',
            sermon.actions.canAddToQueue
              ? 'bg-white/60 dark:bg-neutral-950/40 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-900'
              : 'bg-white/30 dark:bg-neutral-950/20 text-neutral-400 dark:text-neutral-500 border-neutral-200/40 dark:border-neutral-800/40'
          )}
        >
          <ListMusic className="h-4 w-4" strokeWidth={1.75} />
          Queue
        </button>
        <button
          type="button"
          onClick={() => onMarkCompleted?.(!isCompleted)}
          disabled={!sermon.actions.canMarkCompleted}
          className={cn(
            'ml-auto inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-colors border',
            isCompleted
              ? 'bg-primary-600/10 text-primary-900 dark:bg-primary-400/10 dark:text-primary-100 border-primary-200/70 dark:border-primary-500/40 hover:bg-primary-600/15 dark:hover:bg-primary-400/15'
              : sermon.actions.canMarkCompleted
                ? 'bg-white/60 dark:bg-neutral-950/40 text-neutral-900 dark:text-neutral-100 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900'
                : 'bg-white/30 dark:bg-neutral-950/20 text-neutral-400 dark:text-neutral-500 border-neutral-200/40 dark:border-neutral-800/40'
          )}
        >
          <CheckCircle2 className="h-4 w-4" strokeWidth={1.75} />
          {isCompleted ? 'Completed' : 'Mark complete'}
        </button>
      </div>
    </article>
  )
}

export function SearchResults({
  data,
  locale,
  onBack,
  onOpenSermon,
  onPlaySermonAudio,
  onWatchSermonVideo,
  onDownloadSermon,
  onToggleSaveSermon,
  onAddToQueue,
  onMarkSermonCompleted,
  onSearch,
  onUpdateSearchFilters,
}: LibraryProps) {
  const [query, setQuery] = useState(data.searchState.query)
  const [filters, setFilters] = useState<SearchFilters>(data.searchState.filters)

  const seriesById = useMemo(() => new Map(data.series.map((s) => [s.id, s])), [data.series])
  const topicById = useMemo(() => new Map(data.topics.map((t) => [t.id, t])), [data.topics])
  const queue = useMemo(() => new Set(data.listeningQueue.queueSermonIds), [data.listeningQueue.queueSermonIds])

  const applyFilters = (next: SearchFilters) => {
    setFilters(next)
    onUpdateSearchFilters?.(next)
  }

  const triggerSearch = (q: string) => {
    setQuery(q)
    onSearch?.(q)
  }

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = data.sermons

    if (filters.seriesId) list = list.filter((s) => s.seriesId === filters.seriesId)
    if (filters.topicId) list = list.filter((s) => s.topicIds.includes(filters.topicId as string))
    if (filters.hasAudio !== null) list = list.filter((s) => s.availability.hasAudio === filters.hasAudio)
    if (filters.hasVideo !== null) list = list.filter((s) => s.availability.hasVideo === filters.hasVideo)
    if (filters.hasTranscript !== null) list = list.filter((s) => s.availability.hasTranscript === filters.hasTranscript)

    if (!q) return list
    return list.filter((s) => {
      const t = pickSermonText(s, locale)
      const transcript =
        locale !== 'rw'
          ? (s.translations?.[locale]?.transcript ?? s.notes?.transcript ?? '')
          : s.notes?.transcript ?? ''

      const hay = [t.title, t.summary, ...s.scriptureReferences, transcript].join(' ').toLowerCase()
      return hay.includes(q)
    })
  }, [locale, data.sermons, filters, query])

  const activeSeries = filters.seriesId ? seriesById.get(filters.seriesId) : null
  const activeTopic = filters.topicId ? topicById.get(filters.topicId) : null

  const hasAnyFilter =
    Boolean(filters.seriesId) ||
    Boolean(filters.topicId) ||
    filters.hasAudio !== null ||
    filters.hasVideo !== null ||
    filters.hasTranscript !== null

  return (
    <div className="w-full">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">
              <button
                type="button"
                onClick={() => onBack?.()}
                className="inline-flex items-center gap-1 rounded-full border border-neutral-200/70 dark:border-neutral-800/70 bg-white/60 dark:bg-neutral-950/40 px-3 py-1 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
              >
                <ChevronLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
                Back
              </button>
              <span className="opacity-60">•</span>
              <span className="inline-flex items-center gap-1">
                <Search className="h-3.5 w-3.5" strokeWidth={1.75} />
                Search results
              </span>
              <span className="opacity-60">•</span>
              <span className="inline-flex items-center gap-1">
                <Filter className="h-3.5 w-3.5" strokeWidth={1.75} />
                {results.length}
              </span>
            </div>

            <h1 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">
              Search
            </h1>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
              Titles, summaries, scripture references, and notes.
            </p>
          </div>

          <div className="w-full md:max-w-md">
            <div className="rounded-2xl border border-neutral-200/70 dark:border-neutral-800/70 bg-white/70 dark:bg-neutral-950/40 px-3 py-2 flex items-center gap-2">
              <Search className="h-4 w-4 text-neutral-500 dark:text-neutral-400" strokeWidth={1.75} />
              <input
                value={query}
                onChange={(e) => triggerSearch(e.target.value)}
                placeholder="Search sermons…"
                className="w-full bg-transparent outline-none text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400"
              />
              <button
                type="button"
                onClick={() => triggerSearch(query)}
                className="rounded-xl bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-700 transition-colors"
              >
                Search
              </button>
            </div>

            {data.searchState.recentQueries?.length ? (
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">Recent:</span>
                {data.searchState.recentQueries.slice(0, 4).map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => triggerSearch(q)}
                    className="text-[11px] font-semibold text-primary-700 dark:text-primary-200 hover:underline"
                  >
                    {q}
                  </button>
                ))}
              </div>
            ) : null}

          </div>
        </div>

        {/* Filter controls */}
        <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-3xl border border-neutral-200/70 dark:border-neutral-800/70 bg-white/60 dark:bg-neutral-950/40 p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold tracking-wide text-neutral-700 dark:text-neutral-300 uppercase">
                Filters
              </div>
              {hasAnyFilter || query.trim() ? (
                <button
                  type="button"
                  onClick={() => {
                    triggerSearch('')
                    applyFilters({
                      seriesId: null,
                      topicId: null,
                      hasAudio: null,
                      hasVideo: null,
                      hasTranscript: null,
                    })
                  }}
                  className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-300 hover:underline"
                >
                  Reset
                </button>
              ) : null}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Pill
                active={filters.hasAudio === true}
                onClick={() => applyFilters({ ...filters, hasAudio: filters.hasAudio === true ? null : true })}
              >
                <span className="inline-flex items-center gap-1.5">
                  <Headphones className="h-4 w-4" strokeWidth={1.75} />
                  Audio
                </span>
              </Pill>
              <Pill
                active={filters.hasVideo === true}
                onClick={() => applyFilters({ ...filters, hasVideo: filters.hasVideo === true ? null : true })}
              >
                <span className="inline-flex items-center gap-1.5">
                  <Video className="h-4 w-4" strokeWidth={1.75} />
                  Video
                </span>
              </Pill>
              <Pill
                active={filters.hasTranscript === true}
                onClick={() =>
                  applyFilters({ ...filters, hasTranscript: filters.hasTranscript === true ? null : true })
                }
              >
                <span className="inline-flex items-center gap-1.5">
                  <Text className="h-4 w-4" strokeWidth={1.75} />
                  Notes
                </span>
              </Pill>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <div className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 mb-2">
                  Series
                </div>
                <div className="flex flex-wrap gap-2">
                  {data.series.map((s) => {
                    const title = pickSeriesText(s, locale).title
                    const active = filters.seriesId === s.id
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => applyFilters({ ...filters, seriesId: active ? null : s.id })}
                        className={cn(
                          'rounded-full px-3 py-1.5 text-xs font-semibold transition-colors border',
                          active
                            ? 'bg-primary-600 text-white border-primary-600'
                            : 'bg-white/60 dark:bg-neutral-950/40 border-neutral-200/70 dark:border-neutral-800/70 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-900'
                        )}
                      >
                        {title}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <div className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 mb-2">
                  Topic
                </div>
                <div className="flex flex-wrap gap-2">
                  {data.topics.map((tp) => {
                    const label = pickLabel(tp.label, tp.translations?.[locale], locale)
                    const active = filters.topicId === tp.id
                    return (
                      <button
                        key={tp.id}
                        type="button"
                        onClick={() => applyFilters({ ...filters, topicId: active ? null : tp.id })}
                        className={cn(
                          'rounded-full px-3 py-1.5 text-xs font-semibold transition-colors border',
                          active
                            ? 'bg-primary-600 text-white border-primary-600'
                            : 'bg-white/60 dark:bg-neutral-950/40 border-neutral-200/70 dark:border-neutral-800/70 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-900'
                        )}
                      >
                        {label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Active filter summary */}
          <div className="rounded-3xl border border-neutral-200/70 dark:border-neutral-800/70 bg-white/60 dark:bg-neutral-950/40 p-4 sm:p-5">
            <div className="text-xs font-semibold tracking-wide text-neutral-700 dark:text-neutral-300 uppercase">
              Active
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {activeSeries ? (
                <Chip>
                  <Filter className="h-3 w-3" strokeWidth={2} />
                  {pickSeriesText(activeSeries, locale).title}
                </Chip>
              ) : null}
              {activeTopic ? (
                <Chip>
                  <Tag className="h-3 w-3" strokeWidth={2} />
                  {pickLabel(activeTopic.label, activeTopic.translations?.[locale], locale)}
                </Chip>
              ) : null}
              {filters.hasAudio === true ? (
                <Chip tone="primary">
                  <Headphones className="h-3 w-3" strokeWidth={2} />
                  Audio
                </Chip>
              ) : null}
              {filters.hasVideo === true ? (
                <Chip tone="secondary">
                  <Video className="h-3 w-3" strokeWidth={2} />
                  Video
                </Chip>
              ) : null}
              {filters.hasTranscript === true ? (
                <Chip>
                  <Text className="h-3 w-3" strokeWidth={2} />
                  Notes
                </Chip>
              ) : null}

              {!activeSeries && !activeTopic && filters.hasVideo !== true && filters.hasTranscript !== true ? (
                <div className="text-sm text-neutral-600 dark:text-neutral-400">
                  Try narrowing by series or topic for faster discovery.
                </div>
              ) : null}
            </div>

            <div className="mt-4 rounded-2xl border border-secondary-200/70 dark:border-secondary-500/30 bg-secondary-50/80 dark:bg-secondary-500/10 p-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-2xl bg-secondary-100 dark:bg-secondary-500/20 flex items-center justify-center">
                  <Text className="h-5 w-5 text-secondary-900 dark:text-secondary-100" strokeWidth={1.75} />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-secondary-900 dark:text-secondary-100">
                    Notes-aware search
                  </div>
                  <div className="mt-1 text-sm text-secondary-800/90 dark:text-secondary-200">
                    Search includes transcript/notes when available — helpful for finding a teaching by a key phrase.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <section className="mt-6 pb-10">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold tracking-wide text-neutral-700 dark:text-neutral-300 uppercase">
              Results
            </div>
            <div className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">
              {results.length} found
            </div>
          </div>

          <div className="mt-3 grid gap-3">
            {results.length === 0 ? (
              <div className="rounded-3xl border border-neutral-200/70 dark:border-neutral-800/70 bg-white/60 dark:bg-neutral-950/40 p-6">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center">
                    <Search className="h-5 w-5 text-neutral-600 dark:text-neutral-300" strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-neutral-950 dark:text-neutral-50">No matches</div>
                    <div className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                      Try a shorter keyword, change language, or clear filters.
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              results.map((s) => {
                const seriesTitle = s.seriesId
                  ? pickSeriesText(seriesById.get(s.seriesId)!, locale).title
                  : undefined
                const topicLabels = s.topicIds
                  .map((id) => {
                    const t = topicById.get(id)
                    if (!t) return null
                    return pickLabel(t.label, t.translations?.[locale], locale)
                  })
                  .filter(Boolean) as string[]

                return (
                  <SermonResultRow
                    key={s.id}
                    sermon={s}
                    seriesTitle={seriesTitle}
                    topicLabels={topicLabels}
                    locale={locale}
                    isSaved={data.saved.savedSermonIds.includes(s.id)}
                    isInQueue={queue.has(s.id)}
                    isCompleted={data.completedSermonIds.includes(s.id)}
                    onOpen={() => onOpenSermon?.(s.id)}
                    onPlay={() => onPlaySermonAudio?.(s.id)}
                    onWatch={() => onWatchSermonVideo?.(s.id)}
                    onDownload={() => onDownloadSermon?.(s.id)}
                    onToggleSave={(next) => onToggleSaveSermon?.(s.id, next)}
                    onAddToQueue={() => onAddToQueue?.(s.id)}
                    onMarkCompleted={(completed) => onMarkSermonCompleted?.(s.id, completed)}
                  />
                )
              })
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

