'use client'

import type { FellowshipProps } from '@/product/sections/fellowship/types'
import { PrivateCounseling } from '@/product/sections/fellowship/components'
import { useFellowshipCallbacks } from '@/lib/fellowship-callbacks'

type FellowshipData = Pick<
  FellowshipProps,
  'fellowshipPresence' | 'testimonies' | 'prayerPoints' | 'counselingRequests' | 'availablePrayerTags' | 'myPrayerCommitments'
>

export default function FellowshipCounselingClient({ data }: { data: FellowshipData }) {
  const callbacks = useFellowshipCallbacks()

  return (
    <PrivateCounseling
      {...data}
      onBack={callbacks.onBack}
      onSubmitCounselingRequest={callbacks.onSubmitCounselingRequest}
      onOpenCounselingRequest={callbacks.onOpenCounselingRequest}
    />
  )
}
