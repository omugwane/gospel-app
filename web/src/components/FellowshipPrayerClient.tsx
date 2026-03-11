'use client'

import type { FellowshipProps } from '@/product/sections/fellowship/types'
import { InteractivePrayer } from '@/product/sections/fellowship/components'
import { useFellowshipCallbacks } from '@/lib/fellowship-callbacks'

type FellowshipData = Pick<
  FellowshipProps,
  'fellowshipPresence' | 'testimonies' | 'prayerPoints' | 'counselingRequests' | 'availablePrayerTags' | 'myPrayerCommitments'
>

export default function FellowshipPrayerClient({ data }: { data: FellowshipData }) {
  const callbacks = useFellowshipCallbacks()

  return (
    <InteractivePrayer
      {...data}
      onBack={callbacks.onBack}
      onCommitPrayer={callbacks.onCommitPrayer}
      onSubmitPrayerPoint={callbacks.onSubmitPrayerPoint}
    />
  )
}
