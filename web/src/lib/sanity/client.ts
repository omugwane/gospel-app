/**
 * Sanity client stub.
 *
 * Owns: sermons, series, topics, daily verse, exhortations,
 * plan definitions, devotionals, giving editorial content,
 * live/upcoming event references.
 *
 * Replace these placeholders with real values once your
 * Sanity project is created.
 */

export const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? ''
export const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
export const SANITY_API_VERSION = '2024-01-01'

export function getSanityClient() {
  if (!SANITY_PROJECT_ID) {
    console.warn(
      '[sanity] NEXT_PUBLIC_SANITY_PROJECT_ID is not set. ' +
        'Content queries will return empty results until Sanity is configured.'
    )
  }

  return {
    projectId: SANITY_PROJECT_ID,
    dataset: SANITY_DATASET,
    apiVersion: SANITY_API_VERSION,
  }
}
