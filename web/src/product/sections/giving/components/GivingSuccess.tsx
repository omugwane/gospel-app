'use client'

import { useMemo } from 'react'
import { CheckCircle2, Download, PlayCircle, ReceiptText, ShieldCheck, Sparkles } from 'lucide-react'
import type { DonationRecord, GivingProps } from '@/product/sections/giving/types'

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
    <div className="min-h-screen bg-gradient-to-b from-gradient-from via-gradient-via to-gradient-to">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-7 sm:py-10">
        <section className="rounded-3xl border border-content-card-border bg-content-card-bg p-6 sm:p-8 shadow-sm">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-secondary-muted flex items-center justify-center">
            <CheckCircle2 className="h-9 w-9 text-secondary-muted-fg" strokeWidth={1.9} />
          </div>
          <h1 className="mt-4 text-center text-2xl sm:text-3xl font-semibold tracking-tight text-heading">
            Your gift was received. Murakoze cyane.
          </h1>
          <p className="mt-2 text-center text-sm sm:text-base text-body">
            Thank you for partnering with Pastor Senga Emmanuel's ministry.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-border-default bg-muted-bg p-3 text-center">
              <p className="text-[11px] text-muted-strong">Amount</p>
              <p className="mt-1 text-base font-semibold text-heading">
                {donation ? formatAmount(donation.amount, donation.currency) : '-'}
              </p>
            </div>
            <div className="rounded-2xl border border-border-default bg-muted-bg p-3 text-center">
              <p className="text-[11px] text-muted-strong">Category</p>
              <p className="mt-1 text-base font-semibold text-heading">
                {donation?.fundTitle ?? 'General Tithe & Offering'}
              </p>
            </div>
            <div className="rounded-2xl border border-border-default bg-muted-bg p-3 text-center">
              <p className="text-[11px] text-muted-strong">Reference</p>
              <p className="mt-1 text-base font-semibold text-heading">
                {donation?.receiptNumber ?? 'Pending'}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-primary-muted-fg/40 bg-primary-muted p-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-muted px-3 py-1 text-xs font-semibold text-primary-muted-fg">
              <PlayCircle className="h-3.5 w-3.5" strokeWidth={1.8} />
              Thank You Prayer Video
            </div>
            <h2 className="mt-2 text-lg font-semibold text-heading">
              {data.thankYouContent.title}
            </h2>
            <p className="mt-1 text-sm text-body">{data.thankYouContent.message}</p>
            <div className="mt-3 inline-flex items-center gap-2 rounded-xl border border-primary-muted-fg/40 bg-card-bg px-3 py-2 text-xs text-body">
              <Sparkles className="h-3.5 w-3.5 text-primary-muted-fg" strokeWidth={1.8} />
              Prayer clip length: {data.thankYouContent.durationSeconds}s
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-secondary-muted-fg/40 bg-secondary-muted px-4 py-3">
            <p className="inline-flex items-center gap-2 text-xs font-semibold text-secondary-muted-fg">
              <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.8} />
              {data.securityBadgeText}
            </p>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => donation && onOpenReceipt?.(donation.id)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary-solid px-4 py-2 text-sm font-semibold text-primary-solid-fg hover:opacity-90 transition-opacity"
            >
              <Download className="h-4 w-4" strokeWidth={1.8} />
              Download Receipt
            </button>
            <button
              type="button"
              onClick={() => onChangeStep?.('amount')}
              className="inline-flex items-center gap-1.5 rounded-xl border border-input-border px-4 py-2 text-sm font-semibold text-body hover:bg-hover-bg transition-colors"
            >
              <ReceiptText className="h-4 w-4" strokeWidth={1.8} />
              Give Again
            </button>
          </div>
        </section>

        <section className="mt-4 rounded-2xl border border-border-default bg-content-card-bg p-4">
          <h3 className="text-sm font-semibold text-heading">Digital receipt details</h3>
          <p className="mt-1 text-xs text-body">
            {donation
              ? `Receipt ${donation.receiptNumber} generated for ${formatDateLabel(donation.date)} via ${donation.paymentMethodLabel}.`
              : 'Receipt will appear here once donation is recorded.'}
          </p>
        </section>
      </div>
    </div>
  )
}
