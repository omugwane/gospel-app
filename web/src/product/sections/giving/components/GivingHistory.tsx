'use client'

import { useMemo, useState } from 'react'
import { CalendarDays, ChevronLeft, Download, Receipt, ShieldCheck, Wallet } from 'lucide-react'
import type { DonationStatus, GivingProps } from '@/product/sections/giving/types'

function formatAmount(value: number, currency: string) {
  try {
    return new Intl.NumberFormat('en-US', {
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
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const STATUS_STYLES: Record<DonationStatus, string> = {
  succeeded: 'bg-status-success-bg text-status-success-text border-status-success-border',
  processing: 'bg-status-processing-bg text-status-processing-text border-status-processing-border',
  failed: 'bg-status-failed-bg text-status-failed-text border-status-failed-border',
}

export function GivingHistory({ data, onOpenReceipt, onChangeHistoryYear, onBack }: GivingProps) {
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
    <div className="min-h-screen bg-gradient-to-b from-gradient-from via-gradient-via to-gradient-to">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6 sm:py-8">
        <section className="rounded-3xl border border-content-card-border bg-content-card-bg p-5 sm:p-6 shadow-sm">
          {onBack && (
            <div className="mb-4">
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-1 rounded-full border border-input-border bg-card-bg px-3 py-1.5 text-[11px] font-semibold text-body hover:bg-hover-bg transition-colors"
              >
                <ChevronLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
                Back
              </button>
            </div>
          )}
          <div className="inline-flex items-center gap-2 rounded-full bg-badge-bg px-3 py-1 text-xs font-semibold text-badge-text">
            <Receipt className="h-3.5 w-3.5" strokeWidth={1.8} />
            Giving History
          </div>
          <h1 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight text-heading">
            Your Contributions
          </h1>
          <p className="mt-1.5 text-sm sm:text-base text-body">
            Track yearly giving totals, donation records, and receipt references.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-badge-bg px-3 py-1 text-xs font-semibold text-badge-text">
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
              className="rounded-xl border border-input-border bg-input-bg px-3 py-2 text-sm text-input-text outline-none focus:ring-2 focus:ring-primary-500/40"
            >
              {years.map((itemYear) => (
                <option key={itemYear} value={itemYear}>
                  {itemYear}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-primary-muted-fg/40 bg-primary-muted p-3">
              <p className="text-[11px] text-primary-muted-fg">Yearly total ({data.givingSummary.yearlyTotal.currency})</p>
              <p className="mt-1 text-xl font-semibold text-primary-muted-fg">
                {formatAmount(yearTotals.totalAmount, data.givingSummary.yearlyTotal.currency)}
              </p>
            </div>
            <div className="rounded-2xl border border-secondary-muted-fg/40 bg-secondary-muted p-3">
              <p className="text-[11px] text-secondary-muted-fg">Successful donations</p>
              <p className="mt-1 text-xl font-semibold text-secondary-muted-fg">
                {yearTotals.successfulCount}
              </p>
            </div>
            <div className="rounded-2xl border border-border-default bg-muted-bg p-3">
              <p className="text-[11px] text-muted-strong">Recurring donations</p>
              <p className="mt-1 text-xl font-semibold text-heading">
                {yearTotals.recurringCount}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-5 rounded-3xl border border-content-card-border bg-content-card-bg p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-heading">Receipts & Records</h2>
          <p className="mt-1 text-sm text-body">
            Download a receipt for any successful donation.
          </p>

          <div className="mt-4 space-y-2.5">
            {yearRecords.length === 0 ? (
              <div className="rounded-2xl border border-border-default bg-muted-bg px-3.5 py-3 text-sm text-body">
                No donations found for this year.
              </div>
            ) : (
              yearRecords.map((record) => (
                <div
                  key={record.id}
                  className="rounded-2xl border border-border-default bg-card-bg-solid px-3.5 py-3 flex flex-wrap items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-heading truncate">
                      {record.fundTitle}
                    </p>
                    <p className="mt-0.5 text-xs text-body">
                      {formatDateLabel(record.date)} • {record.paymentMethodLabel}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-strong">
                      {record.receiptNumber}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 ml-auto">
                    <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${STATUS_STYLES[record.status]}`}>
                      {record.status}
                    </span>
                    <span className="text-sm font-semibold text-heading">
                      {formatAmount(record.amount, record.currency)}
                    </span>
                    <button
                      type="button"
                      onClick={() => onOpenReceipt?.(record.id)}
                      disabled={record.status !== 'succeeded'}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-input-border px-3 py-1.5 text-xs font-semibold text-body hover:bg-hover-bg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

        <section className="mt-4 rounded-2xl border border-secondary-muted-fg/40 bg-secondary-muted px-4 py-3">
          <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-secondary-muted-fg">
            <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.8} />
            Records are private and tied to your secure giving account.
          </p>
          <p className="mt-1 text-xs text-body">
            Helpful for annual summaries and tax documentation where applicable.
          </p>
          <p className="mt-1 text-xs text-body inline-flex items-center gap-1">
            <Wallet className="h-3.5 w-3.5" strokeWidth={1.8} />
            Gateway: {data.gatewayProvider}
          </p>
        </section>
      </div>
    </div>
  )
}
