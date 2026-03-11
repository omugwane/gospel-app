'use client'

import type { FellowshipProps } from '@/product/sections/fellowship/types'
import { FellowshipHub } from '@/product/sections/fellowship/components'
import { useFellowshipCallbacks } from '@/lib/fellowship-callbacks'

type FellowshipData = Pick<
  FellowshipProps,
  'fellowshipPresence' | 'testimonies' | 'prayerPoints' | 'counselingRequests' | 'availablePrayerTags' | 'myPrayerCommitments'
>

export default function FellowshipClient({ data }: { data: FellowshipData }) {
  const callbacks = useFellowshipCallbacks()

  return (
    <FellowshipHub
      {...data}
      {...callbacks}
    />
  )
}
