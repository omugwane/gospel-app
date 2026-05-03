'use client'

import type { LibraryData, SearchFilters } from '@/product/sections/library/types'
import { SearchResults } from '@/product/sections/library/components'
import { useLibraryCallbacks } from '@/lib/library-callbacks'
import { useMergedLibraryData } from '@/lib/library-overlay'

export default function LibrarySearchClient({
  data,
  initialQuery,
  initialTopicId,
  initialSeriesId,
  initialHasAudio,
  initialHasVideo,
  initialHasTranscript,
}: {
  data: LibraryData
  initialQuery?: string
  initialTopicId?: string
  initialSeriesId?: string
  initialHasAudio?: boolean
  initialHasVideo?: boolean
  initialHasTranscript?: boolean
}) {
  const { data: mergedData, locale } = useMergedLibraryData(data)
  const callbacks = useLibraryCallbacks(mergedData)

  const scopedData: LibraryData = {
    ...mergedData,
    searchState: {
      ...mergedData.searchState,
      query: initialQuery ?? mergedData.searchState.query,
      filters: {
        seriesId: initialSeriesId ?? mergedData.searchState.filters.seriesId,
        topicId: initialTopicId ?? mergedData.searchState.filters.topicId,
        hasAudio: initialHasAudio ?? mergedData.searchState.filters.hasAudio,
        hasVideo: initialHasVideo ?? mergedData.searchState.filters.hasVideo,
        hasTranscript: initialHasTranscript ?? mergedData.searchState.filters.hasTranscript,
      } as SearchFilters,
    },
  }

  return <SearchResults data={scopedData} locale={locale} {...callbacks} />
}
