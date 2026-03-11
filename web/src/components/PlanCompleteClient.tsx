'use client'

import { useState } from 'react'
import type { LanguageCode, Plan, PlansData } from '@/product/sections/plans/types'
import { PlanComplete } from '@/product/sections/plans/components'
import { usePlansCallbacks } from '@/lib/plans-callbacks'

export default function PlanCompleteClient({
  data,
  plan,
  locale,
}: {
  data: PlansData
  plan: Plan
  locale: LanguageCode
}) {
  const [rating, setRating] = useState(0)
  const callbacks = usePlansCallbacks(data)
  const relatedPlans = data.plans.filter((p) => p.id !== plan.id && p.categoryIds.some((c) => plan.categoryIds.includes(c))).slice(0, 3)

  return (
    <PlanComplete
      plan={plan}
      relatedPlans={relatedPlans}
      rating={rating}
      onBack={callbacks.onBack}
      onRate={(r) => {
        setRating(r)
        callbacks.onRatePlan(plan.id, r)
      }}
      onOpenPlan={callbacks.onOpenPlan}
    />
  )
}
