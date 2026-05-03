'use client'

import { useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import type { LibraryData } from '@/product/sections/library/types'
import { SermonDetail } from '@/product/sections/library/components'
import { useLibraryCallbacks } from '@/lib/library-callbacks'
import { useMergedLibraryData } from '@/lib/library-overlay'

export default function LibrarySermonClient({
  data,
  sermonId,
  autoplayAudioOnMount = false,
}: {
  data: LibraryData
  sermonId: string
  autoplayAudioOnMount?: boolean
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { data: mergedData, locale } = useMergedLibraryData(data)
  const callbacks = useLibraryCallbacks(mergedData)

  const onAutoplayIntentConsumed = useCallback(() => {
    router.replace(pathname)
  }, [router, pathname])

  return (
    <SermonDetail
      {...callbacks}
      data={mergedData}
      sermonId={sermonId}
      locale={locale}
      autoplayAudioOnMount={autoplayAudioOnMount}
      onAutoplayIntentConsumed={autoplayAudioOnMount ? onAutoplayIntentConsumed : undefined}
    />
  )
}
