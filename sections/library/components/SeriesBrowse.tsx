import { useMemo } from 'react'
import { ArrowRight, Bookmark, BookmarkCheck, ListMusic, Sparkles, Tag } from 'lucide-react'
import { cn } from '@/lib/utils'
import type {
  LibraryProps,
  LibraryTranslations,
  Series,
  Topic,
} from '@/../product/sections/library/types'
import { DEFAULT_LIBRARY_TRANSLATIONS } from '@/../product/sections/library/types'

function pickSeriesText(series: Series, locale: string) {
  if (locale === 'rw') return { title: series.title, description: series.description }
  const tr = series.translations?.[locale as 'en' | 'fr']
  return {
    title: tr?.title?.trim() || series.title,
    description: tr?.description?.trim() || series.description,
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

function SeriesCard({
  series,
  topics,
  isSaved,
  locale,
  t,
  variant = 'default',
  onOpen,
  onToggleSave,
}: {
  series: Series
  topics: Topic[]
  isSaved: boolean
  locale: string
  t: LibraryTranslations
  variant?: 'default' | 'compact'
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

  if (variant === 'compact') {
    return (
      <button
        type="button"
        onClick={onOpen}
        className={cn(
          'group relative flex items-center gap-4 rounded-2xl border p-4 text-left transition-colors',
          'border-stone-200/70 dark:border-stone-800/70',
          'bg-white/70 dark:bg-stone-950/50',
          'hover:bg-white/90 dark:hover:bg-stone-950/70',
          'hover:border-violet-200/80 dark:hover:border-violet-500/30'
        )}
      >
        <div className="h-10 w-10 shrink-0 rounded-xl bg-violet-600/10 dark:bg-violet-400/10 flex items-center justify-center">
          <ListMusic className="h-5 w-5 text-violet-700 dark:text-violet-200" strokeWidth={1.75} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-stone-950 dark:text-stone-50 truncate">
            {seriesText.title}
          </h3>
          <p className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 mt-0.5">
            {series.sermonCount} sermons
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onToggleSave?.(!isSaved)
            }}
            className={cn(
              'h-9 w-9 rounded-xl flex items-center justify-center transition-colors',
              isSaved
                ? 'bg-violet-600/15 dark:bg-violet-400/15 text-violet-700 dark:text-violet-200'
                : 'bg-stone-100 dark:bg-stone-900 text-stone-500 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-800'
            )}
            aria-label={isSaved ? (t.unsaveSeries ?? 'Unsave series') : (t.saveSeries ?? 'Save series')}
          >
            {isSaved ? (
              <BookmarkCheck className="h-4 w-4" strokeWidth={1.75} />
            ) : (
              <Bookmark className="h-4 w-4" strokeWidth={1.75} />
            )}
          </button>
          <ArrowRight className="h-4 w-4 text-stone-400 dark:text-stone-500 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors" strokeWidth={1.75} />
        </div>
      </button>
    )
  }

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-stone-200/70 dark:border-stone-800/70 bg-white/60 dark:bg-stone-950/40 hover:bg-white/80 dark:hover:bg-stone-950/60 transition-colors">
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(circle_at_20%_10%,rgba(139,92,246,0.08),transparent_45%),radial-gradient(circle_at_90%_80%,rgba(245,158,11,0.06),transparent_50%)]" />
      <div className="relative p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-violet-600/10 dark:bg-violet-400/10 px-2.5 py-1 text-[11px] font-semibold text-violet-900 dark:text-violet-100">
                <Sparkles className="h-3 w-3" strokeWidth={2} />
                {t.series ?? 'Series'}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 dark:bg-stone-900 px-2.5 py-1 text-[11px] font-semibold text-stone-700 dark:text-stone-200">
                <ListMusic className="h-3 w-3" strokeWidth={2} />
                {series.sermonCount} sermons
              </span>
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
              'h-10 w-10 shrink-0 rounded-2xl border flex items-center justify-center transition-colors',
              'border-stone-200/70 dark:border-stone-800/70',
              'bg-white/60 dark:bg-stone-950/40',
              'hover:bg-stone-50 dark:hover:bg-stone-900',
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
          {topicLabels.slice(0, 3).map((label) => (
            <span
              key={label}
                className="inline-flex items-center gap-1 rounded-full bg-stone-100 dark:bg-stone-900 px-2 py-0.5 text-[11px] font-semibold text-stone-700 dark:text-stone-200"
              >
                <Tag className="h-3 w-3 text-stone-500 dark:text-stone-400" strokeWidth={2} />
                {label}
              </span>
            ))}
            {topicLabels.length > 3 ? (
              <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 px-1 py-0.5">
                +{topicLabels.length - 3}
              </span>
            ) : null}
          </div>
        ) : null}

        <div className="mt-5">
          <button
            type="button"
            onClick={onOpen}
            className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-xs font-semibold text-white hover:bg-violet-700 transition-colors"
          >
            Browse sermons
            <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </div>
  )
}

export function SeriesBrowse({
  data,
  locale,
  translations: translationsProp,
  onOpenSeries,
  onToggleSaveSeries,
}: LibraryProps) {
  const t = useMemo(
    () => ({ ...DEFAULT_LIBRARY_TRANSLATIONS, ...translationsProp }),
    [translationsProp]
  )

  const savedSeriesIds = useMemo(() => new Set(data.saved.savedSeriesIds), [data.saved.savedSeriesIds])
  const savedSeries = useMemo(
    () => data.series.filter((s) => savedSeriesIds.has(s.id)),
    [data.series, savedSeriesIds]
  )
  const otherSeries = useMemo(
    () => data.series.filter((s) => !savedSeriesIds.has(s.id)),
    [data.series, savedSeriesIds]
  )

  return (
    <div className="w-full">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-stone-950 dark:text-stone-50">
              {t.series ?? 'Series'}
            </h1>
            <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
              {t.browseBySeries ?? 'Browse teachings by series. Save your favorites for quick access.'}
            </p>
          </div>
        </div>

        {/* Saved series */}
        {savedSeries.length > 0 ? (
          <section className="mt-6">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold tracking-wide text-stone-700 dark:text-stone-300 uppercase">
                Your saved series
              </div>
              <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-200">
                {savedSeries.length} saved
              </span>
            </div>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              {savedSeries.map((series) => (
                <SeriesCard
                  key={series.id}
                  series={series}
                  topics={data.topics}
                  isSaved={true}
                  locale={locale}
                t={t}
                  variant="compact"
                  onOpen={() => onOpenSeries?.(series.id)}
                  onToggleSave={(next) => onToggleSaveSeries?.(series.id, next)}
                />
              ))}
            </div>
          </section>
        ) : null}

        {/* All series grid — saved first, then rest */}
        <section className={savedSeries.length > 0 ? 'mt-8' : 'mt-6'}>
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold tracking-wide text-stone-700 dark:text-stone-300 uppercase">
              {savedSeries.length > 0 ? 'All series' : 'Series'}
            </div>
            <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
              {data.series.length} series
            </span>
          </div>
          <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
            {[...savedSeries, ...otherSeries].map((series) => (
              <SeriesCard
                key={series.id}
                series={series}
                topics={data.topics}
                isSaved={savedSeriesIds.has(series.id)}
                locale={locale}
                t={t}
                onOpen={() => onOpenSeries?.(series.id)}
                onToggleSave={(next) => onToggleSaveSeries?.(series.id, next)}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
