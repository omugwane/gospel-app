'use client'

import { BookOpen, CheckCircle2, Circle, FileText, Headphones, Play, Video, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { DayContent, Plan, PlansTranslations } from '@/product/sections/plans/types'
import { DEFAULT_PLANS_TRANSLATIONS } from '@/product/sections/plans/types'

interface PlanContentReaderProps {
  plan: Plan
  dayNumber: number
  content: DayContent
  isCompleted?: boolean
  translations?: Partial<PlansTranslations>
  onBack?: () => void
  onClose?: () => void
  onToggleComplete?: (contentId: string, planId: string, dayNumber: number) => void
}

function kindLabel(content: DayContent, t: PlansTranslations): string {
  if (content.type === 'passage') return content.refs || t.passage || 'Passage'
  if (content.type === 'written') return t.devotional || 'Devotional'
  if (content.type === 'video') return t.video || 'Video'
  if (content.type === 'audio') return t.audio || 'Audio'
  return content.type
}

export function PlanContentReader({
  plan,
  dayNumber,
  content,
  isCompleted = false,
  translations: translationsProp,
  onBack,
  onClose,
  onToggleComplete,
}: PlanContentReaderProps) {
  const t = { ...DEFAULT_PLANS_TRANSLATIONS, ...translationsProp }

  return (
    <div className="w-full min-h-screen">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-6 sm:py-8">
        <div className="rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/85 dark:bg-neutral-950/60 overflow-hidden">
          <div className="border-b border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/80 dark:bg-neutral-900/50 px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200/70 dark:hover:bg-neutral-800 transition-colors"
              >
                {t.back || 'Back'}
              </button>

              <div className="min-w-0 text-center">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                  {plan.title} - {t.day || 'Day'} {dayNumber}
                </p>
                <h1 className="mt-0.5 text-sm sm:text-base font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-1">
                  {content.title}
                </h1>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200/70 dark:hover:bg-neutral-800 hover:text-neutral-800 dark:hover:text-neutral-100 transition-colors"
                aria-label={t.close || 'Close'}
              >
                <X className="h-4 w-4" strokeWidth={1.75} />
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-600/10 dark:bg-primary-500/15 px-3 py-1 text-xs font-semibold text-primary-900 dark:text-primary-100">
                {content.type === 'passage' ? (
                  <BookOpen className="h-3.5 w-3.5" strokeWidth={1.75} />
                ) : content.type === 'written' ? (
                  <FileText className="h-3.5 w-3.5" strokeWidth={1.75} />
                ) : content.type === 'video' ? (
                  <Video className="h-3.5 w-3.5" strokeWidth={1.75} />
                ) : (
                  <Headphones className="h-3.5 w-3.5" strokeWidth={1.75} />
                )}
                {kindLabel(content, t)}
              </span>

              <button
                type="button"
                onClick={() => onToggleComplete?.(content.id, plan.id, dayNumber)}
                className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white/70 dark:bg-neutral-950/50 px-3 py-2 text-xs font-semibold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-4 w-4 text-primary-600 dark:text-primary-300" strokeWidth={1.75} />
                ) : (
                  <Circle className="h-4 w-4" strokeWidth={1.75} />
                )}
                {t.markComplete || 'Mark complete'}
              </button>
            </div>

            {content.type === 'passage' ? (
              <div className="rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/70 dark:bg-neutral-900/40 p-4 sm:p-5">
                <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                  {t.scripture || 'Scripture'}
                </h2>
                <p className="mt-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  {content.refs || content.title}
                </p>
                <p className="mt-3 text-sm sm:text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
                  {content.textPreview ||
                    t.scripturePlaceholder ||
                    'Scripture text appears here in the full reading experience. This preview keeps the layout lightweight for low-data usage.'}
                </p>
              </div>
            ) : null}

            {content.type === 'written' ? (
              <div className="rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/70 dark:bg-neutral-900/40 p-4 sm:p-5">
                <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                  {t.devotionalReflection || 'Devotional Reflection'}
                </h2>
                <p className="mt-3 text-sm sm:text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
                  {content.textPreview ||
                    t.reflectionPlaceholder ||
                    'Reflection text appears here. Keep typography calm and readable for longer devotional reading.'}
                </p>
              </div>
            ) : null}

            {content.type === 'video' || content.type === 'audio' ? (
              <div className="rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/70 dark:bg-neutral-900/40 p-4 sm:p-5">
                <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                  {content.type === 'video' ? (t.videoPlayer || 'Video Player') : (t.audioPlayer || 'Audio Player')}
                </h2>
                <div className="mt-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-950/40 p-4">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className={cn(
                        'inline-flex h-11 w-11 items-center justify-center rounded-full text-white',
                        content.type === 'video' ? 'bg-secondary-500 hover:bg-secondary-600' : 'bg-primary-600 hover:bg-primary-700'
                      )}
                    >
                      <Play className="h-4 w-4 ml-0.5" strokeWidth={1.75} />
                    </button>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-1">
                        {content.title}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {content.url || t.mediaSource || 'Media source'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
