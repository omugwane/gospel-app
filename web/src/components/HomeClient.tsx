'use client'

import { useRouter } from 'next/navigation'
import type { HomeData, LanguageCode } from '@/product/sections/home/types'
import { HomeDashboard } from '@/product/sections/home/components/HomeDashboard'

function pickVerseText(
  translations: Record<LanguageCode, { text: string }>,
  locale: LanguageCode
): string {
  const order: LanguageCode[] = [locale, 'rw', 'en', 'fr']
  for (const code of order) {
    const text = translations[code]?.text?.trim()
    if (text) return text
  }
  return ''
}

export default function HomeClient({
  data,
  locale,
}: {
  data: HomeData
  locale: LanguageCode
}) {
  const router = useRouter()

  return (
    <HomeDashboard
      data={data}
      locale={locale}
      onShareVerse={(verseId, target) => {
        const verse = data.dailyManna.verse
        const verseText = pickVerseText(verse.translations, locale)
        const shareText = `${verse.reference} – ${verseText}`

        if (target === 'whatsapp') {
          const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`
          if (typeof window !== 'undefined') window.open(url, '_blank')
        } else if (typeof navigator !== 'undefined' && navigator.share) {
          navigator.share({ text: shareText }).catch(() => {
            if (typeof window !== 'undefined') {
              window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank')
            }
          })
        } else if (typeof window !== 'undefined') {
          window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank')
        }
      }}
      onPlayDailyImbuguro={() => {
        router.push(data.detailRoutes.exhortation)
      }}
      onContinueJourney={(planId) => {
        router.push(`/plans?plan=${planId}`)
      }}
      onOpenLiveNow={(watchUrl) => {
        if (typeof window !== 'undefined') window.open(watchUrl, '_blank')
      }}
      onOpenUpcomingPrayer={(prayerId) => {
        router.push(`/fellowship?prayer=${prayerId}`)
      }}
      onOpenTestimony={(testimonyId) => {
        router.push(data.detailRoutes.testimony)
      }}
      onJoinPrayerPulse={() => {
        router.push('/fellowship')
      }}
      onResumeMedia={(mediaId) => {
        router.push(data.detailRoutes.media)
      }}
      onOpenSeries={(seriesId) => {
        router.push(`/library/series/${seriesId}`)
      }}
      onOpenDetailView={(route) => {
        router.push(route)
      }}
    />
  )
}
