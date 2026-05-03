'use client'

import { useRouter } from 'next/navigation'
import { VerseDetail } from '@/product/sections/home/components/VerseDetail'
import type { HomeData, LanguageCode } from '@/product/sections/home/types'

function pickVerseText(
  translations: Record<LanguageCode, { text: string }>,
  locale: LanguageCode
): string {
  const order: LanguageCode[] = [locale, 'en', 'fr', 'rw']
  for (const code of order) {
    const text = translations[code]?.text?.trim()
    if (text) return text
  }
  return ''
}

export default function VerseDetailClient({
  data,
  locale,
}: {
  data: HomeData
  locale: LanguageCode
}) {
  const router = useRouter()
  const verse = data.dailyManna.verse

  return (
    <VerseDetail
      data={data}
      locale={locale}
      onShareVerse={(verseId, target) => {
        const verseText = pickVerseText(verse.translations, locale)
        const shareText = `${verse.reference} – ${verseText}`
        const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`
        if (typeof window !== 'undefined') window.open(url, '_blank')
      }}
      onPlayDailyImbuguro={() => router.push(data.detailRoutes.exhortation)}
      onOpenDetailView={(route) => router.push(route === '/home' ? '/' : route)}
    />
  )
}
