/**
 * Writes the Mux API credentials Sanity Studio expects (`secrets.mux` / mux.apiKey).
 * Run once after setting SANITY_API_WRITE_TOKEN in .env.local:
 *   npm run mux:seed-secrets
 *
 * Token: sanity.io/manage → your project → API → Add API token → Role: Editor (or Admin).
 */

import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_WRITE_TOKEN
const muxToken = process.env.MUX_TOKEN_ID
const muxSecret = process.env.MUX_TOKEN_SECRET

if (!projectId || !dataset) {
  console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET')
  process.exit(1)
}
if (!token) {
  console.error(
    'Missing SANITY_API_WRITE_TOKEN. Add it to .env.local (Sanity manage → API → token with write access).'
  )
  process.exit(1)
}
if (!muxToken || !muxSecret) {
  console.error('Missing MUX_TOKEN_ID or MUX_TOKEN_SECRET in .env.local')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-03-05',
  token,
  useCdn: false,
})

const doc = {
  _id: 'secrets.mux',
  _type: 'mux.apiKey',
  token: muxToken,
  secretKey: muxSecret,
  enableSignedUrls: false,
  signingKeyId: '',
  signingKeyPrivate: '',
  drmConfigId: '',
}

await client.createOrReplace(doc)
console.log(`OK: wrote secrets.mux to dataset "${dataset}" (project ${projectId}).`)
