'use client'

import { useRouter } from 'next/navigation'
import type {
  CurrencyCode,
  GivingFrequency,
  GivingStep,
  NewDonationInput,
} from '@/product/sections/giving/types'

export function useGivingCallbacks() {
  const router = useRouter()

  return {
    onChangeStep: (step: GivingStep) => {
      console.log('Change step:', step)
    },
    onSelectAmount: (amount: number, currency: CurrencyCode) => {
      console.log('Select amount:', amount, currency)
    },
    onSelectCategory: (categoryId: string) => {
      console.log('Select category:', categoryId)
    },
    onSelectFrequency: (frequency: GivingFrequency) => {
      console.log('Select frequency:', frequency)
    },
    onSelectPaymentMethod: (paymentMethodId: string) => {
      console.log('Select payment method:', paymentMethodId)
    },
    onSubmitDonation: (input: NewDonationInput) => {
      console.log('Submit donation:', input)
    },
    onToggleAnonymous: (isAnonymous: boolean) => {
      console.log('Toggle anonymous:', isAnonymous)
    },
    onToggleSavePaymentMethod: (savePaymentMethod: boolean) => {
      console.log('Toggle save payment method:', savePaymentMethod)
    },
    onOpenReceipt: (donationId: string) => {
      console.log('Open receipt:', donationId)
    },
    onChangeHistoryYear: (year: number) => {
      console.log('Change history year:', year)
    },
    onOpenHistory: () => router.push('/giving/history'),
    onBack: () => router.push('/giving'),
  }
}
