import { useMemo, useState } from 'react'
import { CheckCircle2, ChevronRight, LockKeyhole, PlayCircle, ShieldCheck, Wallet } from 'lucide-react'
import type {
  CurrencyCode,
  GivingFrequency,
  GivingProps,
  GivingStep,
  NewDonationInput,
} from '@/../product/sections/giving/types'

function formatAmount(value: number, currency: CurrencyCode) {
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

function progressPercent(raised: number, goal: number) {
  if (goal <= 0) return 0
  return Math.min(100, Math.round((raised / goal) * 100))
}

export function GivingHubWizard({
  data,
  onChangeStep,
  onSelectAmount,
  onSelectCategory,
  onSelectFrequency,
  onSelectPaymentMethod,
  onSubmitDonation,
  onToggleAnonymous,
  onToggleSavePaymentMethod,
}: GivingProps) {
  const [step, setStep] = useState<GivingStep>(data.givingWizardState.step)
  const [currency, setCurrency] = useState<CurrencyCode>(data.givingWizardState.currency)
  const [amount, setAmount] = useState<number>(data.givingWizardState.amount)
  const [customAmount, setCustomAmount] = useState<string>('')
  const [categoryId, setCategoryId] = useState<string>(data.givingWizardState.categoryId)
  const [frequency, setFrequency] = useState<GivingFrequency>(data.givingWizardState.frequency)
  const [isAnonymous, setIsAnonymous] = useState<boolean>(data.givingWizardState.isAnonymous)
  const [paymentMethodId, setPaymentMethodId] = useState<string>(data.givingWizardState.selectedPaymentMethodId)
  const [savePaymentMethod, setSavePaymentMethod] = useState<boolean>(data.givingWizardState.savePaymentMethod)

  const selectedFund = useMemo(
    () => data.impactFunds.find((fund) => fund.id === categoryId) ?? data.impactFunds[0],
    [categoryId, data.impactFunds]
  )

  const selectedPayment = useMemo(
    () => data.paymentMethods.find((method) => method.id === paymentMethodId) ?? data.paymentMethods[0],
    [paymentMethodId, data.paymentMethods]
  )

  const presets = data.presetAmountsByCurrency[currency] ?? []
  const stepOrder: GivingStep[] = ['amount', 'category', 'payment']

  const currentIndex = stepOrder.indexOf(step)
  const canContinue = Boolean(
    (step === 'amount' && amount > 0) ||
      (step === 'category' && categoryId) ||
      (step === 'payment' && paymentMethodId)
  )

  const goToStep = (nextStep: GivingStep) => {
    setStep(nextStep)
    onChangeStep?.(nextStep)
  }

  const goNext = () => {
    if (step === 'amount') goToStep('category')
    if (step === 'category') goToStep('payment')
    if (step === 'payment') goToStep('review')
  }

  const goBack = () => {
    if (step === 'payment') goToStep('category')
    if (step === 'category') goToStep('amount')
    if (step === 'review') goToStep('payment')
  }

  const handleSubmitDonation = () => {
    const payload: NewDonationInput = {
      amount,
      currency,
      categoryId,
      paymentMethodId,
      frequency,
      isAnonymous,
      savePaymentMethod,
    }
    onSubmitDonation?.(payload)
    goToStep('success')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50/70 via-white to-amber-50/50 dark:from-stone-950 dark:via-stone-950 dark:to-stone-900">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-8">
        <section className="rounded-3xl border border-violet-200/70 dark:border-violet-400/40 bg-white/90 dark:bg-stone-900 p-5 sm:p-6 shadow-sm">
          <div className="inline-flex items-center gap-2 rounded-full bg-violet-100 dark:bg-violet-500/20 px-3 py-1 text-xs font-semibold text-violet-800 dark:text-violet-100">
            <PlayCircle className="h-3.5 w-3.5" strokeWidth={1.8} />
            {data.heartOfGivingVideo.title}
          </div>
          <h1 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight text-stone-950 dark:text-stone-50">
            Generosity Hub
          </h1>
          <p className="mt-1.5 text-sm sm:text-base text-stone-700 dark:text-stone-100">
            Partner with the ministry through secure giving and visible impact.
          </p>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <div className="rounded-2xl border border-stone-200 dark:border-stone-600 bg-stone-50 dark:bg-stone-800 px-4 py-3">
              <p className="text-sm font-medium text-stone-800 dark:text-stone-100">
                {data.heartOfGivingVideo.message}
              </p>
              <p className="mt-1 text-xs text-stone-500 dark:text-stone-200">
                Video duration: {data.heartOfGivingVideo.durationSeconds}s
              </p>
            </div>
            <div className="rounded-2xl border border-amber-200 dark:border-amber-400/40 bg-amber-50/80 dark:bg-amber-500/10 px-4 py-3">
              <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 dark:text-amber-100">
                <LockKeyhole className="h-3.5 w-3.5" strokeWidth={1.8} />
                {data.securityBadgeText}
              </p>
              <p className="mt-1 text-xs text-stone-600 dark:text-stone-100">
                Powered by {data.gatewayProvider} for Rwanda and global options.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-5">
          <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-50">Impact Goals</h2>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            {data.impactFunds.map((fund) => {
              const isSelected = fund.id === categoryId
              const percent = progressPercent(fund.raisedAmount, fund.goalAmount)
              return (
                <button
                  key={fund.id}
                  type="button"
                  onClick={() => {
                    setCategoryId(fund.id)
                    onSelectCategory?.(fund.id)
                  }}
                  className={`rounded-3xl border p-4 text-left transition-all duration-200 ${
                    isSelected
                      ? 'border-violet-300 dark:border-violet-400/60 bg-violet-50 dark:bg-violet-500/10 shadow-md shadow-violet-500/10'
                      : 'border-stone-200 dark:border-stone-600 bg-white/85 dark:bg-stone-900 hover:-translate-y-0.5 hover:shadow-sm'
                  }`}
                >
                  <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">{fund.title}</p>
                  <p className="mt-1 text-xs text-stone-600 dark:text-stone-200 line-clamp-2">{fund.description}</p>
                  <div className="mt-3 h-2 rounded-full bg-stone-200 dark:bg-stone-700">
                    <div
                      className="h-full rounded-full bg-amber-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <p className="mt-1.5 text-[11px] text-stone-600 dark:text-stone-200">
                    {formatAmount(fund.raisedAmount, fund.currency)} / {formatAmount(fund.goalAmount, fund.currency)}
                  </p>
                </button>
              )
            })}
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-stone-200 dark:border-stone-600 bg-white/90 dark:bg-stone-900 p-5 sm:p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            {stepOrder.map((s, index) => (
              <button
                key={s}
                type="button"
                onClick={() => goToStep(s)}
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                  step === s
                    ? 'bg-violet-600 text-white'
                    : index <= currentIndex
                      ? 'bg-violet-100 text-violet-800 dark:bg-violet-500/20 dark:text-violet-100'
                      : 'bg-stone-100 text-stone-500 dark:bg-stone-700 dark:text-stone-200'
                }`}
              >
                {index + 1}. {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>

          {step === 'amount' ? (
            <div className="mt-4 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                {data.currencyOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setCurrency(option)
                      const firstPreset = data.presetAmountsByCurrency[option]?.[0] ?? 0
                      setAmount(firstPreset)
                      onSelectAmount?.(firstPreset, option)
                    }}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                      currency === option
                        ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                        : 'bg-stone-100 text-stone-700 dark:bg-stone-700 dark:text-stone-100'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setAmount(preset)
                      setCustomAmount('')
                      onSelectAmount?.(preset, currency)
                    }}
                    className={`rounded-xl border px-3 py-2 text-sm font-semibold transition-colors ${
                      amount === preset && customAmount === ''
                        ? 'border-violet-500 bg-violet-600 text-white'
                        : 'border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100'
                    }`}
                  >
                    {formatAmount(preset, currency)}
                  </button>
                ))}
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-600 dark:text-stone-100">Other amount</label>
                <input
                  type="number"
                  min={1}
                  value={customAmount}
                  onChange={(event) => {
                    const next = event.target.value
                    setCustomAmount(next)
                    const parsed = Number(next)
                    if (parsed > 0) {
                      setAmount(parsed)
                      onSelectAmount?.(parsed, currency)
                    }
                  }}
                  placeholder={`Enter amount in ${currency}`}
                  className="mt-1 w-full rounded-xl border border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 px-3 py-2.5 text-sm text-stone-900 dark:text-stone-100 outline-none focus:ring-2 focus:ring-violet-500/40"
                />
              </div>
            </div>
          ) : null}

          {step === 'category' ? (
            <div className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-stone-600 dark:text-stone-100">Giving category</label>
                <select
                  value={categoryId}
                  onChange={(event) => {
                    const next = event.target.value
                    setCategoryId(next)
                    onSelectCategory?.(next)
                  }}
                  className="mt-1 w-full rounded-xl border border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 px-3 py-2.5 text-sm text-stone-900 dark:text-stone-100 outline-none focus:ring-2 focus:ring-violet-500/40"
                >
                  {data.impactFunds.map((fund) => (
                    <option key={fund.id} value={fund.id}>
                      {fund.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                {(['one_time', 'monthly'] as GivingFrequency[]).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setFrequency(option)
                      onSelectFrequency?.(option)
                    }}
                    className={`rounded-xl border px-3 py-2 text-sm font-semibold capitalize transition-colors ${
                      frequency === option
                        ? 'border-violet-500 bg-violet-600 text-white'
                        : 'border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100'
                    }`}
                  >
                    {option.replace('_', ' ')}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const next = !isAnonymous
                    setIsAnonymous(next)
                    onToggleAnonymous?.(next)
                  }}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                    isAnonymous
                      ? 'bg-amber-500 text-white'
                      : 'bg-stone-100 text-stone-700 dark:bg-stone-700 dark:text-stone-100'
                  }`}
                >
                  {isAnonymous ? 'Anonymous giving: ON' : 'Anonymous giving: OFF'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const next = !savePaymentMethod
                    setSavePaymentMethod(next)
                    onToggleSavePaymentMethod?.(next)
                  }}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                    savePaymentMethod
                      ? 'bg-violet-600 text-white'
                      : 'bg-stone-100 text-stone-700 dark:bg-stone-700 dark:text-stone-100'
                  }`}
                >
                  {savePaymentMethod ? 'Save payment method: ON' : 'Save payment method: OFF'}
                </button>
              </div>
            </div>
          ) : null}

          {step === 'payment' ? (
            <div className="mt-4 space-y-3">
              {data.paymentMethods
                .filter((method) => method.isEnabled)
                .map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => {
                      setPaymentMethodId(method.id)
                      onSelectPaymentMethod?.(method.id)
                    }}
                    className={`w-full rounded-2xl border px-4 py-3 text-left transition-all duration-200 ${
                      paymentMethodId === method.id
                        ? 'border-violet-500 bg-violet-50 dark:bg-violet-500/10'
                        : 'border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 hover:border-stone-300 dark:hover:border-stone-500'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">{method.label}</p>
                        <p className="text-xs text-stone-600 dark:text-stone-200">{method.region}</p>
                      </div>
                      {paymentMethodId === method.id ? (
                        <CheckCircle2 className="h-5 w-5 text-violet-600 dark:text-violet-200" strokeWidth={2} />
                      ) : (
                        <Wallet className="h-5 w-5 text-stone-500 dark:text-stone-200" strokeWidth={1.9} />
                      )}
                    </div>
                  </button>
                ))}
            </div>
          ) : null}

          {step === 'review' ? (
            <div className="mt-4 rounded-2xl border border-stone-200 dark:border-stone-600 bg-stone-50 dark:bg-stone-800 p-4">
              <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">Review giving details</h3>
              <div className="mt-2 space-y-1 text-sm text-stone-700 dark:text-stone-100">
                <p>
                  Amount: <span className="font-semibold">{formatAmount(amount, currency)}</span>
                </p>
                <p>
                  Category: <span className="font-semibold">{selectedFund?.title}</span>
                </p>
                <p>
                  Frequency: <span className="font-semibold capitalize">{frequency.replace('_', ' ')}</span>
                </p>
                <p>
                  Payment: <span className="font-semibold">{selectedPayment?.label}</span>
                </p>
                <p>
                  Donor mode: <span className="font-semibold">{isAnonymous ? 'Anonymous' : 'Named'}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={handleSubmitDonation}
                className="mt-4 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 transition-colors"
              >
                Complete Giving
              </button>
            </div>
          ) : null}

          {step === 'success' ? (
            <div className="mt-4 rounded-2xl border border-amber-200 dark:border-amber-400/40 bg-amber-50/80 dark:bg-amber-500/10 p-4">
              <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                {data.thankYouContent.title}
              </p>
              <p className="mt-1 text-sm text-stone-700 dark:text-stone-100">
                {data.thankYouContent.message}
              </p>
              <p className="mt-1 text-xs text-stone-600 dark:text-stone-200">
                Thank-you prayer video: {data.thankYouContent.durationSeconds}s
              </p>
            </div>
          ) : null}

          <div className="mt-5 flex flex-wrap items-center gap-2">
            {step !== 'amount' && step !== 'success' ? (
              <button
                type="button"
                onClick={goBack}
                className="rounded-xl border border-stone-300 dark:border-stone-600 px-4 py-2 text-sm font-semibold text-stone-700 dark:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                Back
              </button>
            ) : null}
            {stepOrder.includes(step) ? (
              <button
                type="button"
                onClick={goNext}
                disabled={!canContinue}
                className="inline-flex items-center gap-1.5 rounded-xl bg-stone-900 dark:bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-50 dark:text-stone-900 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all"
              >
                Continue
                <ChevronRight className="h-4 w-4" strokeWidth={2} />
              </button>
            ) : null}
            {step === 'success' ? (
              <button
                type="button"
                onClick={() => goToStep('amount')}
                className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 transition-colors"
              >
                Give Again
              </button>
            ) : null}
          </div>

          <div className="mt-4 rounded-2xl border border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 px-3.5 py-2.5">
            <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-700 dark:text-stone-100">
              <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.8} />
              Trust layer active: HTTPS + secured gateway badge visible
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
