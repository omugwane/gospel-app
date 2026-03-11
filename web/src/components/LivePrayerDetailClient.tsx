'use client'

import { useRouter } from 'next/navigation'
import { LivePrayerDetail } from '@/product/sections/home/components/LivePrayerDetail'
import type { HomeData, LanguageCode } from '@/product/sections/home/types'

export default function LivePrayerDetailClient({
  data,
  locale,
}: {
  data: HomeData
  locale: LanguageCode
}) {
  const router = useRouter()
  const { liveNow, upcomingPrayer } = data.liveUrgent

  return (
    <LivePrayerDetail
      data={data}
      onOpenLiveNow={(watchUrl) => {
        if (typeof window !== 'undefined') window.open(watchUrl, '_blank')
      }}
      onOpenUpcomingPrayer={(prayerId) => router.push(`/fellowship?prayer=${prayerId}`)}
      onOpenDetailView={(route) => router.push(route === '/home' ? '/' : route)}
    />
  )
}
