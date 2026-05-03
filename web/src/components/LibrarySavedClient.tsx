'use client'

import type { LibraryData } from '@/product/sections/library/types'
import { SavedSermons } from '@/product/sections/library/components'
import { useLibraryCallbacks } from '@/lib/library-callbacks'
import { useMergedLibraryData } from '@/lib/library-overlay'

export default function LibrarySavedClient({ data }: { data: LibraryData }) {
  const { data: mergedData, locale } = useMergedLibraryData(data)
  const callbacks = useLibraryCallbacks(mergedData)

  return <SavedSermons data={mergedData} locale={locale} {...callbacks} />
}
