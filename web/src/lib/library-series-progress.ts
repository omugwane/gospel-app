import type { Sermon } from '@/product/sections/library/types'

export interface SeriesProgress {
  totalCount: number
  completedCount: number
  /** 0–100 when totalCount > 0; otherwise 0 */
  percent: number
  isComplete: boolean
}

/**
 * Progress for a series is derived only from sermons present in {@link sermons}
 * (typically the Sanity-backed catalog merged for the viewer), so denominators match
 * what can be marked complete in the UI.
 */
export function computeSeriesProgress(
  seriesId: string,
  sermons: Sermon[],
  completedSermonIds: readonly string[]
): SeriesProgress {
  const inSeries = sermons.filter((s) => s.seriesId === seriesId)
  const totalCount = inSeries.length
  const completedSet = new Set(completedSermonIds)
  const completedCount = inSeries.reduce((acc, s) => acc + (completedSet.has(s.id) ? 1 : 0), 0)
  const isComplete = totalCount > 0 && completedCount === totalCount
  const percent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100)

  return { totalCount, completedCount, percent, isComplete }
}

/**
 * Progress map keyed by {@link Series.id} for efficient lookups in grids.
 */
export function buildSeriesProgressMap(
  sermons: Sermon[],
  completedSermonIds: readonly string[]
): Map<string, SeriesProgress> {
  const bySeries = new Map<string, Sermon[]>()
  for (const s of sermons) {
    if (!s.seriesId) continue
    const list = bySeries.get(s.seriesId)
    if (list) list.push(s)
    else bySeries.set(s.seriesId, [s])
  }

  const completedSet = new Set(completedSermonIds)
  const out = new Map<string, SeriesProgress>()

  for (const [seriesId, list] of bySeries) {
    const totalCount = list.length
    const completedCount = list.reduce((acc, s) => acc + (completedSet.has(s.id) ? 1 : 0), 0)
    const isComplete = totalCount > 0 && completedCount === totalCount
    const percent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100)
    out.set(seriesId, { totalCount, completedCount, percent, isComplete })
  }

  return out
}
