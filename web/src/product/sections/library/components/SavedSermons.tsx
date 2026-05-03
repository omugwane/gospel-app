'use client'

import { useMemo } from 'react'
import {
  Bookmark,
  BookmarkCheck,
  ChevronLeft,
  Download,
  Headphones,
  ListMusic,
  Play,
  Tag,
  Text,
  Video,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { LanguageCode, LibraryProps, Sermon, Series, Topic } from '@/product/sections/library/types'

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

function pickLabel(topic: Topic, locale: LanguageCode) {
  if (locale === 'rw') return topic.label
  return topic.translations?.[locale]?.label?.trim() || topic.label
}

function pickSeriesTitle(series: Series, locale: LanguageCode) {
  if (locale === 'rw') return series.title
  return series.translations?.[locale]?.title?.trim() || series.title
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

export function SavedSermons({
  data,
  locale,
  onBack,
  onOpenSermon,
  onPlaySermonAudio,
  onWatchSermonVideo,
  onDownloadSermon,
  onToggleSaveSermon,
  onAddToQueue,
}: LibraryProps) {
  const savedIds = useMemo(() => new Set(data.saved.savedSermonIds), [data.saved.savedSermonIds])
  const queue = useMemo(() => new Set(data.listeningQueue.queueSermonIds), [data.listeningQueue.queueSermonIds])
  const seriesById = useMemo(() => new Map(data.series.map((s) => [s.id, s])), [data.series])
  const topicById = useMemo(() => new Map(data.topics.map((t) => [t.id, t])), [data.topics])
  const savedSermons = useMemo(
    () =>
      data.saved.savedSermonIds
        .map((id) => data.sermons.find((sermon) => sermon.id === id))
        .filter(Boolean) as Sermon[],
    [data.saved.savedSermonIds, data.sermons]
  )

  return (
    <div className="w-full">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">
              <button
                type="button"
                onClick={() => onBack?.()}
                className="inline-flex items-center gap-1 rounded-full border border-neutral-200/70 bg-white/60 px-3 py-1 transition-colors hover:bg-neutral-50 dark:border-neutral-800/70 dark:bg-neutral-950/40 dark:hover:bg-neutral-900"
              >
                <ChevronLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
                Back
              </button>
              <span className="opacity-60">•</span>
              <span className="inline-flex items-center gap-1">
                <BookmarkCheck className="h-3.5 w-3.5" strokeWidth={1.75} />
                Saved sermons
              </span>
              <span className="opacity-60">•</span>
              <span>{savedSermons.length} saved</span>
            </div>

            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50 sm:text-3xl">
              Saved sermons
            </h1>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
              A focused place for sermons you want to return to, download, or add to your queue.
            </p>
          </div>
        </div>

        {savedSermons.length === 0 ? (
          <div className="mt-6 rounded-3xl border border-neutral-200/70 bg-white/60 p-6 dark:border-neutral-800/70 dark:bg-neutral-950/40">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-600/10 dark:bg-primary-400/10">
                <Bookmark className="h-5 w-5 text-primary-800 dark:text-primary-100" strokeWidth={1.75} />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-neutral-950 dark:text-neutral-50">No saved sermons yet</div>
                <div className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                  Tap the bookmark on a sermon to keep it here for later.
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-6 grid gap-3 pb-10">
            {savedSermons.map((sermon) => {
              const text = pickSermonText(sermon, locale)
              const series = sermon.seriesId ? seriesById.get(sermon.seriesId) : null
              const topicLabels = sermon.topicIds
                .map((id) => {
                  const topic = topicById.get(id)
                  return topic ? pickLabel(topic, locale) : null
                })
                .filter(Boolean) as string[]
              const isInQueue = queue.has(sermon.id)
              const downloaded = sermon.offline.downloadState === 'downloaded'

              return (
                <article
                  key={sermon.id}
                  className="rounded-3xl border border-neutral-200/70 bg-white/60 p-5 transition-colors hover:bg-white/80 dark:border-neutral-800/70 dark:bg-neutral-950/40 dark:hover:bg-neutral-950/60"
                >
                  <div className="flex items-start gap-4">
                    <button type="button" onClick={() => onOpenSermon?.(sermon.id)} className="shrink-0">
                      <SermonThumbnail src={sermon.thumbnailUrl} title={text.title} className="h-24 w-24 sm:h-28 sm:w-28" />
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <button type="button" onClick={() => onOpenSermon?.(sermon.id)} className="min-w-0 text-left">
                          <div className="flex flex-wrap items-center gap-2">
                            <Chip tone="primary">
                              <BookmarkCheck className="h-3 w-3" strokeWidth={2} />
                              Saved
                            </Chip>
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

                          <h2 className="mt-2 line-clamp-2 text-sm font-semibold text-neutral-950 dark:text-neutral-50 sm:text-base">
                            {text.title}
                          </h2>
                          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">
                            <span>{formatDate(sermon.publishedAt)}</span>
                            <span className="opacity-50">•</span>
                            <span>{formatDuration(sermon.durationSeconds)}</span>
                            {series ? (
                              <>
                                <span className="opacity-50">•</span>
                                <span className="text-neutral-700 dark:text-neutral-300">{pickSeriesTitle(series, locale)}</span>
                              </>
                            ) : null}
                          </div>
                          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                            {text.summary}
                          </p>
                        </button>

                        <button
                          type="button"
                          onClick={() => onToggleSaveSermon?.(sermon.id, !savedIds.has(sermon.id))}
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-primary-200 bg-primary-600/10 transition-colors hover:bg-primary-600/15 dark:border-primary-500/40 dark:bg-primary-400/10 dark:hover:bg-primary-400/15"
                          aria-label="Unsave sermon"
                        >
                          <BookmarkCheck className="h-4 w-4 text-primary-700 dark:text-primary-200" strokeWidth={1.75} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {topicLabels.length ? (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {topicLabels.slice(0, 4).map((label) => (
                        <span
                          key={label}
                          className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-semibold text-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
                        >
                          <Tag className="h-3 w-3 text-neutral-500 dark:text-neutral-400" strokeWidth={2} />
                          {label}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onPlaySermonAudio?.(sermon.id)}
                      disabled={!sermon.actions.canPlayAudio}
                      className={cn(
                        'inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-colors',
                        sermon.actions.canPlayAudio
                          ? 'bg-primary-600/10 text-primary-900 hover:bg-primary-600/15 dark:bg-primary-400/10 dark:text-primary-100 dark:hover:bg-primary-400/15'
                          : 'bg-neutral-100 text-neutral-400 dark:bg-neutral-900 dark:text-neutral-500'
                      )}
                    >
                      <Play className="h-4 w-4" strokeWidth={1.75} />
                      Play
                    </button>
                    <button
                      type="button"
                      onClick={() => onWatchSermonVideo?.(sermon.id)}
                      disabled={!sermon.actions.canWatchVideo}
                      className={cn(
                        'inline-flex items-center gap-2 rounded-xl border border-neutral-200 px-3 py-2 text-xs font-semibold transition-colors dark:border-neutral-800',
                        sermon.actions.canWatchVideo
                          ? 'bg-white/60 text-neutral-900 hover:bg-neutral-50 dark:bg-neutral-950/40 dark:text-neutral-100 dark:hover:bg-neutral-900'
                          : 'border-neutral-200/40 bg-white/30 text-neutral-400 dark:border-neutral-800/40 dark:bg-neutral-950/20 dark:text-neutral-500'
                      )}
                    >
                      <Video className="h-4 w-4" strokeWidth={1.75} />
                      Video
                    </button>
                    <button
                      type="button"
                      onClick={() => onDownloadSermon?.(sermon.id)}
                      disabled={!sermon.actions.canDownload}
                      className={cn(
                        'inline-flex items-center gap-2 rounded-xl border border-neutral-200 px-3 py-2 text-xs font-semibold transition-colors dark:border-neutral-800',
                        sermon.actions.canDownload
                          ? 'bg-secondary-50 text-secondary-900 hover:bg-secondary-100/70 dark:bg-secondary-500/10 dark:text-secondary-100 dark:hover:bg-secondary-500/15'
                          : 'border-neutral-200/40 bg-white/30 text-neutral-400 dark:border-neutral-800/40 dark:bg-neutral-950/20 dark:text-neutral-500'
                      )}
                    >
                      <Download className="h-4 w-4" strokeWidth={1.75} />
                      Download
                    </button>
                    <button
                      type="button"
                      onClick={() => onAddToQueue?.(sermon.id)}
                      disabled={!sermon.actions.canAddToQueue}
                      className={cn(
                        'inline-flex items-center gap-2 rounded-xl border border-neutral-200 px-3 py-2 text-xs font-semibold transition-colors dark:border-neutral-800',
                        sermon.actions.canAddToQueue
                          ? 'bg-white/60 text-neutral-900 hover:bg-neutral-50 dark:bg-neutral-950/40 dark:text-neutral-100 dark:hover:bg-neutral-900'
                          : 'border-neutral-200/40 bg-white/30 text-neutral-400 dark:border-neutral-800/40 dark:bg-neutral-950/20 dark:text-neutral-500'
                      )}
                    >
                      <ListMusic className="h-4 w-4" strokeWidth={1.75} />
                      Queue
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
