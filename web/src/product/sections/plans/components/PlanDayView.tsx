'use client'

import { useMemo, useState } from 'react'
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  Circle,
  FileText,
  Headphones,
  Play,
  Video,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { DayContent, Plan, PlansData, PlansTranslations } from '@/product/sections/plans/types'
import { DEFAULT_PLANS_TRANSLATIONS } from '@/product/sections/plans/types'

interface PlanDayViewProps {
  data: PlansData
  planId?: string
  /** Initial day to select when opening from URL (e.g. missed days) */
  initialDayNumber?: number
  translations?: Partial<PlansTranslations>
  onBack?: () => void
  onOpenContent?: (content: DayContent, plan: Plan, dayNumber: number) => void
  onMarkContentComplete?: (contentId: string, planId: string, dayNumber: number) => void
  onStartPlan?: (plan: Plan) => void
  onOpenMissedDays?: (planId: string) => void
}

function contentTypeLabel(content: DayContent): string {
  if (content.type === 'passage') return content.refs || 'Passage'
  if (content.type === 'written') return 'Devotional'
  if (content.type === 'video') return 'Video'
  if (content.type === 'audio') return 'Audio'
  return content.type
}

function contentTypeLabelWithTranslations(content: DayContent, t: PlansTranslations): string {
  if (content.type === 'passage') return content.refs || t.passage || 'Passage'
  if (content.type === 'written') return t.devotional || 'Devotional'
  if (content.type === 'video') return t.video || 'Video'
  if (content.type === 'audio') return t.audio || 'Audio'
  return contentTypeLabel(content)
}

function typeIcon(type: DayContent['type']) {
  if (type === 'passage') return BookOpen
  if (type === 'written') return FileText
  if (type === 'video') return Video
  return Headphones
}

export function PlanDayView({
  data,
  planId,
  initialDayNumber,
  translations: translationsProp,
  onBack,
  onOpenContent,
  onMarkContentComplete,
  onStartPlan,
  onOpenMissedDays,
}: PlanDayViewProps) {
  const t = useMemo(
    () => ({ ...DEFAULT_PLANS_TRANSLATIONS, ...translationsProp }),
    [translationsProp]
  )

  const plan = useMemo(() => {
    const byId = planId ? data.plans.find((p) => p.id === planId) : null
    if (byId) return byId
    const preferredId = data.userProgress.myPlanIds[0] || Object.keys(data.planDays)[0]
    return data.plans.find((p) => p.id === preferredId) || data.plans[0]
  }, [data, planId])

  const planDays = plan ? (data.planDays[plan.id] || []) : []
  const progress = plan ? data.userProgress.planProgress[plan.id] : null
  const completedDayIds = new Set(progress?.completedDayIds || [])
  const completedContentIds = new Set(progress?.completedContentIds || [])
  const currentDayNumber = progress?.currentDayNumber ?? planDays[0]?.dayNumber ?? 1
  const [selectedDayNumber, setSelectedDayNumber] = useState(initialDayNumber ?? currentDayNumber)
  const selectedDay =
    planDays.find((day) => day.dayNumber === selectedDayNumber) || planDays[0] || null

  const missedDays = planDays.filter(
    (day) => day.dayNumber < currentDayNumber && !completedDayIds.has(day.dayNumber)
  )

  if (!plan) return null

  return (
    <div className="w-full min-h-screen">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6 sm:py-8">
        <div className="rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-950/60 p-4 sm:p-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              {onBack && (
                <div className="mb-3">
                  <button
                    type="button"
                    onClick={onBack}
                    className="inline-flex items-center gap-1 rounded-full border border-neutral-200/80 dark:border-neutral-800/80 bg-white/70 dark:bg-neutral-950/50 px-3 py-1.5 text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
                    {t.back || 'Back'}
                  </button>
                </div>
              )}
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">
                {plan.title}
              </h1>
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                {t.dayByDaySubtitle || 'Day-by-day content with completion tracking'}
              </p>
            </div>
            {missedDays.length > 0 ? (
              <button
                type="button"
                onClick={() => onOpenMissedDays?.(plan.id)}
                className="inline-flex items-center gap-2 rounded-xl border border-secondary-300/70 dark:border-secondary-500/40 bg-secondary-50 dark:bg-secondary-500/10 px-3 py-2 text-xs font-semibold text-secondary-900 dark:text-secondary-100 hover:bg-secondary-100 dark:hover:bg-secondary-500/15 transition-colors"
              >
                <AlertCircle className="h-4 w-4" strokeWidth={1.75} />
                {t.missedDays || 'Missed Days'} ({missedDays.length})
              </button>
            ) : null}
          </div>

          <div className="mt-5 -mx-1 overflow-x-auto">
            <div className="flex w-max min-w-full gap-2 px-1 pb-1">
              {planDays.map((day) => {
                const isCompleted = completedDayIds.has(day.dayNumber)
                const isSelected = day.dayNumber === (selectedDay?.dayNumber || 0)
                return (
                  <button
                    key={day.dayNumber}
                    type="button"
                    onClick={() => setSelectedDayNumber(day.dayNumber)}
                    className={cn(
                      'min-w-[110px] rounded-2xl border px-3 py-2 text-left transition-colors',
                      isSelected
                        ? 'border-primary-400/80 bg-primary-50 dark:border-primary-500/60 dark:bg-primary-500/10'
                        : 'border-neutral-200/80 dark:border-neutral-800/80 bg-white/60 dark:bg-neutral-950/40 hover:bg-neutral-50 dark:hover:bg-neutral-900'
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                        {t.day || 'Day'} {day.dayNumber}
                      </span>
                      {isCompleted ? (
                        <CheckCircle2 className="h-4 w-4 text-primary-600 dark:text-primary-300" strokeWidth={1.75} />
                      ) : (
                        <Circle className="h-4 w-4 text-neutral-400 dark:text-neutral-500" strokeWidth={1.75} />
                      )}
                    </div>
                    <div className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400">
                      {day.content.length} {t.items || 'items'}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {selectedDay ? (
            <>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-lg font-semibold text-neutral-950 dark:text-neutral-50">
                  {t.day || 'Day'} {selectedDay.dayNumber}
                </h2>
                {missedDays.length > 0 ? (
                  <button
                    type="button"
                    onClick={() => onOpenMissedDays?.(plan.id)}
                    className="inline-flex items-center gap-2 rounded-xl border border-secondary-300/70 dark:border-secondary-500/40 bg-secondary-50 dark:bg-secondary-500/10 px-3 py-2 text-xs font-semibold text-secondary-900 dark:text-secondary-100 hover:bg-secondary-100 dark:hover:bg-secondary-500/15 transition-colors"
                  >
                    <AlertCircle className="h-4 w-4" strokeWidth={1.75} />
                    {missedDays.length} {t.missedDays || 'Missed Days'}
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-2 rounded-xl border border-primary-300/70 dark:border-primary-500/40 bg-primary-50 dark:bg-primary-500/10 px-3 py-2 text-xs font-semibold text-primary-800 dark:text-primary-200">
                    <CheckCircle2 className="h-4 w-4" strokeWidth={1.75} />
                    {t.onTrack || 'On track'}
                  </span>
                )}
              </div>

              <div className="mt-3 space-y-2">
                {selectedDay.content.map((item) => {
                  const isDone = completedContentIds.has(item.id)
                  const Icon = typeIcon(item.type)
                  return (
                    <div
                      key={item.id}
                      className="group flex items-stretch gap-2 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/70 dark:bg-neutral-950/40 p-2.5 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          onMarkContentComplete?.(item.id, plan.id, selectedDay.dayNumber)
                        }
                        className="mt-0.5 h-6 w-6 shrink-0 rounded-full flex items-center justify-center text-neutral-400 hover:text-primary-600 dark:text-neutral-500 dark:hover:text-primary-300 transition-colors"
                        aria-label={`Toggle complete for ${item.title}`}
                      >
                        {isDone ? (
                          <CheckCircle2 className="h-5 w-5 text-primary-600 dark:text-primary-300" strokeWidth={1.75} />
                        ) : (
                          <Circle className="h-5 w-5" strokeWidth={1.75} />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => onOpenContent?.(item, plan, selectedDay.dayNumber)}
                        className="min-w-0 flex-1 text-left"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1 rounded-full bg-primary-600/10 dark:bg-primary-500/15 px-2 py-0.5 text-[11px] font-semibold text-primary-900 dark:text-primary-100">
                            <Icon className="h-3 w-3" strokeWidth={1.75} />
                            {contentTypeLabelWithTranslations(item, t)}
                          </span>
                        </div>
                        <p className={cn(
                          'mt-1 text-sm font-medium text-neutral-900 dark:text-neutral-100',
                          isDone && 'line-through text-neutral-500 dark:text-neutral-400'
                        )}>
                          {item.title}
                        </p>
                        {item.textPreview ? (
                          <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2">
                            {item.textPreview}
                          </p>
                        ) : null}
                      </button>
                    </div>
                  )
                })}
              </div>

              <div className="mt-5">
                <button
                  type="button"
                  onClick={() => {
                    const firstItem = selectedDay.content[0]
                    if (firstItem) onOpenContent?.(firstItem, plan, selectedDay.dayNumber)
                    else onStartPlan?.(plan)
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 transition-colors"
                >
                  <Play className="h-4 w-4" strokeWidth={1.75} />
                  {t.startReading || 'Start Reading'}
                </button>
              </div>
            </>
          ) : (
            <div className="mt-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/70 dark:bg-neutral-900/40 p-5 text-sm text-neutral-600 dark:text-neutral-400">
              {t.noDayContent || 'No day content is available for this plan yet.'}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
