/**
 * Fellowship section mapper.
 *
 * Primarily Firebase-sourced: testimonies, prayer points,
 * prayer commitments, counseling requests, and presence data.
 *
 * Until backends are connected, import sample data directly.
 */

import type { FellowshipProps } from '@/product/sections/fellowship/types'

type FellowshipData = Pick<
  FellowshipProps,
  'fellowshipPresence' | 'testimonies' | 'prayerPoints' | 'counselingRequests' | 'availablePrayerTags' | 'myPrayerCommitments'
>

export async function getFellowshipData(): Promise<FellowshipData> {
  const raw = (await import('@/product/sections/fellowship/sample-data.json')).default as Record<string, unknown>
  const { _meta, ...data } = raw
  return data as unknown as FellowshipData
}
