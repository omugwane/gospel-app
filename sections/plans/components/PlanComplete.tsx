import { CheckCircle2, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Plan, PlansTranslations } from '@/../product/sections/plans/types'
import { DEFAULT_PLANS_TRANSLATIONS } from '@/../product/sections/plans/types'

interface PlanCompleteProps {
  plan: Plan
  relatedPlans?: Plan[]
  rating?: number
  translations?: Partial<PlansTranslations>
  onRate?: (rating: number) => void
  onOpenPlan?: (plan: Plan) => void
}

function PlanBadge({ plan, t }: { plan: Plan; t: PlansTranslations }) {
  return (
    <span className="inline-flex items-center rounded-full bg-violet-600/10 dark:bg-violet-500/15 px-3 py-1 text-xs font-semibold text-violet-900 dark:text-violet-100">
      {plan.type} - {plan.durationDays} {t.days?.toLowerCase() || 'days'}
    </span>
  )
}

export function PlanComplete({
  plan,
  relatedPlans = [],
  rating = 0,
  translations: translationsProp,
  onRate,
  onOpenPlan,
}: PlanCompleteProps) {
  const t = { ...DEFAULT_PLANS_TRANSLATIONS, ...translationsProp }

  return (
    <div className="w-full min-h-screen">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6 sm:py-8">
        <div className="rounded-3xl border border-stone-200/80 dark:border-stone-800/80 bg-white/85 dark:bg-stone-950/60 p-5 sm:p-8">
          <div className="flex flex-col items-start gap-3">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-500/15">
              <CheckCircle2 className="h-7 w-7 text-amber-700 dark:text-amber-200" strokeWidth={1.75} />
            </span>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-stone-950 dark:text-stone-50">
              {t.planCompletedTitle || 'Plan completed!'}
            </h1>
            <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 max-w-2xl">
              {t.planCompletedMessage || 'Great work finishing this plan. Keep the momentum going with another plan.'} <span className="font-semibold">{plan.title}</span>.
            </p>
            <PlanBadge plan={plan} t={t} />
          </div>

          <div className="mt-6 rounded-2xl border border-stone-200/80 dark:border-stone-800/80 bg-stone-50/70 dark:bg-stone-900/40 p-4 sm:p-5">
            <h2 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
              {t.howWouldYouRate || 'How would you rate this plan?'}
            </h2>
            <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
              {t.optionalFeedback || 'Optional feedback helps recommend better plans.'}
            </p>
            <div className="mt-3 flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => onRate?.(value)}
                  className="rounded-lg p-1.5 hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-colors"
                  aria-label={`Rate ${value} star${value > 1 ? 's' : ''}`}
                >
                  <Star
                    className={cn(
                      'h-6 w-6',
                      value <= rating
                        ? 'fill-amber-400 text-amber-500 dark:fill-amber-300 dark:text-amber-300'
                        : 'text-stone-300 dark:text-stone-600'
                    )}
                    strokeWidth={1.75}
                  />
                </button>
              ))}
              <span className="ml-2 text-xs font-semibold text-stone-500 dark:text-stone-400">
                {rating > 0 ? `${rating}/5` : (t.noRating || 'No rating')}
              </span>
            </div>
          </div>
        </div>

        {relatedPlans.length > 0 ? (
          <section className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-stone-950 dark:text-stone-50">
                {t.featuredPlans || 'Featured Plans'}
              </h2>
              <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                {t.related || 'Related'}
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPlans.map((related) => (
                <button
                  key={related.id}
                  type="button"
                  onClick={() => onOpenPlan?.(related)}
                  className="group overflow-hidden rounded-2xl border border-stone-200/80 dark:border-stone-800/80 bg-white/85 dark:bg-stone-950/60 text-left hover:border-violet-300/70 dark:hover:border-violet-500/40 hover:bg-white/95 dark:hover:bg-stone-950/80 transition-colors"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-stone-100 dark:bg-stone-800">
                    {related.thumbnailUrl ? (
                      <img
                        src={related.thumbnailUrl}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    ) : null}
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100 line-clamp-2">
                      {related.title}
                    </h3>
                    <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                      {related.durationDays} {t.days?.toLowerCase() || 'days'}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  )
}
