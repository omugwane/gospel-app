'use client'

import { useMemo } from 'react'
import {
  ChevronLeft,
  Download as DownloadIcon,
  FileAudio2,
  FolderOpen,
  Headphones,
  ListMusic,
  Play,
  Trash2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Download, LanguageCode, LibraryProps, Sermon } from '@/product/sections/library/types'

function formatDate(iso: string) {
  try {
    const d = new Date(iso)
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' })
  } catch {
    return iso
  }
}

function formatBytes(bytes: number) {
  if (!bytes || bytes <= 0) return '—'
  const mb = bytes / (1024 * 1024)
  if (mb < 1024) return `${mb.toFixed(mb < 10 ? 1 : 0)} MB`
  const gb = mb / 1024
  return `${gb.toFixed(1)} GB`
}

function pickSermonTitle(sermon: Sermon, lang: LanguageCode) {
  if (lang === 'rw') return sermon.title
  const t = sermon.translations?.[lang]
  return t?.title?.trim() || sermon.title
}

function pickSermonSummary(sermon: Sermon, lang: LanguageCode) {
  if (lang === 'rw') return sermon.summary
  const t = sermon.translations?.[lang]
  return t?.summary?.trim() || sermon.summary
}

function Card({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'rounded-3xl border border-neutral-200/70 dark:border-neutral-800/70 bg-white/60 dark:bg-neutral-950/40',
        className
      )}
    >
      {children}
    </div>
  )
}

function mapDownloadsToSermons(downloads: Download[], sermons: Sermon[]) {
  const sermonByMedia = new Map<string, Sermon>()
  for (const s of sermons) {
    for (const m of s.mediaAssets) sermonByMedia.set(m.id, s)
  }

  return downloads
    .map((d) => ({
      download: d,
      sermon: sermonByMedia.get(d.mediaAssetId) ?? null,
    }))
    .sort((a, b) => (a.download.createdAt < b.download.createdAt ? 1 : -1))
}

export function Downloads({
  data,
  locale,
  onBack,
  onOpenSeries,
  onOpenSermon,
  onPlaySermonAudio,
  onRemoveDownload,
}: LibraryProps) {

  const rows = useMemo(() => mapDownloadsToSermons(data.downloads ?? [], data.sermons ?? []), [data.downloads, data.sermons])
  const totalBytes = useMemo(() => (data.downloads ?? []).reduce((sum, d) => sum + (d.byteSize || 0), 0), [data.downloads])

  return (
    <div className="w-full">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">
              <button
                type="button"
                onClick={() => {
                  if (onBack) {
                    onBack()
                    return
                  }
                  onOpenSeries?.(data.series?.[0]?.id ?? '')
                }}
                className="inline-flex items-center gap-1 rounded-full border border-neutral-200/70 dark:border-neutral-800/70 bg-white/60 dark:bg-neutral-950/40 px-3 py-1 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
              >
                <ChevronLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
                Back
              </button>
              <span className="opacity-60">•</span>
              <span className="inline-flex items-center gap-1">
                <DownloadIcon className="h-3.5 w-3.5" strokeWidth={1.75} />
                Downloads
              </span>
              <span className="opacity-60">•</span>
              <span className="inline-flex items-center gap-1">
                <FolderOpen className="h-3.5 w-3.5" strokeWidth={1.75} />
                {rows.length} items · {formatBytes(totalBytes)}
              </span>
            </div>

            <h1 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">
              Offline downloads
            </h1>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
              Saved for listening without data. Remove items to free space.
            </p>
          </div>

        </div>

        {/* Empty state */}
        {rows.length === 0 ? (
          <Card className="mt-6 p-6">
            <div className="flex items-start gap-3">
              <div className="h-11 w-11 rounded-2xl bg-secondary-50 dark:bg-secondary-500/10 flex items-center justify-center">
                <FileAudio2 className="h-5 w-5 text-secondary-800 dark:text-secondary-200" strokeWidth={1.75} />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-neutral-950 dark:text-neutral-50">No downloads yet</div>
                <div className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                  Save a sermon from the Library to listen offline.
                </div>
              </div>
            </div>
          </Card>
        ) : (
          <div className="mt-6 grid gap-3 pb-10">
            {rows.map(({ download, sermon }) => {
              const title = sermon ? pickSermonTitle(sermon, locale) : 'Unknown sermon'
              const summary = sermon ? pickSermonSummary(sermon, locale) : 'This download could not be matched to a sermon.'
              const canPlay = Boolean(sermon?.actions.canPlayAudio)
              const isInQueue = sermon ? data.listeningQueue.queueSermonIds.includes(sermon.id) : false

              return (
                <Card key={download.id} className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => (sermon ? onOpenSermon?.(sermon.id) : undefined)}
                      className="min-w-0 text-left"
                    >
                      <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">
                        <span className="inline-flex items-center gap-1 rounded-full bg-secondary-50 dark:bg-secondary-500/10 text-secondary-900 dark:text-secondary-100 px-2 py-0.5">
                          <DownloadIcon className="h-3 w-3" strokeWidth={2} />
                          Downloaded
                        </span>
                        {isInQueue ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-200 px-2 py-0.5">
                            <ListMusic className="h-3 w-3" strokeWidth={2} />
                            In queue
                          </span>
                        ) : null}
                        <span className="opacity-60">•</span>
                        <span>{formatDate(download.createdAt)}</span>
                        <span className="opacity-60">•</span>
                        <span className="tabular-nums">{formatBytes(download.byteSize)}</span>
                      </div>

                      <div className="mt-2 text-sm sm:text-base font-semibold text-neutral-950 dark:text-neutral-50 line-clamp-2">
                        {title}
                      </div>
                      <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed line-clamp-2">
                        {summary}
                      </p>
                    </button>

                    <div className="shrink-0 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onPlaySermonAudio?.(sermon?.id ?? '')}
                        disabled={!canPlay || !sermon}
                        className={cn(
                          'h-11 w-11 rounded-2xl flex items-center justify-center transition-colors',
                          canPlay && sermon
                            ? 'bg-primary-600 text-white hover:bg-primary-700'
                            : 'bg-neutral-200 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400'
                        )}
                        aria-label={canPlay ? 'Play' : 'Cannot play'}
                      >
                        <Play className="h-5 w-5 translate-x-[1px]" strokeWidth={1.75} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => (sermon ? onOpenSermon?.(sermon.id) : undefined)}
                      disabled={!sermon}
                      className={cn(
                        'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-colors border border-neutral-200 dark:border-neutral-800',
                        sermon
                          ? 'bg-white/60 dark:bg-neutral-950/40 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-900'
                          : 'bg-white/30 dark:bg-neutral-950/20 text-neutral-400 dark:text-neutral-500 border-neutral-200/40 dark:border-neutral-800/40'
                      )}
                    >
                      <FolderOpen className="h-4 w-4" strokeWidth={1.75} />
                      Open
                    </button>

                    <button
                      type="button"
                      onClick={() => onPlaySermonAudio?.(sermon?.id ?? '')}
                      disabled={!canPlay || !sermon}
                      className={cn(
                        'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-colors',
                        canPlay && sermon
                          ? 'bg-primary-600/10 text-primary-900 dark:bg-primary-400/10 dark:text-primary-100 hover:bg-primary-600/15 dark:hover:bg-primary-400/15'
                          : 'bg-neutral-100 text-neutral-400 dark:bg-neutral-900 dark:text-neutral-500'
                      )}
                    >
                      <Headphones className="h-4 w-4" strokeWidth={1.75} />
                      Play
                    </button>

                    <button
                      type="button"
                      onClick={() => onRemoveDownload?.(download.id)}
                      className="ml-auto inline-flex items-center gap-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-950/40 px-4 py-2 text-xs font-semibold text-neutral-900 dark:text-neutral-100 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:border-rose-200/80 dark:hover:border-rose-500/30 transition-colors"
                    >
                      <Trash2 className="h-4 w-4 text-neutral-600 dark:text-neutral-300 group-hover:text-rose-700" strokeWidth={1.75} />
                      Remove
                    </button>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

