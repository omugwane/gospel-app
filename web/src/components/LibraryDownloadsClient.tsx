'use client'

import type { LanguageCode, LibraryData } from '@/product/sections/library/types'
import { Downloads } from '@/product/sections/library/components'
import { useLibraryCallbacks } from '@/lib/library-callbacks'

export default function LibraryDownloadsClient({
  data,
  locale,
}: {
  data: LibraryData
  locale: LanguageCode
}) {
  const callbacks = useLibraryCallbacks(data)
  return (
    <Downloads
      data={data}
      locale={locale}
      {...callbacks}
    />
  )
}
