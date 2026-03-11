'use client'

import type { LanguageCode, PlansData } from '@/product/sections/plans/types'
import { PlanMissedDays } from '@/product/sections/plans/components'
import { usePlansCallbacks } from '@/lib/plans-callbacks'

export default function PlanMissedDaysClient({
  data,
  planId,
  startDateIso,
  locale,
}: {
  data: PlansData
  planId: string
  startDateIso?: string
  locale: LanguageCode
}) {
  const callbacks = usePlansCallbacks(data)

  return (
    <PlanMissedDays
      data={data}
      planId={planId}
      startDateIso={startDateIso}
      locale={locale}
      onBack={() => callbacks.onBackToDay(planId)}
      onOpenDay={callbacks.onOpenDay}
    />
  )
}
