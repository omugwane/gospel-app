export type CurrencyCode = 'RWF' | 'USD' | 'EUR' | 'CAD'

export type GivingStep = 'amount' | 'category' | 'payment' | 'review' | 'success'

export type GivingFrequency = 'one_time' | 'monthly'

export type PaymentMethodType = 'mobile_money' | 'card' | 'wallet'

export type DonationStatus = 'succeeded' | 'processing' | 'failed'

export type RecurringInterval = 'monthly'

export interface HeartOfGivingVideo {
  title: string
  durationSeconds: number
  thumbnailUrl: string
  videoUrl: string
  message: string
}

export interface ImpactFund {
  id: string
  title: string
  description: string
  goalAmount: number
  raisedAmount: number
  currency: CurrencyCode
}

export interface PaymentMethod {
  id: string
  label: string
  type: PaymentMethodType
  region: string
  isEnabled: boolean
}

export interface SavedPaymentMethod {
  id: string
  label: string
  methodType: PaymentMethodType
  provider: string
  isDefault: boolean
}

export interface GivingWizardState {
  step: GivingStep
  currency: CurrencyCode
  amount: number
  categoryId: string
  frequency: GivingFrequency
  isAnonymous: boolean
  selectedPaymentMethodId: string
  savePaymentMethod: boolean
}

export interface DonationRecord {
  id: string
  date: string
  fundId: string
  fundTitle: string
  amount: number
  currency: CurrencyCode
  frequency: GivingFrequency
  paymentMethodLabel: string
  status: DonationStatus
  isAnonymous: boolean
  receiptNumber: string
}

export interface YearlyTotal {
  currency: CurrencyCode
  amount: number
}

export interface GivingSummary {
  selectedYear: number
  yearlyTotal: YearlyTotal
  successfulDonationsCount: number
  recurringDonationsCount: number
}

export interface ThankYouContent {
  title: string
  message: string
  videoUrl: string
  durationSeconds: number
}

export interface NewDonationInput {
  amount: number
  currency: CurrencyCode
  categoryId: string
  paymentMethodId: string
  frequency: GivingFrequency
  isAnonymous: boolean
  savePaymentMethod: boolean
}

export interface GivingData {
  gatewayProvider: string
  securityBadgeText: string
  heartOfGivingVideo: HeartOfGivingVideo
  impactFunds: ImpactFund[]
  paymentMethods: PaymentMethod[]
  currencyOptions: CurrencyCode[]
  presetAmountsByCurrency: Record<CurrencyCode, number[]>
  givingWizardState: GivingWizardState
  savedPaymentMethods: SavedPaymentMethod[]
  availableRecurringIntervals: RecurringInterval[]
  donationHistory: DonationRecord[]
  givingSummary: GivingSummary
  thankYouContent: ThankYouContent
  recentReceiptDownloads: string[]
}

export interface GivingProps {
  data: GivingData

  /**
   * Triggered when the user changes the wizard step.
   */
  onChangeStep?: (step: GivingStep) => void

  /**
   * Triggered when the user selects a preset or custom giving amount.
   */
  onSelectAmount?: (amount: number, currency: CurrencyCode) => void

  /**
   * Triggered when the user chooses a giving category/fund.
   */
  onSelectCategory?: (categoryId: string) => void

  /**
   * Triggered when the user chooses one-time or recurring frequency.
   */
  onSelectFrequency?: (frequency: GivingFrequency) => void

  /**
   * Triggered when the user selects the payment method.
   */
  onSelectPaymentMethod?: (paymentMethodId: string) => void

  /**
   * Triggered when the user submits a new gift.
   */
  onSubmitDonation?: (input: NewDonationInput) => void

  /**
   * Triggered when the user toggles anonymous giving.
   */
  onToggleAnonymous?: (isAnonymous: boolean) => void

  /**
   * Triggered when the user toggles save payment method.
   */
  onToggleSavePaymentMethod?: (savePaymentMethod: boolean) => void

  /**
   * Triggered when user opens a donation receipt by record id.
   */
  onOpenReceipt?: (donationId: string) => void

  /**
   * Triggered when user filters or changes giving history year.
   */
  onChangeHistoryYear?: (year: number) => void

  /**
   * Triggered when user opens the giving history view.
   */
  onOpenHistory?: () => void

  /**
   * Navigates back to the Giving hub.
   */
  onBack?: () => void
}
