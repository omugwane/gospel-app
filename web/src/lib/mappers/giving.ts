/**
 * Giving section mapper.
 *
 * Combines Sanity editorial (fund definitions, thank-you content)
 * with Firebase donation history and payment state.
 */

import { sanityClient } from '@/lib/sanity/client'
import { givingFundsQuery, givingEditorialQuery } from '@/lib/sanity/queries'
import type {
  GivingData,
  ImpactFund,
  HeartOfGivingVideo,
  ThankYouContent,
  CurrencyCode,
} from '@/product/sections/giving/types'

const CURRENCY_OPTIONS: CurrencyCode[] = ['RWF', 'USD', 'EUR', 'CAD']

const PRESET_AMOUNTS: Record<CurrencyCode, number[]> = {
  RWF: [5000, 20000, 50000, 100000],
  USD: [5, 20, 50, 100],
  EUR: [5, 20, 50],
  CAD: [10, 25, 50],
}

const DEFAULT_PAYMENT_METHODS = [
  { id: 'mtn-momo', label: 'MTN MoMo', type: 'mobile_money' as const, region: 'Rwanda/Africa', isEnabled: true },
  { id: 'airtel-money', label: 'Airtel Money', type: 'mobile_money' as const, region: 'Rwanda/Africa', isEnabled: true },
  { id: 'visa-mastercard', label: 'Visa / Mastercard', type: 'card' as const, region: 'Global', isEnabled: true },
  { id: 'apple-pay', label: 'Apple Pay', type: 'wallet' as const, region: 'Global', isEnabled: true },
  { id: 'google-pay', label: 'Google Pay', type: 'wallet' as const, region: 'Global', isEnabled: true },
]

function mapImpactFund(doc: Record<string, unknown>): ImpactFund {
  return {
    id: (doc._id as string) ?? '',
    title: (doc.title as string) ?? '',
    description: (doc.description as string) ?? '',
    goalAmount: (doc.goalAmount as number) ?? 0,
    raisedAmount: (doc.raisedAmount as number) ?? 0,
    currency: ((doc.currency as string) ?? 'RWF') as CurrencyCode,
  }
}

export async function getGivingData(): Promise<GivingData> {
  const [fundDocs, editorialDoc] = await Promise.all([
    sanityClient.fetch(givingFundsQuery),
    sanityClient.fetch(givingEditorialQuery),
  ])

  const fundList = Array.isArray(fundDocs) ? fundDocs : []
  const impactFunds = fundList.map((f) => mapImpactFund(f as Record<string, unknown>))

  const editorial = editorialDoc as Record<string, unknown> | null
  const firstFundId = impactFunds[0]?.id ?? ''

  const heartOfGivingVideo: HeartOfGivingVideo = {
    title: (editorial?.heartOfGivingTitle as string) ?? 'The Heart of Partnership',
    durationSeconds: (editorial?.heartOfGivingDurationSeconds as number) ?? 60,
    thumbnailUrl: (editorial?.heartOfGivingThumbnailUrl as string) ?? '',
    videoUrl: (editorial?.heartOfGivingVideoUrl as string) ?? '',
    message: (editorial?.heartOfGivingMessage as string) ?? 'A short invitation from Pastor Senga to partner through generosity.',
  }

  const thankYouContent: ThankYouContent = {
    title: (editorial?.thankYouTitle as string) ?? 'Murakoze for partnering',
    message: (editorial?.thankYouMessage as string) ?? 'Pastor Senga prays a blessing over your household and seed.',
    videoUrl: (editorial?.thankYouVideoUrl as string) ?? '',
    durationSeconds: (editorial?.thankYouDurationSeconds as number) ?? 35,
  }

  return {
    gatewayProvider: 'Flutterwave',
    securityBadgeText: 'Secured by Flutterwave • HTTPS Encrypted',
    heartOfGivingVideo,
    impactFunds,
    paymentMethods: DEFAULT_PAYMENT_METHODS,
    currencyOptions: CURRENCY_OPTIONS,
    presetAmountsByCurrency: PRESET_AMOUNTS,
    givingWizardState: {
      step: 'amount',
      currency: 'RWF',
      amount: 20000,
      categoryId: firstFundId,
      frequency: 'one_time',
      isAnonymous: false,
      selectedPaymentMethodId: 'mtn-momo',
      savePaymentMethod: true,
    },
    savedPaymentMethods: [],
    availableRecurringIntervals: ['monthly'],
    donationHistory: [],
    givingSummary: {
      selectedYear: new Date().getFullYear(),
      yearlyTotal: { currency: 'RWF', amount: 0 },
      successfulDonationsCount: 0,
      recurringDonationsCount: 0,
    },
    thankYouContent,
    recentReceiptDownloads: [],
  }
}
