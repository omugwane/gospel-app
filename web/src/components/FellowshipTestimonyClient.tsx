'use client'

import type { FellowshipProps } from '@/product/sections/fellowship/types'
import { TestimonyWall } from '@/product/sections/fellowship/components'
import { useFellowshipCallbacks } from '@/lib/fellowship-callbacks'

type FellowshipData = Pick<
  FellowshipProps,
  'fellowshipPresence' | 'testimonies' | 'prayerPoints' | 'counselingRequests' | 'availablePrayerTags' | 'myPrayerCommitments'
>

export default function FellowshipTestimonyClient({ data }: { data: FellowshipData }) {
  const callbacks = useFellowshipCallbacks()

  return (
    <TestimonyWall
      {...data}
      onBack={callbacks.onBack}
      onCreateTestimony={callbacks.onCreateTestimony}
      onReactToTestimony={callbacks.onReactToTestimony}
    />
  )
}
