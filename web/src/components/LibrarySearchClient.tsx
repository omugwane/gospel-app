'use client'

import type { LanguageCode, LibraryData, SearchFilters } from '@/product/sections/library/types'
import { SearchResults } from '@/product/sections/library/components'
import { useLibraryCallbacks } from '@/lib/library-callbacks'

export default function LibrarySearchClient({
  data,
  initialQuery,
  initialTopicId,
  locale,
}: {
  data: LibraryData
  initialQuery?: string
  initialTopicId?: string
  locale: LanguageCode
}) {
  const callbacks = useLibraryCallbacks(data)

  const mergedData: LibraryData = {
    ...data,
    searchState: {
      ...data.searchState,
      query: initialQuery ?? data.searchState.query,
      filters: {
        ...data.searchState.filters,
        topicId: initialTopicId ?? data.searchState.filters.topicId,
      } as SearchFilters,
    },
  }

  return (
    <SearchResults
      data={mergedData}
      locale={locale}
      {...callbacks}
    />
  )
}
