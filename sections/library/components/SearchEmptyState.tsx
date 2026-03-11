import { useState } from 'react'
import {
  BookOpen,
  ChevronLeft,
  Filter,
  Headphones,
  Search,
  Sparkles,
  Tag,
  Video,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type {
  LanguageCode,
  LibraryProps,
  SearchFilters,
  Series,
} from '@/../product/sections/library/types'

function pickLabel(
  base: string,
  translations: { label: string } | undefined,
  locale: LanguageCode
) {
  if (locale === 'rw') return base
  return translations?.label?.trim() || base
}

function pickSeriesText(series: Series, locale: LanguageCode) {
  if (locale === 'rw') return { title: series.title }
  const t = series.translations?.[locale]
  return { title: t?.title?.trim() || series.title }
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

export function SearchEmptyState({
  data,
  locale,
  onOpenSeries,
  onOpenTopic,
  onSearch,
  onUpdateSearchFilters,
}: LibraryProps) {
  const [query, setQuery] = useState(data.searchState.query)
  const [filters, setFilters] = useState<SearchFilters>(data.searchState.filters)

  const activeSeries = filters.seriesId
    ? data.series.find((s) => s.id === filters.seriesId)
    : null
  const activeTopic = filters.topicId
    ? data.topics.find((t) => t.id === filters.topicId)
    : null

  const hasAnyFilter =
    Boolean(filters.seriesId) ||
    Boolean(filters.topicId) ||
    filters.hasAudio !== null ||
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

  const resetAll = () => {
    setQuery('')
    triggerSearch('')
    applyFilters({
      seriesId: null,
      topicId: null,
      hasAudio: true,
      hasVideo: null,
      hasTranscript: null,
    })
  }

  const recentQueries = data.searchState.recentQueries ?? []

  return (
    <div className="w-full min-h-[80vh] flex flex-col">
      <div className="mx-auto max-w-5xl w-full flex-1 flex flex-col">
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
                Search
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
              <Search className="h-4 w-4 text-stone-500 dark:text-stone-400 shrink-0" strokeWidth={1.75} />
              <input
                value={query}
                onChange={(e) => triggerSearch(e.target.value)}
                placeholder="Search sermons…"
                className="w-full bg-transparent outline-none text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400"
              />
              <button
                type="button"
                onClick={() => triggerSearch(query)}
                className="rounded-xl bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-700 transition-colors shrink-0"
              >
                Search
              </button>
            </div>

          </div>
        </div>

        {/* Empty state hero */}
        <section className="mt-8 sm:mt-12 flex-1 flex flex-col justify-center">
          <div className="relative overflow-hidden rounded-3xl border border-stone-200/70 dark:border-stone-800/70 bg-white/70 dark:bg-stone-950/50 shadow-sm">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_50%_0%,rgba(139,92,246,0.06),transparent_60%),radial-gradient(ellipse_at_80%_80%,rgba(245,158,11,0.05),transparent_50%)]" />
            <div className="relative px-6 py-12 sm:px-10 sm:py-16 text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-stone-100 dark:bg-stone-900 mb-6">
                <Search className="h-8 w-8 sm:h-10 sm:w-10 text-stone-500 dark:text-stone-400" strokeWidth={1.5} />
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-stone-950 dark:text-stone-50">
                No matches found
              </h2>
              <p className="mt-3 max-w-md mx-auto text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                {query.trim()
                  ? `Nothing matched "${query.trim()}". Try a different keyword, change language, or broaden your filters.`
                  : 'Enter a keyword to search titles, summaries, scripture references, and notes.'}
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={resetAll}
                  className="inline-flex items-center gap-2 rounded-xl border border-stone-200/70 dark:border-stone-800/70 bg-white/60 dark:bg-stone-950/40 px-4 py-2.5 text-sm font-semibold text-stone-900 dark:text-stone-100 hover:bg-stone-50 dark:hover:bg-stone-900 transition-colors"
                >
                  <Filter className="h-4 w-4" strokeWidth={1.75} />
                  Clear filters
                </button>
                {recentQueries.length > 0 ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
                      Try:
                    </span>
                    {recentQueries.slice(0, 3).map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => triggerSearch(q)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-violet-600/10 dark:bg-violet-400/10 px-3 py-2 text-xs font-semibold text-violet-900 dark:text-violet-100 hover:bg-violet-600/15 dark:hover:bg-violet-400/15 transition-colors"
                      >
                        <Sparkles className="h-3.5 w-3.5" strokeWidth={1.75} />
                        {q}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {/* Browse alternatives */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => onOpenSeries?.(data.series[0]?.id ?? '')}
              className="rounded-2xl border border-stone-200/70 dark:border-stone-800/70 bg-white/60 dark:bg-stone-950/40 p-5 text-left hover:bg-white/80 dark:hover:bg-stone-950/60 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-violet-600/10 dark:bg-violet-400/10 flex items-center justify-center group-hover:bg-violet-600/15 dark:group-hover:bg-violet-400/15 transition-colors">
                  <Sparkles className="h-5 w-5 text-violet-700 dark:text-violet-200" strokeWidth={1.75} />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-stone-950 dark:text-stone-50">
                    Browse by series
                  </div>
                  <div className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
                    {data.series.length} series available
                  </div>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onOpenTopic?.(data.topics[0]?.id ?? '')}
              className="rounded-2xl border border-stone-200/70 dark:border-stone-800/70 bg-white/60 dark:bg-stone-950/40 p-5 text-left hover:bg-white/80 dark:hover:bg-stone-950/60 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-100/70 dark:group-hover:bg-amber-500/15 transition-colors">
                  <Tag className="h-5 w-5 text-amber-800 dark:text-amber-200" strokeWidth={1.75} />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-stone-950 dark:text-stone-50">
                    Browse by topic
                  </div>
                  <div className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
                    Prayer, Faith, Family, and more
                  </div>
                </div>
              </div>
            </button>
          </div>

          {/* Active filters summary (if any) */}
          {hasAnyFilter && (
            <div className="mt-6 rounded-2xl border border-amber-200/70 dark:border-amber-500/30 bg-amber-50/80 dark:bg-amber-500/10 p-4">
              <div className="flex items-start gap-3">
                <Filter className="h-5 w-5 text-amber-700 dark:text-amber-200 shrink-0 mt-0.5" strokeWidth={1.75} />
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                    Filters may be limiting results
                  </div>
                  <div className="mt-1 text-sm text-amber-800/90 dark:text-amber-200">
                    {activeSeries && (
                      <span>Series: {pickSeriesText(activeSeries, locale).title}</span>
                    )}
                    {activeTopic && (
                      <span>
                        {activeSeries ? ' • ' : ''}
                        Topic: {pickLabel(activeTopic.label, activeTopic.translations?.[locale], locale)}
                      </span>
                    )}
                    {filters.hasAudio === true && (
                      <span>
                        {(activeSeries || activeTopic) ? ' • ' : ''}
                        Audio only
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={resetAll}
                    className="mt-3 text-xs font-semibold text-amber-800 dark:text-amber-200 hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Compact filter strip */}
        <div className="mt-8 pt-6 border-t border-stone-200/70 dark:border-stone-800/70">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
              Filters:
            </span>
            <Pill
              active={filters.hasAudio === true}
              onClick={() => applyFilters({ ...filters, hasAudio: filters.hasAudio === true ? null : true })}
            >
              <span className="inline-flex items-center gap-1.5">
                <Headphones className="h-3.5 w-3.5" strokeWidth={1.75} />
                Audio
              </span>
            </Pill>
            <Pill
              active={filters.hasVideo === true}
              onClick={() => applyFilters({ ...filters, hasVideo: filters.hasVideo === true ? null : true })}
            >
              <span className="inline-flex items-center gap-1.5">
                <Video className="h-3.5 w-3.5" strokeWidth={1.75} />
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
                <BookOpen className="h-3.5 w-3.5" strokeWidth={1.75} />
                Notes
              </span>
            </Pill>
            <div className="h-5 w-px bg-stone-200 dark:bg-stone-800 mx-1" />
            <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
              Series:
            </span>
            {data.series.slice(0, 3).map((s) => {
              const active = filters.seriesId === s.id
              return (
                <Pill
                  key={s.id}
                  active={active}
                  onClick={() => {
                    applyFilters({ ...filters, seriesId: active ? null : s.id })
                    onOpenSeries?.(s.id)
                  }}
                >
                  {pickSeriesText(s, locale).title}
                </Pill>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
