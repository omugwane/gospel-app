'use client'

import { useRouter } from 'next/navigation'
import type { DayContent, Plan, PlansData, PlanFilter } from '@/product/sections/plans/types'

export function usePlansCallbacks(data: PlansData) {
  const router = useRouter()

  return {
    onFilterChange: (filter: PlanFilter) => {
      router.push(`/plans?filter=${filter}`)
    },
    onOpenPlan: (plan: Plan) => {
      router.push(`/plans/${plan.id}`)
    },
    onStartPlan: (plan: Plan) => {
      router.push(`/plans/${plan.id}/day`)
    },
    onSavePlan: (plan: Plan) => {
      console.log('Save plan:', plan.id)
    },
    onSamplePlan: (plan: Plan) => {
      const days = data.planDays[plan.id]
      const firstDay = days?.[0]
      const firstContent = firstDay?.content?.[0]
      if (firstContent) {
        router.push(`/plans/${plan.id}/day/${firstDay.dayNumber}/content/${firstContent.id}`)
      } else {
        router.push(`/plans/${plan.id}`)
      }
    },
    onOpenContent: (content: DayContent, plan: Plan, dayNumber: number) => {
      router.push(`/plans/${plan.id}/day/${dayNumber}/content/${content.id}`)
    },
    onMarkContentComplete: (contentId: string, planId: string, dayNumber: number) => {
      console.log('Mark content complete:', contentId, planId, dayNumber)
    },
    onMarkDayComplete: (planId: string, dayNumber: number) => {
      console.log('Mark day complete:', planId, dayNumber)
    },
    onPlanComplete: (plan: Plan) => {
      router.push(`/plans/${plan.id}/complete`)
    },
    onRatePlan: (planId: string, rating: number) => {
      console.log('Rate plan:', planId, rating)
    },
    onSearch: (query: string) => {
      console.log('Search plans:', query)
    },
    onBack: () => router.push('/plans'),
    onBackToPlan: (planId: string) => router.push(`/plans/${planId}`),
    onBackToDay: (planId: string, dayNumber?: number) => {
      const base = `/plans/${planId}/day`
      router.push(dayNumber ? `${base}?day=${dayNumber}` : base)
    },
    onOpenMissedDays: (planId: string) => {
      router.push(`/plans/${planId}/missed`)
    },
    onOpenDay: (planId: string, dayNumber: number) => {
      router.push(`/plans/${planId}/day?day=${dayNumber}`)
    },
  }
}
