/**
 * Firestore collection path constants.
 *
 * Centralizes collection names so they can be referenced
 * consistently across services and security rules.
 */

export const Collections = {
  users: 'users',
  devices: 'devices',
  userProgress: 'userProgress',
  savedItems: 'savedItems',
  downloads: 'downloads',
  testimonies: 'testimonies',
  prayerPoints: 'prayerPoints',
  prayerCommitments: 'prayerCommitments',
  counselingRequests: 'counselingRequests',
  notificationPreferences: 'notificationPreferences',
  donations: 'donations',
} as const

export type CollectionName = (typeof Collections)[keyof typeof Collections]
