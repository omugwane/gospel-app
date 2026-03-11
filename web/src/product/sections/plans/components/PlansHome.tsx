'use client'

import { useMemo, useState } from 'react'
import { Search, LayoutList, Bookmark, CheckCircle2, Compass } from 'lucide-react'
import { cn } from '@/lib/utils'
import type {
  Plan,
  PlanFilter,
  PlansProps,
} from '@/product/sections/plans/types'
import { DEFAULT_PLANS_TRANSLATIONS as DEFAULT_TRANSLATIONS } from '@/product/sections/plans/types'
import { PlanCard } from './PlanCard'

export function PlansHome({
  data,
  translations: translationsProp,
  onFilterChange,
  onOpenPlan,
  onStartPlan,
  onSavePlan,
  onSearch,
}: PlansProps) {
  const t = useMemo(
    () => ({ ...DEFAULT_TRANSLATIONS, ...translationsProp }),
    [translationsProp]
  )
  const FILTERS: { id: PlanFilter; label: string; icon: React.ElementType }[] = [
    { id: 'my', label: t.myPlans || 'My Plans', icon: LayoutList },
    { id: 'find', label: t.findPlans || 'Find Plans', icon: Compass },
    { id: 'saved', label: t.savedPlans || 'Saved', icon: Bookmark },
    { id: 'completed', label: t.completedPlans || 'Completed', icon: CheckCircle2 },
  ]

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const activeFilter = data.activeFilter

  const myPlanIds = useMemo(() => new Set(data.userProgress.myPlanIds), [data.userProgress.myPlanIds])
  const savedPlanIds = useMemo(() => new Set(data.userProgress.savedPlanIds), [data.userProgress.savedPlanIds])
  const completedPlanIds = useMemo(() => new Set(data.userProgress.completedPlanIds), [data.userProgress.completedPlanIds])
  const planProgress = data.userProgress.planProgress

  const filteredPlans = useMemo(() => {
    let plans: Plan[] = []

    switch (activeFilter) {
      case 'my':
        plans = data.plans.filter((p) => myPlanIds.has(p.id))
        break
      case 'find':
        plans = [...data.plans]
        break
      case 'saved':
        plans = data.plans.filter((p) => savedPlanIds.has(p.id))
        break
      case 'completed':
        plans = data.plans.filter((p) => completedPlanIds.has(p.id))
        break
      default:
        plans = data.plans
    }

    if (activeFilter === 'find') {
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase()
        plans = plans.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.author?.toLowerCase().includes(q)
        )
      }
      if (selectedCategoryId) {
        plans = plans.filter((p) => p.categoryIds.includes(selectedCategoryId))
      }
    }

    return plans
  }, [
    activeFilter,
    data.plans,
    myPlanIds,
    savedPlanIds,
    completedPlanIds,
    searchQuery,
    selectedCategoryId,
  ])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    onSearch?.(query)
  }

  const handleFilterChange = (filter: PlanFilter) => {
    setSelectedCategoryId(null)
    onFilterChange?.(filter)
  }

  return (
    <div className="w-full min-h-screen">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">
            {t.plansTitle || 'Plans'}
          </h1>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            {t.plansSubtitle || 'Daily plans with video, audio, and scripture. Start one, save for later, or discover something new.'}
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {FILTERS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => handleFilterChange(id)}
              className={cn(
                'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200',
                activeFilter === id
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20 dark:shadow-primary-400/10'
                  : 'bg-white/70 dark:bg-neutral-950/50 border border-neutral-200/80 dark:border-neutral-800/80 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700'
              )}
            >
              <Icon className="h-4 w-4" strokeWidth={1.75} />
              {label}
            </button>
          ))}
        </div>

        {/* Search (Find Plans only) */}
        {activeFilter === 'find' && (
          <div className="mb-4">
            <div className="rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/70 dark:bg-neutral-950/50 px-4 py-3 flex items-center gap-3">
              <Search className="h-4 w-4 text-neutral-500 dark:text-neutral-400 shrink-0" strokeWidth={1.75} />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder={t.searchPlansPlaceholder || 'Search plans by title, description, or author...'}
                className="flex-1 min-w-0 bg-transparent outline-none text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400"
              />
            </div>
          </div>
        )}

        {/* Category pills (Find Plans only) */}
        {activeFilter === 'find' && data.categories.length > 0 && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedCategoryId(null)}
              className={cn(
                'rounded-full px-3 py-1.5 text-xs font-semibold transition-colors',
                selectedCategoryId === null
                  ? 'bg-primary-600 text-white'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
              )}
            >
              {t.allCategories || 'All'}
            </button>
            {data.categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategoryId(selectedCategoryId === cat.id ? null : cat.id)}
                className={cn(
                  'rounded-full px-3 py-1.5 text-xs font-semibold transition-colors',
                  selectedCategoryId === cat.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

        {/* Plan list or empty state */}
        {filteredPlans.length === 0 ? (
          <div className="rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/60 dark:bg-neutral-950/40 p-8 sm:p-12 text-center">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
              <LayoutList className="h-7 w-7 text-neutral-500 dark:text-neutral-400" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-semibold text-neutral-950 dark:text-neutral-50">
              {activeFilter === 'my' && (t.noActivePlans || 'No active plans')}
              {activeFilter === 'find' && (searchQuery.trim() || selectedCategoryId ? (t.noPlansMatch || 'No plans match') : (t.noPlansYet || 'No plans yet'))}
              {activeFilter === 'saved' && (t.noSavedPlans || 'No saved plans')}
              {activeFilter === 'completed' && (t.noCompletedPlans || 'No completed plans')}
            </h3>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 max-w-sm mx-auto">
              {activeFilter === 'my' && (t.startFromFindPlansHint || 'Start a plan from Find Plans to see it here.')}
              {activeFilter === 'find' && (searchQuery.trim() || selectedCategoryId ? (t.tryDifferentSearchHint || 'Try a different search or category.') : (t.plansWillAppearHint || 'Plans will appear here when available.'))}
              {activeFilter === 'saved' && (t.savePlansHint || 'Save plans from Find Plans to access them later.')}
              {activeFilter === 'completed' && (t.completedPlansHint || 'Completed plans will appear here.')}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {filteredPlans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                progress={planProgress[plan.id]}
                isSaved={savedPlanIds.has(plan.id)}
                isCompleted={completedPlanIds.has(plan.id)}
                t={t}
                onOpen={() => onOpenPlan?.(plan)}
                onStart={() => onStartPlan?.(plan)}
                onSave={() => onSavePlan?.(plan)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
