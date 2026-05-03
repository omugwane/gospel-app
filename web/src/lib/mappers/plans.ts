/**
 * Plans section mapper.
 *
 * Combines Sanity plan definitions with Firebase user progress
 * to produce the PlansData prop payload.
 */

import { sanityClient } from '@/lib/sanity/client'
import {
  allPlansQuery,
  allPlanDaysQuery,
  allPlanCategoriesQuery,
} from '@/lib/sanity/queries'
import type {
  PlansData,
  Plan,
  PlanDay,
  DayContent,
  Category,
  UserProgress,
} from '@/product/sections/plans/types'
import type { PlanType, DayContentType } from '@/product/sections/plans/types'

const DEFAULT_USER_PROGRESS: UserProgress = {
  myPlanIds: [],
  savedPlanIds: [],
  completedPlanIds: [],
  planProgress: {},
}

function mapCategory(doc: Record<string, unknown>): Category {
  return {
    id: (doc._id as string) ?? '',
    label: (doc.label as string) ?? '',
  }
}

function mapDayContent(item: Record<string, unknown>, index: number): DayContent {
  const id = (item._key as string) ?? `dc-${index}`
  const type = ((item.type as string) ?? 'written') as DayContentType
  const title = (item.title as string) ?? ''
  const textPreview = item.textPreview as string | undefined
  const refs = item.refs as string | undefined
  const durationSeconds = item.durationSeconds as number | undefined
  const url = item.url as string | undefined
  return {
    id,
    type,
    title,
    ...(textPreview && { textPreview }),
    ...(refs && { refs }),
    ...(durationSeconds != null && { durationSeconds }),
    ...(url && { url }),
  }
}

function mapPlanDay(doc: Record<string, unknown>): PlanDay {
  const dayNumber = (doc.dayNumber as number) ?? 1
  const contentRaw = (doc.content as Record<string, unknown>[]) ?? []
  const content = contentRaw.map((c, i) => mapDayContent(c, i))
  return { dayNumber, content }
}

function mapPlan(doc: Record<string, unknown>): Plan {
  const id = (doc._id as string) ?? ''
  const title = (doc.title as string) ?? ''
  const description = (doc.description as string) ?? ''
  const durationDays = (doc.durationDays as number) ?? 0
  const type = ((doc.type as string) ?? 'devotional') as PlanType
  const thumbnailUrl = doc.thumbnailUrl as string | undefined
  const categoryRefs = (doc.categories as { _ref: string }[]) ?? []
  const categoryIds = categoryRefs.map((c) => c._ref).filter(Boolean)
  const author = doc.author as string | undefined
  const hasAudio = (doc.hasAudio as boolean) ?? false
  const hasVideo = (doc.hasVideo as boolean) ?? false
  const hasPassages = (doc.hasPassages as boolean) ?? true
  const hasWritten = (doc.hasWritten as boolean) ?? true

  return {
    id,
    title,
    description,
    durationDays,
    type,
    ...(thumbnailUrl && { thumbnailUrl }),
    categoryIds,
    ...(author && { author }),
    hasAudio,
    hasVideo,
    hasPassages,
    hasWritten,
  }
}

export async function getPlansData(): Promise<PlansData> {
  const [planDocs, planDayDocs, categoryDocs] = await Promise.all([
    sanityClient.fetch(allPlansQuery),
    sanityClient.fetch(allPlanDaysQuery),
    sanityClient.fetch(allPlanCategoriesQuery),
  ])

  const planList = Array.isArray(planDocs) ? planDocs : []
  const planDayList = Array.isArray(planDayDocs) ? planDayDocs : []
  const categoryList = Array.isArray(categoryDocs) ? categoryDocs : []

  const categories = categoryList.map((c) =>
    mapCategory(c as Record<string, unknown>)
  )

  const plans = planList.map((p) => mapPlan(p as Record<string, unknown>))

  const planDaysByPlanId: Record<string, PlanDay[]> = {}
  for (const pd of planDayList) {
    const doc = pd as Record<string, unknown>
    const planId = doc.planId as string
    if (!planId) continue
    const planDay = mapPlanDay(doc)
    if (!planDaysByPlanId[planId]) {
      planDaysByPlanId[planId] = []
    }
    planDaysByPlanId[planId].push(planDay)
  }

  return {
    activeFilter: 'find',
    categories,
    plans,
    planDays: planDaysByPlanId,
    userProgress: DEFAULT_USER_PROGRESS,
  }
}
