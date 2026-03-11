/**
 * Sanity GROQ query stubs.
 *
 * Each query targets a content type that Sanity owns.
 * Implement real GROQ once schemas are defined in Sanity Studio.
 */

export const dailyVerseQuery = `*[_type == "dailyVerse" && date == $today][0]`

export const dailyImbuguroQuery = `*[_type == "dailyImbuguro" && date == $today][0]`

export const allSeriesQuery = `*[_type == "series"] | order(createdAt desc)`

export const sermonsBySeriesQuery = `*[_type == "sermon" && series._ref == $seriesId] | order(date desc)`

export const allTopicsQuery = `*[_type == "topic"] | order(label asc)`

export const allPlansQuery = `*[_type == "plan"] | order(createdAt desc)`

export const planByIdQuery = `*[_type == "plan" && _id == $planId][0]`

export const givingFundsQuery = `*[_type == "impactFund"] | order(order asc)`

export const givingEditorialQuery = `*[_type == "givingContent"][0]`
