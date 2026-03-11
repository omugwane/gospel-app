import { useMemo } from 'react'
import { CheckCircle2, Download, PlayCircle, ReceiptText, ShieldCheck, Sparkles } from 'lucide-react'
import type { DonationRecord, GivingProps } from '@/../product/sections/giving/types'

function formatAmount(value: number, currency: string) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      maximumFractionDigits: currency === 'RWF' ? 0 : 2,
    }).format(value)
  } catch {
    return `${value} ${currency}`
  }
}

function formatDateLabel(isoDate: string) {
  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) return isoDate
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

function getLatestSuccessfulDonation(history: DonationRecord[]) {
  const succeeded = history.filter((item) => item.status === 'succeeded')
  if (succeeded.length === 0) return history[0]
  return succeeded.sort((a, b) => Date.parse(b.date) - Date.parse(a.date))[0]
}

export function GivingSuccess({ data, onOpenReceipt, onChangeStep }: GivingProps) {
  const donation = useMemo(
    () => getLatestSuccessfulDonation(data.donationHistory),
    [data.donationHistory]
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/70 via-white to-violet-50/50 dark:from-stone-950 dark:via-stone-950 dark:to-stone-900">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-7 sm:py-10">
        <section className="rounded-3xl border border-amber-200/70 dark:border-amber-400/40 bg-white/90 dark:bg-stone-900 p-6 sm:p-8 shadow-sm">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center">
            <CheckCircle2 className="h-9 w-9 text-amber-700 dark:text-amber-100" strokeWidth={1.9} />
          </div>
          <h1 className="mt-4 text-center text-2xl sm:text-3xl font-semibold tracking-tight text-stone-950 dark:text-stone-50">
            Your gift was received. Murakoze cyane.
          </h1>
          <p className="mt-2 text-center text-sm sm:text-base text-stone-700 dark:text-stone-100">
            Thank you for partnering with Pastor Senga Emmanuel's ministry.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-stone-200 dark:border-stone-600 bg-stone-50 dark:bg-stone-800 p-3 text-center">
              <p className="text-[11px] text-stone-500 dark:text-stone-200">Amount</p>
              <p className="mt-1 text-base font-semibold text-stone-900 dark:text-stone-100">
                {donation ? formatAmount(donation.amount, donation.currency) : '-'}
              </p>
            </div>
            <div className="rounded-2xl border border-stone-200 dark:border-stone-600 bg-stone-50 dark:bg-stone-800 p-3 text-center">
              <p className="text-[11px] text-stone-500 dark:text-stone-200">Category</p>
              <p className="mt-1 text-base font-semibold text-stone-900 dark:text-stone-100">
                {donation?.fundTitle ?? 'General Tithe & Offering'}
              </p>
            </div>
            <div className="rounded-2xl border border-stone-200 dark:border-stone-600 bg-stone-50 dark:bg-stone-800 p-3 text-center">
              <p className="text-[11px] text-stone-500 dark:text-stone-200">Reference</p>
              <p className="mt-1 text-base font-semibold text-stone-900 dark:text-stone-100">
                {donation?.receiptNumber ?? 'Pending'}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-violet-200/70 dark:border-violet-400/40 bg-violet-50/70 dark:bg-violet-500/10 p-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-violet-100 dark:bg-violet-500/20 px-3 py-1 text-xs font-semibold text-violet-800 dark:text-violet-100">
              <PlayCircle className="h-3.5 w-3.5" strokeWidth={1.8} />
              Thank You Prayer Video
            </div>
            <h2 className="mt-2 text-lg font-semibold text-stone-900 dark:text-stone-100">
              {data.thankYouContent.title}
            </h2>
            <p className="mt-1 text-sm text-stone-700 dark:text-stone-100">{data.thankYouContent.message}</p>
            <div className="mt-3 inline-flex items-center gap-2 rounded-xl border border-violet-200 dark:border-violet-400/40 bg-white/75 dark:bg-stone-800 px-3 py-2 text-xs text-stone-700 dark:text-stone-100">
              <Sparkles className="h-3.5 w-3.5 text-violet-700 dark:text-violet-100" strokeWidth={1.8} />
              Prayer clip length: {data.thankYouContent.durationSeconds}s
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-amber-200 dark:border-amber-400/40 bg-amber-50/80 dark:bg-amber-500/10 px-4 py-3">
            <p className="inline-flex items-center gap-2 text-xs font-semibold text-amber-900 dark:text-amber-100">
              <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.8} />
              {data.securityBadgeText}
            </p>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => donation && onOpenReceipt?.(donation.id)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 transition-colors"
            >
              <Download className="h-4 w-4" strokeWidth={1.8} />
              Download Receipt
            </button>
            <button
              type="button"
              onClick={() => onChangeStep?.('amount')}
              className="inline-flex items-center gap-1.5 rounded-xl border border-stone-300 dark:border-stone-600 px-4 py-2 text-sm font-semibold text-stone-700 dark:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <ReceiptText className="h-4 w-4" strokeWidth={1.8} />
              Give Again
            </button>
          </div>
        </section>

        <section className="mt-4 rounded-2xl border border-stone-200 dark:border-stone-600 bg-white/80 dark:bg-stone-900 p-4">
          <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">Digital receipt details</h3>
          <p className="mt-1 text-xs text-stone-600 dark:text-stone-100">
            {donation
              ? `Receipt ${donation.receiptNumber} generated for ${formatDateLabel(donation.date)} via ${donation.paymentMethodLabel}.`
              : 'Receipt will appear here once donation is recorded.'}
          </p>
        </section>
      </div>
    </div>
  )
}
