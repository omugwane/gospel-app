/**
 * Per-user library overlay: bookmarks, queue, downloads, completion,
 * and recent queries. Stored under users/{uid}/libraryState/default
 * and read with the client SDK so Firestore rules scope writes to
 * the signed-in user.
 */

import {
  arrayRemove,
  arrayUnion,
  deleteField,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  type DocumentReference,
  type Unsubscribe,
} from 'firebase/firestore'
import { getFirebaseDb } from '@/lib/firebase/client'
import { Collections } from '@/lib/firebase/collections'
import type { Download } from '@/product/sections/library/types'

const LIBRARY_STATE_DOC_ID = 'default'
const RECENT_QUERIES_LIMIT = 10
const PERSISTED_DOWNLOAD_STATES = new Set<Download['state']>([
  'downloading',
  'downloaded',
  'failed',
])

export interface LibraryStateOverlay {
  savedSermonIds: string[]
  savedSeriesIds: string[]
  queueSermonIds: string[]
  completedSermonIds: string[]
  recentQueries: string[]
  downloads: Download[]
}

interface PersistedDownload {
  id: string
  mediaAssetId: string
  sermonId: string
  createdAt: string
  byteSize: number
  state: Download['state']
}

interface LibraryStateDocument {
  savedSermonIds?: string[]
  savedSeriesIds?: string[]
  queueSermonIds?: string[]
  completedSermonIds?: string[]
  recentQueries?: string[]
  downloads?: Record<string, PersistedDownload>
  updatedAt?: unknown
}

export const EMPTY_LIBRARY_STATE: LibraryStateOverlay = {
  savedSermonIds: [],
  savedSeriesIds: [],
  queueSermonIds: [],
  completedSermonIds: [],
  recentQueries: [],
  downloads: [],
}

function getLibraryStateRef(uid: string): DocumentReference<LibraryStateDocument> | null {
  const db = getFirebaseDb()
  if (!db) {
    return null
  }

  return doc(
    db,
    Collections.users,
    uid,
    'libraryState',
    LIBRARY_STATE_DOC_ID
  ) as DocumentReference<LibraryStateDocument>
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string')
}

function normalizeDownloads(value: unknown): Download[] {
  if (!value || typeof value !== 'object') return []
  return Object.values(value as Record<string, unknown>)
    .filter((entry): entry is Record<string, unknown> => !!entry && typeof entry === 'object')
    .map((entry) => {
      const id = typeof entry.id === 'string' ? entry.id : ''
      const mediaAssetId = typeof entry.mediaAssetId === 'string' ? entry.mediaAssetId : ''
      const createdAt = typeof entry.createdAt === 'string' ? entry.createdAt : ''
      const byteSize = typeof entry.byteSize === 'number' ? entry.byteSize : 0
      const state = PERSISTED_DOWNLOAD_STATES.has(entry.state as Download['state'])
        ? (entry.state as Download['state'])
        : 'downloaded'

      if (!id || !mediaAssetId) return null

      return { id, mediaAssetId, createdAt, byteSize, state } satisfies Download
    })
    .filter((value): value is Download => value !== null)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
}

function normalizeOverlay(data: unknown): LibraryStateOverlay {
  if (!data || typeof data !== 'object') return EMPTY_LIBRARY_STATE
  const record = data as LibraryStateDocument
  const recentQueries = asStringArray(record.recentQueries)

  return {
    savedSermonIds: asStringArray(record.savedSermonIds),
    savedSeriesIds: asStringArray(record.savedSeriesIds),
    queueSermonIds: asStringArray(record.queueSermonIds),
    completedSermonIds: asStringArray(record.completedSermonIds),
    recentQueries: recentQueries.slice(-RECENT_QUERIES_LIMIT).reverse(),
    downloads: normalizeDownloads(record.downloads),
  }
}

export function subscribeLibraryState(
  uid: string,
  onChange: (overlay: LibraryStateOverlay) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const ref = getLibraryStateRef(uid)
  if (!ref) {
    onChange(EMPTY_LIBRARY_STATE)
    return () => {}
  }

  return onSnapshot(
    ref,
    (snapshot) => {
      onChange(snapshot.exists() ? normalizeOverlay(snapshot.data()) : EMPTY_LIBRARY_STATE)
    },
    (error) => {
      console.warn('[libraryState] subscription failed', error)
      onError?.(error)
      onChange(EMPTY_LIBRARY_STATE)
    }
  )
}

async function writeLibraryState(
  uid: string,
  patch: Record<string, unknown>
): Promise<void> {
  const ref = getLibraryStateRef(uid)
  if (!ref) return

  await setDoc(
    ref,
    {
      ...patch,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  )
}

export async function setSermonSaved(
  uid: string,
  sermonId: string,
  saved: boolean
): Promise<void> {
  if (!sermonId) return
  await writeLibraryState(uid, {
    savedSermonIds: saved ? arrayUnion(sermonId) : arrayRemove(sermonId),
  })
}

export async function setSeriesSaved(
  uid: string,
  seriesId: string,
  saved: boolean
): Promise<void> {
  if (!seriesId) return
  await writeLibraryState(uid, {
    savedSeriesIds: saved ? arrayUnion(seriesId) : arrayRemove(seriesId),
  })
}

export async function addSermonToQueue(uid: string, sermonId: string): Promise<void> {
  if (!sermonId) return
  await writeLibraryState(uid, {
    queueSermonIds: arrayUnion(sermonId),
  })
}

export async function removeSermonFromQueue(uid: string, sermonId: string): Promise<void> {
  if (!sermonId) return
  await writeLibraryState(uid, {
    queueSermonIds: arrayRemove(sermonId),
  })
}

export async function setSermonCompleted(
  uid: string,
  sermonId: string,
  completed: boolean
): Promise<void> {
  if (!sermonId) return
  await writeLibraryState(uid, {
    completedSermonIds: completed ? arrayUnion(sermonId) : arrayRemove(sermonId),
  })
}

/**
 * Append a query to the user's recent searches. Dedupes by removing any
 * earlier occurrence first, so the latest one always lives at the tail.
 * Read-side trims to {@link RECENT_QUERIES_LIMIT} via {@link normalizeOverlay}.
 */
export async function addRecentQuery(uid: string, query: string): Promise<void> {
  const trimmed = query.trim()
  if (!trimmed) return

  const ref = getLibraryStateRef(uid)
  if (!ref) return

  await setDoc(
    ref,
    {
      recentQueries: arrayRemove(trimmed),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  )

  await setDoc(
    ref,
    {
      recentQueries: arrayUnion(trimmed),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  )
}

export interface UpsertDownloadInput {
  sermonId: string
  mediaAssetId: string
  byteSize?: number
  state?: Download['state']
}

export async function upsertDownload(
  uid: string,
  input: UpsertDownloadInput
): Promise<void> {
  const { sermonId, mediaAssetId } = input
  if (!sermonId || !mediaAssetId) return

  const downloadId = makeDownloadId(sermonId)
  const record: PersistedDownload = {
    id: downloadId,
    mediaAssetId,
    sermonId,
    createdAt: new Date().toISOString(),
    byteSize: input.byteSize ?? 0,
    state: input.state ?? 'downloaded',
  }

  await writeLibraryState(uid, {
    [`downloads.${downloadId}`]: record,
  })
}

export async function removeDownloadById(uid: string, downloadId: string): Promise<void> {
  if (!downloadId) return
  await writeLibraryState(uid, {
    [`downloads.${downloadId}`]: deleteField(),
  })
}

export function makeDownloadId(sermonId: string): string {
  return `dl_${sermonId}`
}
