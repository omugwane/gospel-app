'use client'

import { ChevronLeft, Lock, ShieldCheck } from 'lucide-react'
import type { CounselingRequest } from '@/product/sections/fellowship/types'
import { cn } from '@/lib/utils'

function formatDateLabel(isoDate: string) {
  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) return isoDate
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const STATUS_STYLES: Record<CounselingRequest['status'], string> = {
  Received:
    'bg-neutral-100 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-100 border-neutral-200 dark:border-neutral-500',
  'In Review':
    'bg-secondary-100 text-secondary-800 dark:bg-secondary-500/20 dark:text-secondary-100 border-secondary-200 dark:border-secondary-400/40',
  Scheduled:
    'bg-primary-100 text-primary-800 dark:bg-primary-500/20 dark:text-primary-100 border-primary-200 dark:border-primary-400/40',
}

export function CounselingRequestDetail({
  request,
  onBack,
}: {
  request: CounselingRequest
  onBack?: () => void
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 via-white to-primary-50/40 dark:from-neutral-950 dark:via-neutral-950 dark:to-neutral-900">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-6 sm:py-8">
        {onBack && (
          <div className="mb-4">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1 rounded-full border border-neutral-200 dark:border-neutral-600 bg-white/70 dark:bg-neutral-800 px-3 py-1.5 text-[11px] font-semibold text-neutral-600 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
            >
              <ChevronLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
              Back
            </button>
          </div>
        )}

        <div className="rounded-3xl border border-neutral-300/70 dark:border-neutral-500/50 bg-white/90 dark:bg-neutral-900 p-5 sm:p-6 shadow-sm">
          <div className="inline-flex items-center gap-2 rounded-full bg-neutral-100 dark:bg-neutral-700 px-3 py-1 text-xs font-semibold text-neutral-700 dark:text-neutral-100 mb-4">
            <Lock className="h-3.5 w-3.5" strokeWidth={1.8} />
            Confidential Request
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                'inline-flex rounded-full border px-3 py-1 text-xs font-semibold',
                STATUS_STYLES[request.status]
              )}
            >
              {request.status}
            </span>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              {formatDateLabel(request.submittedAt)}
            </span>
          </div>

          <h1 className="mt-4 text-xl font-semibold text-neutral-950 dark:text-neutral-50">
            {request.category}
          </h1>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
            Preferred: {request.preferredMethod}
          </p>

          <div className="mt-5 rounded-2xl border border-neutral-200 dark:border-neutral-600 bg-neutral-50/70 dark:bg-neutral-800/70 p-4">
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              Your Request
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-700 dark:text-neutral-200">
              {request.description}
            </p>
          </div>

          <div className="mt-4 rounded-2xl border border-primary-200/70 dark:border-primary-400/40 bg-primary-50/50 dark:bg-primary-500/10 p-4">
            <div className="flex items-start gap-2">
              <ShieldCheck className="h-4 w-4 mt-0.5 text-primary-700 dark:text-primary-200 shrink-0" strokeWidth={1.8} />
              <div>
                <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  Next Step
                </h2>
                <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-200">
                  {request.nextStep}
                </p>
              </div>
            </div>
          </div>

          {request.isConfidential && (
            <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">
              This request is confidential and visible only to authorized ministry counselors.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
