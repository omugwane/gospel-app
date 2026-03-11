'use client'

import { BookOpen, ChevronLeft, Headphones, Video, FileText, Play, Bookmark, Sparkles, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Plan, PlansTranslations } from '@/product/sections/plans/types'
import { DEFAULT_PLANS_TRANSLATIONS } from '@/product/sections/plans/types'

interface PlanDetailProps {
  plan: Plan
  relatedPlans?: Plan[]
  translations?: Partial<PlansTranslations>
  onBack?: () => void
  onOpenPlan?: (plan: Plan) => void
  onStartPlan?: (plan: Plan) => void
  onSavePlan?: (plan: Plan) => void
  onSamplePlan?: (plan: Plan) => void
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

function Indicator({
  label,
  active,
  icon,
}: {
  label: string
  active: boolean
  icon: React.ReactNode
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold',
        active
          ? 'bg-primary-600/10 text-primary-900 dark:bg-primary-400/15 dark:text-primary-100'
          : 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400'
      )}
    >
      {icon}
      {label}
    </span>
  )
}

export function PlanDetail({
  plan,
  relatedPlans = [],
  translations: translationsProp,
  onBack,
  onOpenPlan,
  onStartPlan,
  onSavePlan,
  onSamplePlan,
}: PlanDetailProps) {
  const t = { ...DEFAULT_PLANS_TRANSLATIONS, ...translationsProp }

  return (
    <div className="w-full min-h-screen">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6 sm:py-8">
        {onBack && (
          <div className="mb-4">
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
        <div className="overflow-hidden rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-950/60">
          <div className="relative aspect-[16/8] sm:aspect-[16/7] overflow-hidden bg-gradient-to-br from-primary-100 via-neutral-100 to-secondary-50 dark:from-primary-950/40 dark:via-neutral-900 dark:to-secondary-950/30">
            {plan.thumbnailUrl ? (
              <img
                src={plan.thumbnailUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <BookOpen className="h-14 w-14 text-neutral-300 dark:text-neutral-600" strokeWidth={1.25} />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-primary-600/90 px-3 py-1 text-xs font-semibold text-white">
                  {planTypeLabel(plan.type, t)}
                </span>
                <span className="rounded-full bg-white/80 dark:bg-neutral-900/80 px-3 py-1 text-xs font-semibold text-neutral-700 dark:text-neutral-200">
                  {plan.durationDays} {plan.durationDays === 1 ? (t.day || 'Day') : (t.days || 'Days')}
                </span>
                {plan.author ? (
                  <span className="rounded-full bg-white/80 dark:bg-neutral-900/80 px-3 py-1 text-xs font-semibold text-neutral-700 dark:text-neutral-200">
                    {plan.author}
                  </span>
                ) : null}
              </div>
              <h1 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight text-white">
                {plan.title}
              </h1>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <Indicator
                label={t.audio || 'Audio'}
                active={plan.hasAudio}
                icon={<Headphones className="h-3.5 w-3.5" strokeWidth={1.75} />}
              />
              <Indicator
                label={t.video || 'Video'}
                active={plan.hasVideo}
                icon={<Video className="h-3.5 w-3.5" strokeWidth={1.75} />}
              />
              <Indicator
                label={t.written || 'Written'}
                active={plan.hasWritten}
                icon={<FileText className="h-3.5 w-3.5" strokeWidth={1.75} />}
              />
              <Indicator
                label={t.passage || 'Passage'}
                active={plan.hasPassages}
                icon={<BookOpen className="h-3.5 w-3.5" strokeWidth={1.75} />}
              />
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => onStartPlan?.(plan)}
                className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 transition-colors"
              >
                <Play className="h-4 w-4" strokeWidth={1.75} />
                {t.startPlan || 'Start Plan'}
              </button>
              <button
                type="button"
                onClick={() => onSavePlan?.(plan)}
                className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white/70 dark:bg-neutral-950/50 px-4 py-2 text-sm font-semibold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
              >
                <Bookmark className="h-4 w-4" strokeWidth={1.75} />
                {t.saveForLater || 'Save for Later'}
              </button>
              <button
                type="button"
                onClick={() => onSamplePlan?.(plan)}
                className="inline-flex items-center gap-2 rounded-xl border border-secondary-200 dark:border-secondary-500/40 bg-secondary-50 dark:bg-secondary-500/10 px-4 py-2 text-sm font-semibold text-secondary-900 dark:text-secondary-100 hover:bg-secondary-100 dark:hover:bg-secondary-500/15 transition-colors"
              >
                <Sparkles className="h-4 w-4" strokeWidth={1.75} />
                {t.sample || 'Sample'}
              </button>
            </div>

            <div className="mt-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/70 dark:bg-neutral-900/40 p-4 sm:p-5">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                {t.description || 'Description'}
              </h2>
              <p className="mt-2 text-sm sm:text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
                {plan.description}
              </p>
            </div>
          </div>
        </div>

        {relatedPlans.length > 0 ? (
          <section className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-neutral-950 dark:text-neutral-50">
                {t.featuredPlans || 'Featured Plans'}
              </h2>
              <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                {t.related || 'Related'}
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPlans.map((related) => (
                <button
                  key={related.id}
                  type="button"
                  onClick={() => onOpenPlan?.(related)}
                  className="group overflow-hidden rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-950/60 text-left hover:border-primary-300/70 dark:hover:border-primary-500/40 hover:bg-white/95 dark:hover:bg-neutral-950/80 transition-colors"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                    {related.thumbnailUrl ? (
                      <img
                        src={related.thumbnailUrl}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    ) : null}
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-2">
                      {related.title}
                    </h3>
                    <div className="mt-1 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                      <span>{related.durationDays} {t.days?.toLowerCase() || 'days'}</span>
                      <span className="inline-flex items-center gap-1">
                        {t.open || 'Open'}
                        <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
                      </span>
                    </div>
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
