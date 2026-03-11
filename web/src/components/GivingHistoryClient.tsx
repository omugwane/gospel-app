'use client'

import type { GivingData } from '@/product/sections/giving/types'
import { GivingHistory } from '@/product/sections/giving/components'
import { useGivingCallbacks } from '@/lib/giving-callbacks'

export default function GivingHistoryClient({ data }: { data: GivingData }) {
  const callbacks = useGivingCallbacks()

  return (
    <GivingHistory
      data={data}
      onBack={callbacks.onBack}
      onOpenReceipt={callbacks.onOpenReceipt}
      onChangeHistoryYear={callbacks.onChangeHistoryYear}
    />
  )
}
