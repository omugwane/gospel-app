/**
 * Home section mapper.
 *
 * Combines Sanity content (daily verse, imbuguro, series)
 * with Firebase user state (viewer, active journey, fellowship
 * highlights) to produce the HomeData prop payload.
 *
 * Until backends are connected, import sample data directly:
 *
 *   import sampleData from '@/product/sections/home/sample-data.json'
 */

import type { HomeData } from '@/product/sections/home/types'

export async function getHomeData(): Promise<HomeData> {
  // TODO: fetch from Sanity + Firebase and merge
  const raw = (await import('@/product/sections/home/sample-data.json')).default as Record<string, unknown>
  const { _meta, ...data } = raw
  return data as unknown as HomeData
}
