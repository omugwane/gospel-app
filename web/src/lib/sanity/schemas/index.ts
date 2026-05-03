import { dailyVerseType } from './dailyVerse'
import { dailyImbuguroType } from './dailyImbuguro'
import { topicType } from './topic'
import { seriesType } from './series'
import { sermonType } from './sermon'
import { planType, planDayType, planCategoryType, dayContentType } from './plan'
import { impactFundType } from './impactFund'
import { givingContentType } from './givingContent'
import { liveUpdateType } from './liveUpdate'

export const schemaTypes = [
  dailyVerseType,
  dailyImbuguroType,
  topicType,
  seriesType,
  sermonType,
  planCategoryType,
  dayContentType,
  planType,
  planDayType,
  impactFundType,
  givingContentType,
  liveUpdateType,
]
