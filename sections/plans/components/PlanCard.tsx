import { BookOpen, Play, Bookmark, BookmarkCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Plan, PlanProgress, PlansTranslations } from '@/../product/sections/plans/types'

interface PlanCardProps {
  plan: Plan
  progress?: PlanProgress | null
  isSaved: boolean
  isCompleted: boolean
  t: PlansTranslations
  onOpen?: () => void
  onStart?: () => void
  onSave?: () => void
}

function planTypeLabel(type: Plan['type'], t: PlansTranslations): string {
  switch (type) {
    case 'bible':
      return t.bible || 'Bible'
    case 'devotional':
      return t.devotional || 'Devotional'
    case 'topical':
      return t.topical || 'Topical'
    default:
      return type
  }
}

export function PlanCard({
  plan,
  progress,
  isSaved,
  isCompleted,
  t,
  onOpen,
  onStart,
  onSave,
}: PlanCardProps) {
  const isActive = progress?.status === 'active'

  return (
    <div
      className={cn(
        'group overflow-hidden rounded-2xl border border-stone-200/80 dark:border-stone-800/80',
        'bg-white/80 dark:bg-stone-950/60',
        'hover:bg-white/95 dark:hover:bg-stone-950/80 transition-all duration-200',
        'hover:shadow-lg hover:shadow-violet-500/5 dark:hover:shadow-violet-400/5',
        'hover:border-violet-200/60 dark:hover:border-violet-500/30'
      )}
    >
      <button
        type="button"
        onClick={onOpen}
        className="block w-full text-left"
      >
        {/* Thumbnail - uses downloaded images from /images/plans/ */}
        <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-violet-100 via-stone-100 to-amber-50 dark:from-violet-950/50 dark:via-stone-900 dark:to-amber-950/30">
          {plan.thumbnailUrl ? (
            <img
              src={plan.thumbnailUrl}
              alt=""
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <BookOpen className="h-12 w-12 text-stone-300 dark:text-stone-600" strokeWidth={1.25} />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
            <span className="rounded-full bg-violet-600/90 px-2.5 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm">
              {planTypeLabel(plan.type, t)}
            </span>
            <span className="rounded-full bg-white/80 dark:bg-stone-900/80 px-2.5 py-0.5 text-[11px] font-semibold text-stone-700 dark:text-stone-200 backdrop-blur-sm">
              {plan.durationDays} {plan.durationDays === 1 ? (t.day || 'Day') : (t.days || 'Days')}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-base font-semibold tracking-tight text-stone-950 dark:text-stone-50 line-clamp-2">
            {plan.title}
          </h3>
        </div>
      </button>

      {/* Actions: Start/Save */}
      <div className="flex items-center gap-2 px-4 pb-4">
        {isCompleted ? (
          <button
            type="button"
            onClick={onOpen}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500/15 dark:bg-amber-500/20 px-4 py-2 text-xs font-semibold text-amber-800 dark:text-amber-200 hover:bg-amber-500/25 dark:hover:bg-amber-500/30 transition-colors"
          >
            {t.view || 'View'}
          </button>
        ) : isActive ? (
          <button
            type="button"
            onClick={onStart}
            className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-xs font-semibold text-white hover:bg-violet-700 transition-colors"
          >
            <Play className="h-3.5 w-3.5" strokeWidth={1.75} />
            {t.continue || 'Continue'}
          </button>
        ) : (
          <button
            type="button"
            onClick={onStart}
            className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-xs font-semibold text-white hover:bg-violet-700 transition-colors"
          >
            <Play className="h-3.5 w-3.5" strokeWidth={1.75} />
            {t.start || 'Start'}
          </button>
        )}
        {!isSaved && !isCompleted ? (
          <button
            type="button"
            onClick={onSave}
            className="inline-flex items-center gap-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white/60 dark:bg-stone-950/40 px-4 py-2 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-900 transition-colors"
          >
            <Bookmark className="h-3.5 w-3.5" strokeWidth={1.75} />
            {t.save || 'Save'}
          </button>
        ) : isSaved && !isActive && !isCompleted ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-500/10 px-2 py-1 text-[11px] font-semibold text-amber-800 dark:text-amber-200">
            <BookmarkCheck className="h-3 w-3" strokeWidth={1.75} />
            {t.saved || 'Saved'}
          </span>
        ) : null}
      </div>
    </div>
  )
}
