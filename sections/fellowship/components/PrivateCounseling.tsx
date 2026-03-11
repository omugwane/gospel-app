import { useMemo, useState } from 'react'
import { Lock, ShieldCheck, UserRoundCheck } from 'lucide-react'
import type {
  CounselingRequestStatus,
  FellowshipProps,
  NewCounselingRequestInput,
} from '@/../product/sections/fellowship/types'

function formatDateLabel(isoDate: string) {
  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) return isoDate
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

type StatusFilter = 'All' | CounselingRequestStatus

const STATUS_STYLES: Record<CounselingRequestStatus, string> = {
  Received:
    'bg-stone-100 text-stone-700 dark:bg-stone-700 dark:text-stone-100 border-stone-200 dark:border-stone-500',
  'In Review':
    'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-100 border-amber-200 dark:border-amber-400/40',
  Scheduled:
    'bg-violet-100 text-violet-800 dark:bg-violet-500/20 dark:text-violet-100 border-violet-200 dark:border-violet-400/40',
}

export function PrivateCounseling({
  counselingRequests,
  onSubmitCounselingRequest,
  onOpenCounselingRequest,
}: FellowshipProps) {
  const [filter, setFilter] = useState<StatusFilter>('All')
  const [form, setForm] = useState<NewCounselingRequestInput>({
    category: 'Marriage/Family',
    preferredMethod: 'WhatsApp Call',
    description: '',
  })

  const canSubmit = form.description.trim().length >= 20

  const filteredRequests = useMemo(() => {
    if (filter === 'All') return counselingRequests
    return counselingRequests.filter((request) => request.status === filter)
  }, [counselingRequests, filter])

  const summary = useMemo(() => {
    return counselingRequests.reduce<Record<CounselingRequestStatus, number>>(
      (acc, request) => {
        acc[request.status] += 1
        return acc
      },
      { Received: 0, 'In Review': 0, Scheduled: 0 }
    )
  }, [counselingRequests])

  const handleSubmit = () => {
    if (!canSubmit) return
    onSubmitCounselingRequest?.({
      category: form.category,
      preferredMethod: form.preferredMethod,
      description: form.description.trim(),
    })
    setForm((prev) => ({ ...prev, description: '' }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 via-white to-violet-50/40 dark:from-stone-950 dark:via-stone-950 dark:to-stone-900">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6 sm:py-8">
        <header className="rounded-3xl border border-stone-300/70 dark:border-stone-500/50 bg-white/90 dark:bg-stone-900 p-5 sm:p-6 shadow-sm">
          <div className="inline-flex items-center gap-2 rounded-full bg-stone-100 dark:bg-stone-700 px-3 py-1 text-xs font-semibold text-stone-700 dark:text-stone-100">
            <Lock className="h-3.5 w-3.5" strokeWidth={1.8} />
            Inama n'Isengesho
          </div>
          <h1 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight text-stone-950 dark:text-stone-50">
            Private Counseling
          </h1>
          <p className="mt-1.5 text-sm sm:text-base text-stone-700 dark:text-stone-100">
            Submit confidential requests for guidance and track progress from received to scheduled.
          </p>

          <div className="mt-4 inline-flex items-start gap-2 rounded-2xl border border-stone-300 dark:border-stone-500 bg-stone-50 dark:bg-stone-800 px-3.5 py-2.5">
            <ShieldCheck className="h-4 w-4 mt-0.5 text-stone-700 dark:text-stone-100" strokeWidth={1.8} />
            <p className="text-xs leading-relaxed text-stone-700 dark:text-stone-100">
              Your information is confidential and will only be seen by Pastor Senga and designated counseling team.
            </p>
          </div>
        </header>

        <div className="mt-5 grid gap-5 xl:grid-cols-[1.05fr_1fr]">
          <section className="rounded-3xl border border-stone-300/70 dark:border-stone-500/50 bg-white/90 dark:bg-stone-900 p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-stone-950 dark:text-stone-50">Request Form</h2>
            <p className="mt-1 text-sm text-stone-600 dark:text-stone-100">
              Share enough context so the team can triage quickly and care well.
            </p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-stone-600 dark:text-stone-100">Category</label>
                <select
                  value={form.category}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      category: event.target.value as NewCounselingRequestInput['category'],
                    }))
                  }
                  className="mt-1 w-full rounded-xl border border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 px-3 py-2.5 text-sm text-stone-900 dark:text-stone-100 outline-none focus:ring-2 focus:ring-violet-500/40"
                >
                  <option value="Marriage/Family">Marriage/Family</option>
                  <option value="Business">Business</option>
                  <option value="Spiritual Growth">Spiritual Growth</option>
                  <option value="Youth">Youth</option>
                  <option value="Crisis">Crisis</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-600 dark:text-stone-100">Preferred Method</label>
                <select
                  value={form.preferredMethod}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      preferredMethod: event.target.value as NewCounselingRequestInput['preferredMethod'],
                    }))
                  }
                  className="mt-1 w-full rounded-xl border border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 px-3 py-2.5 text-sm text-stone-900 dark:text-stone-100 outline-none focus:ring-2 focus:ring-violet-500/40"
                >
                  <option value="WhatsApp Call">WhatsApp Call</option>
                  <option value="In-person at church">In-person at church</option>
                  <option value="Email">Email</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-600 dark:text-stone-100">Description</label>
                <textarea
                  value={form.description}
                  onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                  placeholder="Describe your situation and the support you are seeking..."
                  className="mt-1 h-36 w-full resize-none rounded-xl border border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 px-3 py-2.5 text-sm text-stone-900 dark:text-stone-100 outline-none focus:ring-2 focus:ring-violet-500/40"
                />
                <p className="mt-1 text-[11px] text-stone-500 dark:text-stone-200">
                  Minimum 20 characters to submit.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-stone-900 dark:bg-stone-100 px-4 py-2.5 text-sm font-semibold text-stone-50 dark:text-stone-900 transition-all duration-200 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <UserRoundCheck className="h-4 w-4" strokeWidth={1.8} />
              Submit Request
            </button>
          </section>

          <section className="rounded-3xl border border-stone-300/70 dark:border-stone-500/50 bg-white/90 dark:bg-stone-900 p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-stone-950 dark:text-stone-50">My Requests</h2>
            <p className="mt-1 text-sm text-stone-600 dark:text-stone-100">
              Track each request from intake through scheduling.
            </p>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="rounded-xl border border-stone-200 dark:border-stone-600 bg-stone-100 dark:bg-stone-700 p-2 text-center">
                <p className="text-[11px] text-stone-600 dark:text-stone-100">Received</p>
                <p className="text-lg font-semibold text-stone-900 dark:text-stone-50">{summary.Received}</p>
              </div>
              <div className="rounded-xl border border-amber-200 dark:border-amber-400/40 bg-amber-50 dark:bg-amber-500/10 p-2 text-center">
                <p className="text-[11px] text-amber-700 dark:text-amber-100">In Review</p>
                <p className="text-lg font-semibold text-amber-800 dark:text-amber-100">{summary['In Review']}</p>
              </div>
              <div className="rounded-xl border border-violet-200 dark:border-violet-400/40 bg-violet-50 dark:bg-violet-500/10 p-2 text-center">
                <p className="text-[11px] text-violet-700 dark:text-violet-100">Scheduled</p>
                <p className="text-lg font-semibold text-violet-800 dark:text-violet-100">{summary.Scheduled}</p>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              {(['All', 'Received', 'In Review', 'Scheduled'] as StatusFilter[]).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setFilter(status)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                    filter === status
                      ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                      : 'bg-stone-100 text-stone-700 dark:bg-stone-700 dark:text-stone-100'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            <div className="mt-4 space-y-2.5">
              {filteredRequests.length === 0 ? (
                <div className="rounded-xl border border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 px-3 py-2.5 text-sm text-stone-600 dark:text-stone-100">
                  No requests in this status.
                </div>
              ) : (
                filteredRequests.map((request) => (
                  <button
                    key={request.id}
                    type="button"
                    onClick={() => onOpenCounselingRequest?.(request.id)}
                    className="w-full rounded-2xl border border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 px-3.5 py-3 text-left transition-all duration-200 hover:bg-stone-50 dark:hover:bg-stone-700 hover:border-stone-300 dark:hover:border-stone-400"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">{request.category}</p>
                        <p className="mt-0.5 text-xs text-stone-600 dark:text-stone-100">{request.preferredMethod}</p>
                      </div>
                      <span
                        className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${STATUS_STYLES[request.status]}`}
                      >
                        {request.status}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-stone-600 dark:text-stone-100 line-clamp-2">{request.nextStep}</p>
                    <p className="mt-1 text-[11px] text-stone-500 dark:text-stone-200">
                      Submitted {formatDateLabel(request.submittedAt)}
                    </p>
                  </button>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
