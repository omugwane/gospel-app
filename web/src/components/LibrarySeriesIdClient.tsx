'use client'

import type { LanguageCode, LibraryData, SearchFilters } from '@/product/sections/library/types'
import { SermonList } from '@/product/sections/library/components'
import { useLibraryCallbacks } from '@/lib/library-callbacks'

export default function LibrarySeriesIdClient({
  data,
  seriesId,
  locale,
}: {
  data: LibraryData
  seriesId: string
  locale: LanguageCode
}) {
  const callbacks = useLibraryCallbacks(data)

  const mergedData: LibraryData = {
    ...data,
    searchState: {
      ...data.searchState,
      filters: {
        ...data.searchState.filters,
        seriesId,
      } as SearchFilters,
    },
  }

  return (
    <SermonList
      data={mergedData}
      locale={locale}
      {...callbacks}
    />
  )
}
