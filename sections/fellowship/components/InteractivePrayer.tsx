import { useMemo, useState } from 'react'
import { HandHeart, Lock, Plus, Search, Users } from 'lucide-react'
import type { FellowshipProps, NewPrayerPointInput, PrayerTag, PrayerVisibility } from '@/../product/sections/fellowship/types'

function formatDateLabel(isoDate: string) {
  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) return isoDate
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

interface PrayerComposerState {
  title: string
  details: string
  category: PrayerTag
  visibility: PrayerVisibility
  tags: PrayerTag[]
}

const defaultComposer = (initialTag: PrayerTag): PrayerComposerState => ({
  title: '',
  details: '',
  category: initialTag,
  visibility: 'Public',
  tags: [initialTag],
})

export function InteractivePrayer({
  prayerPoints,
  availablePrayerTags,
  onCommitPrayer,
  onSubmitPrayerPoint,
}: FellowshipProps) {
  const [activeTag, setActiveTag] = useState<PrayerTag | 'All'>('All')
  const [query, setQuery] = useState('')
  const [openComposer, setOpenComposer] = useState(false)
  const [prayedMap, setPrayedMap] = useState<Record<string, boolean>>({})
  const [composer, setComposer] = useState<PrayerComposerState>(
    defaultComposer(availablePrayerTags[0] ?? 'Health')
  )

  const filtered = useMemo(() => {
    return prayerPoints.filter((point) => {
      const tagMatch = activeTag === 'All' || point.tags.includes(activeTag)
      const searchMatch =
        query.trim().length === 0 ||
        point.title.toLowerCase().includes(query.toLowerCase()) ||
        point.details.toLowerCase().includes(query.toLowerCase())
      return tagMatch && searchMatch
    })
  }, [activeTag, prayerPoints, query])

  const publicCount = filtered.filter((point) => point.visibility === 'Public').length
  const privateCount = filtered.filter((point) => point.visibility === 'Ministry Only').length

  const canSubmit = composer.title.trim().length > 5 && composer.details.trim().length > 15

  const handleSubmitPrayer = () => {
    if (!canSubmit) return
    const payload: NewPrayerPointInput = {
      title: composer.title.trim(),
      details: composer.details.trim(),
      category: composer.category,
      visibility: composer.visibility,
      tags: composer.tags.length > 0 ? composer.tags : [composer.category],
    }
    onSubmitPrayerPoint?.(payload)
    setComposer(defaultComposer(availablePrayerTags[0] ?? 'Health'))
    setOpenComposer(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/70 via-white to-stone-50 dark:from-stone-950 dark:via-stone-950 dark:to-stone-900">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6 sm:py-8">
        <header className="rounded-3xl border border-amber-200/70 dark:border-amber-400/40 bg-white/90 dark:bg-stone-900 p-5 sm:p-6 shadow-sm">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 dark:bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-800 dark:text-amber-100">
            <HandHeart className="h-3.5 w-3.5" strokeWidth={1.8} />
            Gusabirana
          </div>
          <h1 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight text-stone-950 dark:text-stone-50">
            Interactive Prayer
          </h1>
          <p className="mt-1.5 text-sm sm:text-base text-stone-700 dark:text-stone-100">
            Carry each other's burdens. Pray for others and submit prayer points with clear visibility.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 dark:bg-amber-500/20 px-3 py-1 font-semibold text-amber-800 dark:text-amber-100">
              <Users className="h-3.5 w-3.5" strokeWidth={1.8} />
              {publicCount} public requests
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 dark:bg-stone-700 px-3 py-1 font-semibold text-stone-700 dark:text-stone-100">
              <Lock className="h-3.5 w-3.5" strokeWidth={1.8} />
              {privateCount} ministry-only
            </span>
          </div>
        </header>

        <div className="mt-5 rounded-3xl border border-stone-200/80 dark:border-stone-600 bg-white/85 dark:bg-stone-900 p-4 sm:p-5 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTag('All')}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                activeTag === 'All'
                  ? 'bg-amber-500 text-white'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200 dark:bg-stone-700 dark:text-stone-100 dark:hover:bg-stone-600'
              }`}
            >
              All
            </button>
            {availablePrayerTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setActiveTag(tag)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                  activeTag === tag
                    ? 'bg-amber-500 text-white'
                    : 'bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-500/20 dark:text-amber-100 dark:hover:bg-amber-500/30'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="mt-3 rounded-2xl border border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 px-3 py-2.5 flex items-center gap-2">
            <Search className="h-4 w-4 text-stone-500 dark:text-stone-200" strokeWidth={1.8} />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search prayer points..."
              className="w-full bg-transparent text-sm text-stone-900 dark:text-stone-100 outline-none placeholder:text-stone-400 dark:placeholder:text-stone-300"
            />
          </div>
        </div>

        <section className="mt-5 space-y-3">
          {filtered.length === 0 ? (
            <div className="rounded-3xl border border-stone-200 dark:border-stone-600 bg-white/85 dark:bg-stone-800 p-8 text-center text-sm text-stone-600 dark:text-stone-100">
              No prayer points match this filter.
            </div>
          ) : (
            filtered.map((point) => (
              <article
                key={point.id}
                className="rounded-3xl border border-amber-200/70 dark:border-amber-400/35 bg-white/90 dark:bg-stone-800 p-4 sm:p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-500/10"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-base font-semibold text-stone-950 dark:text-stone-50">{point.title}</p>
                    <p className="mt-1 text-sm text-stone-700 dark:text-stone-100">{point.details}</p>
                  </div>
                  {point.visibility === 'Ministry Only' ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 dark:bg-stone-700 px-2.5 py-1 text-[11px] font-semibold text-stone-700 dark:text-stone-100">
                      <Lock className="h-3 w-3" strokeWidth={1.8} />
                      Ministry Only
                    </span>
                  ) : (
                    <span className="rounded-full bg-amber-100 dark:bg-amber-500/20 px-2.5 py-1 text-[11px] font-semibold text-amber-800 dark:text-amber-100">
                      Public
                    </span>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {point.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-amber-300 dark:border-amber-500/40 px-2.5 py-1 text-[11px] font-semibold text-amber-800 dark:text-amber-100"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                  <div className="text-xs text-stone-600 dark:text-stone-100">
                    <span className="font-semibold text-amber-700 dark:text-amber-100 text-lg leading-none">
                      {point.prayedCount + (prayedMap[point.id] ? 1 : 0)}
                    </span>{' '}
                    people prayed • {formatDateLabel(point.createdAt)}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setPrayedMap((prev) => ({ ...prev, [point.id]: !prev[point.id] }))
                      onCommitPrayer?.(point.id)
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-4 py-2 text-xs font-semibold text-white transition-all duration-200 hover:bg-amber-600 hover:shadow-sm hover:shadow-amber-500/40 active:scale-[0.98]"
                  >
                    <HandHeart className="h-3.5 w-3.5" strokeWidth={1.8} />
                    {prayedMap[point.id] ? 'Prayed' : "I'm Praying"}
                  </button>
                </div>
              </article>
            ))
          )}
        </section>

        <button
          type="button"
          onClick={() => setOpenComposer(true)}
          className="fixed bottom-24 sm:bottom-6 right-4 sm:right-6 z-[70] inline-flex items-center gap-2 rounded-full bg-amber-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-500/30 transition-all duration-200 hover:bg-amber-600 hover:shadow-xl hover:shadow-amber-500/40 active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          Add Prayer Point
        </button>

        {openComposer ? (
          <div className="fixed inset-0 z-40 bg-stone-950/55 backdrop-blur-[2px] p-4 sm:p-6">
            <div className="mx-auto mt-8 max-w-xl rounded-3xl border border-amber-200/70 dark:border-amber-400/40 bg-white dark:bg-stone-900 p-5 sm:p-6 shadow-2xl">
              <h2 className="text-xl font-semibold text-stone-950 dark:text-stone-50">Submit Prayer Point</h2>
              <p className="mt-1 text-sm text-stone-600 dark:text-stone-100">
                Choose Public or Ministry Only visibility before sending.
              </p>

              <div className="mt-4 space-y-3">
                <input
                  type="text"
                  value={composer.title}
                  onChange={(event) => setComposer((prev) => ({ ...prev, title: event.target.value }))}
                  placeholder="Title (e.g., Healing for my mother)"
                  className="w-full rounded-xl border border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 px-3 py-2.5 text-sm text-stone-900 dark:text-stone-100 outline-none focus:ring-2 focus:ring-amber-500/40"
                />
                <textarea
                  value={composer.details}
                  onChange={(event) => setComposer((prev) => ({ ...prev, details: event.target.value }))}
                  placeholder="Write the prayer request details..."
                  className="h-28 w-full resize-none rounded-xl border border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 px-3 py-2.5 text-sm text-stone-900 dark:text-stone-100 outline-none focus:ring-2 focus:ring-amber-500/40"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <select
                    value={composer.category}
                    onChange={(event) => {
                      const selected = event.target.value as PrayerTag
                      setComposer((prev) => ({ ...prev, category: selected }))
                    }}
                    className="rounded-xl border border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 px-3 py-2.5 text-sm text-stone-900 dark:text-stone-100 outline-none focus:ring-2 focus:ring-amber-500/40"
                  >
                    {availablePrayerTags.map((tag) => (
                      <option key={tag} value={tag}>
                        {tag}
                      </option>
                    ))}
                  </select>

                  <select
                    value={composer.visibility}
                    onChange={(event) =>
                      setComposer((prev) => ({
                        ...prev,
                        visibility: event.target.value as PrayerVisibility,
                      }))
                    }
                    className="rounded-xl border border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 px-3 py-2.5 text-sm text-stone-900 dark:text-stone-100 outline-none focus:ring-2 focus:ring-amber-500/40"
                  >
                    <option value="Public">Public</option>
                    <option value="Ministry Only">Ministry Only</option>
                  </select>
                </div>

                <div>
                  <p className="text-xs font-semibold text-stone-600 dark:text-stone-100">Tags</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {availablePrayerTags.map((tag) => {
                      const selected = composer.tags.includes(tag)
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() =>
                            setComposer((prev) => ({
                              ...prev,
                              tags: selected
                                ? prev.tags.filter((item) => item !== tag)
                                : [...prev.tags, tag],
                            }))
                          }
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                            selected
                              ? 'bg-amber-500 text-white'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-100'
                          }`}
                        >
                          {tag}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setOpenComposer(false)}
                  className="rounded-xl border border-stone-300 dark:border-stone-600 px-4 py-2 text-sm font-semibold text-stone-700 dark:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmitPrayer}
                  disabled={!canSubmit}
                  className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Submit Prayer Point
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
