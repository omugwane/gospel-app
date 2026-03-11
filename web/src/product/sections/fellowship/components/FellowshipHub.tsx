'use client'

import { useState } from 'react'
import { HandHeart, HeartHandshake, Lock, MessageCircleHeart, Share2, Sparkles, Users, Waves } from 'lucide-react'
import type { CounselingRequestStatus, FellowshipProps } from '@/product/sections/fellowship/types'

function formatDateLabel(isoDate: string) {
  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) return isoDate
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function truncate(text: string, max = 120) {
  if (text.length <= max) return text
  return `${text.slice(0, max).trimEnd()}...`
}

export function FellowshipHub({
  fellowshipPresence,
  testimonies,
  prayerPoints,
  counselingRequests,
  onOpenFeature,
  onReactToTestimony,
  onCommitPrayer,
  onOpenCounselingRequest,
}: FellowshipProps) {
  const latestTestimonies = testimonies.slice(0, 2)
  const activePrayerPoints = prayerPoints.filter((point) => point.visibility === 'Public')
  const featuredPrayerPoint = activePrayerPoints[0]
  const [praisedByUser, setPraisedByUser] = useState<Record<string, boolean>>({})
  const [prayedByUser, setPrayedByUser] = useState<Record<string, boolean>>({})

  const requestSummary = counselingRequests.reduce<Record<CounselingRequestStatus, number>>(
    (acc, request) => {
      acc[request.status] += 1
      return acc
    },
    { Received: 0, 'In Review': 0, Scheduled: 0 }
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50/70 via-white to-secondary-50/40 dark:from-neutral-950 dark:via-neutral-950 dark:to-neutral-900">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-5 sm:py-7 lg:py-8">
        <header className="relative overflow-hidden rounded-3xl border border-primary-200/70 dark:border-primary-500/30 bg-white/80 dark:bg-neutral-900/70 shadow-sm shadow-primary-200/30 dark:shadow-none">
          <div className="absolute -top-12 -right-10 h-36 w-36 rounded-full bg-primary-300/25 blur-3xl dark:bg-primary-500/20" />
          <div className="absolute -bottom-10 -left-8 h-32 w-32 rounded-full bg-secondary-300/30 blur-3xl dark:bg-secondary-500/20" />
          <div className="relative p-4 sm:p-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-100 text-primary-800 dark:bg-primary-500/20 dark:text-primary-200 px-3 py-1 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
              Fellowship
            </div>
            <h1 className="mt-2.5 text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">
              One place to share, pray, and receive support.
            </h1>
            <p className="mt-1.5 text-sm sm:text-base text-neutral-700 dark:text-neutral-200 max-w-2xl">
              This hub keeps the main navigation clean while giving believers a warm, participatory space.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-secondary-300/70 dark:border-secondary-400/40 bg-secondary-50/80 dark:bg-secondary-500/10 px-4 py-2.5">
              <Users className="h-4 w-4 text-secondary-700 dark:text-secondary-200" strokeWidth={1.9} />
              <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                {fellowshipPresence.onlineBelievers.toLocaleString()} {fellowshipPresence.headline.toLowerCase()}
              </span>
            </div>
          </div>
        </header>

        <div className="mt-5 grid gap-5 md:mx-auto md:max-w-2xl xl:mx-0 xl:max-w-none xl:grid-cols-3">
          <article className="rounded-3xl border border-primary-200/70 dark:border-primary-400/40 bg-primary-50/75 dark:bg-neutral-900 p-5 sm:p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary-500/10 dark:hover:border-primary-300/60">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-primary-700 dark:text-primary-200">Ubuhamya</p>
                <h2 className="mt-1 text-xl font-semibold text-neutral-950 dark:text-neutral-50">Share a Testimony</h2>
              </div>
              <MessageCircleHeart className="h-5 w-5 text-primary-700 dark:text-primary-200" strokeWidth={1.9} />
            </div>
            <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-100">
              Celebrate what God has done. Post as your name or anonymous.
            </p>

            <button
              type="button"
              onClick={() => onOpenFeature?.('testimony')}
              className="mt-4 h-11 w-full rounded-2xl bg-primary-600 px-4 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary-700 hover:shadow-md hover:shadow-primary-500/30 active:scale-[0.99]"
            >
              Share a Testimony
            </button>

            <div className="mt-4 space-y-3 pb-1">
              {latestTestimonies.length === 0 ? (
                <div className="rounded-2xl border border-primary-200/70 dark:border-primary-400/35 bg-white/80 dark:bg-neutral-800 p-4 text-sm text-neutral-600 dark:text-neutral-200">
                  No testimonies yet. Be the first to encourage others.
                </div>
              ) : latestTestimonies.map((testimony) => (
                <div key={testimony.id} className="rounded-2xl border border-primary-200/70 dark:border-primary-400/35 bg-white/80 dark:bg-neutral-800 p-4 transition-colors duration-200 hover:bg-primary-50/80 dark:hover:bg-neutral-700/80">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                      {testimony.isAnonymous ? 'Anonymous' : testimony.displayName}
                    </span>
                    <span className="text-[11px] text-neutral-500 dark:text-neutral-300">{testimony.location}</span>
                  </div>
                  <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-100">{truncate(testimony.content, 118)}</p>
                  {testimony.content.length > 118 ? (
                    <button
                      type="button"
                      onClick={() => onOpenFeature?.('testimony')}
                      className="mt-1 text-[11px] font-semibold text-primary-700 dark:text-primary-200 hover:underline"
                    >
                      Read more
                    </button>
                  ) : null}
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setPraisedByUser((prev) => ({ ...prev, [testimony.id]: true }))
                        onReactToTestimony?.(testimony.id, 'praise-god')
                      }}
                      className="inline-flex items-center gap-1.5 rounded-full bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white transition-all duration-200 hover:bg-primary-700 hover:shadow-sm hover:shadow-primary-500/40 active:scale-[0.98]"
                    >
                      <Waves className="h-3.5 w-3.5" strokeWidth={1.8} />
                      {praisedByUser[testimony.id] ? 'Praised' : 'Praise God'}
                    </button>
                    <button
                      type="button"
                      onClick={() => onReactToTestimony?.(testimony.id, 'share')}
                      className="inline-flex items-center gap-1.5 rounded-full px-2 py-1.5 text-xs font-semibold text-primary-800 dark:text-primary-100 transition-colors hover:bg-primary-100/70 dark:hover:bg-primary-500/20"
                    >
                      <Share2 className="h-3.5 w-3.5" strokeWidth={1.8} />
                      Share
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-3xl border border-secondary-200/80 dark:border-secondary-400/40 bg-secondary-50/80 dark:bg-neutral-900 p-5 sm:p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-secondary-500/10 dark:hover:border-secondary-300/60">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-secondary-700 dark:text-secondary-200">Gusabirana</p>
                <h2 className="mt-1 text-xl font-semibold text-neutral-950 dark:text-neutral-50">Pray for Others</h2>
              </div>
              <HandHeart className="h-5 w-5 text-secondary-700 dark:text-secondary-200" strokeWidth={1.9} />
            </div>
            <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-100">
              Carry each other's burdens with prayer commitments and tagged requests.
            </p>

            <div className="mt-4 rounded-2xl border border-secondary-200/70 dark:border-secondary-400/35 bg-white/80 dark:bg-neutral-800 p-4 transition-colors duration-200 hover:bg-secondary-50/70 dark:hover:bg-neutral-700/80">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                  {activePrayerPoints.length} active public requests
                </span>
                <span className="rounded-full bg-neutral-100 dark:bg-neutral-700 px-2.5 py-1 text-[11px] font-medium text-neutral-700 dark:text-neutral-100">
                  Public
                </span>
              </div>

              {featuredPrayerPoint ? (
                <>
                  <div className="mt-3">
                    <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{featuredPrayerPoint.title}</p>
                    <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-100">{truncate(featuredPrayerPoint.details, 105)}</p>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {featuredPrayerPoint.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-secondary-300 dark:border-secondary-500/40 px-2.5 py-1 text-[11px] font-semibold text-secondary-800 dark:text-secondary-200 transition-colors duration-200 hover:bg-secondary-100/60 dark:hover:bg-secondary-500/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-3 flex items-end justify-between gap-2 pb-1">
                    <span className="leading-tight">
                      <span className="block text-2xl font-semibold text-secondary-700 dark:text-secondary-200">
                        {featuredPrayerPoint.prayedCount}
                      </span>
                      <span className="text-xs text-neutral-600 dark:text-neutral-100">people prayed</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setPrayedByUser((prev) => ({ ...prev, [featuredPrayerPoint.id]: true }))
                        onCommitPrayer?.(featuredPrayerPoint.id)
                      }}
                      className="h-10 rounded-full bg-secondary-500 px-4 text-xs font-semibold text-white transition-all duration-200 hover:bg-secondary-600 hover:shadow-sm hover:shadow-secondary-500/40 active:scale-[0.98]"
                    >
                      {prayedByUser[featuredPrayerPoint.id] ? 'Prayed' : "I'm Praying"}
                    </button>
                  </div>
                </>
              ) : (
                <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-100">No public prayer requests yet.</p>
              )}
            </div>

            <button
              type="button"
              onClick={() => onOpenFeature?.('prayer')}
              className="mt-4 h-11 w-full rounded-2xl border border-secondary-300 dark:border-secondary-500/40 bg-white/85 dark:bg-neutral-900/80 px-4 text-sm font-semibold text-neutral-900 dark:text-neutral-100 transition-all duration-200 hover:bg-white dark:hover:bg-neutral-900 hover:shadow-md hover:shadow-secondary-500/20 active:scale-[0.99]"
            >
              Open Interactive Prayer
            </button>
          </article>

          <article className="rounded-3xl border border-neutral-300/80 dark:border-neutral-500/50 bg-neutral-100/80 dark:bg-neutral-900 p-5 sm:p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-neutral-700/20 dark:hover:border-neutral-300/60">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-600 dark:text-neutral-300">Inama n'Isengesho</p>
                <h2 className="mt-1 text-xl font-semibold text-neutral-950 dark:text-neutral-50">Request Counseling</h2>
              </div>
              <Lock className="h-5 w-5 text-neutral-700 dark:text-neutral-300" strokeWidth={1.9} />
            </div>
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-neutral-300 dark:border-neutral-600 px-2.5 py-1 text-[11px] font-semibold text-neutral-700 dark:text-neutral-200">
              <Lock className="h-3.5 w-3.5" strokeWidth={1.8} />
              Confidential
            </div>
            <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-100">
              Confidential requests reviewed only by Pastor Senga and designated counseling team.
            </p>

            <div className="mt-4 rounded-2xl border border-neutral-300/70 dark:border-neutral-600/70 bg-white/90 dark:bg-neutral-800 p-4 transition-colors duration-200 hover:bg-neutral-50 dark:hover:bg-neutral-700/80">
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-xl bg-neutral-100 dark:bg-neutral-900 p-2 text-center transition-colors duration-200 hover:bg-neutral-200 dark:hover:bg-neutral-700">
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-200">Received</p>
                  <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{requestSummary.Received}</p>
                </div>
                <div className="rounded-xl bg-secondary-50 dark:bg-secondary-500/10 p-2 text-center transition-colors duration-200 hover:bg-secondary-100 dark:hover:bg-secondary-500/20">
                  <p className="text-[11px] text-secondary-700 dark:text-secondary-200">In Review</p>
                  <p className="text-lg font-semibold text-secondary-800 dark:text-secondary-100">{requestSummary['In Review']}</p>
                </div>
                <div className="rounded-xl bg-primary-50 dark:bg-primary-500/10 p-2 text-center transition-colors duration-200 hover:bg-primary-100 dark:hover:bg-primary-500/20">
                  <p className="text-[11px] text-primary-700 dark:text-primary-200">Scheduled</p>
                  <p className="text-lg font-semibold text-primary-800 dark:text-primary-100">{requestSummary.Scheduled}</p>
                </div>
              </div>

              <div className="mt-3 space-y-2">
                {counselingRequests.length === 0 ? (
                  <div className="rounded-xl border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-900 px-3 py-2.5 text-xs text-neutral-600 dark:text-neutral-100">
                    No counseling requests yet.
                  </div>
                ) : counselingRequests.slice(0, 2).map((request) => (
                  <button
                    key={request.id}
                    type="button"
                    onClick={() => onOpenCounselingRequest?.(request.id)}
                    className="w-full rounded-xl border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-900 px-3 py-2.5 text-left transition-all duration-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-400"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">{request.category}</span>
                      <span className="text-[11px] text-neutral-500 dark:text-neutral-200">{formatDateLabel(request.submittedAt)}</span>
                    </div>
                    <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-100">{request.status}</p>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => onOpenFeature?.('counseling')}
              className="mt-4 h-11 w-full rounded-2xl bg-neutral-800 dark:bg-neutral-100 px-4 text-sm font-semibold text-neutral-50 dark:text-neutral-900 transition-all duration-200 hover:bg-neutral-700 dark:hover:bg-neutral-200 hover:shadow-md hover:shadow-neutral-900/30 active:scale-[0.99]"
            >
              Request Counseling
            </button>
            <p className="mt-2 text-[11px] text-neutral-500 dark:text-neutral-100">
              Confidentiality: data is visible only to authorized ministry counselors.
            </p>
          </article>
        </div>

        <div className="mt-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-950/40 px-4 py-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1 font-medium text-neutral-700 dark:text-neutral-300 transition-colors duration-200 hover:bg-neutral-200 dark:hover:bg-neutral-700">
              <HeartHandshake className="h-3.5 w-3.5" strokeWidth={1.8} />
              Public: Testimonies, Prayer
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-neutral-200/80 dark:bg-neutral-700/70 px-2.5 py-1 font-medium text-neutral-700 dark:text-neutral-200 transition-colors duration-200 hover:bg-neutral-300/80 dark:hover:bg-neutral-600/80">
              <Lock className="h-3.5 w-3.5" strokeWidth={1.8} />
              Private: Counseling
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
