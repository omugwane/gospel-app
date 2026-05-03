/**
 * Home section mapper.
 *
 * Combines Sanity content (daily verse, imbuguro, series, live)
 * with Firebase user state (viewer, active journey, fellowship
 * highlights) to produce the HomeData prop payload.
 */

import { sanityClient } from '@/lib/sanity/client'
import {
  dailyVerseQuery,
  dailyImbuguroQuery,
  allSeriesQuery,
  liveUpdateQuery,
} from '@/lib/sanity/queries'
import {
  defaultViewer,
  defaultGreetings,
  defaultActiveJourney,
  defaultLiveUrgent,
  defaultFellowshipHighlights,
  defaultMediaShortcuts,
  defaultDetailRoutes,
} from '@/lib/defaults'
import type {
  HomeData,
  DailyManna,
  LiveUrgent,
  SeriesCard,
} from '@/product/sections/home/types'
import type { LanguageCode } from '@/product/sections/home/types'

function getTodayIso(): string {
  return new Date().toISOString().slice(0, 10)
}

function pickVerseTranslations(v: {
  textRw?: string | null
  textEn?: string | null
  textFr?: string | null
}) {
  const rw = v.textRw?.trim()
  const en = v.textEn?.trim()
  const fr = v.textFr?.trim()
  return {
    rw: rw ? { text: rw } : undefined,
    en: en ? { text: en } : undefined,
    fr: fr ? { text: fr } : undefined,
  }
}

function buildDailyManna(
  verseDoc: Record<string, unknown> | null,
  imbuguroDoc: Record<string, unknown> | null,
  today: string
): DailyManna {
  const verseId = (verseDoc?._id as string) ?? `verse_${today.replace(/-/g, '_')}`
  const verseRef = (verseDoc?.reference as string) ?? ''
  const verseTranslations = pickVerseTranslations({
    textRw: verseDoc?.textRw as string | null | undefined,
    textEn: verseDoc?.textEn as string | null | undefined,
    textFr: verseDoc?.textFr as string | null | undefined,
  })
  const shareEnabled = (verseDoc?.shareEnabled as boolean) ?? true

  const impId = (imbuguroDoc?._id as string) ?? `imp_${today.replace(/-/g, '_')}`
  const impTitle = (imbuguroDoc?.title as string) ?? ''
  const impDuration = (imbuguroDoc?.durationSeconds as number) ?? 0
  const impAudioUrl = (imbuguroDoc?.audioUrl as string) ?? ''
  const impSummary = (imbuguroDoc?.summary as string) ?? ''
  const impTranscript = (imbuguroDoc?.transcript as string) ?? ''

  return {
    date: today,
    verse: {
      id: verseId,
      reference: verseRef,
      translations: {
        rw: verseTranslations.rw ?? verseTranslations.en ?? verseTranslations.fr ?? { text: '' },
        en: verseTranslations.en ?? verseTranslations.fr ?? verseTranslations.rw ?? { text: '' },
        fr: verseTranslations.fr ?? verseTranslations.en ?? verseTranslations.rw ?? { text: '' },
      },
      share: { enabled: shareEnabled, target: 'whatsapp' },
    },
    dailyImbuguro: {
      id: impId,
      title: impTitle,
      durationSeconds: impDuration,
      audioUrl: impAudioUrl,
      summary: impSummary,
      transcript: impTranscript,
    },
  }
}

function buildLiveUrgent(liveDoc: Record<string, unknown> | null): LiveUrgent {
  if (!liveDoc || !liveDoc.status) {
    return { ...defaultLiveUrgent }
  }
  const status = (liveDoc.status as string) ?? 'idle'
  const title = (liveDoc.title as string) ?? ''
  const platform = ((liveDoc.platform as string) ?? 'YouTube') as 'YouTube' | 'Radio' | 'Other'
  const startedAt = (liveDoc.startedAt as string) ?? ''
  const watchUrl = (liveDoc.watchUrl as string) ?? ''
  const upcomingTitle = (liveDoc.upcomingTitle as string) ?? ''
  const upcomingStartsAt = (liveDoc.upcomingStartsAt as string) ?? ''

  const isLive = status === 'live'
  const hasUpcoming = !!upcomingTitle && !!upcomingStartsAt
  const isVisible = isLive || hasUpcoming

  let startsInHours = 0
  if (upcomingStartsAt) {
    const diff = new Date(upcomingStartsAt).getTime() - Date.now()
    startsInHours = Math.max(0, Math.round(diff / (1000 * 60 * 60)))
  }

  return {
    isVisible,
    liveNow: {
      status: (isLive ? 'live' : 'idle') as LiveUrgent['liveNow']['status'],
      title: isLive ? title : '',
      platform,
      startedAt: isLive ? startedAt : '',
      watchUrl: isLive ? watchUrl : '',
    },
    upcomingPrayer: {
      id: liveDoc._id ? String(liveDoc._id) : '',
      title: upcomingTitle,
      startsInHours,
      startsAt: upcomingStartsAt,
      participantPreview: [],
    },
  }
}

function buildSeriesCards(seriesDocs: unknown[]): SeriesCard[] {
  return seriesDocs.slice(0, 6).map((s) => {
    const doc = s as Record<string, unknown>
    const id = (doc._id as string) ?? ''
    const title = (doc.title as string) ?? ''
    const thumbnailUrl = (doc.thumbnailUrl as string) ?? ''
    const updatedAt = (doc._createdAt as string) ?? new Date().toISOString()
    return {
      id,
      title,
      thumbnailUrl,
      itemCount: (doc.sermonCount as number) ?? 0,
      updatedAt,
    }
  })
}

export async function getHomeData(): Promise<HomeData> {
  const today = getTodayIso()

  const [verseDoc, imbuguroDoc, seriesDocs, liveDoc] = await Promise.all([
    sanityClient.fetch(dailyVerseQuery, { today }),
    sanityClient.fetch(dailyImbuguroQuery, { today }),
    sanityClient.fetch(allSeriesQuery),
    sanityClient.fetch(liveUpdateQuery, { today }),
  ])

  const seriesList = Array.isArray(seriesDocs) ? seriesDocs : []
  const dailyManna = buildDailyManna(verseDoc, imbuguroDoc, today)
  const liveUrgent = buildLiveUrgent(liveDoc)
  const newestSeries = buildSeriesCards(seriesList)

  const verseId = dailyManna.verse.id
  const impId = dailyManna.dailyImbuguro.id
  const firstSeriesId = newestSeries[0]?.id ?? ''

  return {
    viewer: defaultViewer,
    greetings: defaultGreetings,
    dailyManna,
    activeJourney: defaultActiveJourney,
    liveUrgent,
    fellowshipHighlights: defaultFellowshipHighlights,
    mediaShortcuts: {
      ...defaultMediaShortcuts,
      newestSeries,
    },
    detailRoutes: defaultDetailRoutes(verseId, impId, firstSeriesId),
  }
}
