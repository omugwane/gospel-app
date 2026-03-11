'use client'

import { useRouter } from 'next/navigation'
import type { LibraryData, SearchFilters } from '@/product/sections/library/types'

export function useLibraryCallbacks(data: LibraryData) {
  const router = useRouter()

  return {
    onBack: () => router.push('/library'),
    onBrowseAllSeries: () => router.push('/library/series'),
    onOpenDownloads: () => router.push('/library/downloads'),
    onOpenSeries: (seriesId: string) => router.push(`/library/series/${seriesId}`),
    onOpenTopic: (topicId: string) => router.push(`/library/search?topic=${topicId}`),
    onOpenSermon: (sermonId: string) => router.push(`/library/sermon/${sermonId}`),
    onPlaySermonAudio: (sermonId: string) => {
      router.push(`/library/sermon/${sermonId}`)
    },
    onWatchSermonVideo: (sermonId: string) => {
      const sermon = data.sermons.find((s) => s.id === sermonId)
      const videoAsset = sermon?.mediaAssets.find((m) => m.kind === 'video')
      if (videoAsset?.url && typeof window !== 'undefined') {
        window.open(videoAsset.url, '_blank')
      } else {
        router.push(`/library/sermon/${sermonId}`)
      }
    },
    onDownloadSermon: (sermonId: string) => {
      console.log('Download sermon:', sermonId)
    },
    onRemoveDownload: (downloadId: string) => {
      console.log('Remove download:', downloadId)
    },
    onShareSermon: (sermonId: string) => {
      const sermon = data.sermons.find((s) => s.id === sermonId)
      if (sermon && typeof navigator !== 'undefined' && navigator.share) {
        const url = typeof window !== 'undefined' ? `${window.location.origin}/library/sermon/${sermonId}` : ''
        const text = sermon.title
        navigator.share({ title: sermon.title, text, url }).catch(() => {
          if (typeof window !== 'undefined') {
            window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`, '_blank')
          }
        })
      } else if (typeof window !== 'undefined') {
        const url = `${window.location.origin}/library/sermon/${sermonId}`
        window.open(`https://wa.me/?text=${encodeURIComponent(`${sermon?.title ?? 'Sermon'} ${url}`)}`, '_blank')
      }
    },
    onToggleSaveSermon: (sermonId: string, saved: boolean) => {
      console.log('Toggle save sermon:', sermonId, saved)
    },
    onToggleSaveSeries: (seriesId: string, saved: boolean) => {
      console.log('Toggle save series:', seriesId, saved)
    },
    onAddToQueue: (sermonId: string) => {
      console.log('Add to queue:', sermonId)
    },
    onMarkSermonCompleted: (sermonId: string, completed: boolean) => {
      console.log('Mark sermon completed:', sermonId, completed)
    },
    onSearch: (query: string) => {
      // Can navigate to search with query when needed
      console.log('Search:', query)
    },
    onUpdateSearchFilters: (filters: SearchFilters) => {
      console.log('Update search filters:', filters)
    },
  }
}
