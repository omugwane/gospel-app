'use client'

import type { LanguageCode, PlansData } from '@/product/sections/plans/types'
import { PlanDayView } from '@/product/sections/plans/components'
import { usePlansCallbacks } from '@/lib/plans-callbacks'

export default function PlanDayViewClient({
  data,
  planId,
  initialDay,
  locale,
}: {
  data: PlansData
  planId: string
  initialDay?: number
  locale: LanguageCode
}) {
  const callbacks = usePlansCallbacks(data)

  return (
    <PlanDayView
      data={data}
      planId={planId}
      initialDayNumber={initialDay}
      onBack={() => callbacks.onBackToPlan(planId)}
      onOpenContent={callbacks.onOpenContent}
      onMarkContentComplete={callbacks.onMarkContentComplete}
      onStartPlan={callbacks.onStartPlan}
      onOpenMissedDays={callbacks.onOpenMissedDays}
    />
  )
}
