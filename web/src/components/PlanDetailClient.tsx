'use client'

import type { LanguageCode, Plan, PlansData } from '@/product/sections/plans/types'
import { PlanDetail } from '@/product/sections/plans/components'
import { usePlansCallbacks } from '@/lib/plans-callbacks'

export default function PlanDetailClient({
  data,
  plan,
  locale,
}: {
  data: PlansData
  plan: Plan
  locale: LanguageCode
}) {
  const callbacks = usePlansCallbacks(data)
  const relatedPlans = data.plans.filter((p) => p.id !== plan.id && p.categoryIds.some((c) => plan.categoryIds.includes(c))).slice(0, 3)

  return (
    <PlanDetail
      plan={plan}
      relatedPlans={relatedPlans}
      onBack={callbacks.onBack}
      onOpenPlan={callbacks.onOpenPlan}
      onStartPlan={callbacks.onStartPlan}
      onSavePlan={callbacks.onSavePlan}
      onSamplePlan={callbacks.onSamplePlan}
    />
  )
}
