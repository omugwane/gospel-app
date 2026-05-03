/**
 * Sanity GROQ queries for content.
 * Field names align with schema definitions.
 */

export const dailyVerseQuery = `*[_type == "dailyVerse" && date == $today][0]{
  _id,
  date,
  reference,
  textRw,
  textEn,
  textFr,
  shareEnabled
}`

export const dailyImbuguroQuery = `*[_type == "dailyImbuguro" && date == $today][0]{
  _id,
  date,
  title,
  durationSeconds,
  "audioUrl": audio.asset->url,
  summary,
  transcript
}`

export const allSeriesQuery = `*[_type == "series"] | order(_createdAt desc){
  _id,
  title,
  "slug": slug.current,
  description,
  "thumbnailUrl": image.asset->url,
  topics,
  titleEn,
  titleFr,
  descriptionEn,
  descriptionFr,
  _createdAt,
  "sermonCount": count(*[_type == "sermon" && references(^._id)])
}`

export const allSermonsQuery = `*[_type == "sermon"] | order(publishedAt desc){
  _id,
  title,
  "slug": slug.current,
  series,
  episodeNumber,
  topics,
  publishedAt,
  durationSeconds,
  scriptureReferences,
  summary,
  transcript,
  "audioUrl": audio.asset->url,
  muxVideo{
    asset->{
      "playbackIds": data.playback_ids
    }
  },
  muxPlaybackId,
  youtubeUrl,
  "thumbnailUrl": thumbnail.asset->url,
  titleEn,
  titleFr,
  summaryEn,
  summaryFr,
  transcriptEn,
  transcriptFr
}`

export const sermonsBySeriesQuery = `*[_type == "sermon" && series._ref == $seriesId] | order(coalesce(episodeNumber, 9999) asc, publishedAt asc){
  _id,
  title,
  "slug": slug.current,
  series,
  episodeNumber,
  topics,
  publishedAt,
  durationSeconds,
  scriptureReferences,
  summary,
  transcript,
  "audioUrl": audio.asset->url,
  muxVideo{
    asset->{
      "playbackIds": data.playback_ids
    }
  },
  muxPlaybackId,
  youtubeUrl,
  "thumbnailUrl": thumbnail.asset->url,
  titleEn,
  titleFr,
  summaryEn,
  summaryFr,
  transcriptEn,
  transcriptFr
}`

export const sermonByIdQuery = `*[_type == "sermon" && _id == $id][0]{
  _id,
  title,
  "slug": slug.current,
  series,
  episodeNumber,
  topics,
  publishedAt,
  durationSeconds,
  scriptureReferences,
  summary,
  transcript,
  "audioUrl": audio.asset->url,
  muxVideo{
    asset->{
      "playbackIds": data.playback_ids
    }
  },
  muxPlaybackId,
  youtubeUrl,
  "thumbnailUrl": thumbnail.asset->url,
  titleEn,
  titleFr,
  summaryEn,
  summaryFr,
  transcriptEn,
  transcriptFr
}`

export const allTopicsQuery = `*[_type == "topic"] | order(label asc){
  _id,
  label,
  "slug": slug.current,
  labelEn,
  labelFr
}`

export const allPlansQuery = `*[_type == "plan"] | order(_createdAt desc){
  _id,
  title,
  description,
  durationDays,
  type,
  "thumbnailUrl": thumbnail.asset->url,
  categories,
  author,
  hasAudio,
  hasVideo,
  hasPassages,
  hasWritten,
  _createdAt
}`

export const planByIdQuery = `*[_type == "plan" && _id == $planId][0]{
  _id,
  title,
  description,
  durationDays,
  type,
  "thumbnailUrl": thumbnail.asset->url,
  categories,
  author,
  hasAudio,
  hasVideo,
  hasPassages,
  hasWritten
}`

export const planDaysByPlanQuery = `*[_type == "planDay" && plan._ref == $planId] | order(dayNumber asc){
  _id,
  plan,
  dayNumber,
  content
}`

export const allPlanDaysQuery = `*[_type == "planDay"] | order(plan._ref asc, dayNumber asc){
  _id,
  "planId": plan._ref,
  dayNumber,
  content[]{
    _key,
    type,
    title,
    textPreview,
    refs,
    durationSeconds,
    "url": media.asset->url,
    passageText
  }
}`

export const allPlanCategoriesQuery = `*[_type == "planCategory"] | order(label asc){
  _id,
  label
}`

export const givingFundsQuery = `*[_type == "impactFund"] | order(order asc){
  _id,
  title,
  description,
  goalAmount,
  raisedAmount,
  currency,
  order
}`

export const givingEditorialQuery = `*[_type == "givingContent"][0]{
  _id,
  heartOfGivingTitle,
  heartOfGivingMessage,
  "heartOfGivingVideoUrl": heartOfGivingVideo.asset->url,
  "heartOfGivingThumbnailUrl": heartOfGivingThumbnail.asset->url,
  heartOfGivingDurationSeconds,
  thankYouTitle,
  thankYouMessage,
  "thankYouVideoUrl": thankYouVideo.asset->url,
  thankYouDurationSeconds
}`

export const liveUpdateQuery = `*[_type == "liveUpdate" && date == $today][0]{
  _id,
  date,
  status,
  title,
  platform,
  startedAt,
  watchUrl,
  upcomingTitle,
  upcomingStartsAt
}`
