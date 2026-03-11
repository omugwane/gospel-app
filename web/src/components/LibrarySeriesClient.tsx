'use client'

import type { LanguageCode, LibraryData } from '@/product/sections/library/types'
import { SeriesBrowse } from '@/product/sections/library/components'
import { useLibraryCallbacks } from '@/lib/library-callbacks'

export default function LibrarySeriesClient({
  data,
  locale,
}: {
  data: LibraryData
  locale: LanguageCode
}) {
  const callbacks = useLibraryCallbacks(data)
  return (
    <SeriesBrowse
      data={data}
      locale={locale}
      {...callbacks}
    />
  )
}
