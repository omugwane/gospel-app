import { useMemo } from 'react'
import { AlertCircle, ArrowRight, CalendarDays } from 'lucide-react'
import type { LanguageCode, Plan, PlansData, PlansTranslations } from '@/../product/sections/plans/types'
import { DEFAULT_PLANS_TRANSLATIONS } from '@/../product/sections/plans/types'

interface PlanMissedDaysProps {
  data: PlansData
  planId?: string
  startDateIso?: string
  locale?: LanguageCode
  translations?: Partial<PlansTranslations>
  onOpenDay?: (planId: string, dayNumber: number) => void
}

function formatDateLabel(startDateIso: string, dayNumber: number, locale?: LanguageCode): string {
  const date = new Date(startDateIso)
  date.setDate(date.getDate() + Math.max(0, dayNumber - 1))
  const localeCode = locale === 'rw' ? 'rw-RW' : locale === 'fr' ? 'fr-FR' : 'en-US'
  return date.toLocaleDateString(localeCode, {
    weekday: 'short',
    month: 'short',
    day: '2-digit',
  })
}

export function PlanMissedDays({
  data,
  planId,
  startDateIso = '2026-01-01',
  locale = 'en',
  translations: translationsProp,
  onOpenDay,
}: PlanMissedDaysProps) {
  const t = { ...DEFAULT_PLANS_TRANSLATIONS, ...translationsProp }

  const plan = useMemo(() => {
    const byId = planId ? data.plans.find((p) => p.id === planId) : null
    if (byId) return byId
    const preferredId = data.userProgress.myPlanIds[0] || Object.keys(data.planDays)[0]
    return data.plans.find((p) => p.id === preferredId) || data.plans[0]
  }, [data, planId])

  if (!plan) return null

  const planDays = data.planDays[plan.id] || []
  const progress = data.userProgress.planProgress[plan.id]
  const completedDayIds = new Set(progress?.completedDayIds || [])
  const currentDayNumber = progress?.currentDayNumber || planDays[0]?.dayNumber || 1

  const missedDays = planDays
    .filter((day) => day.dayNumber < currentDayNumber && !completedDayIds.has(day.dayNumber))
    .map((day) => ({
      ...day,
      dateLabel: formatDateLabel(startDateIso, day.dayNumber, locale),
    }))

  return (
    <div className="w-full min-h-screen">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-6 sm:py-8">
        <div className="rounded-3xl border border-stone-200/80 dark:border-stone-800/80 bg-white/85 dark:bg-stone-950/60 p-4 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-stone-950 dark:text-stone-50">
                {t.missedDaysTitle || 'Missed Days'}
              </h1>
              <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
                {plan.title} - {t.missedDaysSubtitle || 'Pick a missed day to continue where you left off.'}
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/70 dark:border-amber-500/40 bg-amber-50 dark:bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-900 dark:text-amber-100">
              <AlertCircle className="h-3.5 w-3.5" strokeWidth={1.75} />
              {missedDays.length} {t.missedCount || 'missed'}
            </span>
          </div>

          {missedDays.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-stone-200/80 dark:border-stone-800/80 bg-stone-50/70 dark:bg-stone-900/40 p-5 text-sm text-stone-600 dark:text-stone-400">
              {t.caughtUp || "You're all caught up. No missed days right now."}
            </div>
          ) : (
            <div className="mt-5 space-y-2">
              {missedDays.map((day) => (
                <button
                  key={day.dayNumber}
                  type="button"
                  onClick={() => onOpenDay?.(plan.id, day.dayNumber)}
                  className="w-full rounded-2xl border border-stone-200/80 dark:border-stone-800/80 bg-white/70 dark:bg-stone-950/40 px-3 sm:px-4 py-3 text-left hover:bg-stone-50 dark:hover:bg-stone-900 hover:border-violet-300/70 dark:hover:border-violet-500/40 transition-colors"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                        {t.day || 'Day'} {day.dayNumber}
                      </p>
                      <p className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400">
                        <CalendarDays className="h-3.5 w-3.5" strokeWidth={1.75} />
                        {day.dateLabel}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-violet-700 dark:text-violet-300">
                      {t.openDay || 'Open day'}
                      <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
