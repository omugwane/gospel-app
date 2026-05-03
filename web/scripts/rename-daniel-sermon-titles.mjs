/**
 * Shorten long Daniel-series sermon titles to "INYIGISHO YA N" only.
 *
 * Matches titles like:
 *   UBUSOBANURO BW'IGITABO N'UBUHANUZI BYA DANIYELI | INYIGISHO YA 1 | Pr. Senga Emmanuel
 *
 * Usage: npm run sanity:rename-daniel-titles
 * Requires: NEXT_PUBLIC_SANITY_*, SANITY_API_WRITE_TOKEN in .env.local
 */

import { createClient } from '@sanity/client'

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_WRITE_TOKEN

if (!projectId || !dataset) {
  console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET')
  process.exit(1)
}
if (!token) {
  console.error('Missing SANITY_API_WRITE_TOKEN in .env.local')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-03-05',
  token,
  useCdn: false,
})

/** Middle segment: | INYIGISHO YA N | */
const lessonRegex = /\|\s*(INYIGISHO YA\s+\d+)\s*\|/i

const query = `*[_type == "sermon" && title match "*DANIYELI*" && title match "*INYIGISHO*"]{
  _id,
  title,
  "slugCurrent": slug.current
}`

const docs = await client.fetch(query)
let updated = 0
let skipped = 0

for (const doc of docs) {
  if (doc._id.startsWith('drafts.')) {
    skipped++
    continue
  }
  if (!doc.title || typeof doc.title !== 'string') {
    skipped++
    continue
  }
  const m = doc.title.match(lessonRegex)
  if (!m) {
    skipped++
    continue
  }
  const newTitle = m[1].replace(/\s+/g, ' ').trim()
  if (newTitle === doc.title) {
    skipped++
    continue
  }

  const newSlug = slugify(newTitle)
  await client
    .patch(doc._id)
    .set({
      title: newTitle,
      slug: { _type: 'slug', current: newSlug },
    })
    .commit({ autoGenerateArrayKeys: true })

  console.log(`OK: ${doc._id}`)
  console.log(`    "${doc.title}"`)
  console.log(` -> "${newTitle}" (slug: ${newSlug})`)
  updated++
}

console.log(`\nDone. Updated ${updated}, skipped ${skipped} (no match or unchanged).`)
