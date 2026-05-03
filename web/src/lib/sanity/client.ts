/**
 * Sanity client for fetching content.
 *
 * Uses next-sanity createClient for GROQ queries.
 * Project ID and dataset come from environment variables.
 */

import { createClient } from 'next-sanity'

export const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? ''
export const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
export const SANITY_API_VERSION = '2024-01-01'

export const sanityClient = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: SANITY_API_VERSION,
  useCdn: process.env.NODE_ENV === 'production',
})
