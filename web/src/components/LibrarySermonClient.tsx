'use client'

import type { LanguageCode, LibraryData } from '@/product/sections/library/types'
import { SermonDetail } from '@/product/sections/library/components'
import { useLibraryCallbacks } from '@/lib/library-callbacks'

export default function LibrarySermonClient({
  data,
  sermonId,
  locale,
}: {
  data: LibraryData
  sermonId: string
  locale: LanguageCode
}) {
  const callbacks = useLibraryCallbacks(data)
  return (
    <SermonDetail
      data={data}
      sermonId={sermonId}
      locale={locale}
      {...callbacks}
    />
  )
}
