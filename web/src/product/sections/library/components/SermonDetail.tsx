'use client'

import MuxPlayer from '@mux/mux-player-react'
import { startTransition, useEffect, useMemo, useRef, useState } from 'react'
import {
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  ChevronLeft,
  Download,
  Headphones,
  Info,
  ListMusic,
  Pause,
  Play,
  Share2,
  Tag,
  Text,
  Video,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type {
  LanguageCode,
  LibraryActionResult,
  LibraryProps,
  Sermon,
  Series,
  SermonVideo,
} from '@/product/sections/library/types'

function normalizeLibraryAction(
  value: void | LibraryActionResult | Promise<void | LibraryActionResult>
): Promise<LibraryActionResult> {
  return Promise.resolve(value).then((v) => v ?? { ok: true })
}

export interface SermonDetailProps extends LibraryProps {
  sermonId?: string
  /** When true (e.g. `?play=1`), try to start audio once the element can play. */
  autoplayAudioOnMount?: boolean
  /** Called after autoplay was attempted (success or failure) so the URL can drop `?play=1`. */
  onAutoplayIntentConsumed?: () => void
}

function formatDuration(totalSeconds: number) {
  if (!totalSeconds || totalSeconds <= 0) return '—'
  const m = Math.floor(totalSeconds / 60)
  const h = Math.floor(m / 60)
  const mm = m % 60
  if (h > 0) return `${h}h ${mm}m`
  return `${m} min`
}

/** mm:ss for the inline player scrubber. */
function formatPlaybackTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const s = Math.floor(seconds % 60)
  const m = Math.floor(seconds / 60)
  return `${m}:${s.toString().padStart(2, '0')}`
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
        'relative overflow-hidden rounded-3xl bg-gradient-to-br from-secondary-50 via-neutral-100 to-primary-50 dark:from-secondary-950/40 dark:via-neutral-900 dark:to-primary-950/40',
        className
      )}
    >
      {src ? (
        <img src={src} alt="" className="h-full w-full object-cover" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <Headphones className="h-12 w-12 text-neutral-300 dark:text-neutral-600" strokeWidth={1.4} />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
      <div className="absolute bottom-3 right-3 rounded-full bg-white/85 px-2.5 py-1 text-[10px] font-semibold text-neutral-700 shadow-sm dark:bg-neutral-950/80 dark:text-neutral-200">
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
  pending,
}: {
  icon?: React.ReactNode
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  pending?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || pending}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-xs font-semibold text-white hover:bg-primary-700 transition-colors',
        (disabled || pending) &&
          'bg-neutral-300 text-neutral-600 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-400',
        pending && 'opacity-80'
      )}
    >
      {icon}
      {children}
    </button>
  )
}

function SermonVideoPlayer({ video, title }: { video: SermonVideo; title: string }) {
  if (video.provider === 'mux') {
    return (
      <MuxPlayer
        streamType="on-demand"
        playbackId={video.playbackId}
        metadata={{ video_title: title }}
        className="h-full w-full"
        autoPlay
        playsInline
      />
    )
  }
  const src = `${video.embedUrl}?autoplay=1&rel=0`
  return (
    <iframe
      src={src}
      title={`${title} video player`}
      className="h-full w-full border-0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
    />
  )
}

function SecondaryButton({
  icon,
  children,
  onClick,
  disabled,
  tone = 'neutral',
  pending,
}: {
  icon?: React.ReactNode
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  tone?: 'neutral' | 'amber'
  pending?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || pending}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-colors border',
        tone === 'amber'
          ? 'border-secondary-200/80 dark:border-secondary-500/30 bg-secondary-50/80 dark:bg-secondary-500/10 text-secondary-900 dark:text-secondary-100 hover:bg-secondary-100/70 dark:hover:bg-secondary-500/15'
          : 'border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-950/40 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-900',
        (disabled || pending) && 'opacity-50',
        pending && 'cursor-wait'
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
  autoplayAudioOnMount = false,
  onAutoplayIntentConsumed,
  onBack,
  onOpenSeries,
  onOpenSermon,
  onDownloadSermon,
  onShareSermon,
  onToggleSaveSermon,
  onAddToQueue,
  onMarkSermonCompleted,
}: SermonDetailProps) {
  const [showTranscript, setShowTranscript] = useState(true)
  const [isVideoActive, setIsVideoActive] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const autoplayAttemptedRef = useRef(false)
  const [audioPlaying, setAudioPlaying] = useState(false)
  const [currentTimeSec, setCurrentTimeSec] = useState(0)
  const [durationSec, setDurationSec] = useState(0)
  const [audioError, setAudioError] = useState<string | null>(null)
  const [saveOverride, setSaveOverride] = useState<boolean | null>(null)
  const [completeOverride, setCompleteOverride] = useState<boolean | null>(null)
  const [queuePendingAdd, setQueuePendingAdd] = useState(false)
  const [playerFeedback, setPlayerFeedback] = useState<{ tone: 'info' | 'error'; text: string } | null>(
    null
  )
  const [libraryActionBusy, setLibraryActionBusy] = useState<
    null | 'save' | 'queue' | 'complete' | 'download' | 'share'
  >(null)

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
  const isCompleted = sermon ? data.completedSermonIds.includes(sermon.id) : false
  const downloaded = sermon ? sermon.offline.downloadState === 'downloaded' : false

  const displaySaved = saveOverride !== null ? saveOverride : isSaved
  const displayCompleted = completeOverride !== null ? completeOverride : isCompleted
  const displayInQueue = isInQueue || queuePendingAdd

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
  const audioSrc =
    sermon?.mediaAssets.find((a) => a.kind === 'audio')?.url ??
    null
  const hasVideo = Boolean(sermon?.availability.hasVideo)
  const hasNotes = Boolean(sermonText?.transcript?.trim())
  const video = sermon.video
  const playerTitle = hasAudio
    ? 'Audio-first'
    : hasVideo
      ? video?.provider === 'mux'
        ? 'Mux video'
        : 'YouTube video'
      : 'Read'

  const moreLikeThis = sermon
    ? (() => {
        // Prefer other sermons from the same series. When episode numbers are available,
        // prioritize upcoming episodes (greater episodeNumber than the current one),
        // then backfill with earlier ones if needed.
        const sameSeries = sermon.seriesId
          ? data.sermons.filter((s) => s.seriesId === sermon.seriesId && s.id !== sermon.id)
          : data.sermons.filter((s) => s.id !== sermon.id)

        const sortedByEpisodeThenDate = [...sameSeries].sort((a, b) => {
          const aEp = a.episodeNumber ?? Number.MAX_SAFE_INTEGER
          const bEp = b.episodeNumber ?? Number.MAX_SAFE_INTEGER
          if (aEp !== bEp) return aEp - bEp
          const aDate = new Date(a.publishedAt).getTime()
          const bDate = new Date(b.publishedAt).getTime()
          return aDate - bDate
        })

        if (sermon.episodeNumber) {
          const currentEp = sermon.episodeNumber
          const upcoming = sortedByEpisodeThenDate.filter(
            (s) => (s.episodeNumber ?? Number.MAX_SAFE_INTEGER) > currentEp
          )
          const earlierOrUnnumbered = sortedByEpisodeThenDate.filter(
            (s) => (s.episodeNumber ?? Number.MAX_SAFE_INTEGER) <= currentEp
          )
          return [...upcoming, ...earlierOrUnnumbered].slice(0, 4)
        }

        // If there is no explicit episode number, just use the default ordering.
        return sortedByEpisodeThenDate.slice(0, 4)
      })()
    : []

  useEffect(() => {
    startTransition(() => {
      setIsVideoActive(false)
    })
  }, [sermon?.id])

  useEffect(() => {
    setSaveOverride(null)
    setCompleteOverride(null)
    setQueuePendingAdd(false)
    setPlayerFeedback(null)
    setLibraryActionBusy(null)
  }, [sermon?.id])

  useEffect(() => {
    if (saveOverride !== null && isSaved === saveOverride) {
      setSaveOverride(null)
    }
  }, [isSaved, saveOverride])

  useEffect(() => {
    if (completeOverride !== null && isCompleted === completeOverride) {
      setCompleteOverride(null)
    }
  }, [isCompleted, completeOverride])

  useEffect(() => {
    if (queuePendingAdd && isInQueue) {
      setQueuePendingAdd(false)
    }
  }, [isInQueue, queuePendingAdd])

  useEffect(() => {
    if (!playerFeedback || playerFeedback.tone === 'error') return
    const timer = window.setTimeout(() => setPlayerFeedback(null), 3800)
    return () => window.clearTimeout(timer)
  }, [playerFeedback])

  useEffect(() => {
    autoplayAttemptedRef.current = false
    startTransition(() => {
      setAudioPlaying(false)
      setCurrentTimeSec(0)
      setDurationSec(0)
      setAudioError(null)
    })
  }, [sermon?.id, audioSrc])

  useEffect(() => {
    const el = audioRef.current
    if (!el || !audioSrc) return

    const onTimeUpdate = () => setCurrentTimeSec(el.currentTime)
    const syncDuration = () => {
      const d = el.duration
      if (Number.isFinite(d) && d > 0) setDurationSec(d)
    }
    const onPlay = () => setAudioPlaying(true)
    const onPause = () => setAudioPlaying(false)
    const onEnded = () => {
      setAudioPlaying(false)
      setCurrentTimeSec(0)
    }
    const onError = () => {
      setAudioError('Could not load audio. Check your connection or try again.')
      setAudioPlaying(false)
    }

    el.addEventListener('timeupdate', onTimeUpdate)
    el.addEventListener('loadedmetadata', syncDuration)
    el.addEventListener('durationchange', syncDuration)
    el.addEventListener('play', onPlay)
    el.addEventListener('pause', onPause)
    el.addEventListener('ended', onEnded)
    el.addEventListener('error', onError)

    return () => {
      el.removeEventListener('timeupdate', onTimeUpdate)
      el.removeEventListener('loadedmetadata', syncDuration)
      el.removeEventListener('durationchange', syncDuration)
      el.removeEventListener('play', onPlay)
      el.removeEventListener('pause', onPause)
      el.removeEventListener('ended', onEnded)
      el.removeEventListener('error', onError)
    }
  }, [audioSrc])

  useEffect(() => {
    if (!autoplayAudioOnMount || !audioSrc || !hasAudio) return
    if (autoplayAttemptedRef.current) return

    const el = audioRef.current
    if (!el) return

    autoplayAttemptedRef.current = true

    const tryPlay = () => {
      el.play()
        .then(() => {
          setAudioError(null)
        })
        .catch(() => {
          setAudioError('Tap Play to start audio (browser blocked autoplay).')
        })
        .finally(() => {
          onAutoplayIntentConsumed?.()
        })
    }

    if (el.readyState >= 2) {
      tryPlay()
    } else {
      const onCanPlay = () => {
        el.removeEventListener('canplay', onCanPlay)
        tryPlay()
      }
      el.addEventListener('canplay', onCanPlay)
      return () => el.removeEventListener('canplay', onCanPlay)
    }
  }, [autoplayAudioOnMount, audioSrc, hasAudio, onAutoplayIntentConsumed])

  const displayDurationSec =
    Number.isFinite(durationSec) && durationSec > 0
      ? durationSec
      : sermon?.durationSeconds && sermon.durationSeconds > 0
        ? sermon.durationSeconds
        : 0
  const progressPct =
    displayDurationSec > 0
      ? Math.min(100, (currentTimeSec / displayDurationSec) * 100)
      : 0

  function toggleAudioPlayback() {
    const el = audioRef.current
    if (!el || !audioSrc) return
    setAudioError(null)
    if (el.paused) {
      el.play().catch(() => {
        setAudioError('Playback failed. Try again.')
      })
    } else {
      el.pause()
    }
  }

  function seekFromPointer(clientX: number, bar: HTMLDivElement) {
    const el = audioRef.current
    if (!el || !displayDurationSec) return
    const rect = bar.getBoundingClientRect()
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
    el.currentTime = ratio * displayDurationSec
    setCurrentTimeSec(el.currentTime)
  }

  async function handleToggleSave() {
    if (!sermon || !onToggleSaveSermon) return
    const next = !displaySaved
    setSaveOverride(next)
    setLibraryActionBusy('save')
    setPlayerFeedback(null)
    try {
      const result = await normalizeLibraryAction(onToggleSaveSermon(sermon.id, next))
      if (!result.ok) {
        setSaveOverride(null)
        setPlayerFeedback({
          tone: 'error',
          text: result.message ?? 'Could not update saved state.',
        })
      } else if (result.message) {
        setPlayerFeedback({ tone: 'info', text: result.message })
      }
    } finally {
      setLibraryActionBusy(null)
    }
  }

  async function handleAddToQueue() {
    if (!sermon || !onAddToQueue || displayInQueue) return
    setQueuePendingAdd(true)
    setLibraryActionBusy('queue')
    setPlayerFeedback(null)
    try {
      const result = await normalizeLibraryAction(onAddToQueue(sermon.id))
      if (!result.ok) {
        setQueuePendingAdd(false)
        setPlayerFeedback({
          tone: 'error',
          text: result.message ?? 'Could not add to queue.',
        })
      } else {
        if (result.skipped) {
          setQueuePendingAdd(false)
        }
        if (result.message) {
          setPlayerFeedback({ tone: 'info', text: result.message })
        }
      }
    } finally {
      setLibraryActionBusy(null)
    }
  }

  async function handleToggleComplete() {
    if (!sermon || !onMarkSermonCompleted) return
    const next = !displayCompleted
    setCompleteOverride(next)
    setLibraryActionBusy('complete')
    setPlayerFeedback(null)
    try {
      const result = await normalizeLibraryAction(onMarkSermonCompleted(sermon.id, next))
      if (!result.ok) {
        setCompleteOverride(null)
        setPlayerFeedback({
          tone: 'error',
          text: result.message ?? 'Could not update completion.',
        })
      } else if (result.message) {
        setPlayerFeedback({ tone: 'info', text: result.message })
      }
    } finally {
      setLibraryActionBusy(null)
    }
  }

  async function handleDownload() {
    if (!sermon || !onDownloadSermon) return
    setLibraryActionBusy('download')
    setPlayerFeedback(null)
    try {
      const result = await normalizeLibraryAction(onDownloadSermon(sermon.id))
      if (!result.ok) {
        setPlayerFeedback({
          tone: 'error',
          text: result.message ?? 'Download could not start.',
        })
      } else if (result.message) {
        setPlayerFeedback({ tone: 'info', text: result.message })
      }
    } finally {
      setLibraryActionBusy(null)
    }
  }

  async function handleShare() {
    if (!sermon || !onShareSermon) return
    setLibraryActionBusy('share')
    setPlayerFeedback(null)
    try {
      const result = await normalizeLibraryAction(onShareSermon(sermon.id))
      if (!result.ok) {
        setPlayerFeedback({
          tone: 'error',
          text: result.message ?? 'Could not share.',
        })
      } else if (result.message) {
        setPlayerFeedback({ tone: 'info', text: result.message })
      }
    } finally {
      setLibraryActionBusy(null)
    }
  }

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
          ) : hasNotes ? (
            <Badge>
              <Text className="h-3 w-3" strokeWidth={2} />
              Transcript only
            </Badge>
          ) : null}
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
          {displayInQueue ? (
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
            {video ? (
              isVideoActive ? (
                <div className="mb-5 overflow-hidden rounded-3xl border border-neutral-200/70 dark:border-neutral-800/70 bg-neutral-950">
                  <div className="aspect-video w-full">
                    <SermonVideoPlayer video={video} title={sermonText.title} />
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsVideoActive(true)}
                  className="group relative mb-5 block w-full overflow-hidden rounded-3xl text-left"
                  aria-label={`Play ${sermonText.title} video`}
                >
                  <SermonThumbnail
                    src={sermon.thumbnailUrl}
                    title={sermonText.title}
                    className="aspect-[16/9]"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-neutral-900 shadow-lg ring-2 ring-white/50">
                      <Play className="h-6 w-6 translate-x-[2px]" strokeWidth={2} />
                    </span>
                  </div>
                </button>
              )
            ) : (
              <SermonThumbnail
                src={sermon.thumbnailUrl}
                title={sermonText.title}
                className="mb-5 aspect-[16/9]"
              />
            )}
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
            {hasAudio || hasVideo ? (
              <>
                {audioSrc ? (
                  <audio
                    key={audioSrc}
                    ref={audioRef}
                    src={audioSrc}
                    preload="metadata"
                    className="hidden"
                    playsInline
                  />
                ) : null}
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
                    {hasAudio && audioSrc ? (
                      <button
                        type="button"
                        onClick={toggleAudioPlayback}
                        disabled={!sermon.actions.canPlayAudio}
                        className="h-11 w-11 shrink-0 rounded-2xl bg-primary-600 text-white flex items-center justify-center hover:bg-primary-700 transition-colors disabled:bg-neutral-300 disabled:text-neutral-600 dark:disabled:bg-neutral-800 dark:disabled:text-neutral-400"
                        aria-label={audioPlaying ? 'Pause audio' : 'Play audio'}
                      >
                        {audioPlaying ? (
                          <Pause className="h-5 w-5" strokeWidth={1.75} />
                        ) : (
                          <Play className="h-5 w-5 translate-x-[1px]" strokeWidth={1.75} />
                        )}
                      </button>
                    ) : (
                      <div className="h-11 w-11 shrink-0 rounded-2xl bg-primary-600 text-white flex items-center justify-center">
                        <Play className="h-5 w-5 translate-x-[1px]" strokeWidth={1.75} />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold text-neutral-700 dark:text-neutral-200">{playerTitle}</div>
                      <div className="mt-0.5 text-sm font-semibold text-neutral-950 dark:text-neutral-50 line-clamp-2">
                        {sermonText.title}
                      </div>
                    </div>
                  </div>

                  {hasAudio && audioSrc ? (
                    <>
                      <div
                        role="progressbar"
                        aria-valuenow={Math.round(progressPct)}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        className="mt-4 h-1.5 cursor-pointer rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden"
                        onClick={(e) => seekFromPointer(e.clientX, e.currentTarget)}
                        onKeyDown={(e) => {
                          if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
                          const el = audioRef.current
                          if (!el || !displayDurationSec) return
                          const delta = e.key === 'ArrowRight' ? 15 : -15
                          el.currentTime = Math.min(displayDurationSec, Math.max(0, el.currentTime + delta))
                        }}
                        tabIndex={0}
                      >
                        <div
                          className="h-full rounded-full bg-primary-600 dark:bg-primary-400 transition-[width] duration-150 ease-out"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                      <div className="mt-2 flex items-center justify-between text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 tabular-nums">
                        <span>{formatPlaybackTime(currentTimeSec)}</span>
                        <span>
                          {displayDurationSec > 0
                            ? formatPlaybackTime(displayDurationSec)
                            : formatDuration(sermon.durationSeconds)}
                        </span>
                      </div>
                      {audioError ? (
                        <p className="mt-2 text-[11px] text-amber-800 dark:text-amber-200">{audioError}</p>
                      ) : null}
                    </>
                  ) : null}

                  {playerFeedback ? (
                    <p
                      className={cn(
                        'mt-4 rounded-xl px-3 py-2 text-[11px] font-medium leading-snug',
                        playerFeedback.tone === 'error'
                          ? 'bg-red-500/10 text-red-900 dark:bg-red-500/15 dark:text-red-100'
                          : 'bg-primary-600/10 text-primary-950 dark:bg-primary-400/15 dark:text-primary-50'
                      )}
                      role={playerFeedback.tone === 'error' ? 'alert' : 'status'}
                    >
                      {playerFeedback.text}
                    </p>
                  ) : null}

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {hasAudio ? (
                      <PrimaryButton
                        icon={
                          audioPlaying ? (
                            <Pause className="h-4 w-4" strokeWidth={1.75} />
                          ) : (
                            <Headphones className="h-4 w-4" strokeWidth={1.75} />
                          )
                        }
                        onClick={toggleAudioPlayback}
                        disabled={!sermon.actions.canPlayAudio || !audioSrc}
                      >
                        {audioPlaying ? 'Pause' : 'Play audio'}
                      </PrimaryButton>
                    ) : hasVideo ? (
                      <PrimaryButton
                        icon={<Play className="h-4 w-4" strokeWidth={1.75} />}
                        onClick={() => setIsVideoActive(true)}
                        disabled={!video}
                      >
                        Play video
                      </PrimaryButton>
                    ) : null}
                    {hasAudio ? (
                      <SecondaryButton
                        icon={<Video className="h-4 w-4" strokeWidth={1.75} />}
                        onClick={() => setIsVideoActive(true)}
                        disabled={!video}
                      >
                        {hasVideo ? 'Play video' : 'Video unavailable'}
                      </SecondaryButton>
                    ) : null}
                    <SecondaryButton
                      tone="amber"
                      icon={<Download className="h-4 w-4" strokeWidth={1.75} />}
                      onClick={() => void handleDownload()}
                      disabled={!sermon.actions.canDownload}
                      pending={libraryActionBusy === 'download'}
                    >
                      Download
                    </SecondaryButton>
                    <SecondaryButton
                      icon={
                        displaySaved ? (
                          <BookmarkCheck className="h-4 w-4" strokeWidth={1.75} />
                        ) : (
                          <Bookmark className="h-4 w-4" strokeWidth={1.75} />
                        )
                      }
                      onClick={() => void handleToggleSave()}
                      disabled={!sermon.actions.canSave}
                      pending={libraryActionBusy === 'save'}
                    >
                      {displaySaved ? 'Saved' : 'Save'}
                    </SecondaryButton>
                  </div>

                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <SecondaryButton
                      icon={<ListMusic className="h-4 w-4" strokeWidth={1.75} />}
                      onClick={() => void handleAddToQueue()}
                      disabled={!sermon.actions.canAddToQueue || displayInQueue}
                      pending={libraryActionBusy === 'queue'}
                    >
                      {displayInQueue ? 'In queue' : 'Add to queue'}
                    </SecondaryButton>
                    <SecondaryButton
                      icon={<CheckCircle2 className="h-4 w-4" strokeWidth={1.75} />}
                      onClick={() => void handleToggleComplete()}
                      disabled={!sermon.actions.canMarkCompleted}
                      pending={libraryActionBusy === 'complete'}
                    >
                      {displayCompleted ? 'Completed' : 'Mark complete'}
                    </SecondaryButton>
                  </div>

                  <div className="mt-2">
                    <SecondaryButton
                      icon={<Share2 className="h-4 w-4" strokeWidth={1.75} />}
                      onClick={() => void handleShare()}
                      disabled={!sermon.actions.canShare}
                      pending={libraryActionBusy === 'share'}
                    >
                      Share
                    </SecondaryButton>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold tracking-wide text-neutral-700 dark:text-neutral-300 uppercase">
                    {hasNotes ? 'Transcript only' : 'Read'}
                  </div>
                  <div className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 tabular-nums">
                    {formatDuration(sermon.durationSeconds)}
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-neutral-200/70 dark:border-neutral-800/70 bg-neutral-50/50 dark:bg-neutral-900/30 p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-2xl bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center">
                      <Text className="h-5 w-5 text-neutral-600 dark:text-neutral-300" strokeWidth={1.75} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">
                        {hasNotes ? 'Read the transcript below' : 'Summary available'}
                      </div>
                      <div className="mt-0.5 text-sm font-semibold text-neutral-950 dark:text-neutral-50 line-clamp-2">
                        {sermonText.title}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <SecondaryButton
                      icon={
                        displaySaved ? (
                          <BookmarkCheck className="h-4 w-4" strokeWidth={1.75} />
                        ) : (
                          <Bookmark className="h-4 w-4" strokeWidth={1.75} />
                        )
                      }
                      onClick={() => void handleToggleSave()}
                      disabled={!sermon.actions.canSave}
                      pending={libraryActionBusy === 'save'}
                    >
                      {displaySaved ? 'Saved' : 'Save'}
                    </SecondaryButton>
                    <SecondaryButton
                      icon={<CheckCircle2 className="h-4 w-4" strokeWidth={1.75} />}
                      onClick={() => void handleToggleComplete()}
                      disabled={!sermon.actions.canMarkCompleted}
                      pending={libraryActionBusy === 'complete'}
                    >
                      {displayCompleted ? 'Completed' : 'Mark complete'}
                    </SecondaryButton>
                  </div>
                  {playerFeedback ? (
                    <p
                      className={cn(
                        'mt-4 rounded-xl px-3 py-2 text-[11px] font-medium leading-snug',
                        playerFeedback.tone === 'error'
                          ? 'bg-red-500/10 text-red-900 dark:bg-red-500/15 dark:text-red-100'
                          : 'bg-primary-600/10 text-primary-950 dark:bg-primary-400/15 dark:text-primary-50'
                      )}
                      role={playerFeedback.tone === 'error' ? 'alert' : 'status'}
                    >
                      {playerFeedback.text}
                    </p>
                  ) : null}
                </div>
              </>
            )}
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
                    <SermonThumbnail
                      src={s.thumbnailUrl}
                      title={t.title}
                      className="mb-4 aspect-[16/9]"
                    />
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

