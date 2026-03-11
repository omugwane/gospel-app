'use client'

import type { DayContent, LanguageCode, Plan } from '@/product/sections/plans/types'
import { PlanContentReader } from '@/product/sections/plans/components'
import { usePlansCallbacks } from '@/lib/plans-callbacks'
import type { PlansData } from '@/product/sections/plans/types'

export default function PlanContentReaderClient({
  data,
  plan,
  dayNumber,
  content,
  locale,
}: {
  data: PlansData
  plan: Plan
  dayNumber: number
  content: DayContent
  locale: LanguageCode
}) {
  const callbacks = usePlansCallbacks(data)
  const progress = data.userProgress.planProgress[plan.id]
  const completedContentIds = new Set(progress?.completedContentIds || [])
  const isCompleted = completedContentIds.has(content.id)

  const goBack = () => callbacks.onBackToDay(plan.id, dayNumber)

  return (
    <PlanContentReader
      plan={plan}
      dayNumber={dayNumber}
      content={content}
      isCompleted={isCompleted}
      onBack={goBack}
      onClose={goBack}
      onToggleComplete={callbacks.onMarkContentComplete}
    />
  )
}
