'use client'

import type { LanguageCode, LibraryData } from '@/product/sections/library/types'
import { LibraryHome } from '@/product/sections/library/components'
import { useLibraryCallbacks } from '@/lib/library-callbacks'

export default function LibraryClient({
  data,
  locale,
}: {
  data: LibraryData
  locale: LanguageCode
}) {
  const callbacks = useLibraryCallbacks(data)

  return (
    <LibraryHome
      data={data}
      locale={locale}
      {...callbacks}
    />
  )
}
