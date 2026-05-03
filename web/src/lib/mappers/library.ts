/**
 * Library section mapper.
 *
 * Combines Sanity catalog (series, sermons, topics) with
 * Firebase user overlays (saved, downloads, listening queue)
 * to produce the LibraryData prop payload.
 */

import { sanityClient } from '@/lib/sanity/client'
import {
  allSeriesQuery,
  allSermonsQuery,
  allTopicsQuery,
} from '@/lib/sanity/queries'
import { defaultViewer, defaultSearchState } from '@/lib/defaults'
import type {
  LibraryData,
  Topic,
  Series,
  Sermon,
  SermonVideo,
  SavedState,
  ListeningQueueState,
  Download,
} from '@/product/sections/library/types'
import type { LanguageCode } from '@/product/sections/library/types'

const LANGUAGE_OPTIONS = [
  { code: 'rw' as LanguageCode, label: 'Kinyarwanda' },
  { code: 'en' as LanguageCode, label: 'English' },
  { code: 'fr' as LanguageCode, label: 'Français' },
]

function parseYouTubeVideo(input: unknown): Extract<SermonVideo, { provider: 'youtube' }> | null {
  if (typeof input !== 'string') return null
  const trimmed = input.trim()
  if (!trimmed) return null

  let url: URL
  try {
    url = new URL(trimmed)
  } catch {
    return null
  }

  const hostname = url.hostname.replace(/^www\./, '')
  let videoId = ''

  if (hostname === 'youtu.be') {
    videoId = url.pathname.slice(1)
  } else if (hostname === 'youtube.com' || hostname === 'm.youtube.com') {
    if (url.pathname === '/watch') {
      videoId = url.searchParams.get('v') ?? ''
    } else if (url.pathname.startsWith('/embed/')) {
      videoId = url.pathname.split('/')[2] ?? ''
    } else if (url.pathname.startsWith('/shorts/')) {
      videoId = url.pathname.split('/')[2] ?? ''
    }
  }

  const normalizedVideoId = videoId.trim()
  if (!normalizedVideoId) return null

  return {
    provider: 'youtube',
    videoId: normalizedVideoId,
    watchUrl: `https://www.youtube.com/watch?v=${normalizedVideoId}`,
    embedUrl: `https://www.youtube.com/embed/${normalizedVideoId}`,
  }
}

/** Mux public playback ID, or a stream.mux.com playback URL. */
function parseMuxPlaybackId(input: unknown): Extract<SermonVideo, { provider: 'mux' }> | null {
  if (typeof input !== 'string') return null
  const trimmed = input.trim()
  if (!trimmed) return null

  if (/^[A-Za-z0-9]{8,128}$/.test(trimmed)) {
    return { provider: 'mux', playbackId: trimmed }
  }

  try {
    const url = new URL(trimmed)
    const host = url.hostname.replace(/^www\./, '')
    if (host === 'stream.mux.com' || host.endsWith('.mux.com')) {
      const segment = url.pathname.replace(/^\//, '').split('/')[0]?.replace(/\.m3u8$/i, '') ?? ''
      if (/^[A-Za-z0-9]{8,128}$/.test(segment)) {
        return { provider: 'mux', playbackId: segment }
      }
    }
  } catch {
    return null
  }

  return null
}

/** Prefer public playback policy for the site player; otherwise first ID (e.g. signed-only assets). */
function playbackIdFromMuxField(doc: Record<string, unknown>): string | null {
  const muxVideo = doc.muxVideo as
    | { asset?: { playbackIds?: Array<{ id?: string; policy?: string }> } }
    | null
    | undefined
  const ids = muxVideo?.asset?.playbackIds
  if (!Array.isArray(ids) || ids.length === 0) return null
  const pub = ids.find((p) => p.policy === 'public')
  const chosen = pub ?? ids[0]
  const id = typeof chosen?.id === 'string' ? chosen.id.trim() : ''
  return id || null
}

function mapTopic(doc: Record<string, unknown>): Topic {
  const id = (doc._id as string) ?? ''
  const label = (doc.label as string) ?? ''
  const labelEn = doc.labelEn as string | null
  const labelFr = doc.labelFr as string | null
  return {
    id,
    label,
    translations: {
      ...(labelEn && { en: { label: labelEn } }),
      ...(labelFr && { fr: { label: labelFr } }),
    },
  }
}

function mapSeries(doc: Record<string, unknown>, sermonCount: number): Series {
  const id = (doc._id as string) ?? ''
  const title = (doc.title as string) ?? ''
  const description = (doc.description as string) ?? ''
  const thumbnailUrl = doc.thumbnailUrl as string | null
  const topicRefs = (doc.topics as { _ref: string }[]) ?? []
  const topicIds = topicRefs.map((t) => t._ref).filter(Boolean)
  const titleEn = doc.titleEn as string | null
  const titleFr = doc.titleFr as string | null
  const descriptionEn = doc.descriptionEn as string | null
  const descriptionFr = doc.descriptionFr as string | null
  return {
    id,
    title,
    description,
    sermonCount,
    topicIds,
    ...(thumbnailUrl ? { thumbnailUrl } : {}),
    translations: {
      ...(titleEn && { en: { title: titleEn, description: descriptionEn ?? '' } }),
      ...(titleFr && { fr: { title: titleFr, description: descriptionFr ?? '' } }),
    },
  }
}

function mapSermon(doc: Record<string, unknown>): Sermon {
  const id = (doc._id as string) ?? ''
  const title = (doc.title as string) ?? ''
  const episodeNumber = (doc.episodeNumber as number | null) ?? null
  const publishedAt = (doc.publishedAt as string) ?? ''
  const durationSeconds = (doc.durationSeconds as number) ?? 0
  const scriptureReferences = (doc.scriptureReferences as string[]) ?? []
  const summary = (doc.summary as string) ?? ''
  const transcript = (doc.transcript as string) ?? ''
  const seriesRef = doc.series as { _ref: string } | null
  const seriesId = seriesRef?._ref ?? null
  const topicRefs = (doc.topics as { _ref: string }[]) ?? []
  const topicIds = topicRefs.map((t) => t._ref).filter(Boolean)
  const audioUrl = doc.audioUrl as string | null
  const muxPlaybackSource = playbackIdFromMuxField(doc) ?? doc.muxPlaybackId
  const muxVideoResolved = parseMuxPlaybackId(muxPlaybackSource)
  const youtubeVideo = parseYouTubeVideo(doc.youtubeUrl)
  const video: SermonVideo | undefined = muxVideoResolved ?? youtubeVideo ?? undefined
  const thumbnailUrl = doc.thumbnailUrl as string | null

  const mediaAssets = []
  if (audioUrl) {
    const pathOnly = audioUrl.split('?')[0] ?? audioUrl
    const ext = pathOnly.split('.').pop()?.toLowerCase() ?? ''
    const mimeType =
      ext === 'm4a' || ext === 'mp4' || ext === 'aac' || ext === 'f4a'
        ? 'audio/mp4'
        : ext === 'ogg' || ext === 'oga'
          ? 'audio/ogg'
          : ext === 'wav'
            ? 'audio/wav'
            : 'audio/mpeg'
    mediaAssets.push({
      id: `${id}_audio`,
      kind: 'audio' as const,
      url: audioUrl,
      mimeType,
      byteSize: 0,
    })
  }
  const hasAudio = !!audioUrl
  const hasVideo = Boolean(video)
  const hasTranscript = !!transcript?.trim()

  return {
    id,
    title,
    episodeNumber,
    publishedAt,
    durationSeconds,
    scriptureReferences,
    summary,
    seriesId,
    topicIds,
    ...(thumbnailUrl ? { thumbnailUrl } : {}),
    ...(video ? { video } : {}),
    availability: { hasAudio, hasVideo, hasTranscript },
    mediaAssets,
    notes: { transcript },
    translations: {
      ...((doc.titleEn as string) && { en: { title: doc.titleEn as string, summary: (doc.summaryEn as string) ?? '', transcript: (doc.transcriptEn as string) ?? '' } }),
      ...((doc.titleFr as string) && { fr: { title: doc.titleFr as string, summary: (doc.summaryFr as string) ?? '', transcript: (doc.transcriptFr as string) ?? '' } }),
    },
    actions: {
      canPlayAudio: hasAudio,
      canWatchVideo: hasVideo,
      canDownload: hasAudio,
      canShare: true,
      canSave: true,
      canAddToQueue: hasAudio,
      canMarkCompleted: true,
    },
    offline: { downloadState: 'notDownloaded' as const },
  }
}

export async function getLibraryData(): Promise<LibraryData> {
  const [seriesDocs, sermonDocs, topicDocs] = await Promise.all([
    sanityClient.fetch(allSeriesQuery),
    sanityClient.fetch(allSermonsQuery),
    sanityClient.fetch(allTopicsQuery),
  ])

  const seriesList = Array.isArray(seriesDocs) ? seriesDocs : []
  const sermonList = Array.isArray(sermonDocs) ? sermonDocs : []
  const topicList = Array.isArray(topicDocs) ? topicDocs : []

  const topics = topicList.map((t) => mapTopic(t as Record<string, unknown>))

  const sermonCountBySeries: Record<string, number> = {}
  for (const s of sermonList) {
    const doc = s as Record<string, unknown>
    const seriesRef = doc.series as { _ref: string } | null
    if (seriesRef?._ref) {
      sermonCountBySeries[seriesRef._ref] = (sermonCountBySeries[seriesRef._ref] ?? 0) + 1
    }
  }

  const series = seriesList.map((s) => {
    const doc = s as Record<string, unknown>
    const id = doc._id as string
    return mapSeries(doc, sermonCountBySeries[id] ?? 0)
  })

  const seriesById = new Map(series.map((item) => [item.id, item]))
  const sermons = sermonList.map((s) => {
    const sermon = mapSermon(s as Record<string, unknown>)
    const fallbackThumbnailUrl = sermon.seriesId
      ? seriesById.get(sermon.seriesId)?.thumbnailUrl
      : undefined

    return sermon.thumbnailUrl || !fallbackThumbnailUrl
      ? sermon
      : { ...sermon, thumbnailUrl: fallbackThumbnailUrl }
  })

  const defaultSaved: SavedState = { savedSermonIds: [], savedSeriesIds: [] }
  const defaultListeningQueue: ListeningQueueState = { queueSermonIds: [] }
  const defaultDownloads: Download[] = []

  const viewer = {
    ...defaultViewer,
    preferredLanguage: defaultViewer.locale,
  }

  return {
    languageOptions: LANGUAGE_OPTIONS,
    viewer,
    topics,
    series,
    sermons,
    saved: defaultSaved,
    listeningQueue: defaultListeningQueue,
    downloads: defaultDownloads,
    searchState: defaultSearchState,
    completedSermonIds: [],
  }
}
