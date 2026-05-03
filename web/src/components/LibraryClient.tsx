'use client'

import type { LibraryData } from '@/product/sections/library/types'
import { LibraryHome } from '@/product/sections/library/components'
import { useLibraryCallbacks } from '@/lib/library-callbacks'
import { useMergedLibraryData } from '@/lib/library-overlay'

export default function LibraryClient({ data }: { data: LibraryData }) {
  const { data: mergedData, locale } = useMergedLibraryData(data)
  const callbacks = useLibraryCallbacks(mergedData)

  return <LibraryHome data={mergedData} locale={locale} {...callbacks} />
}
