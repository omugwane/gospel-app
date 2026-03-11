import { useMemo, useState } from 'react'
import { CalendarDays, Download, Receipt, ShieldCheck, Wallet } from 'lucide-react'
import type { DonationStatus, GivingProps } from '@/../product/sections/giving/types'

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

const STATUS_STYLES: Record<DonationStatus, string> = {
  succeeded:
    'bg-violet-100 text-violet-800 dark:bg-violet-500/20 dark:text-violet-100 border-violet-200 dark:border-violet-400/40',
  processing:
    'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-100 border-amber-200 dark:border-amber-400/40',
  failed:
    'bg-stone-100 text-stone-700 dark:bg-stone-700 dark:text-stone-100 border-stone-200 dark:border-stone-500',
}

export function GivingHistory({ data, onOpenReceipt, onChangeHistoryYear }: GivingProps) {
  const years = useMemo(() => {
    const values = new Set<number>()
    data.donationHistory.forEach((item) => {
      const year = new Date(item.date).getFullYear()
      if (!Number.isNaN(year)) values.add(year)
    })
    return Array.from(values).sort((a, b) => b - a)
  }, [data.donationHistory])

  const defaultYear = years.includes(data.givingSummary.selectedYear)
    ? data.givingSummary.selectedYear
    : (years[0] ?? data.givingSummary.selectedYear)
  const [year, setYear] = useState<number>(defaultYear)

  const yearRecords = useMemo(() => {
    return data.donationHistory
      .filter((item) => new Date(item.date).getFullYear() === year)
      .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
  }, [data.donationHistory, year])

  const yearTotals = useMemo(() => {
    const totalAmount = yearRecords
      .filter((item) => item.status === 'succeeded' && item.currency === data.givingSummary.yearlyTotal.currency)
      .reduce((sum, item) => sum + item.amount, 0)

    const successfulCount = yearRecords.filter((item) => item.status === 'succeeded').length
    const recurringCount = yearRecords.filter((item) => item.frequency !== 'one_time').length

    return { totalAmount, successfulCount, recurringCount }
  }, [data.givingSummary.yearlyTotal.currency, yearRecords])

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 via-white to-violet-50/40 dark:from-stone-950 dark:via-stone-950 dark:to-stone-900">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6 sm:py-8">
        <section className="rounded-3xl border border-stone-300/70 dark:border-stone-500/50 bg-white/90 dark:bg-stone-900 p-5 sm:p-6 shadow-sm">
          <div className="inline-flex items-center gap-2 rounded-full bg-stone-100 dark:bg-stone-700 px-3 py-1 text-xs font-semibold text-stone-700 dark:text-stone-100">
            <Receipt className="h-3.5 w-3.5" strokeWidth={1.8} />
            Giving History
          </div>
          <h1 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight text-stone-950 dark:text-stone-50">
            Your Contributions
          </h1>
          <p className="mt-1.5 text-sm sm:text-base text-stone-700 dark:text-stone-100">
            Track yearly giving totals, donation records, and receipt references.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 dark:bg-stone-700 px-3 py-1 text-xs font-semibold text-stone-700 dark:text-stone-100">
              <CalendarDays className="h-3.5 w-3.5" strokeWidth={1.8} />
              Year
            </span>
            <select
              value={year}
              onChange={(event) => {
                const nextYear = Number(event.target.value)
                setYear(nextYear)
                onChangeHistoryYear?.(nextYear)
              }}
              className="rounded-xl border border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 px-3 py-2 text-sm text-stone-900 dark:text-stone-100 outline-none focus:ring-2 focus:ring-violet-500/40"
            >
              {years.map((itemYear) => (
                <option key={itemYear} value={itemYear}>
                  {itemYear}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-violet-200 dark:border-violet-400/40 bg-violet-50 dark:bg-violet-500/10 p-3">
              <p className="text-[11px] text-violet-700 dark:text-violet-100">Yearly total ({data.givingSummary.yearlyTotal.currency})</p>
              <p className="mt-1 text-xl font-semibold text-violet-900 dark:text-violet-100">
                {formatAmount(yearTotals.totalAmount, data.givingSummary.yearlyTotal.currency)}
              </p>
            </div>
            <div className="rounded-2xl border border-amber-200 dark:border-amber-400/40 bg-amber-50 dark:bg-amber-500/10 p-3">
              <p className="text-[11px] text-amber-700 dark:text-amber-100">Successful donations</p>
              <p className="mt-1 text-xl font-semibold text-amber-900 dark:text-amber-100">
                {yearTotals.successfulCount}
              </p>
            </div>
            <div className="rounded-2xl border border-stone-200 dark:border-stone-600 bg-stone-50 dark:bg-stone-800 p-3">
              <p className="text-[11px] text-stone-600 dark:text-stone-100">Recurring donations</p>
              <p className="mt-1 text-xl font-semibold text-stone-900 dark:text-stone-100">
                {yearTotals.recurringCount}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-5 rounded-3xl border border-stone-200 dark:border-stone-600 bg-white/90 dark:bg-stone-900 p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">Receipts & Records</h2>
          <p className="mt-1 text-sm text-stone-600 dark:text-stone-100">
            Download a receipt for any successful donation.
          </p>

          <div className="mt-4 space-y-2.5">
            {yearRecords.length === 0 ? (
              <div className="rounded-2xl border border-stone-200 dark:border-stone-600 bg-stone-50 dark:bg-stone-800 px-3.5 py-3 text-sm text-stone-600 dark:text-stone-100">
                No donations found for this year.
              </div>
            ) : (
              yearRecords.map((record) => (
                <div
                  key={record.id}
                  className="rounded-2xl border border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 px-3.5 py-3 flex flex-wrap items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-stone-900 dark:text-stone-100 truncate">
                      {record.fundTitle}
                    </p>
                    <p className="mt-0.5 text-xs text-stone-600 dark:text-stone-100">
                      {formatDateLabel(record.date)} • {record.paymentMethodLabel}
                    </p>
                    <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-200">
                      {record.receiptNumber}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 ml-auto">
                    <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${STATUS_STYLES[record.status]}`}>
                      {record.status}
                    </span>
                    <span className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                      {formatAmount(record.amount, record.currency)}
                    </span>
                    <button
                      type="button"
                      onClick={() => onOpenReceipt?.(record.id)}
                      disabled={record.status !== 'succeeded'}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-stone-300 dark:border-stone-600 px-3 py-1.5 text-xs font-semibold text-stone-700 dark:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Download className="h-3.5 w-3.5" strokeWidth={1.8} />
                      Receipt
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="mt-4 rounded-2xl border border-amber-200 dark:border-amber-400/40 bg-amber-50/80 dark:bg-amber-500/10 px-4 py-3">
          <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-900 dark:text-amber-100">
            <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.8} />
            Records are private and tied to your secure giving account.
          </p>
          <p className="mt-1 text-xs text-stone-600 dark:text-stone-100">
            Helpful for annual summaries and tax documentation where applicable.
          </p>
          <p className="mt-1 text-xs text-stone-600 dark:text-stone-100 inline-flex items-center gap-1">
            <Wallet className="h-3.5 w-3.5" strokeWidth={1.8} />
            Gateway: {data.gatewayProvider}
          </p>
        </section>
      </div>
    </div>
  )
}
