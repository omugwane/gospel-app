/**
 * Plans section mapper.
 *
 * Combines Sanity plan definitions with Firebase user progress
 * (myPlanIds, savedPlanIds, completedPlanIds, planProgress)
 * to produce the PlansData prop payload.
 *
 * Until backends are connected, import sample data directly.
 */

import type { PlansData } from '@/product/sections/plans/types'

export async function getPlansData(): Promise<PlansData> {
  const raw = (await import('@/product/sections/plans/sample-data.json')).default as Record<string, unknown>
  const { _meta, ...data } = raw
  return data as unknown as PlansData
}
