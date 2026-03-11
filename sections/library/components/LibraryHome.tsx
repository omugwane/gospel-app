import { useMemo, useState } from 'react'
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
  Video,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type {
  LibraryProps,
  LibraryTranslations,
  SearchFilters,
  Series,
  Sermon,
  Topic,
} from '@/../product/sections/library/types'
import { DEFAULT_LIBRARY_TRANSLATIONS } from '@/../product/sections/library/types'

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

function uniq<T>(arr: T[]) {
  return Array.from(new Set(arr))
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
          'bg-violet-600/10 text-violet-900 dark:bg-violet-400/10 dark:text-violet-100',
        tone === 'secondary' &&
          'bg-amber-50 text-amber-900 dark:bg-amber-500/10 dark:text-amber-100',
        tone === 'neutral' &&
          'bg-stone-100 text-stone-700 dark:bg-stone-900 dark:text-stone-200'
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
      ) : (
        <Badge>
          <Headphones className="h-3 w-3 opacity-60" strokeWidth={2} />
          No audio
        </Badge>
      )}
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
          ? 'bg-violet-600 text-white'
          : 'bg-white/60 dark:bg-stone-950/40 border border-stone-200/70 dark:border-stone-800/70 text-stone-800 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-900'
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
  onOpen,
  onToggleSave,
}: {
  series: Series
  topics: Topic[]
  isSaved: boolean
  locale: string
  t: LibraryTranslations
  onOpen?: () => void
  onToggleSave?: (nextSaved: boolean) => void
}) {
  const seriesText = pickSeriesText(series, locale)
  const topicLabels = series.topicIds
    .map((id) => {
      const topic = topics.find((x) => x.id === id)
      if (!topic) return null
      return pickLabel(topic.label, topic.translations?.[locale as 'en' | 'fr'], locale)
    })
    .filter(Boolean) as string[]

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-stone-200/70 dark:border-stone-800/70 bg-white/60 dark:bg-stone-950/40 hover:bg-white/80 dark:hover:bg-stone-950/60 transition-colors">
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(circle_at_20%_10%,rgba(139,92,246,0.12),transparent_45%),radial-gradient(circle_at_90%_80%,rgba(245,158,11,0.10),transparent_50%)]" />
      <div className="relative p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="primary">
                <Sparkles className="h-3 w-3" strokeWidth={2} />
                {t.series ?? 'Series'}
              </Badge>
              <Badge>
                <ListMusic className="h-3 w-3" strokeWidth={2} />
                {series.sermonCount} sermons
              </Badge>
            </div>
            <h3 className="mt-3 text-lg font-semibold tracking-tight text-stone-950 dark:text-stone-50">
              {seriesText.title}
            </h3>
            <p className="mt-2 text-sm text-stone-700 dark:text-stone-300 leading-relaxed line-clamp-3">
              {seriesText.description}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onToggleSave?.(!isSaved)}
            className={cn(
              'h-10 w-10 rounded-2xl border border-stone-200/70 dark:border-stone-800/70 bg-white/60 dark:bg-stone-950/40 hover:bg-stone-50 dark:hover:bg-stone-900 transition-colors flex items-center justify-center',
              isSaved && 'border-violet-200 dark:border-violet-500/40 bg-violet-600/10 dark:bg-violet-400/10'
            )}
            aria-label={isSaved ? (t.unsaveSeries ?? 'Unsave series') : (t.saveSeries ?? 'Save series')}
          >
            {isSaved ? (
              <BookmarkCheck className="h-4 w-4 text-violet-700 dark:text-violet-200" strokeWidth={1.75} />
            ) : (
              <Bookmark className="h-4 w-4 text-stone-600 dark:text-stone-300" strokeWidth={1.75} />
            )}
          </button>
        </div>

        {topicLabels.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {topicLabels.slice(0, 3).map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1 rounded-full bg-stone-100 dark:bg-stone-900 px-2 py-0.5 text-[11px] font-semibold text-stone-700 dark:text-stone-200"
              >
                <Tag className="h-3 w-3 text-stone-500 dark:text-stone-400" strokeWidth={2} />
                {t}
              </span>
            ))}
            {topicLabels.length > 3 ? (
              <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 px-1 py-0.5">
                +{topicLabels.length - 3}
              </span>
            ) : null}
          </div>
        ) : null}

        <div className="mt-5 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onOpen}
            className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-xs font-semibold text-white hover:bg-violet-700 transition-colors"
          >
            Browse sermons
            <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
          </button>
          <div className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
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
    <div className="rounded-3xl border border-stone-200/70 dark:border-stone-800/70 bg-white/60 dark:bg-stone-950/40 hover:bg-white/80 dark:hover:bg-stone-950/60 transition-colors p-4 sm:p-5">
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
          <h4 className="mt-2 text-sm sm:text-base font-semibold text-stone-950 dark:text-stone-50 line-clamp-2">
            {sermonText.title}
          </h4>
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
            {sermonText.summary}
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
            aria-label={isSaved ? (t.unsaveSermon ?? 'Unsave sermon') : (t.saveSermon ?? 'Save sermon')}
          >
            {isSaved ? (
              <BookmarkCheck className="h-4 w-4 text-violet-700 dark:text-violet-200" strokeWidth={1.75} />
            ) : (
              <Bookmark className="h-4 w-4 text-stone-600 dark:text-stone-300" strokeWidth={1.75} />
            )}
          </button>
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
                ? 'bg-violet-600/10 text-violet-900 dark:bg-violet-400/10 dark:text-violet-100 hover:bg-violet-600/15 dark:hover:bg-violet-400/15'
                : 'bg-stone-100 text-stone-400 dark:bg-stone-900 dark:text-stone-500'
            )}
          >
            {t.play ?? 'Play'}
          </button>
          <button
            type="button"
            onClick={onWatch}
            disabled={!sermon.actions.canWatchVideo}
            className={cn(
              'rounded-xl px-3 py-2 text-xs font-semibold transition-colors border border-stone-200 dark:border-stone-800',
              sermon.actions.canWatchVideo
                ? 'bg-white/60 dark:bg-stone-950/40 text-stone-900 dark:text-stone-100 hover:bg-stone-50 dark:hover:bg-stone-900'
                : 'bg-white/30 dark:bg-stone-950/20 text-stone-400 dark:text-stone-500 border-stone-200/40 dark:border-stone-800/40'
            )}
          >
            Video
          </button>
          <button
            type="button"
            onClick={onDownload}
            disabled={!sermon.actions.canDownload}
            className={cn(
              'rounded-xl px-3 py-2 text-xs font-semibold transition-colors border border-stone-200 dark:border-stone-800',
              sermon.actions.canDownload
                ? 'bg-amber-50 text-amber-900 dark:bg-amber-500/10 dark:text-amber-100 hover:bg-amber-100/70 dark:hover:bg-amber-500/15'
                : 'bg-white/30 dark:bg-stone-950/20 text-stone-400 dark:text-stone-500 border-stone-200/40 dark:border-stone-800/40'
            )}
          >
            {t.download ?? 'Download'}
          </button>
          <button
            type="button"
            onClick={onAddToQueue}
            disabled={!sermon.actions.canAddToQueue}
            className={cn(
              'rounded-xl px-3 py-2 text-xs font-semibold transition-colors border border-stone-200 dark:border-stone-800',
              sermon.actions.canAddToQueue
                ? 'bg-white/60 dark:bg-stone-950/40 text-stone-900 dark:text-stone-100 hover:bg-stone-50 dark:hover:bg-stone-900'
                : 'bg-white/30 dark:bg-stone-950/20 text-stone-400 dark:text-stone-500 border-stone-200/40 dark:border-stone-800/40'
            )}
          >
            Queue
          </button>
          <button
            type="button"
            onClick={() => onMarkCompleted?.(true)}
            disabled={!sermon.actions.canMarkCompleted}
            className={cn(
              'rounded-xl px-3 py-2 text-xs font-semibold transition-colors border border-stone-200 dark:border-stone-800',
              sermon.actions.canMarkCompleted
                ? 'bg-white/60 dark:bg-stone-950/40 text-stone-900 dark:text-stone-100 hover:bg-stone-50 dark:hover:bg-stone-900'
                : 'bg-white/30 dark:bg-stone-950/20 text-stone-400 dark:text-stone-500 border-stone-200/40 dark:border-stone-800/40'
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
              className="inline-flex items-center gap-1 rounded-full bg-stone-100 dark:bg-stone-900 px-2 py-0.5 text-[11px] font-semibold text-stone-700 dark:text-stone-200"
            >
              <Tag className="h-3 w-3 text-stone-500 dark:text-stone-400" strokeWidth={2} />
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
  onOpenTopic,
  onOpenSermon,
  onPlaySermonAudio,
  onWatchSermonVideo,
  onDownloadSermon,
  onToggleSaveSermon,
  onToggleSaveSeries,
  onAddToQueue,
  onMarkSermonCompleted,
  onSearch,
  onUpdateSearchFilters,
}: LibraryProps) {
  const [query, setQuery] = useState(data.searchState.query)
  const [filters, setFilters] = useState<SearchFilters>(data.searchState.filters)

  const t = useMemo(
    () => ({ ...DEFAULT_LIBRARY_TRANSLATIONS, ...translationsProp }),
    [translationsProp]
  )

  const savedSeries = useMemo(() => new Set(data.saved.savedSeriesIds), [data.saved.savedSeriesIds])
  const savedSermons = useMemo(() => new Set(data.saved.savedSermonIds), [data.saved.savedSermonIds])
  const queue = useMemo(() => new Set(data.listeningQueue.queueSermonIds), [data.listeningQueue.queueSermonIds])

  const seriesById = useMemo(() => new Map(data.series.map((s) => [s.id, s])), [data.series])
  const topicById = useMemo(() => new Map(data.topics.map((t) => [t.id, t])), [data.topics])

  const recentQueries = data.searchState.recentQueries

  const activeSeries = filters.seriesId ? seriesById.get(filters.seriesId) : null
  const activeTopic = filters.topicId ? topicById.get(filters.topicId) : null

  const hasFilters =
    Boolean(filters.seriesId) ||
    Boolean(filters.topicId) ||
    filters.hasVideo !== null ||
    filters.hasTranscript !== null

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
    if (filters.hasTranscript !== null)
      list = list.filter((s) => s.availability.hasTranscript === filters.hasTranscript)

    if (!q) return list
    return list.filter((s) => {
      const hay = [
        s.title,
        s.summary,
        ...s.scriptureReferences,
        s.notes?.transcript ?? '',
      ]
        .join(' ')
        .toLowerCase()
      return hay.includes(q)
    })
  }, [data.sermons, filters, query])

  const highlightedIds = useMemo(() => uniq([...data.listeningQueue.queueSermonIds, ...data.saved.savedSermonIds]).slice(0, 3), [
    data.listeningQueue.queueSermonIds,
    data.saved.savedSermonIds,
  ])
  const highlighted = highlightedIds
    .map((id) => data.sermons.find((s) => s.id === id))
    .filter(Boolean) as Sermon[]

  return (
    <div className="w-full">
      <div className="mx-auto max-w-5xl">
        {/* Title + search */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-stone-950 dark:text-stone-50">
              {t.title ?? 'Library'}
            </h1>
            <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
              {t.subtitle ?? "Browse calmly. Search precisely. Save what you'll need offline."}
            </p>
          </div>

          <div className="w-full md:max-w-md">
            <div className="rounded-2xl border border-stone-200/70 dark:border-stone-800/70 bg-white/70 dark:bg-stone-950/40 px-3 py-2 flex items-center gap-2">
              <Search className="h-4 w-4 text-stone-500 dark:text-stone-400" strokeWidth={1.75} />
              <input
                value={query}
                onChange={(e) => triggerSearch(e.target.value)}
                placeholder={t.searchPlaceholder ?? 'Search: title, summary, scripture, notes…'}
                className="w-full bg-transparent outline-none text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400"
              />
              <button
                type="button"
                onClick={() => triggerSearch(query)}
                className="rounded-xl bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-700 transition-colors"
              >
                {t.search ?? 'Search'}
              </button>
            </div>

            {recentQueries?.length ? (
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
                  Recent:
                </span>
                {recentQueries.slice(0, 4).map((q) => (
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

        {/* Filters */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <PillButton
            active={filters.hasAudio === true}
            onClick={() => applyFilters({ ...filters, hasAudio: filters.hasAudio === true ? null : true })}
          >
            <span className="inline-flex items-center gap-1.5">
              <Headphones className="h-4 w-4" strokeWidth={1.75} />
              Audio
            </span>
          </PillButton>
          <PillButton
            active={filters.hasVideo === true}
            onClick={() => applyFilters({ ...filters, hasVideo: filters.hasVideo === true ? null : true })}
          >
            <span className="inline-flex items-center gap-1.5">
              <Video className="h-4 w-4" strokeWidth={1.75} />
              Video
            </span>
          </PillButton>
          <PillButton
            active={filters.hasTranscript === true}
            onClick={() =>
              applyFilters({ ...filters, hasTranscript: filters.hasTranscript === true ? null : true })
            }
          >
            <span className="inline-flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" strokeWidth={1.75} />
              Notes
            </span>
          </PillButton>

          <div className="h-6 w-px bg-stone-200 dark:bg-stone-800 mx-1" />

          <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
            Series:
          </span>
          <div className="flex flex-wrap gap-2">
            {data.series.slice(0, 3).map((s) => (
              <PillButton
                key={s.id}
                active={filters.seriesId === s.id}
                onClick={() => applyFilters({ ...filters, seriesId: filters.seriesId === s.id ? null : s.id })}
              >
                {s.title}
              </PillButton>
            ))}
          </div>

          <span className="ml-auto text-[11px] font-semibold text-stone-500 dark:text-stone-400">
            {results.length} results
          </span>
          {hasFilters || query.trim() ? (
            <button
              type="button"
              onClick={() => {
                triggerSearch('')
                applyFilters({ seriesId: null, topicId: null, hasAudio: true, hasVideo: null, hasTranscript: null })
              }}
              className="text-[11px] font-semibold text-stone-600 dark:text-stone-300 hover:underline"
            >
              Reset
            </button>
          ) : null}
        </div>

        {/* Highlights */}
        {highlighted.length ? (
          <section className="mt-6">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold tracking-wide text-stone-700 dark:text-stone-300 uppercase">
                Continue listening
              </div>
              <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
                Queue + saved
              </span>
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              {highlighted.map((s) => (
                <div
                  key={s.id}
                  className="rounded-3xl border border-stone-200/70 dark:border-stone-800/70 bg-white/60 dark:bg-stone-950/40 p-4 hover:bg-white/80 dark:hover:bg-stone-950/60 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <button type="button" onClick={() => onOpenSermon?.(s.id)} className="min-w-0 text-left">
                      <div className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
                        {formatDuration(s.durationSeconds)}
                      </div>
                      <div className="mt-1 text-sm font-semibold text-stone-950 dark:text-stone-50 line-clamp-2">
                        {pickSermonText(s, locale).title}
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => onPlaySermonAudio?.(s.id)}
                      className="rounded-xl bg-violet-600 px-3 py-2 text-xs font-semibold text-white hover:bg-violet-700 transition-colors"
                    >
                      {t.play ?? 'Play'}
                    </button>
                  </div>
                  <div className="mt-3">
                    <AvailabilityBadges sermon={s} t={t} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {/* Series + Topics */}
        <section className="mt-8">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold tracking-wide text-stone-700 dark:text-stone-300 uppercase">
              Browse
            </div>
            <button
              type="button"
              onClick={() => onOpenSeries?.(data.series[0]?.id ?? '')}
              className="text-[11px] font-semibold text-violet-700 dark:text-violet-200 hover:underline inline-flex items-center gap-1"
            >
              View all series
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
            </button>
          </div>

          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {data.series.map((s) => (
              <SeriesCard
                key={s.id}
                series={s}
                topics={data.topics}
                isSaved={savedSeries.has(s.id)}
                locale={locale}
                t={t}
                onOpen={() => onOpenSeries?.(s.id)}
                onToggleSave={(next) => onToggleSaveSeries?.(s.id, next)}
              />
            ))}
          </div>

          <div className="mt-6 rounded-3xl border border-stone-200/70 dark:border-stone-800/70 bg-white/60 dark:bg-stone-950/40 p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-stone-950 dark:text-stone-50">Topics</div>
              <div className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
                Tap to filter results
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {data.topics.map((t) => (
                <PillButton
                  key={t.id}
                  active={filters.topicId === t.id}
                  onClick={() => {
                    applyFilters({ ...filters, topicId: filters.topicId === t.id ? null : t.id })
                    onOpenTopic?.(t.id)
                  }}
                >
                  <span className="inline-flex items-center gap-1.5">
                    <Tag className="h-4 w-4" strokeWidth={1.75} />
                    {pickLabel(t.label, t.translations?.[locale as 'en' | 'fr'], locale)}
                  </span>
                </PillButton>
              ))}
            </div>
          </div>
        </section>

        {/* Results list (search preview) */}
        <section className="mt-8 pb-10">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold tracking-wide text-stone-700 dark:text-stone-300 uppercase">
              Results
            </div>
            <div className="flex items-center gap-2">
              {activeSeries ? (
                <Badge>
                  <Sparkles className="h-3 w-3" strokeWidth={2} />
                  {pickSeriesText(activeSeries, locale).title}
                </Badge>
              ) : null}
              {activeTopic ? (
                <Badge>
                  <Tag className="h-3 w-3" strokeWidth={2} />
                  {pickLabel(activeTopic.label, activeTopic.translations?.[locale as 'en' | 'fr'], locale)}
                </Badge>
              ) : null}
            </div>
          </div>

          {results.length === 0 ? (
            <div className="mt-3 rounded-3xl border border-stone-200/70 dark:border-stone-800/70 bg-white/60 dark:bg-stone-950/40 p-6">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-2xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center">
                  <Search className="h-5 w-5 text-amber-800 dark:text-amber-200" strokeWidth={1.75} />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-stone-950 dark:text-stone-50">No results</div>
                  <div className="mt-1 text-sm text-stone-600 dark:text-stone-400">
                    Try a different keyword (e.g. <span className="font-semibold">Isengesho</span>) or clear filters.
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-3 grid gap-3">
              {results.slice(0, 5).map((s) => {
                const series = s.seriesId ? seriesById.get(s.seriesId) : null
                const seriesTitle = series ? pickSeriesText(series, locale).title : undefined
                const topicLabels = s.topicIds
                  .map((id) => {
                    const t = topicById.get(id)
                    if (!t) return null
                    return pickLabel(t.label, t.translations?.[locale as 'en' | 'fr'], locale)
                  })
                  .filter(Boolean) as string[]

                return (
                  <SermonRow
                    key={s.id}
                    sermon={s}
                    seriesTitle={seriesTitle}
                    topicLabels={topicLabels}
                    isSaved={savedSermons.has(s.id)}
                    isInQueue={queue.has(s.id)}
                    locale={locale}
                    t={t}
                    onOpen={() => onOpenSermon?.(s.id)}
                    onPlay={() => onPlaySermonAudio?.(s.id)}
                    onWatch={() => onWatchSermonVideo?.(s.id)}
                    onDownload={() => onDownloadSermon?.(s.id)}
                    onToggleSave={(next) => onToggleSaveSermon?.(s.id, next)}
                    onAddToQueue={() => onAddToQueue?.(s.id)}
                    onMarkCompleted={(completed) => onMarkSermonCompleted?.(s.id, completed)}
                  />
                )
              })}
              <div className="flex items-center justify-between gap-3">
                <div className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
                  Showing 5 of {results.length}
                </div>
                <button
                  type="button"
                  onClick={() => onOpenSermon?.(results[0]?.id ?? '')}
                  className="text-[11px] font-semibold text-violet-700 dark:text-violet-200 hover:underline inline-flex items-center gap-1"
                >
                  Open a result
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

