'use client'

import { CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SeriesProgress } from '@/lib/library-series-progress'
import type { LibraryTranslations } from '@/product/sections/library/types'

function formatProgressCount(
  t: LibraryTranslations,
  completed: number,
  total: number
): string {
  const template = t.seriesProgressCount ?? '{{completed}} of {{total}} completed'
  return template.replace('{{completed}}', String(completed)).replace('{{total}}', String(total))
}

export function SeriesProgressStrip({
  progress,
  t,
  className,
  compact,
}: {
  progress: SeriesProgress
  t: LibraryTranslations
  className?: string
  /** Tighter spacing and shorter bar for compact series rows */
  compact?: boolean
}) {
  if (progress.totalCount <= 0) return null

  const label = progress.isComplete
    ? (t.seriesCompletedBadge ?? 'Completed')
    : formatProgressCount(t, progress.completedCount, progress.totalCount)

  const ariaLabel = progress.isComplete
    ? (t.seriesProgressCompleteAria ?? 'Series completed')
    : (t.seriesProgressAria ?? '{{completed}} of {{total}} sermons completed, {{percent}} percent')
        .replace('{{completed}}', String(progress.completedCount))
        .replace('{{total}}', String(progress.totalCount))
        .replace('{{percent}}', String(progress.percent))

  return (
    <div className={cn('w-full', className)} role="group" aria-label={ariaLabel}>
      <div
        className={cn(
          'flex items-center gap-2 text-[11px] font-semibold',
          progress.isComplete
            ? 'text-primary-800 dark:text-primary-200'
            : 'text-neutral-600 dark:text-neutral-400'
        )}
      >
        {progress.isComplete ? (
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" strokeWidth={2} aria-hidden />
        ) : null}
        <span>{label}</span>
        {!progress.isComplete ? (
          <span className="ml-auto tabular-nums text-neutral-500 dark:text-neutral-500">{progress.percent}%</span>
        ) : null}
      </div>
      <div
        className={cn(
          'mt-1.5 w-full overflow-hidden rounded-full bg-neutral-200/80 dark:bg-neutral-800/80',
          compact ? 'h-1' : 'h-1.5'
        )}
        aria-hidden
      >
        <div
          className={cn(
            'h-full rounded-full transition-[width] duration-300 ease-out',
            progress.isComplete
              ? 'bg-primary-600 dark:bg-primary-500'
              : 'bg-primary-500 dark:bg-primary-400'
          )}
          style={{ width: `${progress.percent}%` }}
        />
      </div>
    </div>
  )
}
