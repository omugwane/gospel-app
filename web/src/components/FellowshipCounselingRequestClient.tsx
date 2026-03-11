'use client'

import type { CounselingRequest } from '@/product/sections/fellowship/types'
import { CounselingRequestDetail } from '@/product/sections/fellowship/components'
import { useFellowshipCallbacks } from '@/lib/fellowship-callbacks'

export default function FellowshipCounselingRequestClient({
  request,
}: {
  request: CounselingRequest
}) {
  const callbacks = useFellowshipCallbacks()

  return (
    <CounselingRequestDetail
      request={request}
      onBack={callbacks.onBackToCounseling}
    />
  )
}
