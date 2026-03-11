'use client'

import { useRouter } from 'next/navigation'
import type {
  NewCounselingRequestInput,
  NewPrayerPointInput,
  NewTestimonyInput,
} from '@/product/sections/fellowship/types'

export function useFellowshipCallbacks() {
  const router = useRouter()

  return {
    onOpenFeature: (feature: 'testimony' | 'prayer' | 'counseling') => {
      router.push(`/fellowship/${feature}`)
    },
    onOpenCounselingRequest: (requestId: string) => {
      router.push(`/fellowship/counseling/${requestId}`)
    },
    onBack: () => router.push('/fellowship'),
    onBackToCounseling: () => router.push('/fellowship/counseling'),
    onCreateTestimony: (input: NewTestimonyInput) => {
      console.log('Create testimony:', input)
    },
    onReactToTestimony: (testimonyId: string, action: 'praise-god' | 'share') => {
      console.log('React to testimony:', testimonyId, action)
    },
    onSubmitPrayerPoint: (input: NewPrayerPointInput) => {
      console.log('Submit prayer point:', input)
    },
    onCommitPrayer: (prayerPointId: string) => {
      console.log('Commit prayer:', prayerPointId)
    },
    onSubmitCounselingRequest: (input: NewCounselingRequestInput) => {
      console.log('Submit counseling request:', input)
    },
  }
}
