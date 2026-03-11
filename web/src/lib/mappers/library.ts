/**
 * Library section mapper.
 *
 * Combines Sanity catalog (series, sermons, topics) with
 * Firebase user overlays (saved, downloads, listening queue)
 * to produce the LibraryData prop payload.
 *
 * Until backends are connected, import sample data directly.
 */

import type { LibraryData } from '@/product/sections/library/types'

export async function getLibraryData(): Promise<LibraryData> {
  const raw = (await import('@/product/sections/library/sample-data.json')).default as Record<string, unknown>
  const { _meta, ...data } = raw
  return data as unknown as LibraryData
}
