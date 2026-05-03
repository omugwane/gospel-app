'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback } from 'react'
import { useAuth } from '@/components/auth-context'
import { isFirebaseConfigured } from '@/lib/firebase/client'
import {
  addRecentQuery,
  addSermonToQueue,
  removeDownloadById,
  setSeriesSaved,
  setSermonCompleted,
  setSermonSaved,
  upsertDownload,
} from '@/lib/firebase/libraryState'
import type {
  LibraryActionResult,
  LibraryData,
  MediaAsset,
  SearchFilters,
  Sermon,
} from '@/product/sections/library/types'

function buildSearchUrl(params: {
  q?: string
  topic?: string | null
  series?: string | null
  audio?: boolean | null
  video?: boolean | null
  notes?: boolean | null
}): string {
  const sp = new URLSearchParams()
  if (params.q) sp.set('q', params.q)
  if (params.topic) sp.set('topic', params.topic)
  if (params.series) sp.set('series', params.series)
  if (params.audio === true) sp.set('audio', '1')
  if (params.video === true) sp.set('video', '1')
  if (params.notes === true) sp.set('notes', '1')
  const qs = sp.toString()
  return qs ? `/library/search?${qs}` : '/library/search'
}

function reportFailure(action: string, error: unknown) {
  console.warn(`[library] ${action} failed`, error)
}

function guardAuth(uid: string | null): LibraryActionResult | null {
  if (!uid) {
    return {
      ok: false,
      reason: 'auth_required',
      message: 'Sign in to save sermons, sync your queue, and track downloads.',
    }
  }
  return null
}

function guardFirebase(): LibraryActionResult | null {
  if (!isFirebaseConfigured()) {
    return {
      ok: false,
      reason: 'firebase_unconfigured',
      message: 'Library sync is unavailable. Firebase is not configured.',
    }
  }
  return null
}

async function settleLibraryWrite(
  action: string,
  fn: () => Promise<void>
): Promise<LibraryActionResult> {
  try {
    await fn()
    return { ok: true }
  } catch (error) {
    reportFailure(action, error)
    const message =
      error instanceof Error
        ? error.message
        : 'Something went wrong saving to your library. Try again.'
    return { ok: false, reason: 'unknown', message }
  }
}

function extensionForAudioAsset(audio: MediaAsset): string {
  if (audio.mimeType?.includes('mpeg') || audio.mimeType === 'audio/mp3') return 'mp3'
  if (audio.mimeType?.includes('mp4') || audio.mimeType === 'audio/mp4') return 'm4a'
  const sub = audio.mimeType?.split('/')[1]
  if (sub && /^[a-z0-9]+$/i.test(sub)) return sub
  return 'audio'
}

function sanitizeDownloadBasename(title: string): string {
  const t = title.trim() || 'sermon'
  return t.replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 80) || 'sermon'
}

function triggerBrowserAudioDownload(sermon: Sermon, audioAsset: MediaAsset) {
  if (typeof window === 'undefined') return
  const basename = sanitizeDownloadBasename(sermon.title)
  const ext = extensionForAudioAsset(audioAsset)
  const a = document.createElement('a')
  a.href = audioAsset.url
  a.download = `${basename}.${ext}`
  a.target = '_blank'
  a.rel = 'noopener noreferrer'
  document.body.appendChild(a)
  a.click()
  a.remove()
}

export function useLibraryCallbacks(data: LibraryData) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const uid = user?.uid ?? null

  const isOnSearchPage = pathname === '/library/search'

  const persistRecentQuery = useCallback(
    (query: string) => {
      if (!uid) return
      const trimmed = query.trim()
      if (!trimmed) return
      void addRecentQuery(uid, trimmed).catch((error) =>
        reportFailure('persist recent query', error)
      )
    },
    [uid]
  )

  return {
    onBack: () => router.push('/library'),
    onBrowseAllSeries: () => router.push('/library/series'),
    onOpenDownloads: () => router.push('/library/downloads'),
    onOpenSavedSermons: () => router.push('/library/saved'),
    onOpenSeries: (seriesId: string) => router.push(`/library/series/${seriesId}`),
    onOpenTopic: (topicId: string) => router.push(`/library/search?topic=${topicId}`),
    onOpenSermon: (sermonId: string) => router.push(`/library/sermon/${sermonId}`),
    onPlaySermonAudio: (sermonId: string) => {
      router.push(`/library/sermon/${sermonId}?play=1`)
    },
    onWatchSermonVideo: (sermonId: string) => {
      router.push(`/library/sermon/${sermonId}`)
    },
    onDownloadSermon: async (sermonId: string): Promise<LibraryActionResult> => {
      const authFail = guardAuth(uid)
      if (authFail) return authFail
      const firebaseFail = guardFirebase()
      if (firebaseFail) return firebaseFail

      const sermon = data.sermons.find((s) => s.id === sermonId)
      const audioAsset = sermon?.mediaAssets.find((m) => m.kind === 'audio')
      if (!sermon || !audioAsset?.url) {
        return {
          ok: false,
          reason: 'missing_asset',
          message: 'No audio file is available for this sermon.',
        }
      }

      triggerBrowserAudioDownload(sermon, audioAsset)

      const writeResult = await settleLibraryWrite('register download', () =>
        upsertDownload(uid!, {
          sermonId,
          mediaAssetId: audioAsset.id,
          byteSize: audioAsset.byteSize,
          state: 'downloaded',
        })
      )

      if (!writeResult.ok) return writeResult
      return {
        ok: true,
        message:
          'Download started — check your browser downloads or the new tab. Offline badge updates when synced.',
      }
    },
    onRemoveDownload: (downloadId: string) => {
      if (!uid) return
      void removeDownloadById(uid, downloadId).catch((error) =>
        reportFailure('remove download', error)
      )
    },
    onShareSermon: async (sermonId: string): Promise<LibraryActionResult> => {
      const sermon = data.sermons.find((s) => s.id === sermonId)
      if (!sermon) {
        return { ok: false, reason: 'missing_asset', message: 'Sermon not found.' }
      }

      const text = sermon.title
      const url =
        typeof window !== 'undefined'
          ? `${window.location.origin}/library/sermon/${sermonId}`
          : ''

      try {
        if (typeof navigator !== 'undefined' && navigator.share) {
          await navigator.share({ title: sermon.title, text, url })
          return { ok: true, message: 'Shared.' }
        }
        if (typeof window !== 'undefined') {
          window.open(
            `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
            '_blank',
            'noopener,noreferrer'
          )
          return { ok: true, message: 'Opening share link…' }
        }
        return { ok: false, message: 'Sharing is not available here.' }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return { ok: true, skipped: true, message: 'Share cancelled.' }
        }
        if (typeof window !== 'undefined') {
          window.open(
            `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
            '_blank',
            'noopener,noreferrer'
          )
          return { ok: true, message: 'Opening share link…' }
        }
        reportFailure('share sermon', error)
        return { ok: false, reason: 'unknown', message: 'Could not share. Try again.' }
      }
    },
    onToggleSaveSermon: async (sermonId: string, saved: boolean): Promise<LibraryActionResult> => {
      const authFail = guardAuth(uid)
      if (authFail) return authFail
      const firebaseFail = guardFirebase()
      if (firebaseFail) return firebaseFail

      const result = await settleLibraryWrite('toggle saved sermon', () =>
        setSermonSaved(uid!, sermonId, saved)
      )
      if (!result.ok) return result
      return { ok: true, message: saved ? 'Saved to your library.' : 'Removed from saved.' }
    },
    onToggleSaveSeries: (seriesId: string, saved: boolean) => {
      if (!uid) return
      void setSeriesSaved(uid, seriesId, saved).catch((error) =>
        reportFailure('toggle saved series', error)
      )
    },
    onAddToQueue: async (sermonId: string): Promise<LibraryActionResult> => {
      const authFail = guardAuth(uid)
      if (authFail) return authFail
      const firebaseFail = guardFirebase()
      if (firebaseFail) return firebaseFail

      if (data.listeningQueue.queueSermonIds.includes(sermonId)) {
        return {
          ok: true,
          skipped: true,
          message: 'Already in your queue.',
        }
      }

      const result = await settleLibraryWrite('add to queue', () =>
        addSermonToQueue(uid!, sermonId)
      )
      if (!result.ok) return result
      return { ok: true, message: 'Added to queue.' }
    },
    onMarkSermonCompleted: async (
      sermonId: string,
      completed: boolean
    ): Promise<LibraryActionResult> => {
      const authFail = guardAuth(uid)
      if (authFail) return authFail
      const firebaseFail = guardFirebase()
      if (firebaseFail) return firebaseFail

      const result = await settleLibraryWrite('mark completed', () =>
        setSermonCompleted(uid!, sermonId, completed)
      )
      if (!result.ok) return result
      return {
        ok: true,
        message: completed ? 'Marked complete.' : 'Marked as not completed.',
      }
    },
    onSearch: (query: string) => {
      const trimmed = query.trim()
      if (trimmed) {
        persistRecentQuery(trimmed)
      }

      if (isOnSearchPage) {
        router.replace(
          buildSearchUrl({
            q: trimmed || undefined,
            topic: searchParams.get('topic'),
            series: searchParams.get('series'),
            audio: searchParams.get('audio') === '1' ? true : null,
            video: searchParams.get('video') === '1' ? true : null,
            notes: searchParams.get('notes') === '1' ? true : null,
          }),
          { scroll: false }
        )
      } else {
        router.push(buildSearchUrl({ q: trimmed || undefined }))
      }
    },
    onUpdateSearchFilters: (filters: SearchFilters) => {
      if (!isOnSearchPage) return
      const currentQ = searchParams.get('q') ?? ''
      router.replace(
        buildSearchUrl({
          q: currentQ || undefined,
          topic: filters.topicId,
          series: filters.seriesId,
          audio: filters.hasAudio,
          video: filters.hasVideo,
          notes: filters.hasTranscript,
        }),
        { scroll: false }
      )
    },
  }
}
