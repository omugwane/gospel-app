'use client'

import type { GivingData } from '@/product/sections/giving/types'
import { GivingHubWizard } from '@/product/sections/giving/components'
import { useGivingCallbacks } from '@/lib/giving-callbacks'

export default function GivingClient({ data }: { data: GivingData }) {
  const callbacks = useGivingCallbacks()

  return (
    <GivingHubWizard
      data={data}
      {...callbacks}
    />
  )
}
