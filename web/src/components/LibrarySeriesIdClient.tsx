'use client'

import type { LibraryData, SearchFilters } from '@/product/sections/library/types'
import { SermonList } from '@/product/sections/library/components'
import { useLibraryCallbacks } from '@/lib/library-callbacks'
import { useMergedLibraryData } from '@/lib/library-overlay'

export default function LibrarySeriesIdClient({
  data,
  seriesId,
}: {
  data: LibraryData
  seriesId: string
}) {
  const { data: mergedData, locale } = useMergedLibraryData(data)
  const callbacks = useLibraryCallbacks(mergedData)

  const scopedData: LibraryData = {
    ...mergedData,
    searchState: {
      ...mergedData.searchState,
      filters: {
        ...mergedData.searchState.filters,
        seriesId,
      } as SearchFilters,
    },
  }

  return <SermonList data={scopedData} locale={locale} {...callbacks} />
}
