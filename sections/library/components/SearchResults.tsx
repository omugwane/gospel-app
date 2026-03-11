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
} from '@/../product/sections/library/types'

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
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' })
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
          'bg-violet-600/10 text-violet-900 dark:bg-violet-400/10 dark:text-violet-100',
        tone === 'secondary' &&
          'bg-amber-50 text-amber-900 dark:bg-amber-500/10 dark:text-amber-100',
        tone === 'neutral' && 'bg-stone-100 text-stone-700 dark:bg-stone-900 dark:text-stone-200'
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
          ? 'bg-violet-600 text-white border-violet-600'
          : 'bg-white/60 dark:bg-stone-950/40 border-stone-200/70 dark:border-stone-800/70 text-stone-800 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-900'
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
    <article className="rounded-3xl border border-stone-200/70 dark:border-stone-800/70 bg-white/60 dark:bg-stone-950/40 hover:bg-white/80 dark:hover:bg-stone-950/60 transition-colors p-5">
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

          <h3 className="mt-2 text-sm sm:text-base font-semibold text-stone-950 dark:text-stone-50 line-clamp-2">
            {text.title}
          </h3>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold text-stone-500 dark:text-stone-400">
            <span>{formatDate(sermon.publishedAt)}</span>
            <span className="opacity-50">•</span>
            <span>{formatDuration(sermon.durationSeconds)}</span>
            {seriesTitle ? (
              <>
                <span className="opacity-50">•</span>
                <span className="text-stone-700 dark:text-stone-300">{seriesTitle}</span>
              </>
            ) : null}
          </div>

          <p className="mt-2 text-sm text-stone-700 dark:text-stone-300 leading-relaxed line-clamp-2">
            {text.summary}
          </p>
        </button>

        <div className="shrink-0 flex items-center gap-2">
          <button
            type="button"
            onClick={() => onToggleSave?.(!isSaved)}
            className={cn(
              'h-10 w-10 rounded-2xl border border-stone-200/70 dark:border-stone-800/70 bg-white/60 dark:bg-stone-950/40 hover:bg-stone-50 dark:hover:bg-stone-900 transition-colors flex items-center justify-center',
              isSaved && 'border-violet-200 dark:border-violet-500/40 bg-violet-600/10 dark:bg-violet-400/10'
            )}
            aria-label={isSaved ? 'Unsave sermon' : 'Save sermon'}
          >
            {isSaved ? (
              <BookmarkCheck className="h-4 w-4 text-violet-700 dark:text-violet-200" strokeWidth={1.75} />
            ) : (
              <Bookmark className="h-4 w-4 text-stone-600 dark:text-stone-300" strokeWidth={1.75} />
            )}
          </button>
        </div>
      </div>

      {topicLabels.length ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {topicLabels.slice(0, 4).map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1 rounded-full bg-stone-100 dark:bg-stone-900 px-2 py-0.5 text-[11px] font-semibold text-stone-700 dark:text-stone-200"
            >
              <Tag className="h-3 w-3 text-stone-500 dark:text-stone-400" strokeWidth={2} />
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
              ? 'bg-violet-600/10 text-violet-900 dark:bg-violet-400/10 dark:text-violet-100 hover:bg-violet-600/15 dark:hover:bg-violet-400/15'
              : 'bg-stone-100 text-stone-400 dark:bg-stone-900 dark:text-stone-500'
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
            'inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-colors border border-stone-200 dark:border-stone-800',
            sermon.actions.canWatchVideo
              ? 'bg-white/60 dark:bg-stone-950/40 text-stone-900 dark:text-stone-100 hover:bg-stone-50 dark:hover:bg-stone-900'
              : 'bg-white/30 dark:bg-stone-950/20 text-stone-400 dark:text-stone-500 border-stone-200/40 dark:border-stone-800/40'
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
            'inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-colors border border-stone-200 dark:border-stone-800',
            sermon.actions.canDownload
              ? 'bg-amber-50 text-amber-900 dark:bg-amber-500/10 dark:text-amber-100 hover:bg-amber-100/70 dark:hover:bg-amber-500/15'
              : 'bg-white/30 dark:bg-stone-950/20 text-stone-400 dark:text-stone-500 border-stone-200/40 dark:border-stone-800/40'
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
            'inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-colors border border-stone-200 dark:border-stone-800',
            sermon.actions.canAddToQueue
              ? 'bg-white/60 dark:bg-stone-950/40 text-stone-900 dark:text-stone-100 hover:bg-stone-50 dark:hover:bg-stone-900'
              : 'bg-white/30 dark:bg-stone-950/20 text-stone-400 dark:text-stone-500 border-stone-200/40 dark:border-stone-800/40'
          )}
        >
          <ListMusic className="h-4 w-4" strokeWidth={1.75} />
          Queue
        </button>
        <button
          type="button"
          onClick={() => onMarkCompleted?.(true)}
          disabled={!sermon.actions.canMarkCompleted}
          className={cn(
            'ml-auto inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-colors border border-stone-200 dark:border-stone-800',
            sermon.actions.canMarkCompleted
              ? 'bg-white/60 dark:bg-stone-950/40 text-stone-900 dark:text-stone-100 hover:bg-stone-50 dark:hover:bg-stone-900'
              : 'bg-white/30 dark:bg-stone-950/20 text-stone-400 dark:text-stone-500 border-stone-200/40 dark:border-stone-800/40'
          )}
        >
          <CheckCircle2 className="h-4 w-4" strokeWidth={1.75} />
          Completed
        </button>
      </div>
    </article>
  )
}

export function SearchResults({
  data,
  locale,
  onOpenSeries,
  onOpenTopic,
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
            <div className="inline-flex items-center gap-2 text-[11px] font-semibold text-stone-500 dark:text-stone-400">
              <button
                type="button"
                onClick={() => onOpenSeries?.(data.series[0]?.id ?? '')}
                className="inline-flex items-center gap-1 rounded-full border border-stone-200/70 dark:border-stone-800/70 bg-white/60 dark:bg-stone-950/40 px-3 py-1 hover:bg-stone-50 dark:hover:bg-stone-900 transition-colors"
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

            <h1 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight text-stone-950 dark:text-stone-50">
              Search
            </h1>
            <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
              Titles, summaries, scripture references, and notes.
            </p>
          </div>

          <div className="w-full md:max-w-md">
            <div className="rounded-2xl border border-stone-200/70 dark:border-stone-800/70 bg-white/70 dark:bg-stone-950/40 px-3 py-2 flex items-center gap-2">
              <Search className="h-4 w-4 text-stone-500 dark:text-stone-400" strokeWidth={1.75} />
              <input
                value={query}
                onChange={(e) => triggerSearch(e.target.value)}
                placeholder="Search sermons…"
                className="w-full bg-transparent outline-none text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400"
              />
              <button
                type="button"
                onClick={() => triggerSearch(query)}
                className="rounded-xl bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-700 transition-colors"
              >
                Search
              </button>
            </div>

            {data.searchState.recentQueries?.length ? (
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">Recent:</span>
                {data.searchState.recentQueries.slice(0, 4).map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => triggerSearch(q)}
                    className="text-[11px] font-semibold text-violet-700 dark:text-violet-200 hover:underline"
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
          <div className="rounded-3xl border border-stone-200/70 dark:border-stone-800/70 bg-white/60 dark:bg-stone-950/40 p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold tracking-wide text-stone-700 dark:text-stone-300 uppercase">
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
                      hasAudio: true,
                      hasVideo: null,
                      hasTranscript: null,
                    })
                  }}
                  className="text-[11px] font-semibold text-stone-600 dark:text-stone-300 hover:underline"
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
                <div className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 mb-2">
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
                        onClick={() => {
                          applyFilters({ ...filters, seriesId: active ? null : s.id })
                          onOpenSeries?.(s.id)
                        }}
                        className={cn(
                          'rounded-full px-3 py-1.5 text-xs font-semibold transition-colors border',
                          active
                            ? 'bg-violet-600 text-white border-violet-600'
                            : 'bg-white/60 dark:bg-stone-950/40 border-stone-200/70 dark:border-stone-800/70 text-stone-800 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-900'
                        )}
                      >
                        {title}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <div className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 mb-2">
                  Topic
                </div>
                <div className="flex flex-wrap gap-2">
                  {data.topics.map((t) => {
                    const label = pickLabel(t.label, t.translations?.[locale], locale)
                    const active = filters.topicId === t.id
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          applyFilters({ ...filters, topicId: active ? null : t.id })
                          onOpenTopic?.(t.id)
                        }}
                        className={cn(
                          'rounded-full px-3 py-1.5 text-xs font-semibold transition-colors border',
                          active
                            ? 'bg-violet-600 text-white border-violet-600'
                            : 'bg-white/60 dark:bg-stone-950/40 border-stone-200/70 dark:border-stone-800/70 text-stone-800 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-900'
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
          <div className="rounded-3xl border border-stone-200/70 dark:border-stone-800/70 bg-white/60 dark:bg-stone-950/40 p-4 sm:p-5">
            <div className="text-xs font-semibold tracking-wide text-stone-700 dark:text-stone-300 uppercase">
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
                <div className="text-sm text-stone-600 dark:text-stone-400">
                  Try narrowing by series or topic for faster discovery.
                </div>
              ) : null}
            </div>

            <div className="mt-4 rounded-2xl border border-amber-200/70 dark:border-amber-500/30 bg-amber-50/80 dark:bg-amber-500/10 p-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-2xl bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center">
                  <Text className="h-5 w-5 text-amber-900 dark:text-amber-100" strokeWidth={1.75} />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                    Notes-aware search
                  </div>
                  <div className="mt-1 text-sm text-amber-800/90 dark:text-amber-200">
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
            <div className="text-xs font-semibold tracking-wide text-stone-700 dark:text-stone-300 uppercase">
              Results
            </div>
            <div className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
              {results.length} found
            </div>
          </div>

          <div className="mt-3 grid gap-3">
            {results.length === 0 ? (
              <div className="rounded-3xl border border-stone-200/70 dark:border-stone-800/70 bg-white/60 dark:bg-stone-950/40 p-6">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-stone-100 dark:bg-stone-900 flex items-center justify-center">
                    <Search className="h-5 w-5 text-stone-600 dark:text-stone-300" strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-stone-950 dark:text-stone-50">No matches</div>
                    <div className="mt-1 text-sm text-stone-600 dark:text-stone-400">
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

