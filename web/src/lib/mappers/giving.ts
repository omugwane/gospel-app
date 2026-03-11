/**
 * Giving section mapper.
 *
 * Combines Sanity editorial (fund definitions, thank-you content)
 * with Firebase donation history and payment state.
 *
 * Until backends are connected, import sample data directly.
 */

import type { GivingData } from '@/product/sections/giving/types'

export async function getGivingData(): Promise<GivingData> {
  const raw = (await import('@/product/sections/giving/sample-data.json')).default as Record<string, unknown>
  const { _meta, ...data } = raw
  return data as unknown as GivingData
}
