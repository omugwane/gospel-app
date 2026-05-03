'use client'

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useAuth } from '@/components/auth-context'
import { usePreferences } from '@/components/preferences-context'
import {
  EMPTY_LIBRARY_STATE,
  subscribeLibraryState,
  type LibraryStateOverlay,
} from '@/lib/firebase/libraryState'
import type {
  LanguageCode,
  LibraryData,
  Viewer,
} from '@/product/sections/library/types'

interface LibraryOverlayContextValue {
  overlay: LibraryStateOverlay
  uid: string | null
  isOverlayLoaded: boolean
}

const LibraryOverlayContext = createContext<LibraryOverlayContextValue>({
  overlay: EMPTY_LIBRARY_STATE,
  uid: null,
  isOverlayLoaded: false,
})

/**
 * Subscribes to the signed-in user's library overlay document exactly once
 * and shares it via context. Mounting per-consumer subscriptions caused
 * Firestore "Unexpected state (ID: ca9)" assertions because multiple watch
 * targets on the same doc race during route transitions / HMR; a single
 * provider-level listener avoids that.
 */
export function LibraryOverlayProvider({ children }: { children: ReactNode }) {
  const { user, status } = useAuth()
  const [overlay, setOverlay] = useState<LibraryStateOverlay>(EMPTY_LIBRARY_STATE)
  const [isOverlayLoaded, setIsOverlayLoaded] = useState(false)

  useEffect(() => {
    if (status !== 'ready') return

    if (!user) {
      setOverlay(EMPTY_LIBRARY_STATE)
      setIsOverlayLoaded(true)
      return
    }

    let cancelled = false
    setIsOverlayLoaded(false)

    const unsubscribe = subscribeLibraryState(user.uid, (next) => {
      if (cancelled) return
      setOverlay(next)
      setIsOverlayLoaded(true)
    })

    return () => {
      cancelled = true
      unsubscribe()
    }
  }, [status, user])

  const value = useMemo<LibraryOverlayContextValue>(
    () => ({ overlay, uid: user?.uid ?? null, isOverlayLoaded }),
    [overlay, user, isOverlayLoaded]
  )

  return (
    <LibraryOverlayContext.Provider value={value}>{children}</LibraryOverlayContext.Provider>
  )
}

export function useLibraryOverlay(): LibraryOverlayContextValue {
  return useContext(LibraryOverlayContext)
}

/**
 * Pure merge: combines server-side Sanity catalog with the user's Firestore
 * overlay and sets each sermon's `offline.downloadState` to 'downloaded'
 * when any of its media assets has a registered download.
 */
export function mergeLibraryData(
  serverData: LibraryData,
  overlay: LibraryStateOverlay,
  viewer: Viewer
): LibraryData {
  const downloadedMediaIds = new Set(overlay.downloads.map((d) => d.mediaAssetId))

  const sermons = serverData.sermons.map((sermon) =>
    sermon.mediaAssets.some((m) => downloadedMediaIds.has(m.id))
      ? {
          ...sermon,
          offline: { ...sermon.offline, downloadState: 'downloaded' as const },
        }
      : sermon
  )

  return {
    ...serverData,
    viewer,
    sermons,
    saved: {
      savedSermonIds: overlay.savedSermonIds,
      savedSeriesIds: overlay.savedSeriesIds,
    },
    listeningQueue: {
      queueSermonIds: overlay.queueSermonIds,
    },
    downloads: overlay.downloads,
    completedSermonIds: overlay.completedSermonIds,
    searchState: {
      ...serverData.searchState,
      recentQueries: overlay.recentQueries.length
        ? overlay.recentQueries
        : serverData.searchState.recentQueries,
    },
  }
}

function buildViewer(
  serverViewer: Viewer,
  user: ReturnType<typeof useAuth>['user'],
  language: LanguageCode
): Viewer {
  if (!user) {
    return { ...serverViewer, preferredLanguage: language }
  }

  const displayName =
    user.displayName?.trim() || user.email?.trim() || serverViewer.displayName

  return {
    userId: user.uid,
    displayName,
    preferredLanguage: language,
  }
}

export interface UseMergedLibraryDataResult {
  data: LibraryData
  locale: LanguageCode
  uid: string | null
}

/**
 * Top-level hook used by every Library*Client wrapper. Returns server data
 * merged with the live user overlay (read from context) plus the active
 * locale derived from the preferences provider so library content stays in
 * sync with account language.
 */
export function useMergedLibraryData(serverData: LibraryData): UseMergedLibraryDataResult {
  const { user } = useAuth()
  const { language } = usePreferences()
  const { overlay, uid } = useLibraryOverlay()

  const data = useMemo(
    () => mergeLibraryData(serverData, overlay, buildViewer(serverData.viewer, user, language)),
    [serverData, overlay, user, language]
  )

  return { data, locale: language, uid }
}
