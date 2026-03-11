'use client'

import { useMemo, useState } from 'react'
import { AudioLines, ChevronLeft, Image as ImageIcon, MapPin, MessageCircleHeart, Plus, Share2, Waves, X } from 'lucide-react'
import type { FellowshipProps, NewTestimonyInput, TestimonyMediaType } from '@/product/sections/fellowship/types'

function formatPostedAt(isoDate: string) {
  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) return isoDate
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

interface ComposerState {
  content: string
  isAnonymous: boolean
  location: string
  mediaType: TestimonyMediaType | null
}

const initialComposer: ComposerState = {
  content: '',
  isAnonymous: false,
  location: '',
  mediaType: null,
}

export function TestimonyWall({
  testimonies,
  onCreateTestimony,
  onReactToTestimony,
  onBack,
}: FellowshipProps) {
  const [composerOpen, setComposerOpen] = useState(false)
  const [composer, setComposer] = useState<ComposerState>(initialComposer)
  const [praised, setPraised] = useState<Record<string, boolean>>({})
  const [shared, setShared] = useState<Record<string, boolean>>({})

  const canSubmit = composer.content.trim().length >= 12
  const sortedTestimonies = useMemo(
    () => [...testimonies].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)),
    [testimonies]
  )

  const handleSubmit = () => {
    if (!canSubmit) return

    const payload: NewTestimonyInput = {
      content: composer.content.trim(),
      isAnonymous: composer.isAnonymous,
      location: composer.location.trim() || undefined,
      media: composer.mediaType
        ? {
            type: composer.mediaType,
            url:
              composer.mediaType === 'audio'
                ? '/media/testimonies/new-audio-clip.mp3'
                : '/media/testimonies/new-image.jpg',
            durationSeconds: composer.mediaType === 'audio' ? 30 : undefined,
          }
        : undefined,
    }

    onCreateTestimony?.(payload)
    setComposer(initialComposer)
    setComposerOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50/70 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-950 dark:to-neutral-900">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-6 sm:py-8">
        <header className="rounded-3xl border border-primary-200/70 dark:border-primary-400/40 bg-white/85 dark:bg-neutral-900 p-5 sm:p-6 shadow-sm">
          {onBack && (
            <div className="mb-4">
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-1 rounded-full border border-primary-200/70 dark:border-primary-400/40 bg-white/70 dark:bg-neutral-800 px-3 py-1.5 text-[11px] font-semibold text-primary-700 dark:text-primary-200 hover:bg-primary-50 dark:hover:bg-neutral-700 transition-colors"
              >
                <ChevronLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
                Back
              </button>
            </div>
          )}
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-100 dark:bg-primary-500/20 px-3 py-1 text-xs font-semibold text-primary-800 dark:text-primary-200">
            <MessageCircleHeart className="h-3.5 w-3.5" strokeWidth={1.8} />
            Ubuhamya
          </div>
          <h1 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">
            Testimony Wall
          </h1>
          <p className="mt-1.5 text-sm sm:text-base text-neutral-700 dark:text-neutral-100">
            Share what God has done. Read, celebrate, and strengthen one another.
          </p>
        </header>

        <section className="mt-5 space-y-4">
          {sortedTestimonies.length === 0 ? (
            <div className="rounded-3xl border border-primary-200/70 dark:border-primary-400/35 bg-white/85 dark:bg-neutral-800 p-8 text-center text-sm text-neutral-600 dark:text-neutral-100">
              No testimonies yet. Tap the button below and share the first one.
            </div>
          ) : (
            sortedTestimonies.map((testimony) => (
              <article
                key={testimony.id}
                className="rounded-3xl border border-primary-200/70 dark:border-primary-400/35 bg-white/90 dark:bg-neutral-800 p-4 sm:p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary-500/10"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                      {testimony.isAnonymous ? 'Anonymous' : testimony.displayName}
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-200">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" strokeWidth={1.7} />
                        {testimony.location}
                      </span>
                      <span>•</span>
                      <span>{formatPostedAt(testimony.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <p className="mt-3 text-sm sm:text-base leading-relaxed text-neutral-700 dark:text-neutral-100">
                  {testimony.content}
                </p>

                {testimony.media.length > 0 ? (
                  <div className="mt-3 rounded-2xl border border-primary-200/70 dark:border-primary-400/35 bg-primary-50/70 dark:bg-neutral-700/80 px-3.5 py-2.5">
                    {testimony.media[0].type === 'audio' ? (
                      <p className="text-xs font-semibold text-primary-800 dark:text-primary-100">
                        Audio testimony attached ({testimony.media[0].durationSeconds ?? 30}s)
                      </p>
                    ) : (
                      <p className="text-xs font-semibold text-primary-800 dark:text-primary-100">
                        Image testimony attached
                      </p>
                    )}
                  </div>
                ) : null}

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPraised((prev) => ({ ...prev, [testimony.id]: !prev[testimony.id] }))
                      onReactToTestimony?.(testimony.id, 'praise-god')
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white transition-all duration-200 hover:bg-primary-700 hover:shadow-sm hover:shadow-primary-500/40 active:scale-[0.98]"
                  >
                    <Waves className="h-3.5 w-3.5" strokeWidth={1.8} />
                    {praised[testimony.id] ? 'Praised' : 'Praise God'}
                    <span className="rounded-full bg-white/25 px-1.5 py-0.5 text-[10px]">
                      {testimony.reactions.praiseGodCount + (praised[testimony.id] ? 1 : 0)}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShared((prev) => ({ ...prev, [testimony.id]: !prev[testimony.id] }))
                      onReactToTestimony?.(testimony.id, 'share')
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full border border-primary-300 dark:border-primary-500/40 px-3 py-1.5 text-xs font-semibold text-primary-800 dark:text-primary-100 transition-colors duration-200 hover:bg-primary-100/70 dark:hover:bg-primary-500/20"
                  >
                    <Share2 className="h-3.5 w-3.5" strokeWidth={1.8} />
                    {shared[testimony.id] ? 'Shared' : 'Share'}
                    <span className="rounded-full bg-primary-100 dark:bg-primary-500/20 px-1.5 py-0.5 text-[10px]">
                      {testimony.reactions.shareCount + (shared[testimony.id] ? 1 : 0)}
                    </span>
                  </button>
                </div>
              </article>
            ))
          )}
        </section>

        <button
          type="button"
          onClick={() => setComposerOpen(true)}
          className="fixed bottom-24 sm:bottom-6 right-4 sm:right-6 z-[70] inline-flex items-center gap-2 rounded-full bg-primary-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/30 transition-all duration-200 hover:bg-primary-700 hover:shadow-xl hover:shadow-primary-500/40 active:scale-[0.98]"
          aria-label="Share a testimony"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          Share
        </button>

        {composerOpen ? (
          <div className="fixed inset-0 z-40 bg-neutral-950/55 backdrop-blur-[2px] p-4 sm:p-6">
            <div className="mx-auto mt-8 max-w-lg rounded-3xl border border-primary-200/70 dark:border-primary-400/40 bg-white dark:bg-neutral-900 p-5 sm:p-6 shadow-2xl">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-neutral-950 dark:text-neutral-50">Share a Testimony</h2>
                  <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-100">Text, plus optional image or 30-second audio.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setComposerOpen(false)}
                  className="rounded-full p-1.5 text-neutral-500 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                  aria-label="Close composer"
                >
                  <X className="h-4 w-4" strokeWidth={2} />
                </button>
              </div>

              <div className="mt-4 space-y-3">
                <textarea
                  value={composer.content}
                  onChange={(event) =>
                    setComposer((prev) => ({
                      ...prev,
                      content: event.target.value,
                    }))
                  }
                  placeholder="Write your testimony..."
                  className="h-36 w-full resize-none rounded-2xl border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-3.5 py-3 text-sm text-neutral-900 dark:text-neutral-100 outline-none focus:ring-2 focus:ring-primary-500/40"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={composer.location}
                    onChange={(event) =>
                      setComposer((prev) => ({
                        ...prev,
                        location: event.target.value,
                      }))
                    }
                    placeholder="Location (optional)"
                    className="rounded-xl border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-3 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 outline-none focus:ring-2 focus:ring-primary-500/40"
                  />
                  <label className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-3 py-2.5 text-sm text-neutral-700 dark:text-neutral-100">
                    <input
                      type="checkbox"
                      checked={composer.isAnonymous}
                      onChange={(event) =>
                        setComposer((prev) => ({
                          ...prev,
                          isAnonymous: event.target.checked,
                        }))
                      }
                      className="h-4 w-4 accent-primary-600"
                    />
                    Post as anonymous
                  </label>
                </div>

                <div>
                  <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-200">Optional media</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setComposer((prev) => ({ ...prev, mediaType: null }))}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                        composer.mediaType === null
                          ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                          : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-100'
                      }`}
                    >
                      None
                    </button>
                    <button
                      type="button"
                      onClick={() => setComposer((prev) => ({ ...prev, mediaType: 'image' }))}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                        composer.mediaType === 'image'
                          ? 'bg-primary-600 text-white'
                          : 'bg-primary-100 text-primary-800 dark:bg-primary-500/20 dark:text-primary-100'
                      }`}
                    >
                      <ImageIcon className="h-3.5 w-3.5" strokeWidth={1.8} />
                      1 photo
                    </button>
                    <button
                      type="button"
                      onClick={() => setComposer((prev) => ({ ...prev, mediaType: 'audio' }))}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                        composer.mediaType === 'audio'
                          ? 'bg-secondary-500 text-white'
                          : 'bg-secondary-100 text-secondary-800 dark:bg-secondary-500/20 dark:text-secondary-100'
                      }`}
                    >
                      <AudioLines className="h-3.5 w-3.5" strokeWidth={1.8} />
                      30s audio
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setComposerOpen(false)}
                  className="rounded-xl border border-neutral-300 dark:border-neutral-600 px-4 py-2 text-sm font-semibold text-neutral-700 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className="rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Post Testimony
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
