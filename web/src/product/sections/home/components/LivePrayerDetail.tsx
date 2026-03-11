'use client'

import { ArrowLeft, BellRing, Radio, Timer } from 'lucide-react'
import type { HomeProps } from '@/product/sections/home/types'

type LivePrayerDetailProps = Pick<
  HomeProps,
  'data' | 'onOpenLiveNow' | 'onOpenUpcomingPrayer' | 'onOpenDetailView'
>

function formatTime(dateIso: string) {
  const date = new Date(dateIso)
  if (Number.isNaN(date.getTime())) return dateIso
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

export function LivePrayerDetail({
  data,
  onOpenLiveNow,
  onOpenUpcomingPrayer,
  onOpenDetailView,
}: LivePrayerDetailProps) {
  const { liveNow, upcomingPrayer } = data.liveUrgent

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="rounded-3xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950/70">
        <div className="border-b border-neutral-200 p-5 dark:border-neutral-800 sm:p-6">
          <button
            type="button"
            onClick={() => onOpenDetailView?.('/home')}
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 px-3 py-2 text-xs font-semibold text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </button>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
            Live & Prayer
          </h1>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
            Stay connected to current ministry broadcast and urgent prayer moments.
          </p>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          <article className="rounded-2xl border border-urgency-200 bg-gradient-to-b from-urgency-50 to-white p-5 dark:border-urgency-400/30 dark:from-urgency-500/10 dark:to-neutral-950/30">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-urgency-700 dark:text-urgency-200">
                  <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-urgency-500" />
                  Live Now
                </p>
                <h2 className="mt-2 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                  {liveNow.title}
                </h2>
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
                  {liveNow.platform} · started at {formatTime(liveNow.startedAt)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onOpenLiveNow?.(liveNow.watchUrl)
                  onOpenDetailView?.(data.detailRoutes.live)
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-urgency-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-urgency-500"
              >
                <Radio className="h-4 w-4" />
                Open Live Stream
              </button>
            </div>
          </article>

          <article className="rounded-2xl border border-primary-200/70 bg-primary-50/70 p-5 dark:border-primary-300/25 dark:bg-primary-400/10">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-primary-900 dark:text-primary-100">
                  <Timer className="h-4 w-4" />
                  Upcoming Prayer
                </p>
                <h3 className="mt-2 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  {upcomingPrayer.title}
                </h3>
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
                  Starts in <span className="font-semibold">{upcomingPrayer.startsInHours}h</span> at{' '}
                  {formatTime(upcomingPrayer.startsAt)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onOpenUpcomingPrayer?.(upcomingPrayer.id)}
                className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-primary-500"
              >
                <BellRing className="h-4 w-4" />
                Join Prayer
              </button>
            </div>
          </article>

          <article className="rounded-2xl border border-neutral-200 bg-neutral-50/70 p-4 dark:border-neutral-700 dark:bg-neutral-900">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
              Prayer Participants Preview
            </p>
            {upcomingPrayer.participantPreview.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {upcomingPrayer.participantPreview.map((name) => (
                  <span
                    key={name}
                    className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                  >
                    {name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-300">
                No preview yet. Be among the first to join this prayer session.
              </p>
            )}
          </article>
        </div>
      </div>
    </div>
  )
}
